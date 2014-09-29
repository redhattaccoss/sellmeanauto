<?php

class IndexController extends Zend_Controller_Action
{

    public function indexAction()
    {
        // action body
    	//echo "<p>hello world</p>";
		$this->view->home_page= "hello";
		$this->view->headScript()->appendFile("/public/js/index/index.js", "text/javascript");
    }
	
	

}

