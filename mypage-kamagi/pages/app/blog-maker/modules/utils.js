/**
 * ブログメーカー共通ユーティリティ
 * 定数・ヘルパー関数をまとめたモジュール
 */

const ALLOWED_LAYOUTS = new Set(["horizontal", "vertical"]);

function escapeHtml(value) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };

    return String(value).replace(/[&<>"']/g, (ch) => map[ch]);
}

function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
}

function normalizeParagraphs(paragraphs) {
    if (!Array.isArray(paragraphs)) {
        return [];
    }

    return paragraphs
        .map((text) => String(text).trim())
        .filter((text) => text.length > 0);
}

function createEmptySection(layout) {
    return {
        layout,
        image: "",
        imageAlt: "",
        paragraphs: [""]
    };
}

function swapSections(indexA, indexB) {
    const temp = state.sections[indexA];
    state.sections[indexA] = state.sections[indexB];
    state.sections[indexB] = temp;
}
