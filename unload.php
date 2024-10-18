<?php

require_once 'config.php';

header('Content-Type: application/json');

// Standardmäßig die letzten 10 Datensätze, falls kein Limit angegeben ist
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 3000;

try {
    // Verbindung zur Datenbank aufbauen
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Abfrage zum Abrufen der Wetterdaten
    $stmt = $pdo->prepare("
        SELECT location, kondition, cloudcover, data 
        FROM wetterfrosch 
        ORDER BY data DESC 
        LIMIT :limit
    ");

    // Bindet das Limit, um sicherzustellen, dass nur die gewünschte Anzahl an Datensätzen abgerufen wird
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    // Die abgerufenen Daten werden in einem Array gespeichert
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Gibt die Ergebnisse im JSON-Format zurück
    echo json_encode($results);

} catch (PDOException $e) {
    // Gibt eine Fehlermeldung zurück, falls etwas schiefgeht
    echo json_encode(['error' => $e->getMessage()]);
}
?>

