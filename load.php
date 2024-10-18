<?php

$jsonDatatransform = include('transform.php');

$dataArray = json_decode($jsonDatatransform, true);

require_once 'config.php';

try {

    $pdo = new PDO($dsn, $username, $password, $options);

    $sql = "INSERT INTO wetterfrosch (location, kondition, cloudcover) VALUES (?, ?, ?)";

    $stmt = $pdo->prepare($sql);

    // Fügt jedes Element im Array in die Datenbank ein
    foreach ($dataArray as $item) {
        $stmt->execute([
            $item['location'],
            $item['condition'],
            $item['cloud_cover'],
 
        ]);
    }

    echo "Daten erfolgreich eingefügt.";
} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}
