const content = [
    { date: "2024-06-22", title: "第五回遊行塾に行ってきました", img: "blog/blog-img/24-0622-yugyou1.jpg", caption: "記事の概略", author: "山口", link: "blog/blog-data/yugyou5-blog.html" },
    { date: "2024-06-29", title: "神奈川工科大学見学体験ツアーを行いました", img: "blog/blog-img/24-0629-asahi1.png", caption: "記事の概略", author: "山口", link: "blog/blog-data/asahi.blog.html" },
    { date: "2024-07-11", title: "地域連携サークル交流会に参加しました", img: "blog/blog-img/24-0711-kouryu.jpg", caption: "記事の概略", author: "山口", link: "blog/blog-data/kouryukai.html" },
    { date: "2024-09-28", title: "第六回遊行塾に行ってきました", img: "blog/blog-img/24-0928-yugyou6.jpg", caption: "記事の概略", author: "根本", link: "blog/blog-data/yugyou6-blog.html" },
    { date: "2024-10-28", title: "test", img: "blog/blog-img/24-0928-yugyou6.jpg", caption: "記事の概略", author: "根本", link: "blog/blog-data/yugyou6-blog.html" },
];

const articleLoad = () => {
    const blogArea = document.getElementsByClassName("blog-area")[0];
    const ulElement = document.createElement("ul");
    ulElement.className = "blog-list";

    content.forEach((article) => {
        const boxElement = document.createElement("li");
        boxElement.className = "blog-box";
        boxElement.setAttribute("id", article.date);

        const AnkerElement = document.createElement("a");
        AnkerElement.href = article.link;

        const figElement = document.createElement("figure");

        const imgElement = document.createElement("img");
        imgElement.className = "blog-img";
        imgElement.src = article.img;
        
        const imgCaptionElement = document.createElement("figcaption");
        imgCaptionElement.className = "blog-img-caption";

        const dateElement = document.createElement("p");
        dateElement.className = "blog-date";
        dateElement.innerText = article.date;

        const titleElement = document.createElement("h2");
        titleElement.className = "blog-subject";
        titleElement.innerText = article.title;

        const captionElement = document.createElement("p");
        captionElement.className = "blog-caption";
        captionElement.innerText = article.caption;

        const authorElement = document.createElement("p");
        authorElement.className = "blog-author";
        authorElement.innerText = article.author;

        imgCaptionElement.appendChild(dateElement);
        imgCaptionElement.appendChild(titleElement);
        imgCaptionElement.appendChild(captionElement);
        imgCaptionElement.appendChild(authorElement);
        figElement.appendChild(imgElement);
        figElement.appendChild(imgCaptionElement);

        AnkerElement.appendChild(figElement);

        boxElement.appendChild(AnkerElement);

        ulElement.appendChild(boxElement);

        blogArea.appendChild(ulElement);
        /**
         * <ul class="blog-list">
         *   <li class="blog-box">
         *    <a>
         *     <figure>
         *      <img class="blog-img">
         *      <figcaption class="blog-img-caption">
         *          <p class="blog-date"></p>
         *          <h2 class="blog-subject">/h2>
         *          <p class="blog-caption"></p>
         *          <p class="blog-author"></p>
         *      </figcaption>
         *     </figure>
         *    </a>
         *   </li>
         * </ul>
         */
    });
    articleSort();
};

const articleSort = () => {
    const ulElement = document.getElementsByClassName("blog-list")[0];

    const liArray = Array.from(ulElement.getElementsByTagName("li"));
    liArray.sort((a, b) => {
        const dateA = a.getAttribute("id");
        const dateB = b.getAttribute("id");
        return dateA < dateB ? 1 : -1;
    });
    ulElement.innerHTML = "";
    liArray.forEach(li => ulElement.appendChild(li));
};

document.addEventListener("DOMContentLoaded", articleLoad());
