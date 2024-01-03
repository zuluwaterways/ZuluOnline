<?php
try {
	
	if($_GET["tk"]!="JeGyXMsSpiQJqe5es2akYzWldQE3")exit;
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$stmt = $pdo->prepare('delete from markers.markers where id = :id');
        $stmt->bindValue(':id', $_GET["ids"]);
        $stmt->execute();
	if ($stmt->rowCount()){
	    echo 'Marker Deleted';
	} else{
	    echo 'Marker Not Found!';
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