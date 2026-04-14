/**
 * 画像処理モジュール
 * WEBP変換・命名規則・ZIPアーカイブ生成を担当する。
 * JSZip（CDN）に依存する。
 */

const WEBP_QUALITY = 0.8;

/**
 * 画像ファイルをWEBP形式に変換する
 * @param {File} file - 変換元の画像ファイル
 * @returns {Promise<Blob>} WEBP形式のBlob
 */
function convertToWebp(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(objectUrl);
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error("WEBP変換に失敗しました"));
                    }
                },
                "image/webp",
                WEBP_QUALITY
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("画像の読み込みに失敗しました"));
        };

        img.src = objectUrl;
    });
}

/**
 * 命名規則に従った画像ファイル名を生成する
 * @param {string} dateStr - "YYYY-MM-DD" 形式の日付
 * @param {string} eventId - イベント名（idフィールド）
 * @param {number} index - 画像番号（0=サムネイル, 1〜=セクション画像）
 * @returns {string} "yy-mm-dd-イベント名-番号.webp"
 */
function generateImageFilename(dateStr, eventId, index) {
    const parts = dateStr.split("-");
    const yy = parts[0] ? parts[0].slice(-2) : "00";
    const mm = parts[1] || "01";
    const dd = parts[2] || "01";

    const safeName = eventId.trim() || "untitled";

    return `${yy}-${mm}-${dd}-${safeName}-${index}.webp`;
}

/**
 * JSON + 画像をZIPにまとめてダウンロードする
 * @param {Object} jsonData - エクスポートJSON
 * @param {string} jsonFilename - JSONファイル名
 * @param {Array<{filename: string, blob: Blob}>} imageEntries - 変換済み画像リスト
 */
async function downloadAsZip(jsonData, jsonFilename, imageEntries) {
    const zip = new JSZip();

    const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    zip.file(jsonFilename, jsonBlob);

    imageEntries.forEach((entry) => {
        zip.file(entry.filename, entry.blob);
    });

    const rawBlob = await zip.generateAsync({ type: "blob" });
    const zipBlob = new Blob([rawBlob], { type: "application/zip" });

    const baseName = jsonFilename.replace(/\.json$/, "");
    const downloadName = `${baseName}.zip`;

    console.log("[blog-maker] zipBlob size:", zipBlob.size, "bytes");
    console.log("[blog-maker] zipBlob type:", zipBlob.type);
    console.log("[blog-maker] download filename:", downloadName);

    const url = URL.createObjectURL(zipBlob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = downloadName;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }, 10000);
}

/**
 * アップロード画像の有無を判定する
 * @returns {boolean} 1つ以上の画像ファイルがアップロードされているか
 */
function hasUploadedImages() {
    if (state.thumbnailFile) {
        return true;
    }

    return state.sections.some((section) => section.imageFile !== null);
}
