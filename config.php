<?php

$host = '4c48df.myd.infomaniak.com';
$dbname = '4c48df_IM3';
$username = '4c48df_harunlol';
$password = 'Lucatim1.';


$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";


$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, 
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, 
    PDO::ATTR_EMULATE_PREPARES => false, 
];

?>
