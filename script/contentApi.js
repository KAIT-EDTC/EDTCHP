/**
 * コンテンツ API 共通モジュール
 *
 * ブログ・プロダクト等のJSONコンテンツを統一的に取得するAPI。
 * コンテンツタイプごとにパス設定を持ち、将来の拡張にも対応。
 *
 * 将来ブログを public/blog/contents/ へ移行する場合は
 * CONTENT_TYPES.blog.dataDir を変更するだけで対応可能。
 */

const DEFAULT_BASE_PATH = "./";

/**
 * コンテンツタイプ設定
 * @property {string} dataDir  - JSONファイルの格納ディレクトリ（basePathからの相対）
 * @property {string} postPage - 詳細ページのファイル名
 */
const CONTENT_TYPES = {
    blog: {
        dataDir: "public/blog/contents/",
        postPage: "blog-post.html",
    },
    product: {
        dataDir: "public/product/contents/",
        postPage: "product-post.html",
    },
};

/**
 * 汎用コンテンツ JSON を fetch して返す
 * @param {"blog"|"product"} type - コンテンツタイプ
 * @param {string} id             - コンテンツID
 * @param {string} [basePath]     - ルートへの相対パス
 * @returns {Promise<Object|null>} コンテンツデータ（取得失敗時は null）
 */
export async function fetchContent(type, id, basePath = DEFAULT_BASE_PATH) {
    if (!id) return null;
    const config = CONTENT_TYPES[type];
    if (!config) return null;
    try {
        const res = await fetch(`${basePath}${config.dataDir}${id}.json`);
        if (!res.ok) return null;
        const data = await res.json();
        return { ...data, id, link: buildContentLink(type, id, basePath) };
    } catch {
        return null;
    }
}

/**
 * 汎用コンテンツリンクを生成する
 * @param {"blog"|"product"} type - コンテンツタイプ
 * @param {string} id             - コンテンツID
 * @param {string} [basePath]     - ルートへの相対パス
 * @returns {string}
 */
export function buildContentLink(type, id, basePath = DEFAULT_BASE_PATH) {
    const config = CONTENT_TYPES[type];
    if (!config) return "#";
    return `${basePath}${config.postPage}?id=${id}`;
}

/**
 * コンテンツタイプのデータディレクトリパスを返す
 * @param {"blog"|"product"} type - コンテンツタイプ
 * @param {string} [basePath]     - ルートへの相対パス
 * @returns {string}
 */
export function getContentDataDir(type, basePath = DEFAULT_BASE_PATH) {
    const config = CONTENT_TYPES[type];
    if (!config) return basePath;
    return `${basePath}${config.dataDir}`;
}

// --- 後方互換ラッパー ---

/** @see fetchContent */
export function fetchArticle(id, basePath = DEFAULT_BASE_PATH) {
    return fetchContent("blog", id, basePath);
}

/** @see fetchContent */
export function fetchProduct(id, basePath = DEFAULT_BASE_PATH) {
    return fetchContent("product", id, basePath);
}

/** @see buildContentLink */
export function buildArticleLink(id, basePath = DEFAULT_BASE_PATH) {
    return buildContentLink("blog", id, basePath);
}

/** @see buildContentLink */
export function buildProductLink(id, basePath = DEFAULT_BASE_PATH) {
    return buildContentLink("product", id, basePath);
}
