<?php

/*
*	Author:			Fahid RM.
*
*	Date:			June 2015
*
*	Description:	This is the main page of the server app. It serves as a router.
*
*/


//Load all required scripts.

//Folders where required scripts are housed
$scriptsFolder =  array( 'controllers/' , 'models/', 'persistence/');


//autoload function --> Loads required scripts automatically
function __autoload($class_name) {
    global $scriptsFolder;
    foreach ($scriptsFolder as $scriptFolder){
        if (file_exists($scriptFolder . $class_name . '.php')) {
            include ($scriptFolder . $class_name . '.php');
            return;
        }
    }
}




//Obtaining the method of the request (i.e POST or GET)
$method = $_SERVER['REQUEST_METHOD'];
//Obtaining the URL
$path = $_SERVER['PATH_INFO'];
//Brings about case insensitivity in link
$path = strtolower($path);
$parts = explode("/", $path);

$v = DB::getInstance();	//no need. Just for autoload. Will fix

//set up db
//Persistence::connect();


//Performing Routing
$rep = $parts[0] . "/" . $parts[1] . "/";
$link = str_replace($rep, "", $path);

//handles case where trailing / has not been entered
if ($link == $path){
    $rep = $parts[0] . "/" . $parts[1] ;
    $link = str_replace($rep, "", $path);
}



switch(	$parts[1] ){

    case 'log':	//sends control to the ambulance controller

        LogController::index( $link, $method, $_POST );
        break;

    case '':	//returns the home page

        echo file_get_contents("views/index.html");
        break;

    default:	//returns the 404 page ???
        echo ('Invalid Link.' . $parts[1]);
        break;


}
