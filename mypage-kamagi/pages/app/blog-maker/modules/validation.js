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

    if (!article.author.trim()) {
        errors.push("author未入力です");
    }

    if (!article.caption.trim()) {
        errors.push("caption未入力です");
    }

    if (!article.thumbnailFile) {
        errors.push("thumbnailが未設定です。記事一覧でサムネイルが表示されません");
    }

    if (!Array.isArray(article.sections) || article.sections.length < 1) {
        errors.push("sectionsは1件以上必要です");
        return { errors, warnings };
    }

    article.sections.forEach((section, index) => {
        if (!ALLOWED_LAYOUTS.has(section.layout)) {
            errors.push(`section[${index}].layout は horizontal / vertical のみ指定可能です`);
        }

        const hasImage = section.imageFile !== null;
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

function buildExportJson(article, imageMap) {
    const payload = {
        id: article.id.trim(),
        date: article.date.trim(),
        title: article.title.trim(),
        sections: article.sections.map((section, index) => {
            const normalized = {
                layout: ALLOWED_LAYOUTS.has(section.layout) ? section.layout : "horizontal"
            };

            const imageFilename = imageMap && imageMap.sections[index];
            const imageAlt = section.imageAlt.trim();
            const paragraphs = normalizeParagraphs(section.paragraphs);

            if (imageFilename) {
                normalized.image = imageFilename;
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

    if (imageMap && imageMap.thumbnail) {
        payload.thumbnail = imageMap.thumbnail;
    }
    if (article.caption.trim()) {
        payload.caption = article.caption.trim();
    }
    if (article.author.trim()) {
        payload.author = article.author.trim();
    }

    return payload;
}

async function onDownloadClick() {
    const validation = validateState(state);
    if (validation.errors.length > 0) {
        showToast("入力エラーを解消してください", "error");
        return;
    }

    dom.downloadButton.disabled = true;

    try {
        const randomTag = generateRandomId();
        const dateStr = state.date.trim();
        let imageIndex = 1;
        const imageEntries = [];
        const imageMap = { thumbnail: null, sections: {} };

        if (state.thumbnailFile) {
            const filename = generateImageFilename(dateStr, randomTag, imageIndex);
            const blob = await convertToWebp(state.thumbnailFile);
            imageEntries.push({ filename, blob });
            imageMap.thumbnail = filename;
            imageIndex++;
        }

        for (let i = 0; i < state.sections.length; i++) {
            if (state.sections[i].imageFile) {
                const filename = generateImageFilename(dateStr, randomTag, imageIndex);
                const blob = await convertToWebp(state.sections[i].imageFile);
                imageEntries.push({ filename, blob });
                imageMap.sections[i] = filename;
                imageIndex++;
            }
        }

        const exportData = buildExportJson(state, imageMap);
        const jsonFilename = `${exportData.id}.json`;

        if (imageEntries.length > 0) {
            await downloadAsZip(exportData, jsonFilename, imageEntries);
            showToast("ZIPをダウンロードしました", "success");
        } else {
            downloadJson(exportData, jsonFilename);
            showToast("JSONをダウンロードしました", "success");
        }
    } catch (error) {
        console.error("ダウンロードエラー:", error);
        showToast("ダウンロードに失敗しました", "error");
    } finally {
        renderValidation();
    }
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
    const ext = hasUploadedImages() ? ".zip" : ".json";
    dom.downloadFilename.textContent = `${safeId}${ext}`;
}
