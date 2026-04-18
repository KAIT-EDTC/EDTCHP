/**
 * セクションレンダリング共通ユーティリティ
 *
 * ブログ記事・プロダクト詳細ページで共通の
 * セクション（メディア＋テキスト段落）をDOMに変換する。
 */

const BASE_IMG_PATH = "./public/blog/img";

/**
 * メディア要素を生成する
 * @param {Object} media - mediaオブジェクト { type, src, alt }
 * @returns {HTMLElement|null}
 */
function renderMedia(media) {
    if (!media || !media.src) return null;

    switch (media.type) {
        case 'youtube': {
            const wrapper = document.createElement('div');
            wrapper.className = 'media-embed';
            const iframe = document.createElement('iframe');
            iframe.src = media.src;
            iframe.title = media.alt || '';
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('loading', 'lazy');
            wrapper.appendChild(iframe);
            return wrapper;
        }
        case 'embed': {
            const wrapper = document.createElement('div');
            wrapper.className = 'media-embed';
            const iframe = document.createElement('iframe');
            iframe.src = media.src;
            iframe.title = media.alt || '';
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('loading', 'lazy');
            wrapper.appendChild(iframe);
            return wrapper;
        }
        case 'image':
        default: {
            const img = document.createElement('img');
            img.src = `${BASE_IMG_PATH}/${media.src}`;
            img.alt = media.alt || '';
            img.loading = 'lazy';
            img.decoding = 'async';
            return img;
        }
    }
}

/**
 * セクション1件をDOM要素に変換する
 * @param {Object} section
 * @param {string} [section.layout]       - "horizontal" または "vertical"（未指定時は "horizontal"）
 * @param {Object} [section.media]        - メディアオブジェクト { type, src, alt }
 * @param {string} [section.image]        - 画像パス（後方互換: mediaがない場合に使用）
 * @param {string} [section.imageAlt]     - 画像alt属性（後方互換）
 * @param {string[]} [section.paragraphs] - テキスト段落の配列
 * @returns {HTMLDivElement}
 */
export function renderSection(section) {
    const layout = section.layout || 'horizontal';
    const layoutDiv = document.createElement('div');
    layoutDiv.className = `${layout}-layout`;

    const sectionEl = document.createElement('section');

    // メディア（新形式: media オブジェクト）
    if (section.media) {
        const mediaEl = renderMedia(section.media);
        if (mediaEl) sectionEl.appendChild(mediaEl);
    }
    // 後方互換: 直接 image 指定（ブログ既存JSON）
    else if (section.image) {
        const img = document.createElement('img');
        img.src = `${BASE_IMG_PATH}/${section.image}`;
        img.alt = section.imageAlt || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        sectionEl.appendChild(img);
    }

    // テキスト段落
    if (section.paragraphs && section.paragraphs.length > 0) {
        const textDiv = document.createElement('div');
        section.paragraphs.forEach(text => {
            const p = document.createElement('p');
            // '\n'を<br>に変換して段落内で改行を作成する
            text.split('\n').forEach((line, i, arr) => {
                p.appendChild(document.createTextNode(line));
                if (i < arr.length - 1) p.appendChild(document.createElement('br'));
            });
            textDiv.appendChild(p);
        });
        sectionEl.appendChild(textDiv);
    }

    layoutDiv.appendChild(sectionEl);
    return layoutDiv;
}
