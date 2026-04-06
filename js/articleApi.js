/**
 * ブログ記事 API 共通モジュール
 *
 * - fetchArticle : 記事 JSON を取得して返す
 * - buildLink    : 記事 ID から blog-post.html へのリンクを生成する
 * 
 * TOOD: プロダクトページでも使うため汎用化する
 */

const DEFAULT_BASE_PATH = "./";

/**
 * 記事 JSON を fetch して返す
 * @param {string} id       - 記事ID (例: "25-08-08-sciencesummer")
 * @param {string} [basePath] - ルートへの相対パス (例: "./", "../")
 * @returns {Promise<Object|null>} 記事データ（取得失敗時は null）
 */
export async function fetchArticle(id, basePath = DEFAULT_BASE_PATH) {
    if (!id) return null;
    try {
        const res = await fetch(`${basePath}data/articles/${id}.json`);
        if (!res.ok) return null;
        const data = await res.json();
        return { ...data, id, link: buildLink(id, basePath) };
    } catch {
        return null;
    }
}

/**
 * 記事 ID から blog-post.html へのリンクを生成する
 * @param {string} id       - 記事ID
 * @param {string} [basePath] - ルートへの相対パス
 * @returns {string}
 */
export function buildLink(id, basePath = DEFAULT_BASE_PATH) {
    return `${basePath}blog-post.html?id=${id}`;
}
