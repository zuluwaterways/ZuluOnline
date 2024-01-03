<?php
try {
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$stmt = $pdo->prepare("SELECT time FROM markers.tracks WHERE name = :n order by time desc limit 1");
	$stmt->bindValue(':n', $_POST['user']);
    $stmt->execute();
    $sts = $stmt->fetch();
	if($stmt->rowCount() == 0){
		$sts = strtotime('-1 day');
	}else{
		$sts = $sts[0];
	}
	echo "user:".$_POST['user'].":;".$sts.";;;\n";
	$data_array = explode("\n", $_POST['data']);
	foreach ($data_array as $line) {
		echo $line."\n";
		$dd = explode(";",$line);
		if($dd[0]<$sts){
			echo $dd[0].",";
			echo "d".$sts."f";
			echo "ignoring\n";
			continue;
		}
		$stmt = $pdo->prepare('INSERT INTO markers.tracks VALUES(:ts,:name,:lat,:lon)');
		$stmt->bindValue(':ts', $dd[0]);
		$stmt->bindValue(':name', trim($_POST['user']));
		$stmt->bindValue(':lat', $dd[1]);
		$stmt->bindValue(':lon', $dd[2]);
		$stmt->execute();
		
	}
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
