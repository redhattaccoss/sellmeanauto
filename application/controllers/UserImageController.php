<?php

class UserImageController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
		$db = Zend_Registry::get("main_db");
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");		
		$filepath =APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."public".DIRECTORY_SEPARATOR."img".DIRECTORY_SEPARATOR."no-profile-icon.jpg";
		if($user_login_credentials->user_credentials_id){
			
			$sql = $db->select()
				->from('user_profiles', 'img_path')
				->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
				
				
			$img_path = $db->fetchOne($sql);
			
			$sql = $db->select()->from("user_credentials", "registration_type")->where("id = ?", intval($user_login_credentials->user_credentials_id));
			
		
			$registration_type = $db->fetchOne($sql);
			
			if ($registration_type=="manual"){
				if($img_path){
					$filepath =APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."public".DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$user_login_credentials->user_credentials_id.DIRECTORY_SEPARATOR.$img_path;
				}
			}else{
				$filepath = $img_path;
			}
			
			
		}
		
		
		
		$this->_helper->layout->disableLayout();
        $this->_helper->ViewRenderer->setNoRender();
		$file = $filepath;
       
        $info = getimagesize($file);
		//print_r($info);exit;
        $mimeType = $info['mime'];
		
        $response = $this->getResponse();
        header('Content-type: '.$mimeType);
        
        
        
        $size = filesize($file);
        
        $data = file_get_contents($file);
		echo $data;
		exit; 
		
    }


}

