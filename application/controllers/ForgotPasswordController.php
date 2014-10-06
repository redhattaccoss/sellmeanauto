<?php

class ForgotPasswordController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
		
    }

    public function indexAction()
    {
        // action body
		$this->view->headScript()->appendFile("/public/js/index/index.js", "text/javascript");
		$this->view->headScript()->appendFile("/public/js/login/login.js", "text/javascript");
		$this->view->headScript()->appendFile("/public/js/forgot-password/forgot-password.js", "text/javascript");
		if ($_REQUEST["twitter_status"]){
			$this->view->twitter_status = $_REQUEST["twitter_status"];		
		}else{
			$this->view->twitter_status = "";
		}
		
		$this->view->user_profiles= $user_profiles;
		
    }


	public function  sendAction(){
		$db = Zend_Registry::get("main_db");
		Zend_Loader::loadClass("Utilities",array(COMPONENTS_PATH));
		$ran = Utilities::generateHash(5);
		
		$validator = new Zend_Validate_EmailAddress();
		
		if (!$validator->isValid($_POST['email'])) {
			// email is invalid; print the reasons
			$err_msg="";
			foreach ($validator->getMessages() as $message) {
				$err_msg .= "$message\n";
			}
			echo json_encode(array("success"=>false, "msg"=>$err_msg ));
			exit;
		}
		
		
		//Check if email if existing
		$sql = $db->select()
			->from('user_credentials')
			->where('registration_type =?', 'manual')
			->where('username =?', $_POST['email']);
		$user_credentials = $db->fetchRow($sql);	
		
		if(!$user_credentials){
			echo json_encode(array("success"=>false, "msg"=>sprintf('Email Address [%s] does not exist.', $_POST['email'])));
			exit;
		}
		
		//print_r($user_credentials);exit;
		$sql = $db->select()
			->from('user_profiles')
			->where('user_credentials_id=?', $user_credentials['id'] );
		$user_profiles = $db->fetchRow($sql);
		
		
		$data=array(
			'password' => sha1($ran), 
			'date_updated' => date("Y-m-d H:i:s")
		);
		$where = "id=".$user_credentials['id'];
		$db->update('user_credentials', $data, $where);
		
		// create view object
		$html = new Zend_View();		
		$html->setScriptPath(EMAILS_LAYOUT_PATH);		
		// assign valeues
		$html->assign('ran', $ran);
		$html->assign('user_profiles', $user_profiles);
		
		// create mail object
		$mail = new Zend_Mail('utf-8');
		// render view
		$bodyText = $html->render('forgot-password.phtml');
		//echo $bodyText;exit;
		// configure base stuff
		$mail->addTo($user_credentials['username']);
		//$mail->addBcc('');
		//$mail->addCc('');
		$mail->setSubject("Sell Me an Auto Forot-Password");
		$mail->setFrom('noreply@sellmeanauto.com', 'sellmeanauto');
		$mail->setBodyHtml($bodyText);
		//$mail->send();
		
		//print_r($ran);exit;
		echo json_encode(array("success"=>true, "msg"=>sprintf('An email has been sent to %s', $_POST['email'])));
		exit;
	}

}

