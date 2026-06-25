<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'modules/auth/services/Auth_service.php';

class Auth_guard
{
	protected $ci;
	protected $auth_service;
	protected $last_auth_error = array();

	public function __construct()
	{
		$this->ci =& get_instance();
		$this->auth_service = new Auth_service();
		$this->ci->load->model('auth/Auth_model', 'auth_model');
	}

	public function get_bearer_token($authorization_header = '')
	{
		$header = trim((string) $authorization_header);

		if ($header === '')
		{
			$header = $this->ci->input->get_request_header('Authorization', TRUE);
		}

		if ($header === '' && isset($_SERVER['HTTP_AUTHORIZATION']))
		{
			$header = $_SERVER['HTTP_AUTHORIZATION'];
		}

		return $this->auth_service->get_bearer_token($header);
	}

	public function validate_bearer_token($authorization_header = '')
	{
		$token = $this->get_bearer_token($authorization_header);

		if ($token === '')
		{
			return $this->set_auth_error(401, 'Authorization token is required.', array(
				'authorization' => 'Bearer token is required.',
			));
		}

		$token_hash = $this->auth_service->hash_session_token($token);
		$session = $this->ci->auth_model->find_active_session_with_user($token_hash);

		if ( ! $session)
		{
			return $this->set_auth_error(401, 'Invalid or expired session.', array());
		}

		$user = $this->auth_service->sanitize_public_user($session);
		$this->last_auth_error = array();

		return array(
			'success' => TRUE,
			'user' => $user,
			'session' => $session,
			'token_hash' => $token_hash,
		);
	}

	public function get_current_user($authorization_header = '')
	{
		$result = $this->validate_bearer_token($authorization_header);

		return $result['success'] ? $result['user'] : NULL;
	}

	public function require_auth($authorization_header = '')
	{
		return $this->validate_bearer_token($authorization_header);
	}

	public function revoke_current_session($authorization_header = '')
	{
		$result = $this->validate_bearer_token($authorization_header);

		if ($result['success'] === FALSE)
		{
			return $result;
		}

		$this->ci->auth_model->revoke_session($result['token_hash']);

		return array(
			'success' => TRUE,
			'user' => $result['user'],
			'session' => $result['session'],
		);
	}

	public function get_auth_error()
	{
		return $this->last_auth_error;
	}

	protected function set_auth_error($status_code, $message, $errors = array())
	{
		$this->last_auth_error = array(
			'success' => FALSE,
			'status_code' => $status_code,
			'message' => $message,
			'errors' => $errors,
		);

		return $this->last_auth_error;
	}
}
