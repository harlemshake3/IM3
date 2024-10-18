<?php
function fetchWeatherData() {
    $url = "https://api.open-meteo.com/v1/forecast?latitude=47.0505,46.8499,46.1709&longitude=8.3064,9.5329,8.7995&current=cloud_cover";


    $ch = curl_init($url);

 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);


    $response = curl_exec($ch);

 
    curl_close($ch);

    
    return json_decode($response, true);
}


return fetchWeatherData();


?>
