<?php
if(!isset($_POST['submit']))
{
	//This page should not be accessed directly. Need to submit the form.
	echo "error; you need to submit the form!";
}
$name = $_POST['name'];
$name1 = $_POST['file'];

$file = fopen($name1,"w");
echo fwrite($file,$name );
fclose($file);
?> 