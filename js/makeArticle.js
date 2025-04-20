import { content } from "./articleData.js";

const articleLoad = () => {
    const blogArea = document.getElementsByClassName("blog-area")[0];
    const ulElement = document.createElement("ul");
    ulElement.className = "blog-container";

    content.forEach((article) => {
        const boxElement = document.createElement("li");
        boxElement.className = "blog-contents";
        boxElement.setAttribute("id", article.date);

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

        ulElement.appendChild(boxElement);

        blogArea.appendChild(ulElement);
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
    articleSort();
};

const articleSort = () => {
    const ulElement = document.getElementsByClassName("blog-container")[0];

    const liArray = Array.from(ulElement.getElementsByTagName("li"));
    liArray.sort((a, b) => {
        const dateA = a.getAttribute("id");
        const dateB = b.getAttribute("id");
        return dateA < dateB ? 1 : -1;
    });
    ulElement.innerHTML = "";
    liArray.forEach(li => ulElement.appendChild(li));
};

document.addEventListener("DOMContentLoaded", () => articleLoad());
