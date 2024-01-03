<?php
try {
	$username = $_SERVER['dbuser'];
	$password = $_SERVER['dbpass'];
	$hosts = $_SERVER['dbhost'];

	$pdo = new PDO("pgsql:host=$hosts;port=5432;dbname='postgres';", $username, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$sql = "select * from markers.markersg where st_intersects(ST_Polygon('LINESTRING(".$_GET["la"].")'::geometry, 4326), geom)";
	$vals = array();
	$sth = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
	$sth->execute($vals);
	//echo $_GET["la"];
	$red = $sth->fetchAll();
	ob_start('ob_gzhandler');
	header('Content-type: text/xml');
	header('Content-Disposition: attachment; filename="mobac-profile-new.xml"');
	echo '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<atlas version="1" name="Layer" outputFormat="OsmdroidSQLite">
    <Layer name="markers">
	';
	$count = 1;
	foreach ($red as $marker) {
		echo '		<Map maxTileCoordinate="';
		$lo = floatval($marker["lon"]);
		$la = floatval($marker["lat"]);
		$ll = round(pow(2,23)*($lo+180)/360);
		$lt = round((1-log(tan($la*pi()/180)+1/cos($la*pi()/180))/pi())*pow(2,22));
		//INT((1-LN(TAN(B5*PI()/180) + 1/COS(B5*PI()/180))/PI())/2 *2^23)
		//CONCATENATE(R$1,D2+256,"/",E2+256,S$1,D2-256,"/",E2-256,T$1,"P",ROW(),U$1)
  		//echo trim($marker["id"].",".$la.",".$lo.",".$ll.",".$lt);
		echo ($ll+256)."/".($lt+256);
		echo '" minTileCoordinate="';
		echo ($ll-256)."/".($lt-256);
		echo '" mapSource="Mapbox hybrid" zoom="15" name="P'.$count++.'"/>';
		echo "\r\n"; 
	}
	echo '    </Layer>
	    <Layer name="HDmarkers">
	';
	$count = 1;
	foreach ($red as $marker) {
		echo '		<Map maxTileCoordinate="';
		$lo = floatval($marker["lon"]);
		$la = floatval($marker["lat"]);
		$ll = round(pow(2,26)*($lo+180)/360);
		$lt = round((1-log(tan($la*pi()/180)+1/cos($la*pi()/180))/pi())*pow(2,25));
		//INT((1-LN(TAN(B5*PI()/180) + 1/COS(B5*PI()/180))/PI())/2 *2^23)
		//CONCATENATE(R$1,D2+256,"/",E2+256,S$1,D2-256,"/",E2-256,T$1,"P",ROW(),U$1)
  		//echo trim($marker["id"].",".$la.",".$lo.",".$ll.",".$lt);
		echo ($ll+512)."/".($lt+512);
		echo '" minTileCoordinate="';
		echo ($ll-512)."/".($lt-512);
		echo '" mapSource="Mapbox hybrid" zoom="18" name="HD'.$count++.'"/>';
		echo "\r\n"; 
	}
	echo '    </Layer>
</atlas>
';
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