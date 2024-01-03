<?php
try {
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$stmt = $pdo->prepare('SELECT * FROM markers.markers WHERE length(description) > 50 OFFSET floor(random()*12623) LIMIT 1');
        $stmt->execute(); 
        $red = $stmt->fetchAll();
	foreach ($red as $marker) {
  		echo trim($marker["id"]).";".$marker["lat"].";".$marker["lon"].";".$marker["title"];
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