import { content } from "./articleData.js";

const articleLoad = () => {
    const Archives = document.getElementsByClassName("Archives")[0];
    const ulElement = document.createElement("ul");

    content.forEach((article) => {
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
    // articleSort();
};

// const articleSort = () => {
//     const ulElement = document.getElementsByClassName("blog-container")[0];

//     const liArray = Array.from(ulElement.getElementsByTagName("li"));
//     liArray.sort((a, b) => {
//         const dateA = a.getAttribute("id");
//         const dateB = b.getAttribute("id");
//         return dateA < dateB ? 1 : -1;
//     });
//     ulElement.innerHTML = "";
//     liArray.forEach(li => ulElement.appendChild(li));
// };

document.addEventListener("DOMContentLoaded", () => articleLoad());
