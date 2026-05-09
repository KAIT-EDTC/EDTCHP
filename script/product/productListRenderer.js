import { productIds, PRODUCT_TAGS } from "./../../public/product/pdctData.js";
import { fetchProduct } from "./../contentApi.js";
import { readState, writeState } from "./productUrlState.js";
import { renderMobilePagination, renderDesktopPagination } from "./../blog/blogPagination.js";
import { PAGE_SIZE, filterProducts, renderCards } from "./productCardRenderer.js";

/** 全プロダクトデータ（初回一括fetch後にキャッシュ） */
let allProducts = [];
let isInitialRender = true;

const mobileQuery = window.matchMedia("(max-width: 480px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// DOM参照
let tagsContainer, countEl, clearBtn, pdctArea, paginationAreaTop, paginationArea;
let prevBtn, nextBtn, dotsContainer;

// ===== レンダラー（フィルタリング・ページネーション） =====

function render() {
    const state = readState();

    document.querySelectorAll(".pdct-filters__tag-btn").forEach((btn) => {
        if (btn.dataset.tag === "すべて") {
            btn.setAttribute("aria-pressed", state.tags.length === 0);
        } else {
            btn.setAttribute("aria-pressed", state.tags.includes(btn.dataset.tag));
        }
    });

    const filtered = filterProducts(allProducts, state.tags);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const page = Math.min(state.page, totalPages);

    countEl.textContent = `${filtered.length}件のプロダクト`;
    clearBtn.hidden = !state.tags.length;

    renderCards(pdctArea, filtered, page, { isInitialRender });

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

    const target = document.querySelector(".pdct-filters");
    if (target) {
        target.scrollIntoView({
            behavior: reducedMotion.matches ? "instant" : "smooth",
        });
    }
}

function applyFilter(tags) {
    const state = { tags, page: 1 };
    writeState(state);
    render();
}

// ===== 初期化 =====

document.addEventListener("DOMContentLoaded", async () => {
    tagsContainer = document.querySelector(".pdct-filters__tags");
    countEl = document.querySelector(".pdct-filters__count");
    clearBtn = document.querySelector(".pdct-filters__clear");
    pdctArea = document.querySelector(".pdct-area");
    paginationAreaTop = document.querySelector(".pagination-area--top");
    paginationArea = document.querySelector(".pagination-area--bottom");
    prevBtn = document.querySelector(".pdct-nav__prev");
    nextBtn = document.querySelector(".pdct-nav__next");
    dotsContainer = document.querySelector(".pdct-nav__dots");

    // プロダクトを一度だけ取得してキャッシュ
    allProducts = (await Promise.all(productIds.map((id) => fetchProduct(id)))).filter(Boolean);

    // タグボタン生成
    PRODUCT_TAGS.forEach((tag) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pdct-filters__tag-btn";
        btn.textContent = tag;
        btn.dataset.tag = tag;

        if (tag === "すべて") {
            btn.setAttribute("aria-pressed", "true");
            btn.addEventListener("click", () => applyFilter([]));
        } else {
            btn.setAttribute("aria-pressed", "false");
            btn.addEventListener("click", () => {
                const state = readState();
                const idx = state.tags.indexOf(tag);
                if (idx >= 0) state.tags.splice(idx, 1);
                else state.tags.push(tag);
                applyFilter(state.tags);
            });
        }
        tagsContainer.appendChild(btn);
    });

    // フィルタクリア
    clearBtn.addEventListener("click", () => applyFilter([]));

    // サイドアローボタン
    prevBtn.addEventListener("click", () => {
        const s = readState();
        changePage(s.page - 1);
    });
    nextBtn.addEventListener("click", () => {
        const s = readState();
        changePage(s.page + 1);
    });

    // ポップステート（戻る/進むで発火）
    window.addEventListener("popstate", render);

    // モバイル⇔PC切替時に再描画
    mobileQuery.addEventListener("change", render);

    render();
});
