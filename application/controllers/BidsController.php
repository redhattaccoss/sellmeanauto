<?php
class BidsController extends Zend_Controller_Action{
	
	public function placeBidAction(){
		$result = array();
		$errors = array();	
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		if(!$user_login_credentials->user_credentials_id){
			$errors[] = "Not Logged In!";
		}
		
		$db = Zend_Registry::get("main_db");	
			
		$data = $_POST;
		
		if ($data&&empty($errors)){
			$data["dealer_id"] = $user_login_credentials->user_credentials_id;
			$data["date_posted"] = date("Y-m-d H:i:s");
			$db->insert("bids", $data);
			
			$bid_id = $db->lastInsertId("bids");
			
			
			//load dealer profile
			$dealer_profile = $db->fetchRow($db->select()->from("user_profiles")->where("user_credentials_id = ?", $data["dealer_id"]));
			
			$message = array("message"=>$dealer_profile["fname"]." ".$dealer_profile["lname"]." has bid to your item", "bid_id"=>$bid_id, "dealer_id"=>$data["dealer_id"]);
			
			
			//load owner of order
			$order = $db->fetchRow($db->select()->from("orders")->where("id = ?", $data["order_id"]));
			
			//insert into notifications
			$notification = array();
			$notification["message"] = json_encode($message);
			$notification["user_credentials_id"] = $order;
			$notification["type"] = "added_bid";
			$notification["date_posted"] = date("Y-m-d H:i:s");
			$notification["read"] = "N";
			
			$db->insert("notifications", $notification);
			
			
			$result["success"] = true;
		}else{
			$result["success"] = false;
			$result["errors"] = $errors;
		}
		
		
		echo json_encode($result);
		exit;
	}
	
	
	public function getBidsAction(){
		$result = array();
		$errors = array();	
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		if(!$user_login_credentials->user_credentials_id){
			$errors[] = "Not Logged In!";
		}
		$db = Zend_Registry::get("main_db");	
		
		if (empty($errors)){
			$sql = $db->select()->from(array("b"=>"bids"))->where("dealer_id = ?", $user_login_credentials->user_credentials_id);
			$bids = $db->fetchAll($sql);
			
			foreach($bids as $key=>$bid){
				$order_details = $db->fetchRow($db->select()->from(array("o"=>"orders"))->where("id = ?", $bid["order_id"]));
				if ($order_details){
					$order_details["start_millisecond"] = strtotime($order_details["order_date"]);
					$date = DateTime::createFromFormat("Y-m-d H:i:s", $order_details["order_date"]);
					$date->modify("+".$order_details["duration"]." days");
					$order_details["end_millisecond"] = strtotime($date->format("Y-m-d H:i:s"));
					$order_items = $db->fetchAll($db->select()->from(array("oi"=>"order_items"))->where("order_id = ?", $bid["order_id"]));					$order_details["order_items"] = $order_items;
				}
				$bids[$key]["order_details"] = $order_details;
			}
			$result["success"] = true;
			$result["bids"] = $bids;
		}else{
			$result["success"] = false;
			$result["errors"] = $errors;
		}
		
		echo json_encode($result);
		exit;
	}
	
}
