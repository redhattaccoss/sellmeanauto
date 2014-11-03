<?php

class VehicleController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
    }

	public function styleAction()
	{
		$style_id = $this->getRequest()->getParam('id');
		//print_r($style_id);exit;
		$this->view->style_id = $style_id;
		$this->view->headScript()->appendFile("/public/js/index/index.js", "text/javascript");
		$this->view->headScript()->appendFile("/public/js/vehicle/vehicle.js", "text/javascript");
		$this->view->headScript()->appendFile("/public/js/login/login.js", "text/javascript");
		$this->view->headLink()->appendStylesheet("/public/css/vehicle/vehicle.css");
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		if($user_login_credentials->user_credentials_id){
			$db = Zend_Registry::get("main_db");
			$sql = $db->select()
				->from('user_profiles')
				->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
			$user_profiles = $db->fetchRow($sql);
			$this->view->user_profiles= $user_profiles;			
		}
		
		
		$car_select = new Zend_Session_Namespace("car_select");
		if(!$car_select->zipcode){
			$car_select->zipcode = 90404;
		}
		$this->view->zipcode=$car_select->zipcode;
		$this->_helper->layout->setLayout("vehicle");
	}
	
	public function processVehicleOptionsAction()
	{
		//Zend_Session::namespaceUnset('car_select');
		$car_select = new Zend_Session_Namespace("car_select");
		$car_select->style_id = $_POST['style_id'];
		$car_select->color_id = $_POST['color_id'];
		$car_select->exterior = $_POST['exterior'];
		$car_select->interior = $_POST['interior'];
		$car_select->interior_color = $_POST['interior-color'];
		echo json_encode(array("success"=>true, "style_id"=>$car_select->style_id));
		exit;
		echo "<pre>";
		print_r($car_select->exterior);
		echo "</pre>";
		exit;
	}
	
	
	
	
	public function summaryAction()
	{
		$style_id = $this->getRequest()->getParam('id');
		$this->view->style_id= $style_id;
		//print_r($style_id);exit;
		$car_select = new Zend_Session_Namespace("car_select");
		//print_r($car_select->style_id);exit;
		
		
		$this->view->headScript()->appendFile("/public/js/index/index.js", "text/javascript");
		$this->view->headScript()->appendFile("/public/js/vehicle/summary.js", "text/javascript");
		$this->view->headScript()->appendFile("/public/js/login/login.js", "text/javascript");
		$this->view->headLink()->appendStylesheet("/public/css/vehicle/vehicle.css");
		
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		if($user_login_credentials->user_credentials_id){
			$db = Zend_Registry::get("main_db");
			$sql = $db->select()
				->from('user_profiles')
				->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
			$user_profiles = $db->fetchRow($sql);
			$this->view->user_profiles= $user_profiles;			
		}
		
		
		$car_select = new Zend_Session_Namespace("car_select");
		//print_r($car_select->interior_color[0]);exit;
		$this->view->car_select= $car_select;
		$this->view->summary=true;
		$this->_helper->layout->setLayout("vehicle");
		
	}
	
	
	public function getCarSelectSessionAction()
	{
		
		$car_select = new Zend_Session_Namespace("car_select");
		//var_dump($car_select->exterior);
		//exit;
		$data=array(
			'style_id' => $car_select->style_id,
			'color_id' => $car_select->color_id,
			'exterior' => $car_select->exterior,
			'interior' => $car_select->interior,
			'interior_color' => $car_select->interior_color,
		);
		
		echo json_encode(array("car_select"=>$data));
		exit;
		exit;
	}
	
	
	public function summaryPostAction()
	{
		$car_select = new Zend_Session_Namespace("car_select");
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		$car_select->post_url = NULL;
		
		if($user_login_credentials->user_credentials_id == NULL){
			$url = "/vehicle/summary-post/?q=true";
			$car_select->post_url = $url;
			echo json_encode(array("success"=>false, "url"=>$url, "msg"=> "Please login.", "style_id"=>$car_select->style_id ));	
			exit;
		}
		
		//TODO
		//Save orders
		//print_r($user_profiles);
		$db = Zend_Registry::get("main_db");
		$data=array(
			'user_credentials_id' => $user_login_credentials->user_credentials_id, 
			'order_date' => date("Y-m-d H:i:s"),
			'status' => 'active',
			'zipcode' => $user_login_credentials->zipcode,
			'car_make' => "test"
		);
		$db->insert('orders', $data);
		$order_id = $db->lastInsertId();	
		
		$car_select = new Zend_Session_Namespace("car_select");		
		unset($car_select->post_url);
		unset($car_select->zipcode);
		//print_r($order_id);exit;
		//echo "<pre>";
		foreach($car_select as $key => $value ){	
			if(is_array($value)){
				foreach($value as $v ){	
					if($v){
						$data=array(
							'order_id' => $order_id,
							'item_id' => $v,
							'item_type' => $key
						);
						//print_r($data);
						$db->insert('order_items', $data);
					}
				}
			}else{
				if($value){
					$data=array(
						'order_id' => $order_id,
						'item_id' => $value,
						'item_type' => $key
					);
					//print_r($data);
					$db->insert('order_items', $data);
				}
			}
			
		}
		//echo "</pre>";
		//exit;
		if(isset($_GET['q'])){
			header("Location:/user/post-response");
			exit;
		}
		echo json_encode(array("success"=>true, "msg"=>"order saved." ));
		exit;
		
	}

}

