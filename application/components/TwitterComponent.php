<?php
class TwitterComponent{
	private $consumerkey = '2w7UzSdgulQUgZAAedPV0tCnV';
	private $consumersecret = 'EF59G4fqOJbLgq7fJZq7KiR7rHlJx5E3ircYbYfMpU5bnJSd3A';

	private $accesstoken = "1115674920-NnfNHOvH3I0vjxDdugtFZ5cjDV2QkhH0nIxaIRa";
	private $accesstokensecret = "wescmKfLiG1giKqyt7QbraGHJs81cQAgTgvLwB4R8UQgN";

	public function tweet($message){
		require_once APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."library".DIRECTORY_SEPARATOR."twitteroauth".DIRECTORY_SEPARATOR."twitteroauth.php";
		if (isset($_SESSION["twitter_token"])){
			$accesstoken = $_SESSION["twitter_token"]["oauth_token"];
			$accesstokensecret = $_SESSION["twitter_token"]["oauth_token_secret"];
		}else{
			$accesstoken = $this->accesstoken;
			$accesstokensecret = $this->accesstokensecret;
		}
		
		$twitter = new TwitterOAuth($this->consumerkey, $this->consumersecret, $accesstoken,$accesstokensecret);
 		$result = $twitter->post('https://api.twitter.com/1.1/statuses/update.json', array("status"=>$message));
		return $result;
	}
	
	public function redirect(){
		require_once APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."library".DIRECTORY_SEPARATOR."twitteroauth".DIRECTORY_SEPARATOR."twitteroauth.php";
		$twitter = new TwitterOAuth($this->consumerkey, $this->consumersecret);
 		$temporary_credentials = $twitter->getRequestToken(OAUTH_CALLBACK);
 		$_SESSION["oauth_token"] = $temporary_credentials["oauth_token"];
		$_SESSION["oauth_token_secret"] = $temporary_credentials["oauth_token_secret"];
		
		$redirect_url = $twitter->getAuthorizeURL($temporary_credentials);
		header("Location:".$redirect_url);
		die;
	}
	public function get_followers(){
		require_once APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."library".DIRECTORY_SEPARATOR."twitteroauth".DIRECTORY_SEPARATOR."twitteroauth.php";
		if (isset($_SESSION["twitter_token"])){
			$accesstoken = $_SESSION["twitter_token"]["oauth_token"];
			$accesstokensecret = $_SESSION["twitter_token"]["oauth_token_secret"];
		}else{
			$accesstoken = $this->accesstoken;
			$accesstokensecret = $this->accesstokensecret;
		}
		
		$twitter = new TwitterOAuth($this->consumerkey, $this->consumersecret, $accesstoken,$accesstokensecret);
 		$result = $twitter->get('https://api.twitter.com/1.1/followers/list.json?screen_name=allanaire');
		return $result;
	}
	
	public function get_account_credentials(){
		require_once APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."library".DIRECTORY_SEPARATOR."twitteroauth".DIRECTORY_SEPARATOR."twitteroauth.php";
		if (isset($_SESSION["twitter_token"])){
			$accesstoken = $_SESSION["twitter_token"]["oauth_token"];
			$accesstokensecret = $_SESSION["twitter_token"]["oauth_token_secret"];
		}else{
			$accesstoken = $this->accesstoken;
			$accesstokensecret = $this->accesstokensecret;
		}
		
		$twitter = new TwitterOAuth($this->consumerkey, $this->consumersecret, $accesstoken,$accesstokensecret);
		$result = $twitter->get('https://api.twitter.com/1.1/account/verify_credentials.json');
		return $result;
	}
	public function return_token(){
		require_once APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."library".DIRECTORY_SEPARATOR."twitteroauth".DIRECTORY_SEPARATOR."twitteroauth.php";

		$twitter = new TwitterOAuth($this->consumerkey, $this->consumersecret,$_SESSION["oauth_token"],$_SESSION["oauth_token_secret"]);
		$token = $twitter->getAccessToken($_REQUEST['oauth_verifier']);
		return $token;
	}
}