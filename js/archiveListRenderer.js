import { content } from "./../data/articleData.js";

const articleLoad = () => {
    const Archives = document.getElementsByClassName("Archives")[0];
    const ulElement = document.createElement("ul");
    const fragment = document.createDocumentFragment();

    console.log(content);

    // アーカイブが重複しないように、該当の記事を削除する
    const filtered_content = content.filter((article) => 
        !(document.getElementsByClassName("blog-title")[0].textContent == article.title)
    );

    filtered_content.sort((a, b) => new Date(b.date) - new Date(a.date));
    const sliced_content = filtered_content.slice(0, 5);

    sliced_content.forEach((article) => {
        console.log(article);
        const boxElement = document.createElement("li");

        const AnkerElement = document.createElement("a");
        article.link = article.link.replace(/blog\/blog-data/, ".");
        AnkerElement.href = article.link;

        const titleElement = document.createElement("span");
        titleElement.className = "archives-note";
        titleElement.title = article.title;
        titleElement.innerHTML = article.title;

        AnkerElement.appendChild(titleElement);
        boxElement.appendChild(AnkerElement);

        fragment.appendChild(boxElement);

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
    ulElement.appendChild(fragment);
    Archives.appendChild(ulElement);
};

document.addEventListener("DOMContentLoaded", () => articleLoad());
