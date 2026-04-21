// ===== Pagination rendering =====

/** ページ番号の表示範囲を計算（省略 ellipsis 対応） */
function getPageRange(page, totalPages) {
    const items = [];
    if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) items.push(i);
        return items;
    }
    // 常に先頭・末尾を含め、現在ページ周辺±1を表示
    const near = new Set([1, page - 1, page, page + 1, totalPages]);
    let prev = 0;
    [...near].sort((a, b) => a - b).forEach((n) => {
        if (n < 1 || n > totalPages) return;
        if (prev && n - prev > 1) items.push("...");
        items.push(n);
        prev = n;
    });
    return items;
}

function buildPaginationFragment(page, totalPages, onPageChange) {
    const frag = document.createDocumentFragment();

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "←";
    prevBtn.className = "pagination-area__arrow";
    prevBtn.disabled = page <= 1;
    prevBtn.setAttribute("aria-label", "前のページ");
    prevBtn.addEventListener("click", () => onPageChange(page - 1));
    frag.appendChild(prevBtn);

    getPageRange(page, totalPages).forEach((item) => {
        if (item === "...") {
            const span = document.createElement("span");
            span.className = "pagination-area__ellipsis";
            span.textContent = "…";
            frag.appendChild(span);
        } else {
            const btn = document.createElement("button");
            btn.textContent = item;
            btn.className = "pagination-area__num";
            btn.setAttribute("aria-label", `${item}ページ目`);
            if (item === page) {
                btn.classList.add("pagination-area__current");
                btn.setAttribute("aria-current", "page");
            }
            btn.addEventListener("click", () => onPageChange(item));
            frag.appendChild(btn);
        }
    });

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "→";
    nextBtn.className = "pagination-area__arrow";
    nextBtn.disabled = page >= totalPages;
    nextBtn.setAttribute("aria-label", "次のページ");
    nextBtn.addEventListener("click", () => onPageChange(page + 1));
    frag.appendChild(nextBtn);

    return frag;
}

export function renderMobilePagination(topNav, bottomNav, page, totalPages, onPageChange) {
    [topNav, bottomNav].forEach((nav) => {
        nav.innerHTML = "";
        if (totalPages <= 1) return;
        nav.appendChild(buildPaginationFragment(page, totalPages, onPageChange));
    });
    bottomNav.hidden = totalPages <= 1;
    if (topNav) topNav.hidden = false;
}

export function renderDesktopPagination(prevBtn, nextBtn, dotsContainer, page, totalPages, onPageChange) {
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;

    dotsContainer.innerHTML = "";
    if (totalPages <= 1) return;

    const frag = document.createDocumentFragment();
    for (let i = 1; i <= totalPages; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "blog-nav__dot";
        dot.setAttribute("aria-label", `${i}ページ目`);
        if (i === page) {
            dot.classList.add("blog-nav__dot--active");
            dot.setAttribute("aria-current", "page");
        }
        dot.addEventListener("click", () => onPageChange(i));
        frag.appendChild(dot);
    }
    dotsContainer.appendChild(frag);
}
