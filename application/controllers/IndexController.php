<?php

class IndexController extends Zend_Controller_Action
{

    public function indexAction()
    {
        // action body
    	//echo "<p>hello world</p>";exit;
		$this->view->headScript()->appendFile("/public/js/index/index.js", "text/javascript");
		$this->view->headScript()->appendFile("/public/js/login/login.js", "text/javascript");
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		//echo $user_login_credentials->user_credentials_id;exit;
		$db = Zend_Registry::get("main_db");
		$user_profiles=array();
		if($user_login_credentials->user_credentials_id){
			$sql = $db->select()
				->from('user_profiles')
				->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
			$user_profiles = $db->fetchRow($sql);
			
			$this->view->user_profiles= $user_profiles;			
		}

		if ($_REQUEST["twitter_status"]){
			$this->view->twitter_status = $_REQUEST["twitter_status"];		
		}else{
			$this->view->twitter_status = "";
		}
		
		//REDIRECT URL from CAR SPECIFICATION PAGE
		if ($_REQUEST["q"]){
			$q = $_REQUEST["q"];
		}else{
			$q = "";
		}
		$this->view->q = $q;
		
		//load model years
		$years = array();
		for($i=2013;$i<=(intval(date("Y"))+1);$i++){
			$years[] = $i;
		}
		
		$this->view->build=false;
		if(isset($_GET['build'])){
			$this->view->build=true;
		}
		$this->view->years = $years;
		$this->view->user_profiles= $user_profiles;
    }
	
	public function setZipcodeAction(){
		$code = $this->getRequest()->getQuery("zip");
		$car_select = new Zend_Session_Namespace("car_select");
		$car_select->zipcode = $code;
		echo json_encode(array("success"=>true));
		exit;
	}

}

