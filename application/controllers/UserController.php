<?php

class UserController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
		
    }

    public function indexAction()
    {
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		$db = Zend_Registry::get("main_db");
		
		if(!$user_login_credentials->user_credentials_id){
			header("Location:/");
			exit;
		}

		if($_SERVER['REQUEST_METHOD'] == 'POST'){
			
			Zend_Loader::loadClass("Utilities",array(COMPONENTS_PATH));
			$ran = Utilities::generateHash(10);
			//echo basename($_FILES['file_upload']['name']);exit;
			
			$error_msg="";
			//temporary name of image
			$tmpName = $_FILES['file_upload']['tmp_name']; 
			$img = $_FILES['file_upload']['name']; 
			$imgsize= $_FILES['file_upload']['size']; 
			$imgtype = $_FILES['file_upload']['type'];
			
			if($img != ''){
				if($imgtype=="image/pjpeg") 
				{ 
					$imgtype=".jpg"; 
				} 
				elseif($imgtype=="image/jpeg") 
				{ 
					$imgtype=".jpg"; 
				} 
				elseif($imgtype=="image/gif") 
				{ 
					$imgtype=".gif"; 
				} 
				elseif($imgtype=="image/png") 
				{ 
					$imgtype=".png"; 
				}
				elseif($imgtype=="image/x-png") 
				{ 
					$imgtype=".png"; 
				}  
				else 
				{ 
					$error_msg="Error uploading file, file type is not allowed";
				} 
			}
			//echo $error_msg;exit;
			if(!$error_msg){
				
				$file_path =APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."public".DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$user_login_credentials->user_credentials_id.DIRECTORY_SEPARATOR;
				//echo $file_path;exit;
				if(!file_exists($file_path)){
					mkdir("$file_path",0755); // create a new Folder php function to make a new folder
				}
				
				//$target_path = $file_path.DIRECTORY_SEPARATOR.basename($_FILES['file_upload']['name']);
				$new_filename = sprintf('%s%s', $ran, $imgtype);
				//echo $new_filename;exit;
				$target_path = $file_path.DIRECTORY_SEPARATOR.$new_filename;
				chmod($target_path, 0755);
				
				
				if(@move_uploaded_file($_FILES['file_upload']['tmp_name'], $target_path)) {
					chmod($target_path, 0755);
					$data=array(
						'img_path' => $new_filename		
					);
					$where = "user_credentials_id =".$user_login_credentials->user_credentials_id;
					$db->update('user_profiles', $data, $where);
				}
				
				//print_r($data);exit; 			
			}
			
			$this->view->error_msg= $error_msg;	
			
		}

		
		$sql = $db->select()
			->from('user_credentials', 'type')
			->where('id=?', $user_login_credentials->user_credentials_id );
		$user_type = $db->fetchOne($sql);

		$sql = $db->select()
			->from('user_profiles')
			->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
		$user_profiles = $db->fetchRow($sql);
		
		$user_profiles['type'] = $user_type;
		$this->view->user_profiles= $user_profiles;		
		$this->view->headScript()->appendFile("/public/js/user/user.js", "text/javascript");
		$this->view->account_active="panel-active";
		if($user_type == "consumer"){
			$this->view->headLink()->appendStylesheet("/public/css/user/user.css");
			$this->_helper->layout->setLayout("user");
		}else{
			$this->_helper->layout->setLayout("dealer");
		}
		
    }
	
	
	public function consumerAction()
	{
		echo "consumer";exit;
	}
	
	public function dealerAction()
	{
		echo "dealer";exit;
	}
	
	
	
	public function updatePersonalInfoAction()
	{
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		$db = Zend_Registry::get("main_db");
		
		if(!$user_login_credentials->user_credentials_id){
			echo json_encode(array("success"=>false, "msg"=>"Session expires. Please re-login" ));
			exit;
		}
		
		$data=array(
			'fname' => $_POST['fname'], 
			'lname' => $_POST['lname'], 
			'cell_no' => $_POST['cell_no'], 
			'tell_no' => $_POST['tell_no'], 
			'fax_no' => $_POST['fax_no'], 
			'street' => $_POST['street'], 
			'city_town' => $_POST['city_town'], 
			'state_province' => $_POST['state_province'], 
			'zip_code' => $_POST['zip_code']
		);
		//print_r($data);exit;
		
		$where = "user_credentials_id =".$user_login_credentials->user_credentials_id;
		
		$result = $db->update('user_profiles', $data, $where);
		//print_r($result);exit;
		
		echo json_encode(array("success"=>true, "msg"=>"Personal Information updated." ));
		exit;
	}
	
	
	public function updatePasswordAction()
	{
		//echo "<pre>";
		//print_r($_POST);
		//echo "</pre>";
		
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		$db = Zend_Registry::get("main_db");
		
		if(!$user_login_credentials->user_credentials_id){
			echo json_encode(array("success"=>false, "msg"=>"Session expires. Please re-login" ));
			exit;
		}
		
		$sql = $db->select()
			->from('user_credentials')
			->where('id=?', $user_login_credentials->user_credentials_id );
		$user_credentials = $db->fetchRow($sql);
		if($user_credentials['password'] != sha1($_POST['currentpassword'])){
			echo json_encode(array("success"=>false, "msg"=>"Wrong current password." ));
			exit;
		}
		
		if($_POST['newpassword']==""){
			echo json_encode(array("success"=>false, "msg"=>"Invalid password. Please try again." ));
			exit;
		}
		
		if(sha1($_POST['newpassword']) != sha1($_POST['confirmnewpassword']) ){
			echo json_encode(array("success"=>false, "msg"=>"New password seems incorrect. Please try again." ));
			exit;
		}
		
		$data=array(
			'password' => sha1($_POST['newpassword']),
			'date_updated' => date("Y-m-d H:i:s")
		);
		
		$where = "id =".$user_login_credentials->user_credentials_id;
		$db->update('user_credentials', $data, $where);
		echo json_encode(array("success"=>true, "msg"=>"Password updated." ));
		exit;
	}
	public function postResponseAction()
	{
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		$db = Zend_Registry::get("main_db");
		
		$sql = $db->select()
			->from('user_credentials', 'type')
			->where('id=?', $user_login_credentials->user_credentials_id );
		$user_type = $db->fetchOne($sql);
		
		
		$sql = $db->select()
			->from('user_profiles')
			->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
		$user_profiles = $db->fetchRow($sql);
		
		$user_profiles['type'] = $user_type;
		$this->view->user_profiles= $user_profiles;		
		$this->view->headScript()->appendFile("/public/js/user/user.js", "text/javascript");
        
		
		if($user_type == "consumer"){
			$this->view->headLink()->appendStylesheet("/public/css/user/user.css");
			$this->_helper->layout->setLayout("user");
		}else{
			$this->_helper->layout->setLayout("dealer");
		}
		
	}
	
	public function postedAction()
	{
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		
		if(!$user_login_credentials->user_credentials_id){
			header("Location:/");
			exit;
		}
		
		$db = Zend_Registry::get("main_db");
		
		$sql = $db->select()
			->from('user_credentials', 'type')
			->where('id=?', $user_login_credentials->user_credentials_id );
		$user_type = $db->fetchOne($sql);
		if($user_type == "dealer"){
			header("Location:/user/");
			exit;
		}
		
		$sql = $db->select()
			->from('user_profiles')
			->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
		$user_profiles = $db->fetchRow($sql);
		
		$user_profiles['type'] = $user_type;
		$this->view->user_profiles= $user_profiles;		
		
		$this->view->headScript()->appendFile("/public/js/index/index.js", "text/javascript");
		$this->view->headScript()->appendFile("/public/js/user/user.js", "text/javascript");
        
		$this->view->posted_active="panel-active";
		$this->view->headScript()->appendFile("/public/js/dashboard/dashboard.js", "text/javascript");
		if($user_type == "consumer"){
			$this->view->headLink()->appendStylesheet("/public/css/user/user.css");
			$this->_helper->layout->setLayout("user");
		}
	}
	
	public function accountSettingsAction()
	{
		
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		$db = Zend_Registry::get("main_db");
		
		$sql = $db->select()
			->from('user_credentials', 'type')
			->where('id=?', $user_login_credentials->user_credentials_id );
		$user_type = $db->fetchOne($sql);
		if($user_type == "dealer"){
			header("Location:/user/");
			exit;
		}
		
		$sql = $db->select()
			->from('user_profiles')
			->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
		$user_profiles = $db->fetchRow($sql);
		
		$user_profiles['type'] = $user_type;
		$this->view->user_profiles= $user_profiles;		
		$this->view->headScript()->appendFile("/public/js/user/user.js", "text/javascript");
        
		$this->view->account_settings_active="panel-active";
		$this->view->headLink()->appendStylesheet("/public/css/user/user.css");
		$this->_helper->layout->setLayout("user");
	
	}
	
	
	public function bidsAction()
	{
		
		echo "Under Construction";exit;
	
	}
	
	
	
	public function dashboardAction()
	{
		
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		$db = Zend_Registry::get("main_db");
		
		$sql = $db->select()
			->from('user_credentials', 'type')
			->where('id=?', $user_login_credentials->user_credentials_id );
		$user_type = $db->fetchOne($sql);
		if($user_type == "consumer"){
			header("Location:/user/");
			exit;
		}
		
		$sql = $db->select()
			->from('user_profiles')
			->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
		$user_profiles = $db->fetchRow($sql);
		
		$user_profiles['type'] = $user_type;
		$this->view->user_profiles= $user_profiles;	
		
		
		$this->view->headScript()->appendFile("/public/js/index/index.js", "text/javascript");
		$this->view->headScript()->appendFile("/public/js/user/user.js", "text/javascript");
		$this->view->headScript()->appendFile("/public/js/dashboard/dashboard.js", "text/javascript");
        $this->_helper->layout->setLayout("dealer");
	}
	
	public function logoutAction()
	{
		Zend_Session::namespaceUnset('user_login_credentials');
		header("Location:/");
		exit;
	}


}

