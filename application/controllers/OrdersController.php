<?php
class OrdersController extends Zend_Controller_Action{
		
	/**
	 * JSON Web Service API for viewing the order
	 */	
	public function viewAction(){
		$result = array();
		$errors = array();	
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		if(!$user_login_credentials->user_credentials_id){
			$errors[] = "Not Logged In!";
		}
		
		$db = Zend_Registry::get("main_db");	
		$order_id = $this->getRequest()->getQuery("id");
		if (!$order_id){
			$errors[] = "Missing Order Id!";			
		}else{
			$order = $db->fetchRow($db->select()->from("orders")->where("id = ?", $order_id));
			if ($order){
				$order_items = $db->fetchRow($db->select()->from("order_items")->where("order_id = ?", $order_id));
				$order["order_items"] = $order_items;
				
				$current_lowest_bid = $db->fetchOne($db->quoteInto("SELECT MIN(bid_price) FROM bids WHERE order_id = ?", $order_id));
				$current_lowest_finance_bid = $db->fetchOne($db->quoteInto("SELECT MIN(finance_estimate) FROM bids WHERE order_id = ?", $order_id));

				if (!$current_lowest_bid){
					$current_lowest_bid = 0;
				}
				
				if (!$current_lowest_finance_bid){
					$current_lowest_finance_bid = 0;
				}
				
				$url = EDMUNDS_BASE_URL."vehicle/v2/styles/" . $order["style_id"] . "?view=full&fmt=json&api_key=" . EDMUNDS_API_KEY;
				$response = file_get_contents($url);
				$response = json_decode($response);
				$order["niceName"] = $response->make->name." ".$response->model->name;
				$order["msrp"] = $response->price->baseMSRP;
				$order["finance"] = ($order["msrp"] - ($order["msrp"]*.10))/72;
				$order["transmission"] = $response->transmission->transmissionType;
				$order["current_lowest_bid"] = $current_lowest_bid;
				$order["current_lowest_finance_bid"] = $current_lowest_finance_bid;
				
				
				//address of the car bidder
				$profile = $db->fetchRow($db->select()->from("user_profiles")->where("user_credentials_id = ?", $order["user_credentials_id"]));
				$address = "";
				if ($profile["street"]){
					$address.=$profile["street"]." ";
				}
				if ($profile["city_town"]){
					$address.=$profile["city_town"]." ";
				}
				if ($profile["state_province"]){
					$address.=$profile["state_province"]." ";
				}
				if ($profile["zipcode"]){
					$address.=$profile["zipcode"]." ";
				}
				$order["address"] = $address;
				
			}else{
				$errors[] = "Invalid Order!";
			}
		}
		
		if (empty($errors)){
			$result["success"] = true;
			$result["order"] = $order;
		}else{
			$result["success"] = false;
			$result["errors"] = $errors;
		}
		
		echo json_encode($result);
		exit;
		
	}	
}
