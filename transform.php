<?php

$dataextract = include('extract.php');

// Definiert eine Zuordnung von Koordinaten zu Stadtnamen
$locationsMap = [
    '47.06,8.299999' => 'Lucerne',
    '46.84,9.52' => 'Chur',
    '46.16,8.799999' => 'Locarno',
];

function determineCondition($cloudCover) {
    if ($cloudCover <= 10) {
        return 1; // Sehr sonnig
    } elseif ($cloudCover <= 20) {
        return 2; // Sonnig
    } elseif ($cloudCover <= 30) {
        return 3;
    } elseif ($cloudCover <= 40) {
        return 4;
    } elseif ($cloudCover <= 50) {
        return 5; // Teilweise bewölkt
    } elseif ($cloudCover <= 60) {
        return 6;
    } elseif ($cloudCover <= 70) {
        return 7;
    } elseif ($cloudCover <= 80) {
        return 8;
    } elseif ($cloudCover <= 90) {
        return 9;
    } else {
        return 10; // Komplett bewölkt
    }
}

$transformData = [];

foreach($dataextract as $location) {
    $cityKey = $location['latitude'] . ',' . $location['longitude'];
    $city = $locationsMap[$cityKey] ?? 'Unbekannt';


    $condition = determineCondition(
        $location['current']['cloud_cover'],
    );

    $transformedData[] = [
        'location' => $city,
        'cloud_cover' => $location['current']['cloud_cover'],
        'condition' => $condition, 
    ];
}

$jsonData = json_encode($transformedData, JSON_PRETTY_PRINT);

echo $jsonData;
return $jsonData;

