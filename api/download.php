<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

$url = $_POST['url'] ?? '';
$format = $_POST['format'] ?? 'video'; // 'video' or 'audio'

if (empty($url)) {
    echo json_encode(['error' => 'URL is required']);
    exit;
}

$ytDlpPath = '/opt/homebrew/bin/yt-dlp';
$downloadDir = realpath(__DIR__ . '/../downloads');

if (!is_dir($downloadDir)) {
    mkdir($downloadDir, 0777, true);
}

// Generate a unique filename prefix
$uniqueId = uniqid();
$outputTemplate = $downloadDir . '/' . $uniqueId . '_%(title)s.%(ext)s';

if ($format === 'audio') {
    // MP3 format
    $command = sprintf(
        '%s --ffmpeg-location /opt/homebrew/bin -x --audio-format mp3 --audio-quality 0 -o %s %s 2>&1',
        escapeshellarg($ytDlpPath),
        escapeshellarg($outputTemplate),
        escapeshellarg($url)
    );
} else {
    // MP4 format (highest quality with mp4 extension)
    $command = sprintf(
        '%s --ffmpeg-location /opt/homebrew/bin -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o %s %s 2>&1',
        escapeshellarg($ytDlpPath),
        escapeshellarg($outputTemplate),
        escapeshellarg($url)
    );
}

// Add Homebrew to PATH for the web server user
putenv('PATH=' . getenv('PATH') . ':/opt/homebrew/bin');

exec($command, $output, $returnVar);

if ($returnVar !== 0) {
    echo json_encode([
        'success' => false,
        'error' => 'Download failed',
        'details' => $output,
        'command_return_var' => $returnVar
    ]);
    exit;
}

// Find the downloaded file (title might have changed slightly)
$files = glob($downloadDir . '/' . $uniqueId . '_*');
if (empty($files)) {
    echo json_encode(['error' => 'File not found after download']);
    exit;
}

$filePath = $files[0];
$fileName = basename($filePath);

echo json_encode([
    'success' => true,
    'file' => $fileName,
    'downloadUrl' => 'api/serve.php?file=' . urlencode($fileName)
]);
