<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'core/API_Controller.php';

class Health extends API_Controller {
    public function index() {
        return $this->respond_success(
            'CyberVault backend health check OK',
            [
                'framework' => 'CodeIgniter 3',
                'hmvc' => true
            ]
        );
    }
}
