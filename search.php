<?php
try {
	$bb = isset($_GET['bb'])?(" and (lat > :lat2 and lat < :lat1 and lon > :lon2 and lon < :lon1)"):"";
	if(isset($_GET['usr']))$bb="and usr = :uu";
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
	$stmt = $pdo->prepare("SELECT id,lat,lon,type,title,ST_MakePoint(:c1, :c2)::geography<->ST_MakePoint(lon, lat)::geometry as dist FROM markers.markers WHERE (lower(title) like lower(:s1) or lower(tags) like lower(:s2)) ".$bb.' order by dist asc limit 50');
        $stmt->bindValue(':s1', "%".(isset($_GET['title'])?$_GET['title']:"l8364vnasyrnyzst6nci8zryek8ydvow38n")."%");
	$stmt->bindValue(':s2', "%".(isset($_GET['tags'])?$_GET['tags']:"l8364vnasyrnyzst6nci8zryek8ydvow38n")."%");
	$stmt->bindValue(':c2', (isset($_GET['c1'])?$_GET['c1']:"0"));
	$stmt->bindValue(':c1', (isset($_GET['c2'])?$_GET['c2']:"0"));

	if(isset($_GET['bb'])){
		$ll = explode(",",$_GET['bb']);
		$stmt->bindValue(':lat1', $ll[3]);
		$stmt->bindValue(':lat2', $ll[1]);
		$stmt->bindValue(':lon1', $ll[2]);
		$stmt->bindValue(':lon2', $ll[0]);
	}
	if(isset($_GET['usr'])){
		$stmt->bindValue(':uu', $_GET['usr']);
	}
	//echo $_GET['bb'];
        $stmt->execute();
        $red = $stmt->fetchAll();
	//echo "{";
	foreach ($red as $marker) {
  		echo trim($marker["id"]).";".$marker["lat"].";".$marker["lon"].";".trim($marker["type"]).";".trim($marker["dist"]).";".trim($marker["title"])."\r\n";
	}
	//echo "}";
	} catch (PDOException $e) {
	echo "dieing";
	die($e->getMessage());
} finally {
	if ($pdo) {
		$pdo = null;
	}
}
?>