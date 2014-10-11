<?php

class CarsController extends Zend_Controller_Action
{
	public function selectAction(){
		$request = $this->getRequest();
		$makeName = $request->getParam("makeName");
		$modelName = $request->getParam("modelName");
		$year = $request->getParam("year");
		$this->view->makeName = $makeName;
		$this->view->modelName = $modelName;
		$this->view->year = $year;
		$this->view->headLink()->appendStylesheet("/public/css/cars/select.css");
		$this->view->headScript()->appendFile("/public/js/cars/select.js");
		$this->_helper->layout->setLayout("car-select");
	}
}
	