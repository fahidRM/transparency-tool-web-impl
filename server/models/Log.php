<?php


class Log implements \JsonSerializable{


    private $sessionTag = "";
    private $log = "";
    private $note = "";
    private $sessionSequence = "";



    public function getLog () {
        return $this->log;
    }

    public function getNote () {
        return $this->note;
    }

    public function getSessionSequence () {
        return $this->sessionSequence;
    }

    public function getSessionTag () {
        return $this->sessionTag;
    }


    public static function buildFromArray($arr){
        return new Self($arr["session"], $arr["log"], $arr["note"], $arr["sequence"]);
    }


    public function __construct( $st, $l, $n, $ss){

      echo (json_encode($l));
      echo ("\n\n\n");

     //$this->id = $i;
     $this->sessionTag = $st;
     $this->log = json_encode($l);
     $this->note = $n;
     $this->sessionSequence = $ss;
    }

    /**
     * JsonSerialize:   Part of the JsonSerializable interface.
     *                  Helps to serialize the Ambulance object in-view of its private properties.
     * @return array
     */
    public function JsonSerialize()
    {
        return get_object_vars($this);
    }

    /**
     * toJSON:  Creates a JSON representation of the object
     * @return string
     */
    public function toJSON(){
        return json_encode( $this->JsonSerialize());
    }




}
