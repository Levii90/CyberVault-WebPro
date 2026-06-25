<?php
defined('BASEPATH') OR exit('No direct script access allowed');

if ( ! function_exists('api_success'))
{
	function api_success($message = 'OK', $data = array(), $status_code = 200)
	{
		return array(
			'status_code' => $status_code,
			'body' => array(
				'success' => TRUE,
				'message' => $message,
				'data' => $data,
			),
		);
	}
}

if ( ! function_exists('api_error'))
{
	function api_error($message = 'Error', $errors = array(), $status_code = 400)
	{
		return array(
			'status_code' => $status_code,
			'body' => array(
				'success' => FALSE,
				'message' => $message,
				'errors' => $errors,
			),
		);
	}
}

if ( ! function_exists('api_validation_error'))
{
	function api_validation_error($errors = array(), $message = 'Validation failed')
	{
		return api_error($message, $errors, 422);
	}
}

if ( ! function_exists('api_not_found'))
{
	function api_not_found($message = 'Resource not found')
	{
		return api_error($message, array(), 404);
	}
}

if ( ! function_exists('api_method_not_allowed'))
{
	function api_method_not_allowed($message = 'Method not allowed')
	{
		return api_error($message, array(), 405);
	}
}
