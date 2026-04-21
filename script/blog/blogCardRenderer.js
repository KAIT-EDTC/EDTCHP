// ===== Blog card rendering =====

export const PAGE_SIZE = 3;
export const BASE_IMG_PATH = "./public/blog/img";
export const ALTER_IMAGE_PATH = "./public/img/EDTC-icon.webp";

export function filterArticles(articles, year, tags) {
    return articles.filter((article) => {
        if (!article) return false;
        if (year && !article.date?.startsWith(year)) return false;
        if (tags.length) {
            const articleTags = article.tags || [];
            if (!tags.every((tag) => articleTags.includes(tag))) return false;
        }
        return true;
    });
}

export function getAvailableYears(articles) {
    const years = new Set();
    articles.forEach((article) => {
        if (article?.date) years.add(article.date.slice(0, 4));
    });
    return [...years].sort().reverse();
}

/**
 * カードDOMを生成して container に挿入する。
 * @param {HTMLElement} container - blogArea 要素
 * @param {Object[]} articles - ページ分割済みの記事配列
 * @param {number} page - 現在のページ番号
 * @param {Object} options - { isInitialRender: boolean }
 */
export function renderCards(container, articles, page, options = {}) {
    const { isInitialRender = false } = options;
    const pageItems = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    container.innerHTML = "";

    if (articles.length === 0) {
        container.innerHTML = '<p class="blog-empty">条件に一致する記事がありません。</p>';
        return;
    }

    const ul = document.createElement("ul");
    ul.className = "blog-container";
    const frag = document.createDocumentFragment();

    pageItems.forEach((article, index) => {
        const li = document.createElement("li");
        li.className = isInitialRender ? "blog-card anim-fadein" : "blog-card";
        if (isInitialRender) li.style.animationDelay = `${index * 80}ms`;

        const a = document.createElement("a");
        a.href = article.link;

        // Image wrapper
        const imgWrap = document.createElement("div");
        imgWrap.className = "blog-card__img-wrap";

        const img = document.createElement("img");
        img.className = "blog-card__img";
        img.src = article.thumbnail ? `${BASE_IMG_PATH}/${article.thumbnail}` : ALTER_IMAGE_PATH;
        img.alt = article.title || "記事の画像";
        img.width = 640;
        img.height = 360;
        img.loading = "lazy";
        imgWrap.appendChild(img);

        // Tag chips on image
        if (article.tags?.length) {
            const tagsDiv = document.createElement("div");
            tagsDiv.className = "blog-card__tags";
            article.tags.forEach((tag) => {
                const span = document.createElement("span");
                span.className = "blog-card__tag";
                span.textContent = tag;
                tagsDiv.appendChild(span);
            });
            imgWrap.appendChild(tagsDiv);
        }

        // Body
        const body = document.createElement("div");
        body.className = "blog-card__body";

        const dateEl = document.createElement("span");
        dateEl.className = "blog-card__date";
        dateEl.textContent = article.date || "";

        const titleEl = document.createElement("h2");
        titleEl.className = "blog-card__title";
        titleEl.textContent = article.title || "";

        const capEl = document.createElement("p");
        capEl.className = "blog-card__caption";
        capEl.textContent = article.caption || "";

        body.appendChild(dateEl);
        body.appendChild(titleEl);
        body.appendChild(capEl);

        a.appendChild(imgWrap);
        a.appendChild(body);
        li.appendChild(a);
        frag.appendChild(li);
    });

    ul.appendChild(frag);
    container.appendChild(ul);
}
