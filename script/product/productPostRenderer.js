/**
 * JSONプロダクトデータを読み込み、商品詳細ページをレンダリングするモジュール
 *
 * URL形式: product-post.html?id=<product-id>
 * データ:  public/product/contents/<product-id>.json
 *
 * プロダクト追加手順:
 *   1. public/product/contents/<id>.json を作成（_template.json を参考に）
 *   2. 画像を products/img/ に配置
 *   3. data/pdctData.js にプロダクトIDを追加
 */

import { getContentDataDir } from "./../contentApi.js";

const BASE_IMG_PATH = "./public/product/img";
const ALTER_IMAGE_PATH = "./public/img/EDTC-icon.webp";

/**
 * HTMLエスケープ（XSS対策）
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * エラー表示
 */
function showError(message, basePath) {
    const mainEl = document.getElementById('product-main');
    if (mainEl) {
        mainEl.innerHTML = `
            <div class="product-error">
                <p class="product-error__icon">
                    ⚠
                </p>
                <p class="product-error__message">${escapeHtml(message)}</p>
                <p>
                    <a href="${basePath}product-top.html" class="product-error__link">
                        商品一覧に戻る
                    </a>
                </p>
            </div>
        `;
    }
}

/**
 * プロダクト全体をレンダリング（main版UIレイアウト）
 */
function renderProduct(product, basePath) {
    // ページタイトル
    const pageTitleEl = document.getElementById('page-title');
    if (pageTitleEl) {
        pageTitleEl.textContent = `${product.title}|神奈川工科大学EDTC`;
    }

    // パンくずリスト
    const breadcrumbTitleEl = document.getElementById('breadcrumb-title');
    if (breadcrumbTitleEl) {
        breadcrumbTitleEl.textContent = product.title;
    }

    const mainEl = document.getElementById('product-main');
    if (!mainEl) return;

    // --- メインコンテンツ: オーバーラップデザイン ---
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';

    // content-left: 説明文エリア
    const contentLeft = document.createElement('div');
    contentLeft.className = 'content-left';

    // ヘッドライン（h1）
    if (product.headline) {
        const h1 = document.createElement('h1');
        h1.textContent = product.headline;
        contentLeft.appendChild(h1);
    }

    // セクション本文（paragraphs）
    if (product.sections && product.sections.length > 0) {
        product.sections.forEach(section => {
            if (section.paragraphs) {
                section.paragraphs.forEach(text => {
                    const p = document.createElement('p');
                    p.textContent = text;
                    contentLeft.appendChild(p);
                });
            }
        });
    }

    // メタ情報（値段・対象者など）
    if (product.price) {
        const p = document.createElement('p');
        p.textContent = `値段：${product.price}`;
        contentLeft.appendChild(p);
    }
    if (product.target) {
        const p = document.createElement('p');
        p.textContent = `対象：${product.target}`;
        contentLeft.appendChild(p);
    }

    // CTAボタン
    const ctaLink = document.createElement('a');
    ctaLink.href = `${basePath}contact-us.html`;
    ctaLink.className = 'cta-button';
    ctaLink.textContent = '気軽にご相談ください！';
    const iconSpan = document.createElement('span');
    iconSpan.className = 'icon';
    iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>';
    ctaLink.appendChild(iconSpan);
    contentLeft.appendChild(ctaLink);

    mainContent.appendChild(contentLeft);

    // content-right: 画像エリア
    const contentRight = document.createElement('div');
    contentRight.className = 'content-right';

    const img = document.createElement('img');
    img.src = product.thumbnail ? `${BASE_IMG_PATH}/${product.thumbnail}` : ALTER_IMAGE_PATH;
    img.alt = product.title || '';
    contentRight.appendChild(img);

    mainContent.appendChild(contentRight);
    mainEl.appendChild(mainContent);

    // --- Maker セクション ---
    if (product.maker) {
        const infoSection = document.createElement('div');
        infoSection.className = 'info-section';

        const h3 = document.createElement('h3');
        h3.textContent = 'Maker';
        infoSection.appendChild(h3);

        const name = document.createElement('p');
        name.textContent = product.maker;
        infoSection.appendChild(name);

        mainEl.appendChild(infoSection);
    }
}

/**
 * プロダクトデータを読み込んでレンダリング
 */
async function loadProduct() {
    const basePath = document.body.dataset.basePath || './';
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        showError('商品IDが指定されていません。', basePath);
        return;
    }

    try {
        const dataDir = getContentDataDir('product', basePath);
        const response = await fetch(`${dataDir}${productId}.json`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`商品「${productId}」が見つかりません。`);
            }
            throw new Error(`読み込みエラー (HTTP ${response.status})`);
        }
        const product = await response.json();
        renderProduct(product, basePath);
    } catch (error) {
        console.error('Product post load error:', error);
        showError(error.message || '商品の読み込みに失敗しました。', basePath);
    }
}

loadProduct();
