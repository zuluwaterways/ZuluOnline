<?php
try {
	$username = $_SERVER['dbuser'];
	$password = $_SERVER['dbpass'];
	$hosts = $_SERVER['dbhost'];

	$pdo = new PDO("pgsql:host=$hosts;port=5432;dbname='postgres';", $username, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$sql = 'SELECT * FROM markers.markers where lat > :lat2 and lat < :lat1 and lon > :lon2 and lon < :lon1 limit 500';
	$vals = array(':lat1' => $_GET["lat1"], ':lat2' => $_GET["lat2"], ':lon1' => $_GET["lon1"], ':lon2' => $_GET["lon2"]);
	if(isset($_GET['ft'])) {
		$ft = explode(":",$_GET['ft']);
		$inQuery = implode(',', array_fill(0, count($ft), '?'));
		$sql = 'SELECT * FROM markers.markers where lat > ? and lat < ? and lon > ? and lon < ? and type NOT IN (' . $inQuery . ') limit 500';
	 	$vals = array_merge(array($_GET["lat2"],$_GET["lat1"], $_GET["lon2"], $_GET["lon1"]),$ft);
		//var_dump($ft);

	}
	$sth = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
	$sth->execute($vals);
	$red = $sth->fetchAll();
	foreach ($red as $marker) {
  		echo trim($marker["id"]).";".$marker["lat"].";".$marker["lon"].";".trim($marker["type"]);
		echo "\r\n";
	}
	//var_dump($red);
	} catch (PDOException $e) {
	echo "dieing";
	die($e->getMessage());
} finally {
	if ($pdo) {
		$pdo = null;
	}
}
?>