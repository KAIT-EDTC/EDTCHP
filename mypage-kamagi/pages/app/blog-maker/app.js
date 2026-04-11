/**
 * ブログメーカー メインオーケストレーター
 * アプリ状態の定義・DOMキャッシュ・初期化シーケンス・イベント配線のみ。
 * 各業務ロジックは modules/ 配下に委譲する。
 */

const state = {
    id: "",
    date: "",
    title: "",
    thumbnail: "",
    caption: "",
    author: "",
    sections: [createEmptySection("horizontal")]
};

const dom = {};

document.addEventListener("DOMContentLoaded", async () => {
    cacheDom();
    await initializeAuthState();
    initializeDefaultValues();
    bindEvents();
    renderSectionEditors();
    renderAll();
});

function cacheDom() {
    dom.form = document.getElementById("blog-form");
    dom.sectionsContainer = document.getElementById("sections-container");
    dom.validationErrors = document.getElementById("validation-errors");
    dom.downloadButton = document.getElementById("download-json-btn");
    dom.downloadFilename = document.getElementById("download-filename");

    dom.previewBreadcrumbTitle = document.getElementById("preview-breadcrumb-title");
    dom.previewTitle = document.getElementById("preview-blog-title");
    dom.previewDate = document.getElementById("preview-blog-date");
    dom.previewMain = document.getElementById("preview-blog-main");

    dom.idInput = document.getElementById("article-id");
    dom.dateInput = document.getElementById("article-date");
    dom.titleInput = document.getElementById("article-title");
}

function initializeDefaultValues() {
    const today = new Date();
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    const isoDate = local.toISOString().slice(0, 10);

    state.date = isoDate;

    if (dom.dateInput) {
        dom.dateInput.value = isoDate;
    }
}

function bindEvents() {
    dom.form.querySelectorAll("[data-field]").forEach((input) => {
        input.addEventListener("input", () => {
            state[input.dataset.field] = input.value;
            renderAll();
        });
    });

    document.getElementById("add-section-btn").addEventListener("click", () => {
        state.sections.push(createEmptySection("horizontal"));
        renderSectionEditors();
        renderAll();
    });

    dom.sectionsContainer.addEventListener("click", onSectionsClick);
    dom.sectionsContainer.addEventListener("input", onSectionsInput);
    dom.sectionsContainer.addEventListener("change", onSectionsInput);

    dom.downloadButton.addEventListener("click", onDownloadClick);
}

function renderAll() {
    renderPreview();
    renderValidation();
    updateDownloadFilename();
}
