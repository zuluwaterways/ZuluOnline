<?php
try {
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$stmt = $pdo->prepare('INSERT INTO markers.history VALUES(:id,:marker,:type,:old,now(),:usr)');
	//echo substr(md5(random_bytes(25)),3,25);
        $stmt->bindValue(':id', substr(md5(random_bytes(25)),3,25));
	$stmt->bindValue(':marker', $_POST["id"]);
	$stmt->bindValue(':type', $_POST["type"]);
	$stmt->bindValue(':old', $_POST["data"]);
	//$stmt->bindValue(':dt', now());
	$stmt->bindValue(':usr', $_POST["user"]);
        $stmt->execute();
        echo "complete";
	} catch (PDOException $e) {
	echo "dieing";
	die($e->getMessage());
} finally {
	if ($pdo) {
		$pdo = null;
	}
}
?>
