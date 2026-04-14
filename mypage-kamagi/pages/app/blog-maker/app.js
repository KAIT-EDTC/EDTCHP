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
    thumbnailFile: null,
    thumbnailPreviewUrl: "",
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

    dom.thumbnailUpload = document.getElementById("thumbnail-upload");
    dom.thumbnailPreview = document.getElementById("thumbnail-preview-container");
    dom.thumbnailRemoveBtn = document.getElementById("thumbnail-remove-btn");
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

    if (dom.thumbnailUpload) {
        dom.thumbnailUpload.addEventListener("change", onThumbnailUpload);
    }
    if (dom.thumbnailRemoveBtn) {
        dom.thumbnailRemoveBtn.addEventListener("click", onThumbnailRemove);
    }
}

function onThumbnailUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
        return;
    }

    if (state.thumbnailPreviewUrl) {
        URL.revokeObjectURL(state.thumbnailPreviewUrl);
    }

    state.thumbnailFile = file;
    state.thumbnailPreviewUrl = URL.createObjectURL(file);

    updateThumbnailPreview();
    renderAll();
}

function onThumbnailRemove() {
    if (state.thumbnailPreviewUrl) {
        URL.revokeObjectURL(state.thumbnailPreviewUrl);
    }

    state.thumbnailFile = null;
    state.thumbnailPreviewUrl = "";

    if (dom.thumbnailUpload) {
        dom.thumbnailUpload.value = "";
    }

    updateThumbnailPreview();
    renderAll();
}

function updateThumbnailPreview() {
    if (!dom.thumbnailPreview) {
        return;
    }

    if (state.thumbnailPreviewUrl) {
        dom.thumbnailPreview.innerHTML = `
            <img src="${state.thumbnailPreviewUrl}" alt="サムネイルプレビュー" class="image-preview-thumb">
        `;
        dom.thumbnailPreview.style.display = "flex";
        if (dom.thumbnailRemoveBtn) {
            dom.thumbnailRemoveBtn.style.display = "inline-block";
        }
    } else {
        dom.thumbnailPreview.innerHTML = "";
        dom.thumbnailPreview.style.display = "none";
        if (dom.thumbnailRemoveBtn) {
            dom.thumbnailRemoveBtn.style.display = "none";
        }
    }
}

function renderAll() {
    renderPreview();
    renderValidation();
    updateDownloadFilename();
}
