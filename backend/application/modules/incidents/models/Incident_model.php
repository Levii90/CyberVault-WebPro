<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Incident_model extends CI_Model
{
	protected $table_reports = 'incident_reports';
	protected $table_status_logs = 'incident_report_status_logs';

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function is_persistence_ready()
	{
		$required_tables = array(
			$this->table_reports,
			$this->table_status_logs,
		);

		foreach ($required_tables as $table)
		{
			if ($this->db->table_exists($table) === FALSE)
			{
				return FALSE;
			}
		}

		$required_columns = array(
			$this->table_reports => array(
				'report_code',
				'user_id',
				'incident_type',
				'title',
				'description',
				'platform',
				'city',
				'suspicious_url',
				'evidence_summary',
				'incident_date',
				'severity',
				'status',
				'contact_preference',
				'created_at',
				'updated_at',
				'deleted_at',
			),
			$this->table_status_logs => array(
				'incident_report_id',
				'actor_user_id',
				'old_status',
				'new_status',
				'note',
				'created_at',
			),
		);

		foreach ($required_columns as $table => $columns)
		{
			foreach ($columns as $column)
			{
				if ($this->db->field_exists($column, $table) === FALSE)
				{
					return FALSE;
				}
			}
		}

		return TRUE;
	}

	public function create_report($data)
	{
		$this->db->insert($this->table_reports, $data);

		if ($this->db->affected_rows() !== 1)
		{
			return FALSE;
		}

		return (int) $this->db->insert_id();
	}

	public function create_status_log($data)
	{
		$this->db->insert($this->table_status_logs, $data);

		return $this->db->affected_rows() === 1;
	}

	public function is_report_code_exists($report_code)
	{
		return $this->db
			->from($this->table_reports)
			->where('report_code', $report_code)
			->count_all_results() > 0;
	}

	public function find_report_by_code_for_user($report_code, $user_id)
	{
		return $this->db
			->from($this->table_reports)
			->where('report_code', $report_code)
			->where('user_id', (int) $user_id)
			->where('deleted_at IS NULL', NULL, FALSE)
			->get()
			->row_array();
	}

	public function list_reports_by_user($user_id, $filters = array())
	{
		$query = $this->db
			->from($this->table_reports)
			->where('user_id', (int) $user_id)
			->where('deleted_at IS NULL', NULL, FALSE);

		if (isset($filters['status']) && $filters['status'] !== '')
		{
			$query->where('status', $filters['status']);
		}

		if (isset($filters['severity']) && $filters['severity'] !== '')
		{
			$query->where('severity', $filters['severity']);
		}

		if (isset($filters['incident_type']) && $filters['incident_type'] !== '')
		{
			$query->where('incident_type', $filters['incident_type']);
		}

		$limit = isset($filters['limit']) ? (int) $filters['limit'] : 10;
		$page = isset($filters['page']) ? (int) $filters['page'] : 1;
		$offset = max(0, ($page - 1) * $limit);

		return $query
			->order_by('created_at', 'DESC')
			->limit($limit, $offset)
			->get()
			->result_array();
	}

	public function count_reports_by_user($user_id, $filters = array())
	{
		$query = $this->db
			->from($this->table_reports)
			->where('user_id', (int) $user_id)
			->where('deleted_at IS NULL', NULL, FALSE);

		if (isset($filters['status']) && $filters['status'] !== '')
		{
			$query->where('status', $filters['status']);
		}

		if (isset($filters['severity']) && $filters['severity'] !== '')
		{
			$query->where('severity', $filters['severity']);
		}

		if (isset($filters['incident_type']) && $filters['incident_type'] !== '')
		{
			$query->where('incident_type', $filters['incident_type']);
		}

		return (int) $query->count_all_results();
	}

	public function get_status_logs($incident_report_id)
	{
		return $this->db
			->select('id, incident_report_id, old_status, new_status, note, created_at')
			->from($this->table_status_logs)
			->where('incident_report_id', (int) $incident_report_id)
			->order_by('created_at', 'ASC')
			->order_by('id', 'ASC')
			->get()
			->result_array();
	}
}
