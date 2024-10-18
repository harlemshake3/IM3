<?php
function fetchWeatherData() {
    $url = "https://api.open-meteo.com/v1/forecast?latitude=47.0505,46.8499,46.1709&longitude=8.3064,9.5329,8.7995&current=cloud_cover";

    // Initialisiert eine cURL-Sitzung
    $ch = curl_init($url);

    // Setzt Optionen
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Führt die cURL-Sitzung aus und erhält den Inhalt
    $response = curl_exec($ch);

    // Schließt die cURL-Sitzung
    curl_close($ch);

    
    return json_decode($response, true);
}

// Gibt die Daten zurück, wenn dieses Skript eingebunden ist
return fetchWeatherData();


?>
