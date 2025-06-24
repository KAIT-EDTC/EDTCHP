import { content } from "./../data/articleData.js";
const PAGE_SIZE = 6;
let offset = 0;
let currentPage = 1;
const endPage = Math.ceil(content.length / PAGE_SIZE);

const articleLoad = () => {
    offset = (currentPage - 1) * PAGE_SIZE;
    const blogArea = document.getElementsByClassName("blog-area")[0];
    const ulElement = document.createElement("ul");
    blogArea.innerHTML = "";
    const fragment = document.createDocumentFragment();
    ulElement.className = "blog-container";
    const sorted_content = content.sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted_content.slice(offset, PAGE_SIZE + offset).forEach((article) => {
        const boxElement = document.createElement("li");
        boxElement.className = "blog-contents anim-fadein";

        const AnkerElement = document.createElement("a");
        AnkerElement.href = article.link;

        const divElement = document.createElement("div");
        divElement.className = "blog-box";

        const imgElement = document.createElement("img");
        imgElement.className = "blog-img";
        imgElement.src = article.img;
        
        const detailsElement = document.createElement("div");
        detailsElement.className = "blog-details";

        const dateElement = document.createElement("span");
        dateElement.className = "blog-date";
        dateElement.innerHTML = '<i class="fa-regular fa-clock"></i>' + article.date;

        const titleElement = document.createElement("h2");
        titleElement.className = "blog-subject";
        titleElement.innerText = article.title;

        const captionElement = document.createElement("span");
        captionElement.className = "blog-caption";
        captionElement.innerHTML = article.caption;

        const authorElement = document.createElement("span");
        authorElement.className = "blog-author";
        authorElement.innerText = article.author;

        detailsElement.appendChild(dateElement);
        detailsElement.appendChild(titleElement);
        detailsElement.appendChild(captionElement);
        detailsElement.appendChild(authorElement);
        divElement.appendChild(imgElement);
        divElement.appendChild(detailsElement);

        AnkerElement.appendChild(divElement);

        boxElement.appendChild(AnkerElement);

        fragment.appendChild(boxElement);
        /**
         * <ul class="blog-list">
         *   <li class="blog-contents">
         *    <a>
         *     <div class="blog-box">
         *      <img class="blog-img">
         *      <div class="blog-details">
         *        <span class="blog-date"></p>
         *        <h2 class="blog-subject">/h2>
         *        <span class="blog-caption"></p>
         *        <span class="blog-author"></p>
         *      </div>
         *     </div>
         *    </a>
         *   </li>
         * </ul>
        */
    });
    ulElement.appendChild(fragment);
    blogArea.appendChild(ulElement);
};

const paginationArea = document.getElementsByClassName("pagination-area")[0];
const prevBtn = document.createElement("button");
const PageLabel = document.createElement("p");
const nextBtn = document.createElement("button");
prevBtn.innerHTML = '<i class="fa fa-chevron-left" aria-hidden="true"></i>';
nextBtn.innerHTML = '<i class="fa fa-chevron-right" aria-hidden="true"></i>';
paginationArea.appendChild(prevBtn);
paginationArea.appendChild(PageLabel);
paginationArea.appendChild(nextBtn);

const Pagination = () => {
    // endPageが1のとき
    if (endPage == 1) {
        PageLabel.textContent = "1";
    }

    // endPageが2以上のとき
    if (endPage > 1) {        
        PageLabel.textContent = currentPage + "/" + endPage;

    }
};

prevBtn.addEventListener("click", () => {
    if (currentPage - 1 <= 0) return;
    currentPage--;
    Pagination();
    articleLoad();
})

nextBtn.addEventListener("click", () => {
    if (currentPage == endPage) return;
    currentPage++;
    Pagination();
    articleLoad();
})

document.addEventListener("DOMContentLoaded", () => {
    articleLoad();
    Pagination();
});
