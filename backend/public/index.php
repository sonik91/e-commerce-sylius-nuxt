<?php
//header('Access-Control-Allow-Origin: http://nuxt.localhost');
//header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT');
//header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

use App\Kernel;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
