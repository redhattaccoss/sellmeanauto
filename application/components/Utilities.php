<?php

class Utilities 
{
	public static function generateHash($lenght=250){
		$chars = array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
        //$lenght=250; 
        (string) $keygen = '';
        for($i=1;$i<=$lenght;$i++){
            $keygen .= $chars[rand(0,60)]; 
        }
  		return $keygen;
	}
}