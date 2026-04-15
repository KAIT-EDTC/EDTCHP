/**
 * プレビュー描画モジュール
 * 記事の状態をもとにライブプレビューをDOM上に描画する。
 * グローバルの state, dom を参照する。
 */
function renderPreview() {
    try {
        dom.previewBreadcrumbTitle.textContent = state.title.trim() || "記事タイトル";
        dom.previewTitle.textContent = state.title.trim() || "記事タイトル";
        dom.previewDate.innerHTML = `<i class="fa fa-calendar"></i> ${escapeHtml(state.date.trim() || "日付未入力")}`;

        dom.previewMain.innerHTML = "";

        state.sections.forEach((section) => {
            const cleanedParagraphs = normalizeParagraphs(section.paragraphs);
            if (!section.imagePreviewUrl && cleanedParagraphs.length === 0) {
                return;
            }

            const wrapper = document.createElement("div");
            const layout = ALLOWED_LAYOUTS.has(section.layout) ? section.layout : "horizontal";
            wrapper.className = `${layout}-layout`;

            const sectionElement = document.createElement("section");

            if (section.imagePreviewUrl) {
                const img = document.createElement("img");
                img.src = section.imagePreviewUrl;
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
