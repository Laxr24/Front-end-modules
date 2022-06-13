<?php 
$object = $_POST['config']; 
// Decoding the stringified JSON to make operations 
$decode = json_decode($object); 

// echo json_encode($decode) ;
$temp_config = [
    "size" => $decode->size, 
    "name" => $decode->name,
    "chunk" => $decode->chunks,
    "type" => $decode->type,
    "next_chunk_request" => 0
]; 


// Making a temp dir and making config file with configuration contents 

mkdir("tmp"); 
$newfile = fopen(__DIR__."/tmp/config.json", "w+");
fwrite($newfile, json_encode($temp_config));
fclose($newfile);
