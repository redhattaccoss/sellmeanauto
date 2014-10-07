<?php

class UserImageController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
		/*
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		//Zend_Loader::loadClass("SimpleImage",array(COMPONENTS_PATH));
		require_once APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."library".DIRECTORY_SEPARATOR."SimpleImage.php";
		$filepath =APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."public".DIRECTORY_SEPARATOR."img".DIRECTORY_SEPARATOR."no-profile-icon.jpg";
		//echo $filepath;exit;
		header("Content-type: image/jpeg");
		$image = new SimpleImage();
		$filepath = file_get_contents($filepath);
		$image->image = imagecreatefromstring($filepath);
		$image->output();
		*/
		//$this->_helper->layout->disableLayout(); 
		
		$user_login_credentials = new Zend_Session_Namespace("user_login_credentials");
		
		$filepath =APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."public".DIRECTORY_SEPARATOR."img".DIRECTORY_SEPARATOR."no-profile-icon.jpg";
		if($user_login_credentials->user_credentials_id){
			$db = Zend_Registry::get("main_db");
			$sql = $db->select()
				->from('user_profiles', 'img_path')
				->where('user_credentials_id=?', $user_login_credentials->user_credentials_id );
			//echo $sql;exit;	
			$img_path = $db->fetchOne($sql);
			if($img_path){
				$filepath =APPLICATION_PATH.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."public".DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$user_login_credentials->user_credentials_id.DIRECTORY_SEPARATOR.$img_path;
				//echo $filepath;exit;	
			}
			
		}
		
		
		//print_r(mime_content_type($filepath));exit;
		//$logo = file_get_contents($filepath); 
		//echo count($logo);exit;
		
		
		//$type = 'image/png'; 
		/*
		$response = $this->getFrontController()->getResponse(); 
		$response->setHeader('Content-Type', $type, true); 
		$response->setHeader('Content-Length', count($logo), true); 
		$response->setHeader('Content-Transfer-Encoding', 'binary', true); 
		$response->setHeader('Cache-Control', 'max-age=3600, must-revalidate', true); 
		$response->setBody($logo); 	
		$response->sendResponse(); 
		*/
        /*
        $modifiedDateGM = gmdate('D, d M Y H:i:s', strtotime($logo['modified'])) . ' GMT';
        $response = $this->getFrontController()->getResponse();
        $response->setHeader('Last-Modified', $modifiedDateGM, true);
        $response->setHeader('Content-Type', $type, true);
        $response->setHeader('Content-Length', count($logo), true);

        $response->setHeader('Content-Transfer-Encoding', 'binary', true);
        $response->setHeader('Cache-Control', 'max-age=3600, must-revalidate', true);
        $response->setBody($logo);
        $response->sendResponse();
        exit;
		*/
		
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

