/**
 * インポートモジュール
 * ZIP（JSON＋画像）またはJSONファイルを読み込み、editorの状態を復元する。
 * グローバルの state, dom, renderSectionEditors, renderAll, updateThumbnailPreview を参照する。
 */

function onImportClick() {
    if (dom.importFileInput) {
        dom.importFileInput.click();
    }
}

async function onImportFileChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
        return;
    }

    try {
        if (file.name.endsWith(".zip")) {
            if (typeof JSZip === "undefined") {
                showToast("ZIPインポートは現在利用できません。JSONファイルを使用してください。", "error");
                return;
            }
            await importFromZip(file);
        } else if (file.name.endsWith(".json")) {
            const text = await file.text();
            const json = JSON.parse(text);
            restoreStateFromJson(json, {});
        } else {
            showToast("対応していないファイル形式です", "error");
            return;
        }
        showToast("インポートしました", "success");
    } catch (error) {
        console.error("インポートエラー:", error);
        showToast("インポートに失敗しました", "error");
    }

    if (dom.importFileInput) {
        dom.importFileInput.value = "";
    }
}

async function importFromZip(file) {
    const zip = await JSZip.loadAsync(file);

    let jsonData = null;
    let jsonFilename = null;
    const imageBlobs = {};

    for (const [filename, zipEntry] of Object.entries(zip.files)) {
        if (zipEntry.dir) {
            continue;
        }
        if (filename.endsWith(".json")) {
            const text = await zipEntry.async("text");
            jsonData = JSON.parse(text);
            jsonFilename = filename;
        } else if (/\.(webp|png|jpe?g|gif)$/i.test(filename)) {
            const blob = await zipEntry.async("blob");
            imageBlobs[filename] = blob;
        }
    }

    if (!jsonData) {
        throw new Error("ZIP内にJSONファイルが見つかりません");
    }

    restoreStateFromJson(jsonData, imageBlobs);
}

function restoreStateFromJson(json, imageBlobs) {
    cleanupPreviousState();

    state.id = json.id || "";
    state.date = json.date || "";
    state.title = json.title || "";
    state.caption = json.caption || "";
    state.author = json.author || "";

    state.thumbnailFile = null;
    state.thumbnailPreviewUrl = "";
    if (json.thumbnail && imageBlobs[json.thumbnail]) {
        const blob = imageBlobs[json.thumbnail];
        state.thumbnailFile = new File([blob], json.thumbnail, { type: blob.type || "image/webp" });
        state.thumbnailPreviewUrl = URL.createObjectURL(blob);
    }

    state.sections = [];
    const sections = Array.isArray(json.sections) ? json.sections : [];
    sections.forEach((sec) => {
        const section = createEmptySection(sec.layout || "horizontal");
        section.imageAlt = sec.imageAlt || "";
        section.paragraphs = Array.isArray(sec.paragraphs) && sec.paragraphs.length > 0
            ? sec.paragraphs.slice()
            : [""];

        if (sec.image && imageBlobs[sec.image]) {
            const blob = imageBlobs[sec.image];
            section.imageFile = new File([blob], sec.image, { type: blob.type || "image/webp" });
            section.imagePreviewUrl = URL.createObjectURL(blob);
        }

        state.sections.push(section);
    });

    if (state.sections.length === 0) {
        state.sections.push(createEmptySection("horizontal"));
    }

    syncDomFromState();
    updateThumbnailPreview();
    renderSectionEditors();
    renderAll();
}

function cleanupPreviousState() {
    if (state.thumbnailPreviewUrl) {
        URL.revokeObjectURL(state.thumbnailPreviewUrl);
    }
    if (Array.isArray(state.sections)) {
        state.sections.forEach((section) => {
            if (section.imagePreviewUrl) {
                URL.revokeObjectURL(section.imagePreviewUrl);
            }
        });
    }
}

function syncDomFromState() {
    if (dom.idInput) {
        dom.idInput.value = state.id;
    }
    if (dom.dateInput) {
        dom.dateInput.value = state.date;
    }
    if (dom.titleInput) {
        dom.titleInput.value = state.title;
    }

    const authorInput = document.getElementById("article-author");
    if (authorInput) {
        authorInput.value = state.author;
    }

    const captionInput = document.getElementById("article-caption");
    if (captionInput) {
        captionInput.value = state.caption;
    }

    if (dom.thumbnailUpload) {
        dom.thumbnailUpload.value = "";
    }
}
