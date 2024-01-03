<?php
try {
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$stmt = $pdo->prepare('INSERT INTO markers.comments VALUES(:id,:marker,now(),:com,:usr)');
	$nid = substr(md5(random_bytes(25)),3,25);
        $stmt->bindValue(':id', $nid);
	$stmt->bindValue(':marker', $_GET["marker"]);
	$stmt->bindValue(':com', $_GET["com"]);
	$stmt->bindValue(':usr', $_GET["user"]);
        $stmt->execute();
        echo $nid;
	} catch (PDOException $e) {
	echo "dieing";
	die($e->getMessage());
} finally {
	if ($pdo) {
		$pdo = null;
	}
}
?>
