import { articleIds } from "./../../public/blog/articleData.js";
import { fetchArticle } from "./../contentApi.js";

const PAGE_SIZE = 6;
const TOTAL_PAGES = Math.ceil(articleIds.length / PAGE_SIZE);
let currentPage = 1;
// html基準のパス
const BASE_IMG_PATH = "./public/blog/img";
const ALTER_IMAGE_PATH = "./public/img/EDTC-icon.webp";

/**
 * 現在ページの記事カードをレンダリング
 */
async function articleLoad() {
    const blogArea = document.getElementsByClassName("blog-area")[0];
    blogArea.innerHTML = "";

    const offset = (currentPage - 1) * PAGE_SIZE;
    const pageIds = articleIds.slice(offset, offset + PAGE_SIZE);

    // 現在ページ分だけ並列fetch
    const articles = await Promise.all(pageIds.map((id) => fetchArticle(id)));

    const ulElement = document.createElement("ul");
    ulElement.className = "blog-container";
    const fragment = document.createDocumentFragment();

    articles.forEach((article) => {
        if (!article) return;

        const li = document.createElement("li");
        li.className = "blog-contents anim-fadein";

        const a = document.createElement("a");
        a.href = article.link;

        const divBox = document.createElement("div");
        divBox.className = "blog-box";

        const img = document.createElement("img");
        img.className = "blog-img";
        img.src = article.thumbnail ? `${BASE_IMG_PATH}/${article.thumbnail}` : ALTER_IMAGE_PATH;
        img.alt = article.title || "記事の画像";
        img.width = 640;
        img.height = 360;

        const divDetails = document.createElement("div");
        divDetails.className = "blog-details";

        const spanDate = document.createElement("span");
        spanDate.className = "blog-date";
        spanDate.textContent = `投稿日: ${article.date || ""}`;

        const h2 = document.createElement("h2");
        h2.className = "blog-subject";
        h2.textContent = article.title || "";

        const spanCaption = document.createElement("span");
        spanCaption.className = "blog-caption";
        spanCaption.textContent = article.caption || "";

        const spanAuthor = document.createElement("span");
        spanAuthor.className = "blog-author";
        spanAuthor.textContent = article.author || "";

        divDetails.appendChild(spanDate);
        divDetails.appendChild(h2);
        divDetails.appendChild(spanCaption);
        divDetails.appendChild(spanAuthor);
        divBox.appendChild(img);
        divBox.appendChild(divDetails);
        a.appendChild(divBox);
        li.appendChild(a);
        fragment.appendChild(li);
    });

    ulElement.appendChild(fragment);
    blogArea.appendChild(ulElement);
}

// 表示ページが最初、最後の場合、ボタンの表示を切り替える。
function updatePagination(prevBtn, pageLabel, nextBtn) {
    pageLabel.textContent = TOTAL_PAGES <= 1 ? "1" : `${currentPage}/${TOTAL_PAGES}`;
    prevBtn.style.display = currentPage <= 1 ? "none" : "inline-block";
    nextBtn.style.display = currentPage >= TOTAL_PAGES ? "none" : "inline-block";
}

document.addEventListener("DOMContentLoaded", () => {
    // ページネーション DOM 構築
    const paginationArea = document.getElementsByClassName("pagination-area")[0];
    if (!paginationArea) return;

    const prevBtn = document.createElement("button");
    const pageLabel = document.createElement("p");
    const nextBtn = document.createElement("button");
    prevBtn.textContent = "前へ";
    nextBtn.textContent = "次へ";
    paginationArea.appendChild(prevBtn);
    paginationArea.appendChild(pageLabel);
    paginationArea.appendChild(nextBtn);

    prevBtn.addEventListener("click", () => {
        if (currentPage <= 1) return;
        currentPage--;
        updatePagination(prevBtn, pageLabel, nextBtn);
        articleLoad();
    });

    nextBtn.addEventListener("click", () => {
        if (currentPage >= TOTAL_PAGES) return;
        currentPage++;
        updatePagination(prevBtn, pageLabel, nextBtn);
        articleLoad();
    });

    updatePagination(prevBtn, pageLabel, nextBtn);
    articleLoad();
});
