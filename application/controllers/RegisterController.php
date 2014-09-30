<?php

class RegisterController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
		header("Location:/register/step1");
		
    }

	
	public function step1Action()
    {
        // action body
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		if($user_login_credentials->step1){
			$db = Zend_Registry::get("main_db");
			$sql = $db->select()
				->from('temp_registration')
				->where('ran =?', $user_login_credentials->ran );
			$temp_registration = $db->fetchRow($sql);
			$this->view->temp_registration = $temp_registration;
			$this->view->disabled = "disabled='disabled'";
			$this->view->dummy_password_str = "hello world";
			//print_r($temp_registration);exit;
		}
		
		$this->_helper->layout->setLayout("register");
		
    }
	
	public function step2Action()
    {
        // action body
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		if(!$user_login_credentials->step1){
			header("Location:/register/step1");
			exit;
		}
		
		$db = Zend_Registry::get("main_db");
		$sql = $db->select()
			->from('temp_registration')
			->where('ran =?', $user_login_credentials->ran );
		$temp_registration = $db->fetchRow($sql);
		$this->view->temp_registration = $temp_registration;
		
		
		$this->_helper->layout->setLayout("register");
    }
	
	public function step3Action()
    {
        // action body
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		if(!$user_login_credentials->step1){
			header("Location:/register/step1");
			exit;
		}
		$this->_helper->layout->setLayout("register");
    }
	
	
	public function  processStep1Action(){
		$db = Zend_Registry::get("main_db");
		
		Zend_Loader::loadClass("Utilities",array(COMPONENTS_PATH));
		$ran = Utilities::generateHash();
		//echo strlen($ran);
		
		//Check if email if existing
		$sql = $db->select()
			->from('temp_registration', 'email')
			->where('email =?', $_POST['email']);
		$existing_email = $db->fetchOne($sql);	
		
		if($existing_email){
			echo json_encode(array("success"=>false, "existing_email"=>$existing_email, "msg"=>'This email has already been registered.' ));
			exit;
		}
		
		
		
		$data=array(
			'email' => $_POST['email'],
			'password' => sha1($_POST['password']),
			'ran' =>  $ran,
			'date_registered' => date("Y-m-d H:i:s")
		);
		//echo "<pre>";
		//print_r($data);
		//echo "</pre>";
		//exit;
		$db->insert('temp_registration', $data);
		
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		$user_login_credentials->step1 = true;
		$user_login_credentials->ran = $ran;
		echo json_encode(array("success"=>true, "ran"=>$ran ));
		exit;
	}
	
	public function  processStep2Action(){
		$db = Zend_Registry::get("main_db");
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		
		$data=array(
			'fname' => $_POST['fname'],
			'lname' => $_POST['lname'],
			'about_user' => $_POST['about_user']
		);
		$where = "ran = '".$user_login_credentials->ran."'";
		$db->update('temp_registration', $data, $where);
		
		
		/*
		echo "<pre>";
		echo $user_login_credentials->ran;
		echo "<br>";
		print_r($_POST);
		echo "</pre>";
		*/
		echo json_encode(array("success"=>true, "ran"=>$user_login_credentials->ran, "msg"=> "Personal Information updated."   ));
		exit;
		
	}
	
	public function  processStep3Action(){
		$db = Zend_Registry::get("main_db");
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		
		$data=array(
			'cell_no' => $_POST['cell_no'],
			'tell_no' => $_POST['tell_no'],
			'fax_no' => $_POST['fax_no'],
			'street' => $_POST['street'],
			'city_town' => $_POST['city_town'],
			'state_province' => $_POST['state_province'],
			'zip_code' => $_POST['zip_code'],
		);
		$where = "ran = '".$user_login_credentials->ran."'";
		$db->update('temp_registration', $data, $where);
		
		
		/*
		echo "<pre>";
		echo $user_login_credentials->ran;
		echo "<br>";
		print_r($_POST);
		echo "</pre>";
		*/
		echo json_encode(array("success"=>true, "ran"=>$user_login_credentials->ran, "msg"=> "Contact Information updated."   ));
		exit;
		
	}
	
	public function  thankyouAction(){
		
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		$db = Zend_Registry::get("main_db");
		$sql = $db->select()
			->from('temp_registration')
			->where('ran =?', $user_login_credentials->ran );
		$temp_registration = $db->fetchRow($sql);
		
		
		
		// create view object
		$html = new Zend_View();
		
		$html->setScriptPath(EMAILS_LAYOUT_PATH);
		
		// assign valeues
		$html->assign('name', sprintf('%s %s', $temp_registration['fname'], $temp_registration['lname']));
		
		if(TEST){
			$url = sprintf('http://dev.sellmeanauto.com/register/activate-account/?h_key=%s', $temp_registration['ran']);
		}else{
			$url = sprintf('http://sellmeanauto.com/register/activate-account/?h_key=%s', $temp_registration['ran']);
		}
		
		$html->assign('url', $url);		
		// create mail object
		$mail = new Zend_Mail('utf-8');
		// render view
		$bodyText = $html->render('activate_account.phtml');
		//echo $bodyText;exit;
		// configure base stuff
		$mail->addTo($temp_registration['email'], sprintf('%s %s', $temp_registration['fname'], $temp_registration['lname']));
		//$mail->addBcc('');
		//$mail->addCc('');
		$mail->setSubject("Please activate you sellmeanuto account");
		$mail->setFrom('noreply@sellmeanauto.com', 'sellmeanauto');
		$mail->setBodyHtml($bodyText);
		//$mail->send();
		
		$this->view->temp_registration = $temp_registration;
		$this->_helper->layout->setLayout("register");
	}
	
	public function activateAccountAction(){
		//print_r($_GET['h_key']); exit;
		$ran = $_GET['h_key'];
		if(!isset($_GET['h_key'])){
			header("Location:/");
			exit;
		}
		if(!$ran){
			header("Location:/");
			exit;
		}
		$db = Zend_Registry::get("main_db");
		$sql = $db->select()
			->from('temp_registration')
			->where('ran =?', $ran );
		$temp_registration = $db->fetchRow($sql);
		
		
		if($temp_registration['account_activated'] == 'Y'){
			header("Location:/");
			exit;
		}
		
		
		//print_r($temp_registration); exit;
		$data=array(
			'account_activated' => 'Y',
			'date_activated' => date("Y-m-d H:i:s")
		);
		$where = "ran = '".$ran."'";
		$db->update('temp_registration', $data, $where);
		
		
		
		#TODO
		//isnert new record in user_credentials 
		$data=array(
			'username' => $temp_registration['email'], 
			'password' => $temp_registration['password'], 
			'registration_type' => 'manual', 
			'date_created' => date("Y-m-d H:i:s"), 
			'date_updated' => date("Y-m-d H:i:s")
		);
		
		$db->insert('user_credentials', $data);
		$user_credentials_id = $db->lastInsertId();
		
		//insert new record in user_profiles
		$data=array(
			'user_credentials_id' => $user_credentials_id, 
			'fname' => $temp_registration['fname'], 
			'lname' => $temp_registration['lname'], 
			'email' => $temp_registration['email'], 
			'about_user' => $temp_registration['about_user'], 
			'img_path' => $temp_registration['img_path'], 
			'cell_no' => $temp_registration['cell_no'], 
			'tell_no' => $temp_registration['tell_no'], 
			'fax_no' => $temp_registration['fax_no'], 
			'street' => $temp_registration['street'], 
			'city_town' => $temp_registration['city_town'], 
			'state_province' => $temp_registration['state_province'], 
			'zip_code' => $temp_registration['zip_code'] 		
		);
		$db->insert('user_profiles', $data);
		
		
		
		
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		$user_login_credentials->user_credentials_id = $user_credentials_id;
		
		//print_r($user_login_credentials->user_credentials_id);exit;
		//echo "<pre>";
		//print_r($data); 
		//echo "</pre>";
		//exit;
		
		//die("Insert record in user_credentials and user_profiles");		
		header("Location:/");
		exit;
	}
	
}

