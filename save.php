<?php

//$data = file_get_contents("php://input");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$path = $request->path;
$data = $request->data;


$myfile = fopen($path, "w") or die("Unable to open file!");
fwrite($myfile, $data);
fclose($myfile);
?>