<?php

class SigninController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
		//echo "<pre>";
		//print_r ($_POST);
		//echo "</pre>";
		//exit;
		
		
		$db = Zend_Registry::get("main_db");
		$sql = $db->select()
			->from('user_credentials', 'id')
			->where('registration_type=?', 'manual' )
			->where('username=?', $_POST['username'] )
			->where('password=?', sha1($_POST['login_password']) );
		$user_credentials_id = $db->fetchOne($sql);	
		if(!$user_credentials_id){
			echo json_encode(array("success"=>false, "msg"=>'Email / Password does not match.' ));
			exit;
		}
		
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		$user_login_credentials->user_credentials_id = $user_credentials_id;
		echo json_encode(array("success"=>true, "msg"=>'ok' , "user_credentials_id"=>$user_login_credentials->user_credentials_id ));
		exit;
    }


}

