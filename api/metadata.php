<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

$url = $_POST['url'] ?? '';

if (empty($url)) {
    echo json_encode(['error' => 'URL is required']);
    exit;
}

$ytDlpPath = '/opt/homebrew/bin/yt-dlp';

// Use --dump-json to get video info without downloading
$command = sprintf(
    '%s --ffmpeg-location /opt/homebrew/bin --dump-json --no-playlist %s 2>&1',
    escapeshellarg($ytDlpPath),
    escapeshellarg($url)
);

// Add Homebrew to PATH for the web server user
putenv('PATH=' . getenv('PATH') . ':/opt/homebrew/bin');

exec($command, $output, $returnVar);

if ($returnVar !== 0) {
    echo json_encode([
        'error' => 'Failed to fetch metadata',
        'details' => $output
    ]);
    exit;
}

// Filter output to find the JSON line
$jsonLine = '';
foreach ($output as $line) {
    if (strpos(trim($line), '{') === 0) {
        $jsonLine = $line;
        break;
    }
}

if (empty($jsonLine)) {
    echo json_encode([
        'error' => 'No JSON metadata found in output',
        'details' => $output
    ]);
    exit;
}

$metadata = json_decode($jsonLine, true);

if (!$metadata) {
    echo json_encode([
        'error' => 'Failed to parse metadata JSON',
        'raw_line' => $jsonLine
    ]);
    exit;
}

// Extract relevant fields
$response = [
    'success' => true,
    'url' => $url,
    'id' => $metadata['id'] ?? '',
    'title' => $metadata['title'] ?? 'Unknown Title',
    'thumbnail' => $metadata['thumbnail'] ?? '',
    'duration' => isset($metadata['duration']) ? gmdate("H:i:s", $metadata['duration']) : '00:00:00',
    'view_count' => $metadata['view_count'] ?? 0,
    'uploader' => $metadata['uploader'] ?? ''
];

// Reformat duration to be more readable if under an hour
if (strpos($response['duration'], '00:') === 0) {
    $response['duration'] = substr($response['duration'], 3);
}

echo json_encode($response);
