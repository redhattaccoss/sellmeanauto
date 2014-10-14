<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
	protected function _initAutoload(){
		define("TEST", true);
		define("FORMS_PATH", APPLICATION_PATH.DIRECTORY_SEPARATOR."forms");
		define("MODELS_PATH", APPLICATION_PATH.DIRECTORY_SEPARATOR."models");
		define("COMPONENTS_PATH", APPLICATION_PATH.DIRECTORY_SEPARATOR."components");
		define("EMAILS_LAYOUT_PATH", APPLICATION_PATH.DIRECTORY_SEPARATOR."views".DIRECTORY_SEPARATOR."emaillayouts");
		
		$connectionParameters = array("host" => "localhost",
								"username" => "sellmeanauto",
								"password" => "n0rm4n3eil01",
								"dbname" => "sellmeanauto");
		//load the database adapter
		$db = Zend_Db::factory("Pdo_Mysql", $connectionParameters);
		Zend_Registry::set("main_db", $db);
		Zend_Db_Table_Abstract::setDefaultAdapter($db);
		Zend_Layout::startMvc();
    	$layout = Zend_Layout::getMvcInstance();
		
		
		//session namespace access
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		Zend_Registry::set("user_login_credentials", $user_login_credentials);
			
		$layout->setLayoutPath(APPLICATION_PATH.DIRECTORY_SEPARATOR."views/layouts");
		
		$this->__addRouter();
		//defines the OAUTH_CALLBACK for twitter API
		if (TEST){
			define("OAUTH_CALLBACK", "http://dev.sellmeanauto.com/twitter/callback/");		
		}else{
			define("OAUTH_CALLBACK", "http://sellmeanauto.com/twitter/callback/");
		}
		//echo OAUTH_CALLBACK;
		
		
	}
	
	private function loadLibraries(){
		$views = APPLICATION_PATH.DIRECTORY_SEPARATOR."views";
		$models = APPLICATION_PATH.DIRECTORY_SEPARATOR."models";
		Zend_Loader::loadClass("Converter", array($models));
	}
	
	
	private function defineACL(){
		$acl = new Zend_Acl();
		$acl->addRole(new Zend_Acl_Role("admin"))
			->addRole(new Zend_Acl_Role("agent"))
			->addRole(new Zend_Acl_Role("member"))
			->addRole(new Zend_Acl_Role("owner"));
	
	}
	
	private function _initSetupBaseUrl(){
		$this->bootstrap('frontcontroller');
		$ctrl = Zend_Controller_Front::getInstance();
		$router = $ctrl->getRouter();
		$route = new Zend_Controller_Router_Route_Static("about/*",
					array("controller"=>"index", "action"=>"about"));
		$router->addRoute("about", $route);
	}
	protected function _initRoutes()
	{
		$router = Zend_Controller_Front::getInstance()->getRouter();
		$detailsRoute = new Zend_Controller_Router_Route("vehicle/style/:id", array(
		   'controller' => 'vehicle',
		   'action' => 'style'
		));
		$router->addRoute('vehicleDetail', $detailsRoute);
		
		$detailsRoute = new Zend_Controller_Router_Route("vehicle/summary/:id", array(
		   'controller' => 'vehicle',
		   'action' => 'summary'
		));
		$router->addRoute('vehicleSummary', $detailsRoute);
		
		
		//added cars selection 
		$route = new Zend_Controller_Router_Route("cars/select/:makeName/:modelName/:year",
					array("controller"=>"cars", "action"=>"select"));
		$router->addRoute("cars/select", $route);
		
		
		
		

	}
	protected function _initView(){
		// Initialize view
		$view = new Zend_View();
		$view->addScriptPath(APPLICATION_PATH . '/views/scripts/');
		
		$view->headTitle("Sell me an Auto - Hassle Free. Zero Negotiation.");
		
		// Add it to the ViewRenderer
		$viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper(
		    'ViewRenderer'
		);
		$viewRenderer->setView($view);
		return $view;
	}
	
	protected function _initUser(){

	}
	
	protected function _initAcl(){
		
	}	

}

function dateDiff($startDate, $endDate){
	$startArry = date_parse($startDate);
	$endArry = date_parse($endDate);
	$start_date = gregoriantojd($startArry["month"], $startArry["day"], $startArry["year"]);
	$end_date = gregoriantojd($endArry["month"], $endArry["day"], $endArry["year"]);
	return round(($end_date - $start_date), 0);
}
