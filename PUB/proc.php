<?php
error_reporting(E_ALL);

define('ABS_PATH', dirname(__FILE__));
define('ORIG_PATH', constant('ABS_PATH').'/orig');
define('RESULT_PATH', constant('ABS_PATH').'/result');

//load the csv file
$csvfile = constant('ORIG_PATH').'/list';
$csvfp = fopen($csvfile, 'r');
if (!$csvfp) die("Could not find the list file!");

//output xml file handles
$xmlfiles = array();

while(!feof($csvfp)) {
	$line = fgetcsv($csvfp);
	if (!is_numeric($line[0])) continue;
	//process the line
	//0->ID, 1~17 Authors, 18->Title, 19->Journal, 20->Vol, 21->Page, 22->Year
	if (!$xmlfiles["y".$line[16]]) {	//construct the XML header
		$xmlfiles["y".$line[16]] = fopen(constant('RESULT_PATH')."/year-".$line[16].".xml",'w');
		fwrite($xmlfiles["y".$line[22]], '<?xml version="1.0" encoding="utf-8" ?>'."\n".'<papers>'."\n");
	}
	$xmlrecord  = "\t<paper>\n";
	$xmlrecord .= "\t\t<authors>\n";
	for($i=1;$i<=10;$i++) {
		if (!empty($line[$i])) {
			$xmlrecord .= "\t\t\t<author>".$line[$i]."</author>\n";
		}
	}
	$xmlrecord .= "\t\t</authors>\n";
	$xmlrecord .= "\t\t<title>".$line[12]."</title>\n";
	$xmlrecord .= "\t\t<journal>".$line[13]."</journal>\n";
	$xmlrecord .= "\t\t<vol>".$line[14]."</vol>\n";
	$xmlrecord .= "\t\t<page>".$line[15]."</page>\n";
	//var_dump($line);
	//die;
	//find the pdf file
	$pdfs = glob(constant('ORIG_PATH')."/".$line[0].",*.pdf");
	if (count($pdfs)) {
		$fn = basename($pdfs[0],".pdf");
		$newname = md5($fn).".pdf";
		$nfn=constant('RESULT_PATH')."/papers/".$newname;
		//die($nfn);
		copy($pdfs[0],$nfn);
		$xmlrecord .= "\t\t<pdf>".$newname."</pdf>\n";
	} else {
		$xmlrecord .= "\t\t<pdf>#</pdf>\n";
	}
	$xmlrecord .= "\t</paper>\n";
	echo $xmlrecord;
	//write xml file
	fwrite($xmlfiles["y".$line[16]], $xmlrecord);
	
}

//close all xml files
foreach($xmlfiles as $xmlfile) {
	fwrite($xmlfile, '</papers>');
	fclose($xmlfile);
}
?>