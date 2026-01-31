<?php

// セッションの有効期限を60分に設定
ini_set('session.gc_maxlifetime', 3600);
session_set_cookie_params(3600);

session_start();
