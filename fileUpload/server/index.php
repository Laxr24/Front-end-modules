<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");


echo "Total Slices = ". $_GET['slices']." File Size: ". $_GET['size']; 

/**
 * Get the information about the file
 * Save userful informaion of that file size, number of chunks, chunkID, serials of chunks, file extension, file name, request chunk ID
 * Create a temp folder 
 * create a json configuration file in the temp folder 
 * save the information in JSON in the config file 
 * Send the signal with server confirmation with the first chunk of the file to be transmitted 
 * Client sends the first chunk with the first ID that comes in 
 * First chunk is received and check for the size and id described in the configuration file 
 * If matches then saves the chunk in the temp folder with custom extension with proper naming technique 
 * Update the next chunk to request in the configuration file and send that information with the response 
 * 
 * Detect when the last chunk is being received 
 * 
 * start joining all the file chunks one by one and save on a place outsize the temp folder
 * Delete all the file chunks and configuration file 
 * Delete the temp folder 
 * Send confirmation from server that it has been uploaded successfully. 
 */