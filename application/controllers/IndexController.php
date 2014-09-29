<?php

class IndexController extends Zend_Controller_Action
{

    public function indexAction()
    {
        // action body
    	//echo "<p>hello world</p>";exit;
		$this->view->headScript()->appendFile("/public/js/index/index.js", "text/javascript");
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		//echo $user_login_credentials->user_credentials_id;exit;
		$this->view->user_credentials_id= $user_login_credentials->user_credentials_id;
		
    }
	
	

}

