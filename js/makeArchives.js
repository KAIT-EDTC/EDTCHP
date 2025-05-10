import { content } from "./../data/articleData.js";

const articleLoad = () => {
    const Archives = document.getElementsByClassName("Archives")[0];
    const ulElement = document.createElement("ul");

    // アーカイブが重複しないように、該当の記事を削除する
    const filtered_content = content.filter((article) => 
        !(document.getElementsByClassName("blog-title")[0].textContent == article.title)
    );

    filtered_content.forEach((article) => {
        const boxElement = document.createElement("li");

        const AnkerElement = document.createElement("a");
        article.link = article.link.replace(/blog\/blog-data/, ".");
        AnkerElement.href = article.link;

        const titleElement = document.createElement("span");
        titleElement.className = "archives-note";
        titleElement.innerHTML = article.title;

        AnkerElement.appendChild(titleElement);
        boxElement.appendChild(AnkerElement);

        ulElement.appendChild(boxElement);

        Archives.appendChild(ulElement);
        /**
         * <ul>
         *   <li>
         *    <a>
         *      <span class="archives-note"></p>
         *    </a>
         *   </li>
         * </ul>
         */
    });
};

document.addEventListener("DOMContentLoaded", () => articleLoad());
