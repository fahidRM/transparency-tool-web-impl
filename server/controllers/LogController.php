<?php


class LogController {

    public static function index($path, $method, $data){
        switch ($method) {

            case 'GET':

                if ($path == ''){
                    echo LogController::fetch(NULL);
                }else{
                    echo LogController::fetch($path);
                }
                break;

            case 'POST':
                if ($path == ''){
                    $data_set =  json_decode(file_get_contents('php://input'), true);
                    $l = Log::buildFromArray($data_set);
                    echo LogController::add( $l   );
                }
                break;

            default:

                echo 'Unsupported';
                break;

        }

    }


    private static function add($data){
        DB::getInstance()->addLog($data);
    }





    private static function fetch($data){

        if ($data == NULL) {
            return DB::getInstance()->getRecord('log', NULL);
        }
        else if (is_numeric($data)) {
            return DB::getInstance()->getRecord('log', $data);
        }else{
            return DB::getInstance()->getRecord('log', explode("/", $data) );
        }

    }


    private static function edit($id, $newData){}

    /*
    * delete: Deletes a specifed  ambulance
    *
    */
    private function delete($data){}








}






?>