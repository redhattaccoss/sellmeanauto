<?php
class TwitterController extends Zend_Controller_Action{
	public function redirectAction(){
		Zend_Loader::loadClass("TwitterComponent", array(COMPONENTS_PATH));
		$twitter = new TwitterComponent();
		$twitter->redirect();
	}
	
	public function callbackAction(){
		$db = Zend_Registry::get("main_db");
		
		Zend_Loader::loadClass("TwitterComponent", array(COMPONENTS_PATH));
		$twitter = new TwitterComponent();
		$token = $twitter->return_token();
		
		
		$credentials = $twitter->get_account_credentials();
		$creds = $db->fetchRow($db->select()->from("user_credentials")->where("twitter = ?", $credentials->id)->where("username = ?",$credentials->screen_name)->where("registration_type = ?", "twitter"));
		if ($creds){
			$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
			$user_login_credentials->user_credentials_id = $creds["id"];
			header("Location:/?twitter_status=already_registered");
		
		}else{
			$user_credentials = array(
			"username"=>$credentials->screen_name,
			"date_created"=>date("Y-m-d H:i:s"),
			"date_updated"=>date("Y-m-d H:i:s"),
			"twitter"=>$credentials->id,	
			"registration_type"=>"twitter"	
			);	
			$db->insert("user_credentials", $user_credentials);
			$user_credential_id = $db->lastInsertId("user_credentials");
			$user_profile = array(
				"user_credentials_id"=>$user_credential_id,
				"fname"=>$credentials->name,
				"lname"=>"",
				"img_path"=>$credentials->profile_image_url
			);
			
			$db->insert("user_profiles", $user_profile);
			header("Location:/?twitter_status=registered_via_twitter");
		}
		
		$_SESSION["twitter_token"] = $token;
		exit;
	}
}
