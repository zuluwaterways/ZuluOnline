
<?php
$to = "zuluwaterways@gmail.com";
$subject = "Marker Report!";
$txt = "marker:".$_GET["ids"]."\nUser:".$_GET["usr"]."\nReason:".$_GET["info"]."\nLat:".$_GET["lat"]."\nLon:".$_GET["lon"]."\n Link:https://www.zuluwaterways.com/#/".$_GET["ids"]."/".$_GET["lat"]."/".$_GET["lon"]."/reported";
$headers = "From: reports@zuluwaterwys.com" . "\r\n";

mail($to,$subject,$txt,$headers);
echo "reported";
?>