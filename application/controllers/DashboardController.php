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
		
		$db = Zend_Registry::get("main_db");
		$sql = $db->select()
			->from('user_credentials', 'type')
			->where('id=?', $user_login_credentials->user_credentials_id );
		$user_type = $db->fetchOne($sql);
		
		echo json_encode(array("success"=>true, "msg"=>"ok", "type"=>$user_type ));
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
			//echo $order['id'];
			
			$sql = $db->select()
				->from('order_items', Array('item_id', 'item_type'))
				->where('order_id =?', $order['id']);
			//echo $sql;exit;	
			$items = $db->fetchAll($sql);
			
			$date_diff = "";
			$order_date = date("Y-m-d", strtotime($order['order_date']));			
			$date_diff = Utilities::dateDiff(sprintf('%s', date("Y-m-d")), $order_date );
			
			Zend_Loader::loadClass("BidUtilities", array(COMPONENTS_PATH));
			
			$current_lowest_bid = BidUtilities::getCurrentLowestBid($order["id"]);
			$current_lowest_finance_bid = BidUtilities::getCurrentLowestFinanceBid($order["id"]);
			$count = BidUtilities::getCountBid($order["id"]);
			$data=array(
				'order_id'=>$order['id'],
				'order_date'=>$order['order_date'],
				'date_diff'=>$date_diff,
				'style_id'=>$order['style_id'],
				'zipcode'=>$order['zipcode'],
				'status'=>$order['status'],
				'duration'=>$order['duration'],
				'items'=>$items,
				"current_lowest_bid"=>$current_lowest_bid,
				"current_lowest_finance_bid"=>$current_lowest_finance_bid,
				"current_bid_count"=>$count
				
			);
			
			
			$today = strtotime(date("Y-m-d H:i:s"));
			$data["ending"] = $today - strtotime($order["order_date"]);
			
			
			$user_orders[] = $data;
			
		}			
		//print_r($user_orders);exit;
		
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

