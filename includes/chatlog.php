<?php 
$filename="C:/logs/#toonami-log.html";
if (!is_readable($filename)) exit;
$Vdata = file_get_contents($filename);
$text = str_replace("\r\n",'', $Vdata);
Header("content-type: application/x-javascript");
echo "var chatplace = $$('div.ircwindow')[0];";
echo "chatplace.set(\"html\", \"" . $text . "\");";
?>