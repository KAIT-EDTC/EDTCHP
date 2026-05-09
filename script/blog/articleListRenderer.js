import { articleIds, BLOG_TAGS } from "./../../public/blog/articleData.js";
import { fetchArticle } from "./../contentApi.js";
import { readState, writeState } from "./blogUrlState.js";
import { renderMobilePagination, renderDesktopPagination } from "./blogPagination.js";
import { PAGE_SIZE, filterArticles, getAvailableYears, renderCards } from "./blogCardRenderer.js";

/** 全記事データ（初回一括fetch後にキャッシュ） */
let allArticles = [];
let isInitialRender = true;

const mobileQuery = window.matchMedia("(max-width: 480px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// DOM列挙
let yearSelect, tagsContainer, countEl, clearBtn, blogArea, paginationAreaTop, paginationArea;
let prevBtn, nextBtn, dotsContainer;

// =====レンダラー(フィルタリング・ページネーション)=====

function render() {
    const state = readState();

    yearSelect.value = state.year;
    document.querySelectorAll(".blog-filters__tag-btn").forEach((btn) => {
        if (btn.dataset.tag === "すべて") {
            btn.setAttribute("aria-pressed", state.tags.length === 0);
        } else {
            btn.setAttribute("aria-pressed", state.tags.includes(btn.dataset.tag));
        }
    });

    const filtered = filterArticles(allArticles, state.year, state.tags);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const page = Math.min(state.page, totalPages);

    // 記事件数
    countEl.textContent = `${filtered.length}件の記事`;

    // 年/タグフィルターが有効なときのみクリアボタン表示
    clearBtn.hidden = !state.year && !state.tags.length;

    // 記事をレンダリング
    renderCards(blogArea, filtered, page, { isInitialRender });

    // ページネーション — 
    // SP:番号付き
    // PC:サイドアロー+ドット
    if (mobileQuery.matches) {
        renderMobilePagination(paginationAreaTop, paginationArea, page, totalPages, changePage);
    } else {
        renderDesktopPagination(prevBtn, nextBtn, dotsContainer, page, totalPages, changePage);
        paginationArea.hidden = true;
        if (paginationAreaTop) paginationAreaTop.hidden = true;
    }
    isInitialRender = false;
}

// ===== 状態更新ヘルパー =====

function changePage(newPage) {
    const state = readState();
    state.page = newPage;
    writeState(state);
    render();

    // フィルター位置までスクロール
    const target = document.querySelector(".blog-filters");
    if (target) {
        target.scrollIntoView({
            behavior: reducedMotion.matches ? "instant" : "smooth",
        });
    }
}

function applyFilter(year, tags) {
    const state = { year, tags, page: 1 };
    writeState(state);
    render();
}

// ===== 初期化 =====

document.addEventListener("DOMContentLoaded", async () => {
    yearSelect = document.getElementById("year-select");
    tagsContainer = document.querySelector(".blog-filters__tags");
    countEl = document.querySelector(".blog-filters__count");
    clearBtn = document.querySelector(".blog-filters__clear");
    blogArea = document.querySelector(".blog-area");
    paginationAreaTop = document.querySelector(".pagination-area--top");
    paginationArea = document.querySelector(".pagination-area--bottom");
    prevBtn = document.querySelector(".blog-nav__prev");
    nextBtn = document.querySelector(".blog-nav__next");
    dotsContainer = document.querySelector(".blog-nav__dots");

    // 記事を一度だけ取得してキャッシュ
    allArticles = (await Promise.all(articleIds.map((id) => fetchArticle(id)))).filter(Boolean);

    // 年セレクト生成/イベント設定
    const years = getAvailableYears(allArticles);
    years.forEach((y) => {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = `${y}年`;
        yearSelect.appendChild(opt);
    });

    yearSelect.addEventListener("change", () => {
        const state = readState();
        applyFilter(yearSelect.value, state.tags);
    });

    // タグボタン生成/イベント設定
    BLOG_TAGS.forEach((tag) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "blog-filters__tag-btn";
        btn.textContent = tag;
        btn.dataset.tag = tag;

        if (tag === "すべて") {
            btn.setAttribute("aria-pressed", "true");
            btn.addEventListener("click", () => {
                const state = readState();
                applyFilter(state.year, []);
            });
        } else {
            btn.setAttribute("aria-pressed", "false");
            btn.addEventListener("click", () => {
                const state = readState();
                const idx = state.tags.indexOf(tag);
                if (idx >= 0) state.tags.splice(idx, 1);
                else state.tags.push(tag);
                applyFilter(state.year, state.tags);
            });
        }
        tagsContainer.appendChild(btn);
    });

    // フィルタクリア
    clearBtn.addEventListener("click", () => {
        applyFilter("", []);
    });

    // ブログリスト側面のアローボタン
    prevBtn.addEventListener("click", () => {
        const s = readState();
        changePage(s.page - 1);
    });
    nextBtn.addEventListener("click", () => {
        const s = readState();
        changePage(s.page + 1);
    });

    // ポップステート(戻る/進むで発火)
    window.addEventListener("popstate", render);

    // モバイル⇔PC切替時に再描画
    mobileQuery.addEventListener("change", render);

    render();
});
