const content = [
    {
        date: "2024-06-22",
        title: "第五回遊行塾に行ってきました",
        img: "blog/blog-img/24-0622-yugyou1.jpg",
        caption: "前期最終回となる遊行塾でしたが、楽しく学べる授業を提供できたと思います。\
                当サイト初のブログになりますので至らぬ点もあるかと思いますが読んでいただけたら幸いです。",
        author: "山口",
        link: "blog/blog-data/yugyou5-blog.html"
    },
    { 
        date: "2024-06-29", 
        title: "神奈川工科大学見学体験ツアーを行いました", 
        img: "blog/blog-img/24-0629-asahi1.png", 
        caption: "本年度二回目となるあさひ学苑さんとのイベントを行いました。\
                今回も弊学に来ていただき学内を探索したり工房にて缶バッチ制作をしていただきました", 
        author: "山口", 
        link: "blog/blog-data/asahi.blog.html" 
    },
    { 
        date: "2024-07-11", 
        title: "地域連携サークル交流会に参加しました", 
        img: "blog/blog-img/24-0711-kouryu.jpg", 
        caption: "今回はKAIT内部のサークルの集い地域連携サークル交流会にご招待いただいたので参加してきました。", 
        author: "山口", 
        link: "blog/blog-data/kouryukai.html" 
    },
    { 
        date: "2024-09-28", 
        title: "第六回遊行塾に行ってきました", 
        img: "blog/blog-img/24-0928-yugyou6.jpg", 
        caption: "嶺学園藤沢中学校に第六回遊行塾を実施しました。後期始めにふさわしい快調なスタートを切ることが出来ました", 
        author: "根本", 
        link: "blog/blog-data/yugyou6-blog.html" 
    },
    // { date: "2024-10-28", title: "test", img: "blog/blog-img/24-0928-yugyou6.jpg", caption: "記事の概略", author: "根本", link: "blog/blog-data/yugyou6-blog.html" },
];

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

document.addEventListener("DOMContentLoaded", articleLoad());
