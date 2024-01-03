<?php
if(isset($_GET['last'])){
try {
	//echo $_GET['last'];
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$stmt = $pdo->prepare('SELECT * FROM markers.history left join markers.markers on history.marker = markers.id where history.dt >= :dt');
        $stmt->bindValue(':dt', $_GET["last"]);
        $stmt->execute();
        //echo json_encode($stmt->fetchAll());
	$red = $stmt->fetchAll();
	$list="";
	foreach ($red as $marker) {
  		if(!str_contains($list, trim($marker["id"])))$list=$list.($list==""?"":",")."'".trim($marker["id"])."'";
	}
	//echo $list;
	if($list!=""){
		$stmt = $pdo->prepare('SELECT * FROM markers.markers where id in ('.$list.');');
        	$stmt->execute();
        	$m= json_encode($stmt->fetchAll());
		$stmt = $pdo->prepare('SELECT * FROM markers.comments where marker in ('.$list.');');
        	$stmt->execute();
		$c=json_encode($stmt->fetchAll());
		echo "[".$m.",".$c."]";

	}
	} catch (PDOException $e) {
	echo "dieing";
	die($e->getMessage());
} finally {
	if ($pdo) {
		$pdo = null;
	}
}

}else{
$filename = "/data/www/dbb/current.db";

if(file_exists($filename)){

    //Get file type and set it as Content Type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    header('Content-Type: ' . finfo_file($finfo, $filename));
    finfo_close($finfo);

    //Use Content-Disposition: attachment to specify the filename
    header('Content-Disposition: attachment; filename='.basename($filename));

    //No cache
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');

    //Define file size
    header('Content-Length: ' . filesize($filename));

    ob_clean();
    flush();
    readfile($filename);
    exit;
}
}
?>