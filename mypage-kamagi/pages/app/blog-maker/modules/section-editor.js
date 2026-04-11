/**
 * セクション編集UIモジュール
 * セクションエディタのDOM生成とイベント処理を担当する。
 * グローバルの state, dom を参照する。
 */

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
