<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'modules/incidents/services/Incident_service.php';

class Incidents extends API_Controller
{
	protected $incident_service;

	public function __construct()
	{
		parent::__construct();
		$this->load->model('incidents/Incident_model', 'incident_model');
		$this->incident_service = new Incident_service();
	}

	public function status()
	{
		if ($this->input->method(TRUE) !== 'GET')
		{
			return $this->respond_method_not_allowed('Only GET is allowed for incident status');
		}

		return $this->respond_success('CyberVault incidents module status', array(
			'module' => 'incidents',
			'framework' => 'CodeIgniter 3 HMVC',
			'persistence_ready' => $this->incident_model->is_persistence_ready(),
			'implemented_endpoints' => array(
				'GET /api/incidents/status',
				'GET /api/incidents/contract',
				'POST /api/incidents/report',
				'GET /api/incidents/my',
				'GET /api/incidents/detail/{report_code}',
			),
			'current_phase' => $this->incident_model->is_persistence_ready() ? 'persistence_v1' : 'foundation',
		));
	}

	public function contract()
	{
		if ($this->input->method(TRUE) !== 'GET')
		{
			return $this->respond_method_not_allowed('Only GET is allowed for incident contract');
		}

		return $this->respond_success('CyberVault incident report contract', $this->incident_service->get_contract(
			$this->incident_model->is_persistence_ready()
		));
	}

	public function report()
	{
		if ($this->input->method(TRUE) !== 'POST')
		{
			return $this->respond_method_not_allowed('Only POST is allowed for incident report');
		}

		$auth = $this->require_auth();

		if ($auth['success'] === FALSE)
		{
			return $this->auth_error_response($auth);
		}

		$payload = $this->read_request_input();
		$validation = $this->incident_service->validate_report_payload($payload);

		if ($validation['valid'] === FALSE)
		{
			return $this->respond_validation_error($validation['errors'], 'Incident report payload is invalid');
		}

		if ($this->incident_model->is_persistence_ready() === FALSE)
		{
			return $this->respond_error('Incident persistence is not available yet.', array(), 501);
		}

		$user_id = (int) $auth['user']['id'];
		$report_code = $this->generate_unique_report_code();
		$report_payload = $this->incident_service->build_report_create_payload($user_id, $validation['sanitized']);
		$report_payload['report_code'] = $report_code;

		$this->db->trans_begin();

		$incident_report_id = $this->incident_model->create_report($report_payload);

		if ($incident_report_id === FALSE)
		{
			$this->db->trans_rollback();
			return $this->respond_error('Failed to save incident report.', array(), 500);
		}

		$status_log_created = $this->incident_model->create_status_log(
			$this->incident_service->build_status_log_payload($incident_report_id, $user_id)
		);

		if ($status_log_created === FALSE || $this->db->trans_status() === FALSE)
		{
			$this->db->trans_rollback();
			return $this->respond_error('Failed to save incident report.', array(), 500);
		}

		$this->db->trans_commit();

		$report = $this->incident_model->find_report_by_code_for_user($report_code, $user_id);

		return $this->respond_success('Incident report submitted successfully.', array(
			'report' => $this->incident_service->sanitize_report_summary($report),
		), 201);
	}

	public function my()
	{
		if ($this->input->method(TRUE) !== 'GET')
		{
			return $this->respond_method_not_allowed('Only GET is allowed for my incidents');
		}

		$auth = $this->require_auth();

		if ($auth['success'] === FALSE)
		{
			return $this->auth_error_response($auth);
		}

		if ($this->incident_model->is_persistence_ready() === FALSE)
		{
			return $this->respond_error('Incident persistence is not available yet.', array(), 501);
		}

		$filters = $this->incident_service->normalize_list_filters($this->input->get(NULL, TRUE));
		$user_id = (int) $auth['user']['id'];
		$reports = $this->incident_model->list_reports_by_user($user_id, $filters);
		$total = $this->incident_model->count_reports_by_user($user_id, $filters);
		$items = array();

		foreach ($reports as $report)
		{
			$items[] = $this->incident_service->sanitize_report_summary($report);
		}

		return $this->respond_success('Incident reports fetched successfully.', array(
			'items' => $items,
			'pagination' => array(
				'total' => $total,
				'page' => $filters['page'],
				'limit' => $filters['limit'],
			),
			'filters' => $filters,
		));
	}

	public function detail($report_code = '')
	{
		if ($this->input->method(TRUE) !== 'GET')
		{
			return $this->respond_method_not_allowed('Only GET is allowed for incident detail');
		}

		$auth = $this->require_auth();

		if ($auth['success'] === FALSE)
		{
			return $this->auth_error_response($auth);
		}

		$report_code = trim((string) $report_code);

		if ($report_code === '')
		{
			return $this->respond_validation_error(array(
				'report_code' => 'Report code is required.',
			), 'Incident detail payload is invalid');
		}

		if ($this->incident_model->is_persistence_ready() === FALSE)
		{
			return $this->respond_error('Incident persistence is not available yet.', array(), 501);
		}

		$user_id = (int) $auth['user']['id'];
		$report = $this->incident_model->find_report_by_code_for_user($report_code, $user_id);

		if ( ! $report)
		{
			return $this->respond_not_found('Incident report not found');
		}

		$status_logs = $this->incident_model->get_status_logs($report['id']);

		return $this->respond_success('Incident report detail fetched successfully.', array(
			'report' => $this->incident_service->sanitize_report_detail($report, $status_logs),
		));
	}

	protected function read_request_input()
	{
		$raw_input = $this->input->raw_input_stream;
		$decoded = json_decode($raw_input, TRUE);

		if (json_last_error() === JSON_ERROR_NONE && is_array($decoded))
		{
			return $decoded;
		}

		$post = $this->input->post(NULL, TRUE);

		return is_array($post) ? $post : array();
	}

	protected function generate_unique_report_code()
	{
		for ($attempt = 0; $attempt < 10; $attempt++)
		{
			$report_code = $this->incident_service->generate_report_code();

			if ( ! $this->incident_model->is_report_code_exists($report_code))
			{
				return $report_code;
			}
		}

		return 'CV-INC-'.date('Ymd').'-'.str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
	}
}
