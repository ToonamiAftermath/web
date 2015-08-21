<?php
/////////////////////////////////////////////////////////////////
/// getID3() by James Heinrich <info@getid3.org>               //
//  available at http://getid3.sourceforge.net                 //
//            or http://www.getid3.org                         //
/////////////////////////////////////////////////////////////////
//                                                             //
// /demo/demo.simple.php - part of getID3()                    //
// Sample script for scanning a single directory and           //
// displaying a few pieces of information for each file        //
// See readme.txt for more details                             //
//                                                            ///
/////////////////////////////////////////////////////////////////

// include getID3() library (can be in a different directory if full path is specified)
require_once('../getid3/getid3.php');

// Initialize getID3 engine
$getID3 = new getID3;

$DirectoryToScan = 'T:\toonami\Movies'; // change to whatever directory you want to scan
$dir = opendir($DirectoryToScan);

while (($file = readdir($dir)) !== false) {
	$FullFileName = realpath($DirectoryToScan.'/'.$file);
	if ((substr($FullFileName, 0, 1) != '.') && is_file($FullFileName)) {

		$ThisFileInfo = $getID3->analyze($FullFileName);

		getid3_lib::CopyTagsToComments($ThisFileInfo);

		// output desired information in whatever format you want
		$path = $ThisFileInfo['filenamepath'];
		$path = str_replace('/', '\\', $path);
		echo '"'.$path.'", '.$ThisFileInfo['playtime_seconds'];
		echo '<br>';
	}
}
