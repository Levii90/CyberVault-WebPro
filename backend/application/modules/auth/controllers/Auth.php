<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'modules/auth/services/Auth_service.php';

class Auth extends API_Controller
{
	protected $auth_service;

	public function __construct()
	{
		parent::__construct();
		$this->load->model('auth/Auth_model', 'auth_model');
		$this->auth_service = new Auth_service();
	}

	public function status()
	{
		if ($this->input->method(TRUE) !== 'GET')
		{
			return $this->respond_method_not_allowed('Only GET is allowed for auth status');
		}

		return $this->respond_success('CyberVault auth module status', array(
			'module' => 'auth',
			'framework' => 'CodeIgniter 3 HMVC',
			'persistence_ready' => $this->auth_model->is_persistence_ready(),
			'implemented_endpoints' => array(
				'GET /api/auth/status',
				'GET /api/auth/contract',
				'POST /api/auth/register',
				'POST /api/auth/login',
				'POST /api/auth/logout',
				'GET /api/auth/me',
				'PUT /api/auth/profile',
				'PATCH /api/auth/profile',
				'POST /api/auth/profile',
				'GET /api/auth/sessions',
				'POST /api/auth/sessions/revoke',
			),
		));
	}

	public function contract()
	{
		if ($this->input->method(TRUE) !== 'GET')
		{
			return $this->respond_method_not_allowed('Only GET is allowed for auth contract');
		}

		return $this->respond_success('CyberVault auth validation contract', array(
			'register' => array(
				'method' => 'POST',
				'endpoint' => '/api/auth/register',
				'fields' => array(
					'name' => array('required' => TRUE, 'min_length' => 3, 'max_length' => 100),
					'username' => array('required' => FALSE, 'min_length' => 3, 'max_length' => 50),
					'email' => array('required' => TRUE, 'format' => 'email', 'max_length' => 150),
					'password' => array('required' => TRUE, 'min_length' => 8, 'max_length' => 72),
					'password_confirmation' => array('required' => TRUE, 'must_match' => 'password'),
				),
			),
			'login' => array(
				'method' => 'POST',
				'endpoint' => '/api/auth/login',
				'fields' => array(
					'email' => array('required' => TRUE, 'format' => 'email', 'max_length' => 150),
					'password' => array('required' => TRUE, 'min_length' => 8, 'max_length' => 72),
				),
			),
			'token' => array(
				'type' => 'bearer',
				'storage' => 'user_sessions.session_token_hash',
				'raw_token_stored_in_db' => FALSE,
				'default_expiry_days' => 7,
			),
			'current_state' => array(
				'frontend_demo_auth_kept' => TRUE,
				'persistence_ready' => $this->auth_model->is_persistence_ready(),
			),
			'sessions' => array(
				'list' => array(
					'method' => 'GET',
					'endpoint' => '/api/auth/sessions',
				),
				'revoke' => array(
					'method' => 'POST',
					'endpoint' => '/api/auth/sessions/revoke',
					'fields' => array(
						'session_id' => array('required' => TRUE, 'type' => 'integer'),
					),
				),
			),
		));
	}

	public function register()
	{
		if ($this->input->method(TRUE) !== 'POST')
		{
			return $this->respond_method_not_allowed('Only POST is allowed for register');
		}

		$payload = $this->read_request_input();
		$validation = $this->auth_service->validate_register_payload($payload);

		if ($validation['valid'] === FALSE)
		{
			return $this->respond_validation_error($validation['errors'], 'Register payload is invalid');
		}

		$email = $validation['sanitized']['email'];
		$username = $validation['sanitized']['username'];

		if ($this->auth_model->find_by_email($email))
		{
			return $this->respond_error('Email already registered.', array('email' => 'Email already registered.'), 409);
		}

		if ($username !== NULL && $this->auth_model->find_by_username($username))
		{
			return $this->respond_error('Username already registered.', array('username' => 'Username already registered.'), 409);
		}

		$now = date('Y-m-d H:i:s');
		try
		{
			$user_id = $this->auth_model->create_user(array(
				'name' => $validation['sanitized']['name'],
				'username' => $username,
				'email' => $email,
				'password_hash' => $this->auth_service->hash_password($payload['password']),
				'role' => 'user',
				'status' => 'active',
				'email_verified_at' => NULL,
				'last_login_at' => $now,
				'created_at' => $now,
				'updated_at' => $now,
				'deleted_at' => NULL,
			));
		}
		catch (Throwable $exception)
		{
			if (stripos($exception->getMessage(), 'uk_users_email') !== FALSE)
			{
				return $this->respond_error('Email already registered.', array('email' => 'Email already registered.'), 409);
			}

			if (stripos($exception->getMessage(), 'uk_users_username') !== FALSE)
			{
				return $this->respond_error('Username already registered.', array('username' => 'Username already registered.'), 409);
			}

			return $this->respond_error('Failed to create user.', array(), 500);
		}

		if ($user_id === FALSE)
		{
			return $this->respond_error('Failed to create user.', array(), 500);
		}

		$this->auth_model->create_profile($user_id);

		$token = $this->auth_service->generate_session_token();
		$token_hash = $this->auth_service->hash_session_token($token);
		$expires_at = $this->auth_service->get_session_expiry();

		$this->auth_model->create_session(
			$user_id,
			$token_hash,
			$expires_at,
			$this->input->user_agent(),
			$this->get_client_ip()
		);

		$user = $this->auth_model->get_user_with_profile($user_id);

		return $this->respond_success('Register successful.', array(
			'user' => $this->auth_service->sanitize_public_user($user),
			'token' => $token,
			'expires_at' => $expires_at,
		), 201);
	}

	public function login()
	{
		if ($this->input->method(TRUE) !== 'POST')
		{
			return $this->respond_method_not_allowed('Only POST is allowed for login');
		}

		$payload = $this->read_request_input();
		$validation = $this->auth_service->validate_login_payload($payload);

		if ($validation['valid'] === FALSE)
		{
			return $this->respond_validation_error($validation['errors'], 'Login payload is invalid');
		}

		$user = $this->auth_model->find_by_email($validation['sanitized']['email']);

		if ( ! $user || ! $this->auth_service->verify_password($validation['sanitized']['password'], $user['password_hash']))
		{
			return $this->respond_error('Invalid email or password.', array(), 401);
		}

		if ($user['status'] !== 'active')
		{
			return $this->respond_error('Account is not allowed to log in.', array('status' => 'Account is '.$user['status'].'.'), 403);
		}

		$this->auth_model->update_last_login($user['id']);

		$token = $this->auth_service->generate_session_token();
		$token_hash = $this->auth_service->hash_session_token($token);
		$expires_at = $this->auth_service->get_session_expiry();

		$this->auth_model->create_session(
			$user['id'],
			$token_hash,
			$expires_at,
			$this->input->user_agent(),
			$this->get_client_ip()
		);

		$user = $this->auth_model->get_user_with_profile($user['id']);

		return $this->respond_success('Login successful.', array(
			'user' => $this->auth_service->sanitize_public_user($user),
			'token' => $token,
			'expires_at' => $expires_at,
		));
	}

	public function logout()
	{
		if ($this->input->method(TRUE) !== 'POST')
		{
			return $this->respond_method_not_allowed('Only POST is allowed for logout');
		}

		$auth = $this->require_auth();
		if ($auth['success'] === FALSE)
		{
			return $this->auth_error_response($auth);
		}

		$this->get_auth_guard()->revoke_current_session();

		return $this->respond_success('Logout successful.');
	}

	public function me()
	{
		if ($this->input->method(TRUE) !== 'GET')
		{
			return $this->respond_method_not_allowed('Only GET is allowed for auth me');
		}

		$auth = $this->require_auth();
		if ($auth['success'] === FALSE)
		{
			return $this->auth_error_response($auth);
		}

		return $this->respond_success('Current user fetched successfully.', array(
			'user' => $auth['user'],
		));
	}

	public function profile()
	{
		$method = $this->input->method(TRUE);
		if ( ! in_array($method, array('PUT', 'PATCH', 'POST'), TRUE))
		{
			return $this->respond_method_not_allowed('Only PUT, PATCH, or POST is allowed for auth profile');
		}

		$auth = $this->require_auth();
		if ($auth['success'] === FALSE)
		{
			return $this->auth_error_response($auth);
		}

		$payload = $this->read_request_input();
		$validation = $this->auth_service->validate_profile_payload($payload);

		if ($validation['valid'] === FALSE)
		{
			return $this->respond_validation_error($validation['errors'], 'Profile payload is invalid');
		}

		$username = $validation['sanitized']['username'];
		if ($username !== NULL)
		{
			$existing_user = $this->auth_model->find_by_username($username);
			if ($existing_user && (int) $existing_user['id'] !== (int) $auth['user']['id'])
			{
				return $this->respond_error('Username already registered.', array('username' => 'Username already registered.'), 409);
			}
		}

		$user_data = array();
		if ($validation['sanitized']['name'] !== NULL)
		{
			$user_data['name'] = $validation['sanitized']['name'];
		}
		if (array_key_exists('username', $validation['sanitized']))
		{
			$user_data['username'] = $validation['sanitized']['username'];
		}

		$profile_data = array(
			'bio' => $validation['sanitized']['bio'],
			'phone' => $validation['sanitized']['phone'],
			'institution' => $validation['sanitized']['institution'],
		);

		if ($this->auth_model->update_user_profile($auth['user']['id'], $user_data, $profile_data) === FALSE)
		{
			return $this->respond_error('Failed to update profile.', array(), 500);
		}

		$user = $this->auth_model->get_user_with_profile($auth['user']['id']);

		return $this->respond_success('Profile updated successfully.', array(
			'user' => $this->auth_service->sanitize_public_user($user),
		));
	}

	public function sessions()
	{
		if ($this->input->method(TRUE) !== 'GET')
		{
			return $this->respond_method_not_allowed('Only GET is allowed for auth sessions');
		}

		$auth = $this->require_auth();
		if ($auth['success'] === FALSE)
		{
			return $this->auth_error_response($auth);
		}

		$sessions = $this->auth_model->list_sessions_by_user($auth['user']['id']);
		$session_rows = array();

		foreach ($sessions as $session)
		{
			$session_rows[] = $this->auth_service->sanitize_session_record($session, $auth['token_hash']);
		}

		return $this->respond_success('Session list fetched successfully.', array(
			'sessions' => $session_rows,
		));
	}

	public function revoke_session()
	{
		if ($this->input->method(TRUE) !== 'POST')
		{
			return $this->respond_method_not_allowed('Only POST is allowed for auth sessions revoke');
		}

		$auth = $this->require_auth();
		if ($auth['success'] === FALSE)
		{
			return $this->auth_error_response($auth);
		}

		$payload = $this->read_request_input();
		$session_id = isset($payload['session_id']) ? (int) $payload['session_id'] : 0;

		if ($session_id <= 0)
		{
			return $this->respond_validation_error(array(
				'session_id' => 'Session ID is required and must be a positive integer.',
			), 'Session revoke payload is invalid');
		}

		$revoked = $this->auth_model->revoke_session_by_id($auth['user']['id'], $session_id);

		if ($revoked === FALSE)
		{
			return $this->respond_not_found('Session not found or already revoked');
		}

		return $this->respond_success('Session revoked successfully.', array(
			'session_id' => $session_id,
			'revoked' => TRUE,
		));
	}

	protected function read_request_input()
	{
		$raw_input = $this->input->raw_input_stream;
		$decoded = json_decode($raw_input, TRUE);

		if (is_array($decoded))
		{
			return $decoded;
		}

		$post = $this->input->post(NULL, TRUE);
		return is_array($post) ? $post : array();
	}

	protected function get_client_ip()
	{
		return isset($_SERVER['REMOTE_ADDR']) ? substr((string) $_SERVER['REMOTE_ADDR'], 0, 45) : NULL;
	}
}
