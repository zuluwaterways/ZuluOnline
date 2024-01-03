<?php
try {
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$sql = 'SELECT * FROM markers.ais where "LATITUDE" > :lat2 and "LATITUDE" < :lat1 and "LONGITUDE" > :lon2 and "LONGITUDE" < :lon1 limit 500';
	$vals = array(':lat1' => $_GET["lat1"], ':lat2' => $_GET["lat2"], ':lon1' => $_GET["lon1"], ':lon2' => $_GET["lon2"]);
	$sth = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
	$sth->execute($vals);
	$red = $sth->fetchAll();
	
	foreach ($red as $blip) {
  		echo trim($blip["MMSI"]).";".$blip["LATITUDE"].";".$blip["LONGITUDE"].";".trim($blip["COG"]).";".trim($blip["TYPE"]).";".trim($blip["SOG"]).";".trim($blip["TSTAMP"]).";".trim($blip["NAME"]);
		echo "\r\n";
	}
} catch (PDOException $e) {
	echo "dieing";
	die($e->getMessage());
} finally {
	if ($pdo) {
		$pdo = null;
	}
}
?>
