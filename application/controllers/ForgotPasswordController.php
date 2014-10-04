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
		if ($_REQUEST["twitter_status"]){
			$this->view->twitter_status = $_REQUEST["twitter_status"];		
		}else{
			$this->view->twitter_status = "";
		}
		
		$this->view->user_profiles= $user_profiles;
		
    }


}

