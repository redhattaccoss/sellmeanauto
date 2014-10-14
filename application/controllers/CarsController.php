<?php

class CarsController extends Zend_Controller_Action
{
	public function selectAction(){
		$request = $this->getRequest();
		$makeName = $request->getParam("makeName");
		$modelName = $request->getParam("modelName");
		$year = $request->getParam("year");
		$this->view->makeName = $makeName;
		$this->view->modelName = $modelName;
		$this->view->year = $year;
		$this->view->headLink()->appendStylesheet("/public/css/cars/select.css");
		$this->view->headScript()->appendFile("/public/js/cars/select.js");
		
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		if($user_login_credentials->user_credentials_id){
			$db = Zend_Registry::get("main_db");
			$sql = $db->select()
				->from('user_profiles')
				->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
			$user_profiles = $db->fetchRow($sql);
			$this->view->user_profiles= $user_profiles;
		}
		
		
		
		$this->_helper->layout->setLayout("car-select");
	}
}
	