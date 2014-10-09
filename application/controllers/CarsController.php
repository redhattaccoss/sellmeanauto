<?php

class CarsController extends Zend_Controller_Action
{
	public function selectAction(){
		$request = $this->getRequest();
		$makeName = $request->getParam("makeName");
	}
}
	