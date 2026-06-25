<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth_model extends CI_Model
{
	protected $table_users = 'users';
	protected $table_profiles = 'user_profiles';
	protected $table_sessions = 'user_sessions';

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function is_persistence_ready()
	{
		$required_tables = array(
			$this->table_users,
			$this->table_profiles,
			$this->table_sessions,
		);

		foreach ($required_tables as $table)
		{
			if ($this->db->table_exists($table) === FALSE)
			{
				return FALSE;
			}
		}

		return TRUE;
	}

	public function find_by_email($email)
	{
		return $this->db
			->from($this->table_users)
			->where('email', $email)
			->where('deleted_at IS NULL', NULL, FALSE)
			->get()
			->row_array();
	}

	public function find_by_id($user_id)
	{
		return $this->db
			->from($this->table_users)
			->where('id', (int) $user_id)
			->where('deleted_at IS NULL', NULL, FALSE)
			->get()
			->row_array();
	}

	public function find_by_username($username)
	{
		return $this->db
			->from($this->table_users)
			->where('username', $username)
			->where('deleted_at IS NULL', NULL, FALSE)
			->get()
			->row_array();
	}

	public function create_user($data)
	{
		$this->db->insert($this->table_users, $data);

		if ($this->db->affected_rows() !== 1)
		{
			return FALSE;
		}

		return (int) $this->db->insert_id();
	}

	public function create_profile($user_id, $data = array())
	{
		$payload = array_merge(array(
			'user_id' => (int) $user_id,
			'bio' => NULL,
			'avatar_url' => NULL,
			'phone' => NULL,
			'institution' => NULL,
			'created_at' => date('Y-m-d H:i:s'),
			'updated_at' => NULL,
		), $data);

		$this->db->insert($this->table_profiles, $payload);

		return $this->db->affected_rows() === 1;
	}

	public function update_last_login($user_id)
	{
		$this->db
			->where('id', (int) $user_id)
			->where('deleted_at IS NULL', NULL, FALSE)
			->update($this->table_users, array(
				'last_login_at' => date('Y-m-d H:i:s'),
				'updated_at' => date('Y-m-d H:i:s'),
			));

		return $this->db->affected_rows() >= 0;
	}

	public function create_session($user_id, $token_hash, $expires_at, $user_agent = NULL, $ip_address = NULL)
	{
		$this->db->insert($this->table_sessions, array(
			'user_id' => (int) $user_id,
			'session_token_hash' => $token_hash,
			'user_agent' => $user_agent,
			'ip_address' => $ip_address,
			'expires_at' => $expires_at,
			'revoked_at' => NULL,
			'created_at' => date('Y-m-d H:i:s'),
		));

		return $this->db->affected_rows() === 1;
	}

	public function find_session($token_hash)
	{
		return $this->find_active_session_with_user($token_hash);
	}

	public function find_active_session_with_user($token_hash)
	{
		return $this->db
			->select('users.id AS id, users.name, users.username, users.email, users.role, users.status, users.email_verified_at, users.last_login_at, users.created_at, users.updated_at, user_profiles.bio, user_profiles.avatar_url, user_profiles.phone, user_profiles.institution, user_sessions.id AS session_id, user_sessions.user_id AS session_user_id, user_sessions.session_token_hash, user_sessions.user_agent AS session_user_agent, user_sessions.ip_address AS session_ip_address, user_sessions.expires_at, user_sessions.revoked_at, user_sessions.created_at AS session_created_at')
			->from($this->table_sessions)
			->join($this->table_users, 'users.id = user_sessions.user_id')
			->join($this->table_profiles, 'user_profiles.user_id = users.id', 'left')
			->where('user_sessions.session_token_hash', $token_hash)
			->where('user_sessions.revoked_at IS NULL', NULL, FALSE)
			->where('user_sessions.expires_at >', date('Y-m-d H:i:s'))
			->where('users.status', 'active')
			->where('users.deleted_at IS NULL', NULL, FALSE)
			->get()
			->row_array();
	}

	public function list_sessions_by_user($user_id)
	{
		return $this->db
			->select('id, user_id, session_token_hash, user_agent, ip_address, expires_at, revoked_at, created_at')
			->from($this->table_sessions)
			->where('user_id', (int) $user_id)
			->order_by('created_at', 'DESC')
			->get()
			->result_array();
	}

	public function revoke_session($token_hash)
	{
		$this->db
			->where('session_token_hash', $token_hash)
			->where('revoked_at IS NULL', NULL, FALSE)
			->update($this->table_sessions, array(
				'revoked_at' => date('Y-m-d H:i:s'),
			));

		return $this->db->affected_rows() > 0;
	}

	public function revoke_session_by_id($user_id, $session_id)
	{
		$this->db
			->where('user_id', (int) $user_id)
			->where('id', (int) $session_id)
			->where('revoked_at IS NULL', NULL, FALSE)
			->update($this->table_sessions, array(
				'revoked_at' => date('Y-m-d H:i:s'),
			));

		return $this->db->affected_rows() > 0;
	}

	public function get_user_with_profile($user_id)
	{
		return $this->db
			->select('users.id, users.name, users.username, users.email, users.role, users.status, users.email_verified_at, users.last_login_at, users.created_at, users.updated_at, user_profiles.bio, user_profiles.avatar_url, user_profiles.phone, user_profiles.institution')
			->from($this->table_users)
			->join($this->table_profiles, 'user_profiles.user_id = users.id', 'left')
			->where('users.id', (int) $user_id)
			->where('users.deleted_at IS NULL', NULL, FALSE)
			->get()
			->row_array();
	}

	public function update_user_profile($user_id, $user_data, $profile_data)
	{
		$this->db->trans_start();

		if ( ! empty($user_data))
		{
			$user_data['updated_at'] = date('Y-m-d H:i:s');
			$this->db
				->where('id', (int) $user_id)
				->where('deleted_at IS NULL', NULL, FALSE)
				->update($this->table_users, $user_data);
		}

		$profile_exists = $this->db
			->from($this->table_profiles)
			->where('user_id', (int) $user_id)
			->count_all_results() > 0;

		if ($profile_exists)
		{
			$profile_data['updated_at'] = date('Y-m-d H:i:s');
			$this->db
				->where('user_id', (int) $user_id)
				->update($this->table_profiles, $profile_data);
		}
		else
		{
			$profile_data['user_id'] = (int) $user_id;
			$profile_data['created_at'] = date('Y-m-d H:i:s');
			$profile_data['updated_at'] = date('Y-m-d H:i:s');
			$this->db->insert($this->table_profiles, $profile_data);
		}

		$this->db->trans_complete();

		return $this->db->trans_status();
	}
}
