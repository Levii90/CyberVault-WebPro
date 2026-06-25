<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'third_party/MX/Controller.php';

class API_Controller extends MX_Controller
{
	protected $auth_guard;

	protected $allowed_origins = array(
		'http://localhost:5173',
		'http://127.0.0.1:5173',
		'http://localhost',
		'http://127.0.0.1',
	);

	public function __construct()
	{
		parent::__construct();

		$this->load->helper('api_response');
		$this->apply_cors_headers();
		$this->output->set_content_type('application/json', 'utf-8');

		if ($this->input->method(TRUE) === 'OPTIONS')
		{
			$this->output->set_status_header(204);
			$this->output->set_output('');
			$this->output->_display();
			exit;
		}
	}

	protected function respond_success($message, $data = array(), $status_code = 200)
	{
		$response = api_success($message, $data, $status_code);
		return $this->respond_json($response['body'], $response['status_code']);
	}

	protected function respond_error($message, $errors = array(), $status_code = 400)
	{
		$response = api_error($message, $errors, $status_code);
		return $this->respond_json($response['body'], $response['status_code']);
	}

	protected function respond_validation_error($errors, $message = 'Validation failed')
	{
		$response = api_validation_error($errors, $message);
		return $this->respond_json($response['body'], $response['status_code']);
	}

	protected function respond_not_found($message = 'Resource not found')
	{
		$response = api_not_found($message);
		return $this->respond_json($response['body'], $response['status_code']);
	}

	protected function respond_method_not_allowed($message = 'Method not allowed')
	{
		$response = api_method_not_allowed($message);
		return $this->respond_json($response['body'], $response['status_code']);
	}

	protected function respond_unauthorized($message = 'Unauthorized', $errors = array())
	{
		return $this->respond_error($message, $errors, 401);
	}

	protected function get_auth_guard()
	{
		if ( ! isset($this->auth_guard))
		{
			$this->load->library('Auth_guard');
			$this->auth_guard = new Auth_guard();
		}

		return $this->auth_guard;
	}

	protected function get_bearer_token()
	{
		return $this->get_auth_guard()->get_bearer_token();
	}

	protected function require_auth()
	{
		return $this->get_auth_guard()->require_auth();
	}

	protected function current_user()
	{
		$result = $this->require_auth();

		return $result['success'] ? $result['user'] : NULL;
	}

	protected function auth_error_response($auth_result = array())
	{
		$error = empty($auth_result) ? $this->get_auth_guard()->get_auth_error() : $auth_result;

		return $this->respond_error(
			isset($error['message']) ? $error['message'] : 'Unauthorized',
			isset($error['errors']) ? $error['errors'] : array(),
			isset($error['status_code']) ? $error['status_code'] : 401
		);
	}

	private function apply_cors_headers()
	{
		$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

		if ($origin !== '' && in_array($origin, $this->allowed_origins, TRUE))
		{
			$this->output->set_header('Access-Control-Allow-Origin: '.$origin);
			$this->output->set_header('Vary: Origin');
		}

		$this->output->set_header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
		$this->output->set_header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
	}

	private function respond_json($payload, $status_code)
	{
		return $this->output
			->set_status_header($status_code)
			->set_output(json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
	}
}
