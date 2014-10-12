<?php

class VehicleController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
    }

	public function styleAction()
	{
		$style_id = $this->getRequest()->getParam('id');
		//print_r($style_id);exit;
		$this->view->style_id = $style_id;
		$this->view->headScript()->appendFile("/public/js/index/index.js", "text/javascript");
		$this->view->headScript()->appendFile("/public/js/vehicle/vehicle.js", "text/javascript");
		$this->view->headScript()->appendFile("/public/js/login/login.js", "text/javascript");
		$this->view->headLink()->appendStylesheet("/public/css/vehicle/vehicle.css");
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		if($user_login_credentials->user_credentials_id){
			$db = Zend_Registry::get("main_db");
			$sql = $db->select()
				->from('user_profiles')
				->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
			$user_profiles = $db->fetchRow($sql);
			$this->view->user_profiles= $user_profiles;			
		}
		
		
		$car_select = new Zend_Session_Namespace("car_select");
		$this->view->zipcode=$car_select->zipcode;
		//echo $car_select->zipcode;exit;
		$this->_helper->layout->setLayout("vehicle");
	}

}

