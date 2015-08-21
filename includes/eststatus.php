<?php
$xmlPath="http://localhost:7070/requests/status.xml";
$username="";
$password="aftvip";
$ch = curl_init();

curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
curl_setopt($ch, CURLOPT_URL, $xmlPath);
curl_setopt($ch, CURLOPT_USERPWD, $username . ':' . $password);
$result = curl_exec($ch);
curl_close($ch);

$xml = new SimpleXMLElement($result);
$length= $xml->length;
$time= $xml->time;
echo '#'.($length - $time).'#';
$artist= @$xml->xpath("information/category/info[@name='title']")[0];
if($artist=="" or preg_match("/\d#..*/i", $artist)===0){
	$artist= @$xml->xpath("information/category/info[@name='artist']")[0];
}
elseif($artist=="" or preg_match("/\d#..*/i", $artist)===0){
	$artist= @$xml->xpath("information/category/info[@name='filename']")[0];
}
echo $artist;
?>