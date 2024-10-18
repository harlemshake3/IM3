<?php

require_once 'config.php';

header('Content-Type: application/json');

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 3000;

try {

    $pdo = new PDO($dsn, $username, $password, $options);


    $stmt = $pdo->prepare("
        SELECT location, kondition, cloudcover, data 
        FROM wetterfrosch 
        ORDER BY data DESC 
        LIMIT :limit
    ");


    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>

