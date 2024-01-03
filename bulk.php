<form action="bulk.php" method="post" enctype="multipart/form-data">
  Select CSV to upload:
  <input type="file" name="fileToUpload" id="fileToUpload">
  <input type="submit" value="Upload CSV" name="submit">
</form>

<?php
try {
	print_r($_POST);
	
	$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
  $check = filesize($_FILES["fileToUpload"]["tmp_name"]);
  if($check !== false) {
    echo "File uploaded: - " . $check . ". Checking...";
    $uploadOk = 1;
	$row = 1;
if (($handle = fopen($_FILES["fileToUpload"]["tmp_name"], "r")) !== FALSE) {
	$pdo = new PDO("pgsql:host='zdb.cwynaussndat.ap-southeast-2.rds.amazonaws.com';port=5432;dbname='postgres';", $_SERVER['dbuser'], $_SERVER['dbpass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		$num = count($data);
		if($row!=1 && $num>3){
        
		//print_r($data);
	$stmt = $pdo->prepare('insert into markers.markers values(:id,:lat,:lon,:type,:title,:desc,now(),:user,:tags,0,:pics)');
	$nid = substr(md5(random_bytes(25)),3,25);
	$stmt->bindValue(':id', $nid);
	$stmt->bindValue(':lat', $data[1]);
	$stmt->bindValue(':lon', $data[2]);
	$stmt->bindValue(':type', $data[3]);
	$stmt->bindValue(':title', $data[4]);
	$stmt->bindValue(':desc', $data[5]);
	$stmt->bindValue(':user', $data[7]);
	$stmt->bindValue(':tags', "");
	$stmt->bindValue(':pics',"");
        $stmt->execute();
		}
		echo "added $row <br>";
		$row++;
		
    }
    fclose($handle);
}
  } else {
    echo "Invalid File.";
    $uploadOk = 0;
  }
}
if($_POST["bulk"]!="here"){echo "dieing";die();}
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
