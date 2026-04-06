/**
 * JSON記事データを読み込み、ブログ記事ページをレンダリングするモジュール
 *
 * URL形式: blog-post.html?id=<article-id>
 * データ:  data/articles/<article-id>.json
 *
 * ブログ記事追加手順:
 *   1. data/articles/<id>.json を作成（_template.json を参考に）
 *   2. 画像を blog/blog-img/ に配置
 *   3. data/articleData.js に記事IDを追加
 */

/**
 * HTMLエスケープ
 * XSSを防ぐ
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// showToastはマイページだけにする
/**
 * エラー表示(ページに表示)
 * @param {string} message  - エラーメッセージ
 * @param {string} basePath - ルートへの相対パス
 */
function showError(message, basePath) {
    const mainEl = document.getElementById('blog-main');
    if (mainEl) {
        mainEl.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <p style="font-size: 2em; color: #ccc; margin-bottom: 16px;">
                    <i class="fa fa-exclamation-triangle"></i>
                </p>
                <p style="font-size: 1.1em; color: #666;">${escapeHtml(message)}</p>
                <p style="margin-top: 24px;">
                    <a href="${basePath}blog.html" style="color: var(--main-color); text-decoration: underline;">
                        ブログ一覧に戻る
                    </a>
                </p>
            </div>
        `;
    }
}

/**
 * 記事セクションをレンダリング
 */
function renderSection(section) {
    const layoutDiv = document.createElement('div');
    // horizontal-layout または vertical-layout
    layoutDiv.className = `${section.layout}-layout`;

    const sectionEl = document.createElement('section');

    // 画像
    if (section.image) {
        const img = document.createElement('img');
        img.src = section.image;
        img.alt = section.imageAlt || '';
        sectionEl.appendChild(img);
    }

    // テキスト段落
    if (section.paragraphs && section.paragraphs.length > 0) {
        const textDiv = document.createElement('div');
        section.paragraphs.forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            textDiv.appendChild(p);
        });
        sectionEl.appendChild(textDiv);
    }

    layoutDiv.appendChild(sectionEl);
    return layoutDiv;
}

/**
 * 記事全体をレンダリング
 */
function renderArticle(article) {
    // ページタイトル
    const pageTitleEl = document.getElementById('page-title');
    if (pageTitleEl) {
        pageTitleEl.textContent = `${article.title}|神奈川工科大学EDTC`;
    }

    // パンくずリスト
    const breadcrumbTitleEl = document.getElementById('breadcrumb-title');
    if (breadcrumbTitleEl) {
        breadcrumbTitleEl.textContent = article.title;
    }

    // ブログタイトル
    const blogTitleEl = document.getElementById('blog-title');
    if (blogTitleEl) {
        blogTitleEl.textContent = article.title;
    }

    // 日付
    const blogDateEl = document.getElementById('blog-date');
    if (blogDateEl) {
        blogDateEl.innerHTML = `<i class="fa fa-clock-o"></i>${escapeHtml(article.date)}`;
    }

    // 本文セクション
    const mainEl = document.getElementById('blog-main');
    if (!mainEl) return;

    const fragment = document.createDocumentFragment();

    // 各セクションをレンダリング
    if (article.sections && article.sections.length > 0) {
        article.sections.forEach(section => {
            fragment.appendChild(renderSection(section));
        });
    }

    // 著者
    if (article.author) {
        const authorContainer = document.createElement('div');
        authorContainer.className = 'author-container';

        const captionP = document.createElement('p');
        captionP.className = 'author-caption';
        captionP.textContent = 'ブログ著者';

        const authorP = document.createElement('p');
        authorP.className = 'author';
        authorP.textContent = article.author;

        authorContainer.appendChild(captionP);
        authorContainer.appendChild(authorP);
        fragment.appendChild(authorContainer);
    }

    mainEl.appendChild(fragment);
}

// 固有のエラーハンドリングがあるためヘルパーは使わない
/**
 * 記事データを読み込んでレンダリング
 */
async function loadArticle() {
    const basePath = document.body.dataset.basePath || './';
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    if (!articleId) {
        showError('記事IDが指定されていません。', basePath);
        return;
    }

    try {
        const response = await fetch(`${basePath}data/articles/${articleId}.json`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`記事「${articleId}」が見つかりません。`);
            }
            throw new Error(`読み込みエラー (HTTP ${response.status})`);
        }
        const article = await response.json();
        renderArticle(article);
    } catch (error) {
        console.error('Blog post load error:', error);
        showError(error.message || '記事の読み込みに失敗しました。', basePath);
    }
}

loadArticle();
