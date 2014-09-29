<?php

class FacebookRegisterController extends Zend_Controller_Action
{
	public function signinAction(){
		$db = Zend_Registry::get("main_db");
		
		
		$creds = $db->fetchRow($db->select()->from("user_credentials")->where("facebook_id = ?", $_REQUEST["id"])->where("username = ?", $_REQUEST["email"]));
		
		if ($creds){
			$this->view->result = array("success"=>true,"status"=>"Already Registered");
		}else{
			$user_credentials = array(
			"username"=>$_REQUEST["email"],
			"date_created"=>date("Y-m-d H:i:s"),
			"date_updated"=>date("Y-m-d H:i:s"),
			"facebook_id"=>$_REQUEST["id"],		
			);	
			$db->insert("user_credentials", $user_credentials);
			$user_credential_id = $db->lastInsertId("user_credentials");
			$user_profile = array(
				"user_credentials_id"=>$user_credential_id,
				"fname"=>$_REQUEST["first_name"],
				"lname"=>$_REQUEST["last_name"],
				"email"=>$_REQUEST["email"],
				"img_path"=>$_REQUEST["picture"]
			);
			$db->insert("user_profiles", $user_profile);
			$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
			$user_login_credentials->user_credentials_id = $user_credential_id;
			$this->view->result = array("success"=>true,"status"=>"Registered via FB");
		}
		
		echo json_encode($this->view->result);
		exit;
	}
}
