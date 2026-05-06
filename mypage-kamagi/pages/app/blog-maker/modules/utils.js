/**
 * ブログメーカー共通ユーティリティ
 * 定数・ヘルパー関数をまとめたモジュール
 */

const ALLOWED_LAYOUTS = new Set(["horizontal", "vertical"]);
const ARTICLE_ID_PATTERN = /^(\d{2}-\d{2}-\d{2})-(.+)$/;
const DEFAULT_ARTICLE_BASE_NAME = "article";

function buildDatePrefix(dateStr) {
    const matched = String(dateStr || "").trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!matched) {
        return "";
    }

    const year = matched[1];
    const month = matched[2];
    const day = matched[3];

    const monthNumber = Number(month);
    const dayNumber = Number(day);
    if (monthNumber < 1 || monthNumber > 12 || dayNumber < 1 || dayNumber > 31) {
        return "";
    }

    const parsedDate = new Date(Number(year), monthNumber - 1, dayNumber);
    if (
        parsedDate.getFullYear() !== Number(year) ||
        parsedDate.getMonth() !== monthNumber - 1 ||
        parsedDate.getDate() !== dayNumber
    ) {
        return "";
    }

    const yy = year.slice(-2);
    const mm = month.padStart(2, "0");
    const dd = day.padStart(2, "0");

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

    const matched = rawId.match(ARTICLE_ID_PATTERN);
    if (matched) {
        return matched[2];
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
