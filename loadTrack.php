<?php
try {
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$lt = $_GET["up"]=="1"?"limit 5":"";
	$stmt = $pdo->prepare('SELECT * FROM markers.tracks WHERE name = :name '.$lt);
        $stmt->bindValue(':name', $_GET["name"]);
        $stmt->execute();
        echo json_encode($stmt->fetchAll());	
	} catch (PDOException $e) {
	echo "dieing";
	die($e->getMessage());
} finally {
	if ($pdo) {
		$pdo = null;
	}
}
?>