<?php
$file = $_GET['file'] ?? '';
$downloadDir = realpath(__DIR__ . '/../downloads');
$filePath = realpath($downloadDir . '/' . $file);

if ($filePath && strpos($filePath, $downloadDir) === 0 && file_exists($filePath)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filePath));
    readfile($filePath);

    // Optional: Delete the file after serving to save space
    // unlink($filePath);
    exit;
} else {
    http_response_code(404);
    echo "File not found.";
}
