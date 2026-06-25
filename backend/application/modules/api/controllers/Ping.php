<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'core/API_Controller.php';

class Ping extends API_Controller
{
	public function index()
	{
		return $this->respond_success(
			'CyberVault API ping OK',
			array(
				'service' => 'CyberVault Backend API',
				'framework' => 'CodeIgniter 3',
				'hmvc' => TRUE,
			)
		);
	}
}
