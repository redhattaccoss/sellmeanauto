<?php
class BidUtilities{
	public static function getCurrentLowestBid($order_id){
		$db = Zend_Registry::get("main_db");
		$current_lowest_bid = $db->fetchOne($db->quoteInto("SELECT MIN(bid_price) FROM bids WHERE order_id = ?", $order_id));

		if (!$current_lowest_bid){
			$current_lowest_bid = 0;
		}
		
		return $current_lowest_bid;		
	}
	
	public static function getCurrentLowestFinanceBid($order_id){
		$db = Zend_Registry::get("main_db");
		$current_lowest_finance_bid = $db->fetchOne($db->quoteInto("SELECT MIN(finance_estimate) FROM bids WHERE order_id = ?", $order_id));
		if (!$current_lowest_finance_bid){
			$current_lowest_finance_bid = 0;
		}
		return $current_lowest_finance_bid;
	}
	
	
	public static function getCountBid($order_id){
		$db = Zend_Registry::get("main_db");
		$count = $db->fetchOne($db->quoteInto("SELECT COUNT(*) FROM bids WHERE order_id = ?", $order_id));
		return $count;
	}
}