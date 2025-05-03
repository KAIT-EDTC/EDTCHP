// 商品データのインポート
import { pdct_list } from "./pdctData.js";

// selectタブ
const orderByBox = document.getElementsByClassName("pdct-orderBy")[0];
const ageByBox = document.getElementsByClassName("pdct-ageBy")[0];

// ul内に要素を追加する関数
const pdctLoad = () => {
    const mainElement = document.getElementsByTagName("main")[0];
    const ulElement = document.getElementsByClassName("pdct-container")[0];

    pdct_list.forEach((pdct) => {
        const listElement = document.createElement("li");
        listElement.className = "pdct-contents";
        listElement.setAttribute("data-price", pdct.tags[0]);
        listElement.setAttribute("data-age", pdct.tags[1]);

        const AnkerElement = document.createElement("a");
        AnkerElement.href = "./../products/page/" + pdct.file;
        // AnkerElement.href = "./../products/page/comingsoon.html";

        const boxElement = document.createElement("div");
        boxElement.className = "pdct-box";

        const imgElement = document.createElement("img")
        imgElement.className = "pdct-img";
        imgElement.src = pdct.src;
        imgElement.alt = pdct.name;
        imgElement.loading = "lazy";
        // imgElement.alt = "商品画像はまだありません。";
        
        const boxChildElement = document.createElement("div")
        boxChildElement.className = "pdct-details";

        const titleElement = document.createElement("h2");
        titleElement.className = "pdct-name";
        titleElement.innerHTML = pdct.name;

        // const paraElement = document.createElement("span");
        // paraElement.className = "pdct-price";
        // paraElement.innerText = (Number.isInteger(pdct.price)) ? `${pdct.price}円` : "未定";

        const paraElement2 = document.createElement("p");
        paraElement2.className = "pdct-maker";
        paraElement2.innerText = pdct.maker;

        const tagsContainerElement = document.createElement("ul");
        tagsContainerElement.className = "pdct-tags-container";

        pdct.tags.map((tag) => {
            const tagsElement = document.createElement("li");
            tagsElement.className = "pdct-tag";
            tagsElement.innerText = tag;
            tagsContainerElement.appendChild(tagsElement);
        })

        boxChildElement.appendChild(titleElement);
        // boxChildElement.appendChild(paraElement);
        boxChildElement.appendChild(paraElement2);

        AnkerElement.appendChild(imgElement);
        AnkerElement.appendChild(boxChildElement);
        boxElement.appendChild(AnkerElement);
        boxElement.appendChild(tagsContainerElement);
        listElement.appendChild(boxElement);

        ulElement.appendChild(listElement);
        
        /**
         * <main>
         *  <ul class="pdct-list">
         *    <li id="値段が入る" class="pdct-contents">
         *      <div class="pdct-box">
         *        <a class="pdct-anker" href="製品の詳細ページ">
         *          <img class="pdct-img">
         *          <div class="pdct-details">
         *            <h2 class-"pdct-name"></h2>
         *            <span class="pdct-price"></p>
         *            <span class="pdct-maker"></p>
         *          </div>
         *        </a>
         *        <ul class="pdct-tags-container">
         *          <li class="pdct-tag">price</li>
         *          <li class="pdct-tag">age</li>
         *        </ul>
         *      </div>
         *    </li>
         *  </ul>
         * </main>
         */
        mainElement.appendChild(ulElement);
    });
};

// プルダウンリストの選択項目が変更されたら呼び出す
orderByBox.addEventListener("change", (item) => {
    // プルダウンリストの選ばれた項目を取得
    const val = item.target.value;
    const ul = document.getElementsByClassName("pdct-container")[0];
    // li内の要素をすべて取得する
    const liArray = Array.from(ul.getElementsByClassName("pdct-contents"));
    liArray.sort((a, b) => {
        const aValue = parseInt(a.getAttribute('data-price'));
        const bValue = parseInt(b.getAttribute('data-price'));

        if (isNaN(aValue) && isNaN(bValue)) return 0;
        else if (isNaN(aValue)) return 1;
        else if (isNaN(bValue)) return -1;
        else return val === 'asce' ? aValue - bValue : bValue - aValue;
    });
    // ulの中の要素を空にする
    ul.innerHTML = "";
    // ソートしたliをulに追加
    liArray.forEach(li => ul.appendChild(li));
});

ageByBox.addEventListener("change", (item) => {
    const val = item.target.value;
    const ul = document.getElementsByClassName("pdct-container")[0];
    const liArray = Array.from(ul.getElementsByClassName("pdct-contents"));
    liArray.sort((a, b) => {
        // カスタム属性であるdata-ageを取得する(data-ageがundefinedの場合は空文字を代入)
        const aValue = a.getAttribute('data-age') || "";
        const bValue = b.getAttribute('data-age') || "";

        // data-ageにプルダウンの文字列が含まれているかどうかでソートする
        if (aValue.includes(val) && bValue.includes(val)) return 0;
        else if (aValue.includes(val)) return -1;
        else if (bValue.includes(val)) return 1;
        else return 0;
    });
    ul.innerHTML = "";
    liArray.forEach(li => ul.appendChild(li));
});

// DOMが読み込まれてからpdctLoadを呼び出す
document.addEventListener("DOMContentLoaded", () => {
    pdctLoad();
});
