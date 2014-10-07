<?php

class UserImageController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
		
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");		
		$filepath =APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."public".DIRECTORY_SEPARATOR."img".DIRECTORY_SEPARATOR."no-profile-icon.jpg";
		if($user_login_credentials->user_credentials_id){
			$db = Zend_Registry::get("main_db");
			$sql = $db->select()
				->from('user_profiles', 'img_path')
				->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
			$img_path = $db->fetchOne($sql);
			if($img_path){
				$filepath =APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."public".DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$user_login_credentials->user_credentials_id.DIRECTORY_SEPARATOR.$img_path;
			}
			
		}
		
		$this->_helper->layout->disableLayout();
        $this->_helper->ViewRenderer->setNoRender();
        
        $file = $filepath;
       
        $info = getimagesize($file);
		//print_r($info);exit;
        $mimeType = $info['mime'];
        
        $size = filesize($file);
        
        $data = file_get_contents($file);
        
        $response = $this->getResponse();
        $response->setHeader('Content-Type', $mimeType, true);
        $response->setHeader('Content-Length', $size, true);
        $response->setBody($data);
        $response->sendResponse();
		exit; 
		
    }


}

