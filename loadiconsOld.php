<?php
//echo $_GET["lat1"].";".$_GET["lat2"].";".$_GET["lon1"].";".$_GET["lon2"]."\r\n";
$manager = new MongoDB\Driver\Manager("mongodb+srv://admin:SpL10SYUi7Pg7kpp@cluster0.qs5xp.mongodb.net/intMap");
$filter = ['Coordinate.lat' => ['$gt' => (float)$_GET["lat2"],'$lt' => (float)$_GET["lat1"]],
	'Coordinate.lng' => ['$gt' => (float)$_GET["lon2"],'$lt' => (float)$_GET["lon1"]]
	];
$options = ['projection' => ['_id' => 1,'Coordinate'=>1,'locationTypeId'=>1],'limit' => '500'];
$query = new MongoDB\Driver\Query($filter, $options);
$cursor = $manager->executeQuery('intMap.Location', $query);
foreach ($cursor as $document) {
	echo strlen($document->Coordinate->lat)>1?(string)$document->_id.";".$document->Coordinate->lat.";".$document->Coordinate->lng.";".$document->locationTypeId."\r\n":"";
}
?>