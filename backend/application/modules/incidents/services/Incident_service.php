<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Incident_service
{
	protected $allowed_incident_types = array(
		'phishing',
		'online-fraud',
		'account-hijack',
		'data-breach',
		'malware',
		'other',
	);

	protected $allowed_severity = array('low', 'medium', 'high', 'critical');
	protected $allowed_contact_preferences = array('email', 'in_app', 'none');
	protected $sensitive_rejected_fields = array(
		'password',
		'otp',
		'token',
		'private_key',
		'session_token',
		'password_hash',
		'identity_number',
		'bank_account_number',
	);

	public function get_contract($persistence_ready = FALSE)
	{
		return array(
			'auth_policy' => array(
				'status' => 'public',
				'contract' => 'public',
				'report' => 'bearer_required',
				'my' => 'bearer_required',
				'detail' => 'bearer_required',
				'anonymous_reporting_enabled' => FALSE,
			),
			'status' => array(
				'method' => 'GET',
				'endpoint' => '/api/incidents/status',
			),
			'contract' => array(
				'method' => 'GET',
				'endpoint' => '/api/incidents/contract',
			),
			'report' => array(
				'method' => 'POST',
				'endpoint' => '/api/incidents/report',
				'persistence_ready' => (bool) $persistence_ready,
				'fields' => array(
					'incident_type' => array('required' => TRUE, 'enum' => $this->allowed_incident_types),
					'title' => array('required' => TRUE, 'max_length' => 150),
					'description' => array('required' => TRUE, 'min_length' => 20),
					'platform' => array('required' => FALSE, 'max_length' => 120),
					'city' => array('required' => FALSE, 'max_length' => 120),
					'suspicious_url' => array('required' => FALSE, 'format' => 'url', 'max_length' => 500),
					'evidence_summary' => array('required' => FALSE, 'max_length' => 1000),
					'incident_date' => array('required' => FALSE, 'format' => 'datetime'),
					'severity' => array('required' => FALSE, 'enum' => $this->allowed_severity, 'default' => 'medium'),
					'contact_preference' => array('required' => FALSE, 'enum' => $this->allowed_contact_preferences, 'default' => 'in_app'),
				),
				'unsupported_upload_fields' => array(
					'evidence_files',
					'attachments',
				),
			),
			'my' => array(
				'method' => 'GET',
				'endpoint' => '/api/incidents/my',
			),
			'detail' => array(
				'method' => 'GET',
				'endpoint' => '/api/incidents/detail/{report_code}',
			),
			'response' => array(
				'success' => array(
					'success' => TRUE,
					'message' => 'string',
					'data' => array(),
				),
				'error' => array(
					'success' => FALSE,
					'message' => 'string',
					'errors' => array(),
				),
			),
		);
	}

	public function validate_report_payload($payload = array())
	{
		$payload = is_array($payload) ? $payload : array();
		$errors = array();
		$sanitized = array(
			'incident_type' => $this->sanitize_string($this->read_value($payload, 'incident_type'), 80),
			'title' => $this->sanitize_string($this->read_value($payload, 'title'), 150),
			'description' => $this->sanitize_string($this->read_value($payload, 'description')),
			'platform' => $this->sanitize_string($this->read_value($payload, 'platform'), 120),
			'city' => $this->sanitize_string($this->read_value($payload, 'city'), 120),
			'suspicious_url' => $this->sanitize_string($this->read_value($payload, 'suspicious_url'), 500),
			'evidence_summary' => $this->sanitize_string($this->read_value($payload, 'evidence_summary'), 1000),
			'incident_date' => $this->sanitize_string($this->read_value($payload, 'incident_date'), 50),
			'severity' => $this->sanitize_string($this->read_value($payload, 'severity'), 20),
			'contact_preference' => $this->sanitize_string($this->read_value($payload, 'contact_preference'), 20),
		);

		foreach ($this->sensitive_rejected_fields as $field)
		{
			if ($this->has_meaningful_value($payload, $field))
			{
				$errors[$field] = 'Sensitive credential fields are not accepted in incident reports.';
			}
		}

		if ($this->has_non_empty_list_value($payload, 'evidence_files') || $this->has_non_empty_list_value($payload, 'evidenceFiles'))
		{
			$errors['evidence_files'] = 'Evidence file upload is not supported yet. Use evidence_summary for text evidence.';
		}

		if ($sanitized['incident_type'] === '')
		{
			$errors['incident_type'] = 'Incident type is required.';
		}
		elseif ( ! in_array($sanitized['incident_type'], $this->allowed_incident_types, TRUE))
		{
			$errors['incident_type'] = 'Incident type is not supported.';
		}

		if ($sanitized['title'] === '')
		{
			$errors['title'] = 'Title is required.';
		}

		if ($sanitized['description'] === '')
		{
			$errors['description'] = 'Description is required.';
		}
		elseif ($this->string_length($sanitized['description']) < 20)
		{
			$errors['description'] = 'Description must be at least 20 characters.';
		}

		if ($sanitized['suspicious_url'] !== '' && filter_var($sanitized['suspicious_url'], FILTER_VALIDATE_URL) === FALSE)
		{
			$errors['suspicious_url'] = 'Suspicious URL must be a valid URL.';
		}

		if ($sanitized['incident_date'] !== '' && strtotime($sanitized['incident_date']) === FALSE)
		{
			$errors['incident_date'] = 'Incident date must be a valid datetime.';
		}

		if ($sanitized['severity'] === '')
		{
			$sanitized['severity'] = 'medium';
		}
		elseif ( ! in_array($sanitized['severity'], $this->allowed_severity, TRUE))
		{
			$errors['severity'] = 'Severity is not supported.';
		}

		if ($sanitized['contact_preference'] === '')
		{
			$sanitized['contact_preference'] = 'in_app';
		}
		elseif ( ! in_array($sanitized['contact_preference'], $this->allowed_contact_preferences, TRUE))
		{
			$errors['contact_preference'] = 'Contact preference is not supported.';
		}

		return array(
			'valid' => empty($errors),
			'errors' => $errors,
			'sanitized' => $sanitized,
		);
	}

	public function normalize_list_filters($query = array())
	{
		$query = is_array($query) ? $query : array();

		$filters = array(
			'status' => $this->sanitize_string($this->read_value($query, 'status'), 50),
			'severity' => $this->sanitize_string($this->read_value($query, 'severity'), 20),
			'incident_type' => $this->sanitize_string($this->read_value($query, 'incident_type'), 80),
			'limit' => (int) $this->read_value($query, 'limit'),
			'page' => (int) $this->read_value($query, 'page'),
		);

		$filters['limit'] = $filters['limit'] > 0 ? min($filters['limit'], 50) : 10;
		$filters['page'] = $filters['page'] > 0 ? $filters['page'] : 1;

		if ($filters['status'] !== '' && ! in_array($filters['status'], array('submitted', 'in_review', 'need_more_info', 'resolved', 'rejected'), TRUE))
		{
			$filters['status'] = '';
		}

		if ($filters['severity'] !== '' && ! in_array($filters['severity'], $this->allowed_severity, TRUE))
		{
			$filters['severity'] = '';
		}

		if ($filters['incident_type'] !== '' && ! in_array($filters['incident_type'], $this->allowed_incident_types, TRUE))
		{
			$filters['incident_type'] = '';
		}

		return $filters;
	}

	public function generate_report_code()
	{
		return 'CV-INC-'.date('Ymd').'-'.str_pad((string) random_int(1, 999999), 6, '0', STR_PAD_LEFT);
	}

	public function build_report_create_payload($user_id, $data)
	{
		$now = date('Y-m-d H:i:s');

		return array(
			'user_id' => (int) $user_id,
			'incident_type' => $data['incident_type'],
			'title' => $data['title'],
			'description' => $data['description'],
			'platform' => $data['platform'],
			'city' => $data['city'],
			'suspicious_url' => $data['suspicious_url'],
			'evidence_summary' => $data['evidence_summary'],
			'incident_date' => $this->normalize_datetime($data['incident_date']),
			'severity' => $data['severity'],
			'status' => 'submitted',
			'contact_preference' => $data['contact_preference'],
			'created_at' => $now,
			'updated_at' => NULL,
			'deleted_at' => NULL,
		);
	}

	public function build_status_log_payload($incident_report_id, $actor_user_id, $new_status = 'submitted', $old_status = NULL, $note = 'Report submitted')
	{
		return array(
			'incident_report_id' => (int) $incident_report_id,
			'actor_user_id' => (int) $actor_user_id,
			'old_status' => $old_status,
			'new_status' => $new_status,
			'note' => $note,
			'created_at' => date('Y-m-d H:i:s'),
		);
	}

	public function sanitize_report_summary($report)
	{
		return array(
			'id' => isset($report['id']) ? (string) $report['id'] : '',
			'report_code' => isset($report['report_code']) ? $report['report_code'] : '',
			'incident_type' => isset($report['incident_type']) ? $report['incident_type'] : '',
			'title' => isset($report['title']) ? $report['title'] : '',
			'platform' => isset($report['platform']) ? $report['platform'] : NULL,
			'city' => isset($report['city']) ? $report['city'] : NULL,
			'incident_date' => isset($report['incident_date']) ? $report['incident_date'] : NULL,
			'severity' => isset($report['severity']) ? $report['severity'] : 'medium',
			'status' => isset($report['status']) ? $report['status'] : 'submitted',
			'contact_preference' => isset($report['contact_preference']) ? $report['contact_preference'] : 'in_app',
			'created_at' => isset($report['created_at']) ? $report['created_at'] : NULL,
			'updated_at' => isset($report['updated_at']) ? $report['updated_at'] : NULL,
		);
	}

	public function sanitize_report_detail($report, $status_logs = array())
	{
		$detail = $this->sanitize_report_summary($report);
		$detail['description'] = isset($report['description']) ? $report['description'] : '';
		$detail['suspicious_url'] = isset($report['suspicious_url']) ? $report['suspicious_url'] : NULL;
		$detail['evidence_summary'] = isset($report['evidence_summary']) ? $report['evidence_summary'] : NULL;
		$detail['status_logs'] = array();

		foreach ($status_logs as $status_log)
		{
			$detail['status_logs'][] = array(
				'id' => isset($status_log['id']) ? (string) $status_log['id'] : '',
				'old_status' => isset($status_log['old_status']) ? $status_log['old_status'] : NULL,
				'new_status' => isset($status_log['new_status']) ? $status_log['new_status'] : '',
				'note' => isset($status_log['note']) ? $status_log['note'] : NULL,
				'created_at' => isset($status_log['created_at']) ? $status_log['created_at'] : NULL,
			);
		}

		return $detail;
	}

	protected function read_value($payload, $key)
	{
		return isset($payload[$key]) ? $payload[$key] : '';
	}

	protected function has_meaningful_value($payload, $key)
	{
		if ( ! isset($payload[$key]))
		{
			return FALSE;
		}

		$value = is_scalar($payload[$key]) ? trim((string) $payload[$key]) : '';

		return $value !== '';
	}

	protected function has_non_empty_list_value($payload, $key)
	{
		if ( ! isset($payload[$key]))
		{
			return FALSE;
		}

		if (is_array($payload[$key]))
		{
			return count($payload[$key]) > 0;
		}

		if (is_scalar($payload[$key]))
		{
			return trim((string) $payload[$key]) !== '';
		}

		return FALSE;
	}

	protected function sanitize_string($value, $max_length = 0)
	{
		$value = is_scalar($value) ? trim(strip_tags((string) $value)) : '';

		if ($max_length > 0 && $this->string_length($value) > $max_length)
		{
			$value = $this->string_substr($value, $max_length);
		}

		return $value;
	}

	protected function string_length($value)
	{
		return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
	}

	protected function string_substr($value, $length)
	{
		return function_exists('mb_substr') ? mb_substr($value, 0, $length) : substr($value, 0, $length);
	}

	protected function normalize_datetime($value)
	{
		if ($value === '')
		{
			return NULL;
		}

		$timestamp = strtotime($value);

		return $timestamp === FALSE ? NULL : date('Y-m-d H:i:s', $timestamp);
	}
}
