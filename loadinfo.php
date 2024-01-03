<?php
$manager = new MongoDB\Driver\Manager("mongodb+srv://admin:SpL10SYUi7Pg7kpp@cluster0.qs5xp.mongodb.net/intMap");
$filter = ['_id'=> new MongoDB\BSON\ObjectID($_GET["ids"])];
$options = ['limit'=>2];
$query = new MongoDB\Driver\Query($filter, $options);
$cursor = $manager->executeQuery('intMap.Location', $query);
//echo $_GET["ids"];
foreach ($cursor as $document) {
	//var_dump($document);
	echo json_encode($document);
	//echo strlen($document->Coordinate->lat)>1?(string)$document->_id.";".$document->Coordinate->lat.";".$document->Coordinate->lng.";".$document->locationTypeId."\r\n":"";
}

?>