const ALLOWED_LAYOUTS = new Set(["horizontal", "vertical"]);

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
    bindStaticInputs();
    bindGlobalActions();
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

async function initializeAuthState() {
    try {
        const authData = await authService.checkStatus();
        if (!authData.isLoggedIn) {
            window.location.href = "/mypage-kamagi/pages/login/";
            return;
        }

        if (authData.user && String(authData.user.role) === "0") {
            const adminLink = document.getElementById("admin-link");
            if (adminLink) {
                adminLink.style.display = "block";
            }
        }

        document.body.style.display = "block";
    } catch (error) {
        console.error("認証確認エラー:", error);
        showToast("認証確認に失敗しました。ログインし直してください。", "error");
        window.location.href = "/mypage-kamagi/pages/login/";
    }
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

function bindStaticInputs() {
    const inputs = dom.form.querySelectorAll("[data-field]");
    inputs.forEach((input) => {
        input.addEventListener("input", () => {
            const field = input.dataset.field;
            state[field] = input.value;
            renderAll();
        });
    });
}

function bindGlobalActions() {
    document.getElementById("add-section-btn").addEventListener("click", () => {
        state.sections.push(createEmptySection("horizontal"));
        renderSectionEditors();
        renderAll();
    });

    dom.sectionsContainer.addEventListener("click", onSectionsClick);
    dom.sectionsContainer.addEventListener("input", onSectionsInput);
    dom.sectionsContainer.addEventListener("change", onSectionsInput);

    dom.downloadButton.addEventListener("click", () => {
        const validation = validateState(state);
        if (validation.errors.length > 0) {
            showToast("入力エラーを解消してください", "error");
            return;
        }

        const exportData = buildExportJson(state);
        downloadJson(exportData, `${exportData.id}.json`);
        showToast("JSONをダウンロードしました", "success");
    });
}

function onSectionsClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
        return;
    }

    const index = Number(button.dataset.sectionIndex);
    if (!Number.isInteger(index) || !state.sections[index]) {
        return;
    }

    const action = button.dataset.action;

    if (action === "move-up" && index > 0) {
        swapSections(index, index - 1);
    } else if (action === "move-down" && index < state.sections.length - 1) {
        swapSections(index, index + 1);
    } else if (action === "remove-section") {
        state.sections.splice(index, 1);
        if (state.sections.length === 0) {
            state.sections.push(createEmptySection("horizontal"));
        }
    } else if (action === "add-paragraph") {
        state.sections[index].paragraphs.push("");
    } else if (action === "remove-paragraph") {
        const paragraphIndex = Number(button.dataset.paragraphIndex);
        if (Number.isInteger(paragraphIndex)) {
            state.sections[index].paragraphs.splice(paragraphIndex, 1);
            if (state.sections[index].paragraphs.length === 0) {
                state.sections[index].paragraphs.push("");
            }
        }
    }

    renderSectionEditors();
    renderAll();
}

function onSectionsInput(event) {
    const target = event.target;
    const sectionIndex = Number(target.dataset.sectionIndex);
    if (!Number.isInteger(sectionIndex) || !state.sections[sectionIndex]) {
        return;
    }

    const section = state.sections[sectionIndex];

    if (target.dataset.sectionField) {
        section[target.dataset.sectionField] = target.value;
    }

    if (target.dataset.paragraphIndex !== undefined) {
        const paragraphIndex = Number(target.dataset.paragraphIndex);
        if (Number.isInteger(paragraphIndex)) {
            section.paragraphs[paragraphIndex] = target.value;
        }
    }

    renderAll();
}

function renderSectionEditors() {
    const fragment = document.createDocumentFragment();

    state.sections.forEach((section, sectionIndex) => {
        const card = document.createElement("div");
        card.className = "section-editor";

        card.innerHTML = `
            <div class="section-card-header">
                <h4>section[${sectionIndex}]</h4>
                <div class="section-actions">
                    <button type="button" class="btn btn-ghost" data-action="move-up" data-section-index="${sectionIndex}">上へ</button>
                    <button type="button" class="btn btn-ghost" data-action="move-down" data-section-index="${sectionIndex}">下へ</button>
                    <button type="button" class="btn btn-danger" data-action="remove-section" data-section-index="${sectionIndex}">削除</button>
                </div>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label>layout</label>
                    <select data-section-field="layout" data-section-index="${sectionIndex}">
                        <option value="horizontal" ${section.layout === "horizontal" ? "selected" : ""}>horizontal</option>
                        <option value="vertical" ${section.layout === "vertical" ? "selected" : ""}>vertical</option>
                    </select>
                </div>

                <div class="form-group full-row">
                    <label>image</label>
                    <input type="text" value="${escapeAttr(section.image)}" data-section-field="image" data-section-index="${sectionIndex}" placeholder="blog/blog-img/your-image.webp">
                </div>

                <div class="form-group full-row">
                    <label>imageAlt</label>
                    <input type="text" value="${escapeAttr(section.imageAlt)}" data-section-field="imageAlt" data-section-index="${sectionIndex}" placeholder="画像説明（image入力時は推奨）">
                </div>

                <div class="form-group full-row">
                    <label>paragraphs</label>
                    <div class="paragraph-list">
                        ${renderParagraphEditors(section, sectionIndex)}
                    </div>
                    <div class="paragraph-actions">
                        <button type="button" class="btn btn-ghost" data-action="add-paragraph" data-section-index="${sectionIndex}">+ 段落追加</button>
                    </div>
                </div>
            </div>
        `;

        fragment.appendChild(card);
    });

    dom.sectionsContainer.innerHTML = "";
    dom.sectionsContainer.appendChild(fragment);
}

function renderParagraphEditors(section, sectionIndex) {
    return section.paragraphs.map((paragraph, paragraphIndex) => {
        return `
            <div class="paragraph-item">
                <textarea
                    class="paragraph-input"
                    rows="2"
                    data-section-index="${sectionIndex}"
                    data-paragraph-index="${paragraphIndex}"
                    placeholder="本文段落を入力"
                >${escapeHtml(paragraph)}</textarea>
                <button type="button" class="btn btn-danger" data-action="remove-paragraph" data-section-index="${sectionIndex}" data-paragraph-index="${paragraphIndex}">削除</button>
            </div>
        `;
    }).join("");
}

function renderAll() {
    renderPreview();
    renderValidation();
    updateDownloadFilename();
}

function renderPreview() {
    try {
        dom.previewBreadcrumbTitle.textContent = state.title.trim() || "記事タイトル";
        dom.previewTitle.textContent = state.title.trim() || "記事タイトル";
        dom.previewDate.innerHTML = `<i class="fa fa-calendar"></i> ${escapeHtml(state.date.trim() || "日付未入力")}`;

        dom.previewMain.innerHTML = "";

        state.sections.forEach((section) => {
            const cleanedParagraphs = normalizeParagraphs(section.paragraphs);
            if (!section.image.trim() && cleanedParagraphs.length === 0) {
                return;
            }

            const wrapper = document.createElement("div");
            const layout = ALLOWED_LAYOUTS.has(section.layout) ? section.layout : "horizontal";
            wrapper.className = `${layout}-layout`;

            const sectionElement = document.createElement("section");

            if (section.image.trim()) {
                const img = document.createElement("img");
                img.src = section.image.trim();
                img.alt = section.imageAlt.trim() || "";
                sectionElement.appendChild(img);
            }

            if (cleanedParagraphs.length > 0) {
                const paragraphWrap = document.createElement("div");
                cleanedParagraphs.forEach((paragraphText) => {
                    const p = document.createElement("p");
                    p.textContent = paragraphText;
                    paragraphWrap.appendChild(p);
                });
                sectionElement.appendChild(paragraphWrap);
            }

            wrapper.appendChild(sectionElement);
            dom.previewMain.appendChild(wrapper);
        });

        if (state.author.trim()) {
            const authorContainer = document.createElement("div");
            authorContainer.className = "author-container";
            authorContainer.innerHTML = `
                <p class="author-caption">ブログ著者</p>
                <p class="author">${escapeHtml(state.author.trim())}</p>
            `;
            dom.previewMain.appendChild(authorContainer);
        }

        if (!dom.previewMain.innerHTML.trim()) {
            dom.previewMain.innerHTML = "<p>セクション内容を入力するとここに表示されます。</p>";
        }

        document.title = `${state.title.trim() || "ブログ記事"}|神奈川工科大学EDTC`;
    } catch (error) {
        console.error("プレビュー描画エラー:", error);
        dom.previewMain.innerHTML = `
            <div class="preview-error">
                <p>⚠ プレビュー描画でエラーが発生しました。</p>
                <p>入力内容を確認して再度お試しください。</p>
            </div>
        `;
    }
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

function updateDownloadFilename() {
    const safeId = state.id.trim() || "article";
    dom.downloadFilename.textContent = `${safeId}.json`;
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

function swapSections(indexA, indexB) {
    const temp = state.sections[indexA];
    state.sections[indexA] = state.sections[indexB];
    state.sections[indexB] = temp;
}

function createEmptySection(layout) {
    return {
        layout,
        image: "",
        imageAlt: "",
        paragraphs: [""]
    };
}

function normalizeParagraphs(paragraphs) {
    if (!Array.isArray(paragraphs)) {
        return [];
    }

    return paragraphs
        .map((text) => String(text).trim())
        .filter((text) => text.length > 0);
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
