/**
 * ブログメーカー共通ユーティリティ
 * 定数・ヘルパー関数をまとめたモジュール
 */

const ALLOWED_LAYOUTS = new Set(["horizontal", "vertical"]);

function buildDatePrefix(dateStr) {
    const parts = String(dateStr || "").split("-");
    const yy = parts[0] ? parts[0].slice(-2) : "";
    const mm = parts[1] || "";
    const dd = parts[2] || "";

    if (!yy || !mm || !dd) {
        return "";
    }

    return `${yy}-${mm}-${dd}`;
}

function buildArticleId(dateStr, eventId) {
    const prefix = buildDatePrefix(dateStr);
    const safeEventId = String(eventId || "").trim();
    if (!prefix) {
        return safeEventId;
    }
    if (!safeEventId) {
        return prefix;
    }
    return `${prefix}-${safeEventId}`;
}

function extractEventId(articleId, dateStr) {
    const rawId = String(articleId || "").trim();
    if (!rawId) {
        return "";
    }

    const prefix = buildDatePrefix(dateStr);
    if (prefix && rawId.startsWith(`${prefix}-`)) {
        return rawId.slice(prefix.length + 1);
    }

    const matched = rawId.match(/^\d{2}-\d{2}-\d{2}-(.+)$/);
    if (matched) {
        return matched[1];
    }

    return rawId;
}

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
        imageFile: null,
        imagePreviewUrl: "",
        paragraphs: [""]
    };
}

function swapSections(indexA, indexB) {
    const temp = state.sections[indexA];
    state.sections[indexA] = state.sections[indexB];
    state.sections[indexB] = temp;
}
