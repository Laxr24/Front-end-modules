<?php

header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Headers:*");



// define("ROOT_FOLDER", realpath(__FILE__."/uploads/")); 


$dir = "uploads/".basename($_FILES["file"]["tmp_name"])."-".$_POST["id"].".tmp"; 

if($_FILES["file"]){
    if(move_uploaded_file($_FILES["file"]["tmp_name"], $dir)){
        echo "upload Done"; 
    }
    else{
        echo "Not uploaded"; 
    } 
}
else{
    echo "No files"; 
}

