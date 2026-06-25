<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth_service
{
	public function validate_register_payload($input)
	{
		$payload = is_array($input) ? $input : array();
		$errors = array();

		$name = $this->normalize_text($this->get_value($payload, 'name'));
		$username = $this->normalize_username($this->get_value($payload, 'username'));
		$email = $this->normalize_email($this->get_value($payload, 'email'));
		$password = (string) $this->get_value($payload, 'password');
		$password_confirmation = (string) $this->first_available_value($payload, array('password_confirmation', 'confirm_password'));

		if ($name === '')
		{
			$errors['name'] = 'Name is required';
		}
		elseif (mb_strlen($name) < 3 || mb_strlen($name) > 100)
		{
			$errors['name'] = 'Name must be between 3 and 100 characters';
		}

		$username_error = $this->validate_username($username, FALSE);
		if ($username_error !== NULL)
		{
			$errors['username'] = $username_error;
		}

		$email_error = $this->validate_email($email, 150);
		if ($email_error !== NULL)
		{
			$errors['email'] = $email_error;
		}

		$password_error = $this->validate_password($password);
		if ($password_error !== NULL)
		{
			$errors['password'] = $password_error;
		}

		if ($password_confirmation === '')
		{
			$errors['password_confirmation'] = 'Password confirmation is required';
		}
		elseif ($password_confirmation !== $password)
		{
			$errors['password_confirmation'] = 'Password confirmation must match password';
		}

		return array(
			'valid' => empty($errors),
			'errors' => $errors,
			'sanitized' => array(
				'name' => $name,
				'username' => $username !== '' ? $username : NULL,
				'email' => $email,
			),
		);
	}

	public function validate_login_payload($input)
	{
		$payload = is_array($input) ? $input : array();
		$errors = array();

		$email = $this->normalize_email($this->get_value($payload, 'email'));
		$password = (string) $this->get_value($payload, 'password');

		$email_error = $this->validate_email($email, 150);
		if ($email_error !== NULL)
		{
			$errors['email'] = $email_error;
		}

		$password_error = $this->validate_password($password);
		if ($password_error !== NULL)
		{
			$errors['password'] = $password_error;
		}

		return array(
			'valid' => empty($errors),
			'errors' => $errors,
			'sanitized' => array(
				'email' => $email,
				'password' => $password,
			),
		);
	}

	public function validate_profile_payload($input)
	{
		$payload = is_array($input) ? $input : array();
		$errors = array();

		$name = $this->normalize_text($this->get_value($payload, 'name'));
		$username = $this->normalize_username($this->get_value($payload, 'username'));
		$bio = $this->nullable_trim($this->get_value($payload, 'bio'));
		$phone = $this->nullable_trim($this->get_value($payload, 'phone'));
		$institution = $this->nullable_trim($this->get_value($payload, 'institution'));

		if ($name !== '' && (mb_strlen($name) < 3 || mb_strlen($name) > 100))
		{
			$errors['name'] = 'Name must be between 3 and 100 characters';
		}

		$username_error = $this->validate_username($username, TRUE);
		if ($username_error !== NULL)
		{
			$errors['username'] = $username_error;
		}

		if ($bio !== NULL && mb_strlen($bio) > 1000)
		{
			$errors['bio'] = 'Bio must be 1000 characters or fewer';
		}

		if ($phone !== NULL && mb_strlen($phone) > 30)
		{
			$errors['phone'] = 'Phone must be 30 characters or fewer';
		}

		if ($institution !== NULL && mb_strlen($institution) > 150)
		{
			$errors['institution'] = 'Institution must be 150 characters or fewer';
		}

		return array(
			'valid' => empty($errors),
			'errors' => $errors,
			'sanitized' => array(
				'name' => $name !== '' ? $name : NULL,
				'username' => $username !== '' ? $username : NULL,
				'bio' => $bio,
				'phone' => $phone,
				'institution' => $institution,
			),
		);
	}

	public function hash_password($password)
	{
		return password_hash((string) $password, PASSWORD_DEFAULT);
	}

	public function verify_password($password, $hash)
	{
		return password_verify((string) $password, (string) $hash);
	}

	public function generate_session_token()
	{
		return rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
	}

	public function hash_session_token($token)
	{
		return hash('sha256', (string) $token);
	}

	public function get_bearer_token($authorization_header = '')
	{
		$header = trim((string) $authorization_header);

		if ($header === '' || stripos($header, 'Bearer ') !== 0)
		{
			return '';
		}

		return trim(substr($header, 7));
	}

	public function get_session_expiry($days = 7)
	{
		return date('Y-m-d H:i:s', strtotime('+'.(int) $days.' days'));
	}

	public function sanitize_public_user($user)
	{
		$record = is_array($user) ? $user : array();

		unset(
			$record['password_hash'],
			$record['session_token_hash'],
			$record['reset_token_hash'],
			$record['remember_token_hash'],
			$record['deleted_at'],
			$record['user_id'],
			$record['session_id'],
			$record['session_user_id'],
			$record['session_user_agent'],
			$record['session_ip_address'],
			$record['session_created_at'],
			$record['revoked_at'],
			$record['expires_at']
		);

		return $record;
	}

	public function sanitize_session_record($session, $current_token_hash = '')
	{
		$record = is_array($session) ? $session : array();
		$session_hash = isset($record['session_token_hash']) ? $record['session_token_hash'] : '';

		return array(
			'id' => isset($record['id']) ? (string) $record['id'] : '',
			'user_agent' => isset($record['user_agent']) ? $record['user_agent'] : '',
			'ip_address' => $this->mask_ip_address(isset($record['ip_address']) ? $record['ip_address'] : ''),
			'expires_at' => isset($record['expires_at']) ? $record['expires_at'] : NULL,
			'revoked_at' => isset($record['revoked_at']) ? $record['revoked_at'] : NULL,
			'created_at' => isset($record['created_at']) ? $record['created_at'] : NULL,
			'is_current' => ($current_token_hash !== '' && $session_hash === $current_token_hash),
		);
	}

	protected function get_value($payload, $key)
	{
		return isset($payload[$key]) ? $payload[$key] : '';
	}

	protected function first_available_value($payload, $keys)
	{
		foreach ($keys as $key)
		{
			if (isset($payload[$key]))
			{
				return $payload[$key];
			}
		}

		return '';
	}

	protected function normalize_text($value)
	{
		return trim((string) $value);
	}

	protected function normalize_email($value)
	{
		return strtolower(trim((string) $value));
	}

	protected function normalize_username($value)
	{
		return strtolower(trim((string) $value));
	}

	protected function nullable_trim($value)
	{
		$normalized = trim((string) $value);
		return $normalized === '' ? NULL : $normalized;
	}

	protected function validate_email($email, $max_length = 190)
	{
		if ($email === '')
		{
			return 'Email is required';
		}

		if (mb_strlen($email) > $max_length)
		{
			return 'Email must be '.$max_length.' characters or fewer';
		}

		if (filter_var($email, FILTER_VALIDATE_EMAIL) === FALSE)
		{
			return 'Email format is invalid';
		}

		return NULL;
	}

	protected function validate_password($password)
	{
		$length = strlen($password);

		if ($password === '')
		{
			return 'Password is required';
		}

		if ($length < 8)
		{
			return 'Password must be at least 8 characters';
		}

		if ($length > 72)
		{
			return 'Password must be 72 characters or fewer';
		}

		return NULL;
	}

	protected function validate_username($username, $allow_empty = TRUE)
	{
		if ($username === '')
		{
			return $allow_empty ? NULL : NULL;
		}

		if (mb_strlen($username) < 3 || mb_strlen($username) > 50)
		{
			return 'Username must be between 3 and 50 characters';
		}

		if (preg_match('/^[a-z0-9_.-]+$/', $username) !== 1)
		{
			return 'Username may only contain lowercase letters, numbers, dots, underscores, and hyphens';
		}

		return NULL;
	}

	protected function mask_ip_address($ip_address)
	{
		$ip = trim((string) $ip_address);

		if ($ip === '')
		{
			return '';
		}

		if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4))
		{
			$segments = explode('.', $ip);
			$segments[3] = '***';
			return implode('.', $segments);
		}

		if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6))
		{
			$segments = explode(':', $ip);
			$last_index = count($segments) - 1;
			if ($last_index >= 0)
			{
				$segments[$last_index] = '****';
			}
			return implode(':', $segments);
		}

		return $ip;
	}
}
