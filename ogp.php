<?php
/**
 * OGP メタタグ生成ヘルパー
 *
 * blog-post.html / product-post.html から include して使用。
 * JSON コンテンツデータを読み込み、OGP + Twitter Card のメタタグ文字列を返す。
 */

define('OGP_SITE_URL', 'https://kaitedtc.com/');
define('OGP_SITE_NAME', '神奈川工科大学EDTC');
define('OGP_DEFAULT_IMAGE', OGP_SITE_URL . 'public/img/EDTC-icon.webp');
define('OGP_TWITTER_SITE', '@kait_edtc');

/**
 * コンテンツタイプごとの設定
 */
const OGP_CONTENT_TYPES = [
    'blog' => [
        'jsonDir'  => 'public/blog/contents/',
        'imgDir'   => 'public/blog/img/',
        'postPage' => 'blog-post.html',
        'defaultTitle' => 'ブログ',
    ],
    'product' => [
        'jsonDir'  => 'public/product/contents/',
        'imgDir'   => 'public/product/img/',
        'postPage' => 'product-post.html',
        'defaultTitle' => '商品詳細',
    ],
];

/**
 * OGP + Twitter Card メタタグを生成する
 *
 * @param string      $type コンテンツタイプ ('blog' | 'product')
 * @param string|null $id   コンテンツID （$_GET['id']）
 * @return string HTML メタタグ文字列
 */
function generateOgpTags(string $type, ?string $id): string
{
    $config = OGP_CONTENT_TYPES[$type] ?? null;
    if (!$config) {
        return '';
    }

    // デフォルト値
    $title       = $config['defaultTitle'] . '|' . OGP_SITE_NAME;
    $description = OGP_SITE_NAME . 'の公式サイトです。';
    $image       = OGP_DEFAULT_IMAGE;
    $url         = OGP_SITE_URL . $config['postPage'];

    // ID が指定されていれば JSON を読み込む
    if ($id !== null && preg_match('/\A[a-zA-Z0-9_\-]+\z/', $id)) {
        $jsonPath = __DIR__ . '/' . $config['jsonDir'] . $id . '.json';

        if (file_exists($jsonPath)) {
            $json = file_get_contents($jsonPath);
            $data = json_decode($json, true);

            if ($data) {
                if (!empty($data['title'])) {
                    $title = $data['title'] . '|' . OGP_SITE_NAME;
                }
                if (!empty($data['caption'])) {
                    $description = $data['caption'];
                }
                if (!empty($data['thumbnail'])) {
                    $image = OGP_SITE_URL . $config['imgDir'] . $data['thumbnail'];
                }
                $url = OGP_SITE_URL . $config['postPage'] . '?id=' . rawurlencode($id);
            }
        }
    }

    // エスケープ
    $e = function (string $value): string {
        return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    };

    $tags  = '<meta property="og:title" content="' . $e($title) . '">' . "\n";
    $tags .= '    <meta property="og:description" content="' . $e($description) . '">' . "\n";
    $tags .= '    <meta property="og:image" content="' . $e($image) . '">' . "\n";
    $tags .= '    <meta property="og:url" content="' . $e($url) . '">' . "\n";
    $tags .= '    <meta property="og:type" content="article">' . "\n";
    $tags .= '    <meta property="og:site_name" content="' . $e(OGP_SITE_NAME) . '">' . "\n";
    $tags .= '    <meta name="twitter:card" content="summary_large_image">' . "\n";
    $tags .= '    <meta name="twitter:site" content="' . $e(OGP_TWITTER_SITE) . '">' . "\n";
    $tags .= '    <meta name="twitter:title" content="' . $e($title) . '">' . "\n";
    $tags .= '    <meta name="twitter:description" content="' . $e($description) . '">' . "\n";
    $tags .= '    <meta name="twitter:image" content="' . $e($image) . '">';

    return $tags;
}
