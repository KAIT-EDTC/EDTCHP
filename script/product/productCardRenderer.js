// ===== Product card rendering =====

export const PAGE_SIZE = 6;
export const BASE_IMG_PATH = "./public/product/img";
export const ALTER_IMAGE_PATH = "./public/img/EDTC-icon.webp";

export function filterProducts(products, tags) {
    return products.filter((product) => {
        if (!product) return false;
        if (tags.length) {
            const productTags = product.tags || [];
            if (!tags.some((tag) => productTags.includes(tag))) return false;
        }
        return true;
    });
}

/**
 * カードDOMを生成して container に挿入する。
 * @param {HTMLElement} container - pdctArea 要素
 * @param {Object[]} products - フィルタ済みのプロダクト配列
 * @param {number} page - 現在のページ番号
 * @param {Object} options - { isInitialRender: boolean }
 */
export function renderCards(container, products, page, options = {}) {
    const { isInitialRender = false } = options;
    const pageItems = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = '<p class="pdct-empty">条件に一致するプロダクトがありません。</p>';
        return;
    }

    const ul = document.createElement("ul");
    ul.className = "pdct-container";
    const frag = document.createDocumentFragment();

    pageItems.forEach((product, index) => {
        const li = document.createElement("li");
        li.className = isInitialRender ? "pdct-card anim-fadein" : "pdct-card";
        if (isInitialRender) li.style.animationDelay = `${index * 80}ms`;

        const a = document.createElement("a");
        a.href = product.link;

        // Image wrapper
        const imgWrap = document.createElement("div");
        imgWrap.className = "pdct-card__img-wrap";

        const img = document.createElement("img");
        img.className = "pdct-card__img";
        img.src = product.thumbnail ? `${BASE_IMG_PATH}/${product.thumbnail}` : ALTER_IMAGE_PATH;
        img.alt = product.title || "製品の画像";
        img.width = 640;
        img.height = 360;
        img.loading = "lazy";
        imgWrap.appendChild(img);

        // Tag chips on image
        if (product.tags?.length) {
            const tagsDiv = document.createElement("div");
            tagsDiv.className = "pdct-card__tags";
            product.tags.forEach((tag) => {
                const span = document.createElement("span");
                span.className = "pdct-card__tag";
                span.textContent = tag;
                tagsDiv.appendChild(span);
            });
            imgWrap.appendChild(tagsDiv);
        }

        // Body
        const body = document.createElement("div");
        body.className = "pdct-card__body";

        const titleEl = document.createElement("h2");
        titleEl.className = "pdct-card__title";
        titleEl.textContent = product.title || "";

        const capEl = document.createElement("p");
        capEl.className = "pdct-card__caption";
        capEl.textContent = product.caption || "";

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
