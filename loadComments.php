<?php
try {
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$stmt = $pdo->prepare('SELECT * FROM markers.comments WHERE marker = :id order by date desc');
        //$stmt->bindValue(':id', $_GET["ids"]);
	$stmt->execute( array(':id' => $_GET["ids"]));
        $red = $stmt->fetchAll();
	foreach ($red as $marker) {
  		echo $marker["user"].":".$marker["date"].":".$marker["comment"];
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