<?php
try {
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$stmt = $pdo->prepare('SELECT * FROM "markers"."history" order by dt desc limit 20');
	$stmt ->execute();
        $red = $stmt->fetchAll();
	foreach ($red as $marker) {
  		foreach ($red as $marker) {
  			echo $marker["marker"].";".$marker["type"].";".$marker["dt"].";".trim($marker["usr"]).";".trim($marker["old"]);
			echo "\r\n";
		}
	}
	echo "done";
	} catch (PDOException $e) {
	echo "dieing";
	die($e->getMessage());
} finally {
	if ($pdo) {
		$pdo = null;
	}
}
?>