<?php
	require('S3.php');
	if(!isset($_GET["tk"])||!isset($_GET["fn"])||($_GET["tk"]!='35q25wa5wsvi7y8s83wy53wy5nkyzs20lzsb23'&&$_GET["tk"]!='a89v5ygwgrwfcx8avktzshzrzll0945'&&$_GET["tk"]!='28yc5keskn76ysnklo53ynwm35yee4ipw'))exit();
if (!defined('awsAccessKey')) define('awsAccessKey', $_SERVER['s3id']);
if (!defined('awsSecretKey')) define('awsSecretKey', $_SERVER['s3key']);
$bucketName = 'zulu-location-photos'; 
if(isset($_GET["it"])&&$_GET["it"]=="shopi") $bucketName = 'zulu-product-images';
$s3 = new S3($_SERVER['s3id'], $_SERVER['s3key'],false,'s3.amazonaws.com','ap-southeast-2');
$info = $s3->getObjectInfo($bucketName, $_GET["fn"]);
$obj = $s3->getObject($bucketName, $_GET["fn"]);
header('Content-Type: '.$obj->headers['type']);
echo $obj->body;

die();
?>