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


	public function getUserDashboardAction()
	{
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");		
		$db = Zend_Registry::get("main_db");
		
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
			
			$data=array(
				'order_id'=>$order['id'],
				'order_date'=>$order['order_date'],
				'items'=>$items 
				
			);
			$user_orders[] = $data;
		}
		
		
		echo json_encode(array("success"=>true, "user_orders"=>$user_orders, "user_credentials_id"=>$user_login_credentials->user_credentials_id ));
		exit;
	}
}

