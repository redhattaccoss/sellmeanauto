<?php

class UserController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
		
    }

    public function indexAction()
    {
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		//echo $user_login_credentials->user_credentials_id;
		$user_profiles=array();
		if($user_login_credentials->user_credentials_id){
			$db = Zend_Registry::get("main_db");
			$sql = $db->select()
				->from('user_profiles')
				->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
			$user_profiles = $db->fetchRow($sql);
			
		}		
		$this->view->user_profiles= $user_profiles;
        
		
    }
	
	public function logoutAction()
	{
		Zend_Session::namespaceUnset('user_login_credentials');
		header("Location:/");
		exit;
	}


}

