<?php

// セッションの有効期限を60分に設定
ini_set('session.gc_maxlifetime', 3600);
session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => '',
    'secure' => true,      // HTTPS通信の場合はtrue
    'httponly' => true,    // JavaScriptからのアクセスを防ぐ
    'samesite' => 'Lax'    // CSRF対策
]);

session_start();
