// 商品データのインポート
import { pdct_list } from "./../data/pdctData.js";

// ul内に要素を追加する関数
const pdctLoad = () => {
    const mainElement = document.getElementsByTagName("main")[0];
    const ulElement = document.getElementsByClassName("pdct-container")[0];
    const fragment = document.createDocumentFragment();

    pdct_list.forEach((pdct) => {
        const listElement = document.createElement("li");
        listElement.className = "pdct-contents";
        listElement.setAttribute("data-price", pdct.tags[0]);
        listElement.setAttribute("data-age", pdct.tags[1]);

        const AnkerElement = document.createElement("a");
        AnkerElement.href = "products/page/" + pdct.file;

        const boxElement = document.createElement("div");
        boxElement.className = "pdct-box";

        const imgElement = document.createElement("img");
        imgElement.className = "pdct-img";
        imgElement.alt = pdct.name;
        imgElement.src = pdct.src;
        imgElement.loading = "lazy";

        const boxChildElement = document.createElement("div");
        boxChildElement.className = "pdct-details";

        const titleElement = document.createElement("h2");
        titleElement.className = "pdct-name";
        titleElement.textContent = pdct.name;

        const headlineElement = document.createElement("p");
        headlineElement.className = "pdct-headline";
        headlineElement.textContent = pdct.headline || "製品の詳細はまだありません。";

        const makerElement = document.createElement("p");
        makerElement.className = "pdct-maker";
        makerElement.innerText = pdct.maker;

        const tagsContainerElement = document.createElement("ul");
        tagsContainerElement.className = "pdct-tags-container";

        pdct.tags.forEach((tag) => {
            const tagsElement = document.createElement("li");
            tagsElement.className = "pdct-tag";
            tagsElement.textContent = tag;
            tagsContainerElement.appendChild(tagsElement);
        });

        boxChildElement.appendChild(titleElement);
        boxChildElement.appendChild(headlineElement);
        boxChildElement.appendChild(makerElement);
        boxChildElement.appendChild(tagsContainerElement);

        AnkerElement.appendChild(imgElement);
        AnkerElement.appendChild(boxChildElement);
        boxElement.appendChild(AnkerElement);
        listElement.appendChild(boxElement);

        fragment.appendChild(listElement);
    });

    ulElement.appendChild(fragment);
    mainElement.appendChild(ulElement);
};

/**
 * <main>
 *  <ul class="pdct-list">
 *    <li class="pdct-contents" data-price="price" data-age="age">
 *      <div class="pdct-box">
 *        <a class="pdct-anker" href="製品の詳細ページ">
 *          <img class="pdct-img">
 *          <div class="pdct-details">
 *            <h2 class-"pdct-name"></h2>
 *            <p class="pdct-headline"></p>
 *            <span class="pdct-price"></p>
 *            <span class="pdct-maker"></p>
 *          </div>
 *          <ul class="pdct-tags-container">
 *            <li class="pdct-tag">price</li>
 *            <li class="pdct-tag">age</li>
 *          </ul>
 *        </a>
 *      </div>
 *    </li>
 *  </ul>
 * </main>
 */

document.addEventListener("DOMContentLoaded", () => pdctLoad());
