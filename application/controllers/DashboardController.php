<?php

class DashboardController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
		echo json_encode(array("success"=>true, "msg"=>"dashboard api" ));
		exit;
    }

	public function checkUserSessionAction()
	{
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		if(!$user_login_credentials->user_credentials_id){
			echo json_encode(array("success"=>false, "msg"=>"Plese login" ));
			exit;
		}
		echo json_encode(array("success"=>true, "msg"=>"ok" ));
		exit;
	}

	public function getDealerDashboardAction()
	{
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");		
		$db = Zend_Registry::get("main_db");
		Zend_Loader::loadClass("Utilities",array(COMPONENTS_PATH));
		
		if(!$user_login_credentials->user_credentials_id){
			echo json_encode(array("success"=>false, "msg"=>"Plese login" ));
			exit;
		}
		$sql = $db->select()
			->from('user_profiles')
			->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
		$user_profiles = $db->fetchRow($sql);
		
		
		//Get selected car makes of Dealer
		$sql="SELECT c.value  FROM selected_car_makes s JOIN car_makes c ON c.id=s.car_makes_id WHERE s.user_credentials_id=".$user_login_credentials->user_credentials_id.";";
		$cars = $db->fetchAll($sql);
		$car_makes=array();
		foreach($cars as $car){
			array_push($car_makes, $car['value']);
		}
		
		if(!$car_makes){
			echo json_encode(array("success"=>false, "msg"=>"Dealer has no selected car makes." ));
			exit;
		}
		
		$sql="SELECT * FROM orders o WHERE zipcode='".$user_profiles['zip_code']."' AND car_make IN('".implode("','",$car_makes)."');";
		$orders = $db->fetchAll($sql);
		$user_orders=array();
		foreach($orders as $order){
			
			$sql = $db->select()
				->from('order_items', Array('item_id', 'item_type'))
				->where('order_id =?', $order['id']);
			$items = $db->fetchAll($sql);
			
			$order_date = date("Y-m-d", strtotime($order['order_date']));
			$date_diff = Utilities::dateDiff(sprintf('%s', date("Y-m-d")), $order_date );
			
			$data=array(
				'order_id'=>$order['id'],
				'order_date'=>$order['order_date'],
				'date_diff'=>$date_diff,
				'style_id'=>$order['style_id'],
				'zipcode'=>$order['zipcode'],
				'status'=>$order['status'],
				'duration'=>$order['duration'],
				'items'=>$items,
				
				
			);
			$user_orders[] = $data;
		}			
		
		
		echo json_encode(array("success"=>true, "user_orders"=>$user_orders ));
		exit;
	}


	public function getUserDashboardAction()
	{
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");		
		$db = Zend_Registry::get("main_db");
		Zend_Loader::loadClass("Utilities",array(COMPONENTS_PATH));

		$sql = $db->select()
			->from('orders', Array('id', 'order_date'))
			->where('user_credentials_id =?', $user_login_credentials->user_credentials_id);
		$orders = $db->fetchAll($sql);
		
		$user_orders=array();
		foreach($orders as $order){
			
			$sql = $db->select()
				->from('order_items', Array('item_id', 'item_type'))
				->where('order_id =?', $order['id']);
			$items = $db->fetchAll($sql);
			
			$order_date = date("Y-m-d", strtotime($order['order_date']));
			$date_diff = Utilities::dateDiff(sprintf('%s', date("Y-m-d")), $order_date );
			
			$data=array(
				'order_id'=>$order['id'],
				'order_date'=>$order['order_date'],
				'items'=>$items,
				'date_diff'=>$date_diff
				
			);
			$user_orders[] = $data;
		}
		
		
		echo json_encode(array("success"=>true, "user_orders"=>$user_orders, "user_credentials_id"=>$user_login_credentials->user_credentials_id ));
		exit;
	}
}

