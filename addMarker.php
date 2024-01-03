<?php
try {
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$stmt = $pdo->prepare('insert into markers.markers values(:id,:lat,:lon,:type,:title,:desc,now(),:user,:tags,0,:pics)');
	$nid = substr(md5(random_bytes(25)),3,25);
	$stmt->bindValue(':id', $nid);
	$stmt->bindValue(':lat', $_POST["lat"]);
	$stmt->bindValue(':lon', $_POST["lon"]);
	$stmt->bindValue(':type', $_POST["type"]);
	$stmt->bindValue(':title', $_POST["title"]);
	$stmt->bindValue(':desc', $_POST["desc"]);
	$stmt->bindValue(':user', $_POST["user"]);
	$stmt->bindValue(':tags', $_POST["tags"]);
	$stmt->bindValue(':pics', $_POST["pics"]);
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
