<?php

class DB
{

    //Instance --> for singleton
    private static $instance = null;
    //Self explanatory
    /*private static $serverAddress = getenv("SERVER_ADDRESS"); //"localhost";
    private static $userName = getenv("MYSQL_USER");//"root";
    private static $password = getenv("MYSQL_PASSWORD");//"root";
    private static $databaseName = getenv("MYSQL_DATABASE");//"agent_viz";*/
    //private static $tableName = "d_logs";
    //Database connectio
    private static $connection = null;


    public static function getInstance()
    {
        if (DB::$instance == null) {
            DB::$instance = new DB();
        }
        return DB::$instance;
    }


    private function connect()
    {
        if (DB::$connection == null) {
            DB::$connection = new mysqli( getenv("SERVER_ADDRESS"), getenv("MYSQL_USER"), getenv("MYSQL_PASSWORD"), getenv("MYSQL_DATABASE"));
            if (DB::$connection->connect_error) {
                die("Connection failed: " . DB::$connection->connect_error);
            }
        }
    }


    public function addLog($log)
    {
        $this->connect();
        $sql = "INSERT INTO d_logs ( session_tag, session_sequence, note, log_dump) VALUES ('" . $log->getSessionTag() . "', " . $log->getSessionSequence() . ", '" . $log->getNote() . "',  '" . $log->getLog() . "')";
        if (!(DB::$connection->query($sql) === TRUE)) {
            echo "Error: " . DB::$connection->error;
        }
        DB::$connection->close();
    }


    public function getRecord($recordType, $param)
    {
        $this->connect();
        switch ($recordType) {
            case 'log':
                $sql = "SELECT * FROM d_logs ORDER BY session_sequence";
                if ($param != NULL) {
                    if (sizeof($param) == 1) {
                        $sql = "SELECT * FROM d_logs where session_tag = '" . $param[0] . "'";
                    } else if (is_array($param)) {
                        $sql = "SELECT * FROM d_logs where session_tag = '" . $param[0] . "' and session_sequence = " . $param[1];
                    }
                }

                $logQuery = DB::$connection->query($sql);
                $logs = array();
                if ($logQuery->num_rows > 0) {
                    while ($row = $logQuery->fetch_assoc()) {
                        array_push($logs, $row);
                    }
                }
                DB::$connection->close();
                return json_encode($logs);

            default:
                return $recordType;
        }
    }
}