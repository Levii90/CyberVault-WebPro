<?php
$version = file_exists(__DIR__ . '/dist/index.html')
  ? filemtime(__DIR__ . '/dist/index.html')
  : time();

header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header("Location: ./dist/?v=$version");
exit;
