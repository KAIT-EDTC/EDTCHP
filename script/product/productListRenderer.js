// 商品データのインポート
import { productIds } from "./../../public/product/pdctData.js";
import { fetchProduct } from "./../contentApi.js";

const ALTER_IMAGE_PATH = "./public/img/EDTC-icon.webp";
const BASE_IMG_PATH = "./public/product/img";

// ul内に要素を追加する関数
const pdctLoad = async () => {
    const mainElement = document.getElementsByTagName("main")[0];
    const ulElement = document.getElementsByClassName("pdct-container")[0];

    // 全プロダクトを並列fetch
    const products = await Promise.all(
        productIds.map((id) => fetchProduct(id))
    );

    const fragment = document.createDocumentFragment();

    products.forEach((pdct) => {
        if (!pdct) return;

        const listElement = document.createElement("li");
        listElement.className = "pdct-contents anim-fadein";
        listElement.setAttribute("data-price", pdct.tags[0] || "");
        listElement.setAttribute("data-age", pdct.tags[1] || "");

        const AnkerElement = document.createElement("a");
        AnkerElement.href = pdct.link;

        const boxElement = document.createElement("div");
        boxElement.className = "pdct-box";

        const imgElement = document.createElement("img");
        imgElement.className = "pdct-img";
        imgElement.src = pdct.thumbnail ? `${BASE_IMG_PATH}/${pdct.thumbnail}` : ALTER_IMAGE_PATH;
        imgElement.alt = pdct.title || "製品の画像";
        imgElement.width = 640;
        imgElement.height = 360;

        const boxChildElement = document.createElement("div");
        boxChildElement.className = "pdct-details";

        const titleElement = document.createElement("h2");
        titleElement.className = "pdct-name";
        titleElement.textContent = pdct.title || "";

        const headlineElement = document.createElement("p");
        headlineElement.className = "pdct-headline";
        headlineElement.textContent = pdct.headline || "製品の詳細はまだありません。";

        const viewmoreElement = document.createElement("p");
        viewmoreElement.className = "viewmore";
        viewmoreElement.textContent = "View More ";

        const tagsContainerElement = document.createElement("ul");
        tagsContainerElement.className = "pdct-tags-container";

        if (pdct.tags) {
            pdct.tags.forEach((tag) => {
                const tagsElement = document.createElement("li");
                tagsElement.className = "pdct-tag";
                tagsElement.textContent = tag;
                tagsContainerElement.appendChild(tagsElement);
            });
        }

        boxChildElement.appendChild(tagsContainerElement);
        boxChildElement.appendChild(titleElement);
        boxChildElement.appendChild(headlineElement);
        boxChildElement.appendChild(viewmoreElement);

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
