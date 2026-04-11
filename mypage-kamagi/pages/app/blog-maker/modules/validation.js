/**
 * バリデーション＆エクスポートモジュール
 * 記事データの検証、JSON組み立て、ダウンロード処理を担当する。
 * グローバルの state, dom を参照する。
 */

function validateState(article) {
    const errors = [];
    const warnings = [];

    if (!article.id.trim()) {
        errors.push("id未入力です");
    }

    if (!article.date.trim()) {
        errors.push("date未入力です");
    }

    if (!article.title.trim()) {
        errors.push("title未入力です");
    }

    if (!Array.isArray(article.sections) || article.sections.length < 1) {
        errors.push("sectionsは1件以上必要です");
        return { errors, warnings };
    }

    article.sections.forEach((section, index) => {
        if (!ALLOWED_LAYOUTS.has(section.layout)) {
            errors.push(`section[${index}].layout は horizontal / vertical のみ指定可能です`);
        }

        const hasImage = section.image.trim().length > 0;
        const paragraphs = normalizeParagraphs(section.paragraphs);

        if (!hasImage && paragraphs.length === 0) {
            errors.push(`section[${index}] は image または paragraphs の少なくとも一方が必要です`);
        }

        if (hasImage && !section.imageAlt.trim()) {
            warnings.push(`section[${index}] は imageAlt の入力を推奨します`);
        }
    });

    return { errors, warnings };
}

function renderValidation() {
    const validation = validateState(state);
    dom.validationErrors.innerHTML = "";

    if (validation.errors.length === 0) {
        const ok = document.createElement("li");
        ok.className = "validation-ok";
        ok.textContent = "入力は有効です。JSONをダウンロードできます。";
        dom.validationErrors.appendChild(ok);
    } else {
        validation.errors.forEach((message) => {
            const li = document.createElement("li");
            li.textContent = message;
            dom.validationErrors.appendChild(li);
        });
    }

    if (validation.warnings.length > 0) {
        validation.warnings.forEach((message) => {
            const li = document.createElement("li");
            li.style.color = "#6d4f00";
            li.textContent = `推奨: ${message}`;
            dom.validationErrors.appendChild(li);
        });
    }

    dom.downloadButton.disabled = validation.errors.length > 0;
}

function buildExportJson(article) {
    const payload = {
        id: article.id.trim(),
        date: article.date.trim(),
        title: article.title.trim(),
        sections: article.sections.map((section) => {
            const normalized = {
                layout: ALLOWED_LAYOUTS.has(section.layout) ? section.layout : "horizontal"
            };

            const image = section.image.trim();
            const imageAlt = section.imageAlt.trim();
            const paragraphs = normalizeParagraphs(section.paragraphs);

            if (image) {
                normalized.image = image;
            }
            if (imageAlt) {
                normalized.imageAlt = imageAlt;
            }
            if (paragraphs.length > 0) {
                normalized.paragraphs = paragraphs;
            }

            return normalized;
        }).filter((section) => section.image || (section.paragraphs && section.paragraphs.length > 0))
    };

    if (article.thumbnail.trim()) {
        payload.thumbnail = article.thumbnail.trim();
    }
    if (article.caption.trim()) {
        payload.caption = article.caption.trim();
    }
    if (article.author.trim()) {
        payload.author = article.author.trim();
    }

    return payload;
}

function onDownloadClick() {
    const validation = validateState(state);
    if (validation.errors.length > 0) {
        showToast("入力エラーを解消してください", "error");
        return;
    }

    const exportData = buildExportJson(state);
    downloadJson(exportData, `${exportData.id}.json`);
    showToast("JSONをダウンロードしました", "success");
}

function downloadJson(data, fileName) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
}

function updateDownloadFilename() {
    const safeId = state.id.trim() || "article";
    dom.downloadFilename.textContent = `${safeId}.json`;
}
