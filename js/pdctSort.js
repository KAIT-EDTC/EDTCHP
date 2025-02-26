// selectタブ
const arngmnt = document.getElementById("arrangement");
const img_path = "./../products/img/";

// ここに商品を追加すればOK
// tbd = to be decided
const pdct_list = [
    { name:"ブザー", src:"buzzer.jpg", file:"product-buzzer.html",  price:1000, maker:"足立遥大" },
    { name:"ArtoRo(アトロ)", src:"ArtoRo.png", file:"product-ArtoRo.html", price:"tbd", maker:"番倉もえ" },
    // { name:"お絵描きロボット", src:"drawRobot.jpg", file:"product-DrawRobot.html",  price:"tbd", maker:"渡邉芯" },
    { name:"LogicLineTracer(ロジックライントレーサー)", src:"NullPic.png", file:"product-LogicLineTracerV2.html", price:"tbd", maker:"須藤陸" },
    { name:"組み換えロボット", src:"NullPic.png", file:"product-kumikaeRobot.html", price:"tbd", maker:"二年" },
    { name:"ぶるぶるくん", src:"NullPic.png", file:"product-buruburu.html", price:500, maker:"鈴木一平" },
    { name:"相撲ロボット", src:"SumoRobot.jpg", file:"product-SumoRobot.html", price:"tbd", maker:"上條慶" },
    { name:"ライントレース迷路ロボット", src:"MazeLineTracer.jpg", file:"product-MazeLineTracer.html", price:"tbd", maker:"二年" }
];

// ul内に要素を追加する関数
const pdctLoad = () => {
    const mainElement = document.getElementsByTagName("main");
    const ulElement = document.getElementById("ulsort");

    pdct_list.forEach((pdct) => {
        const AnkerElement = document.createElement("a");
        AnkerElement.className = "pdct-anker";
        AnkerElement.href = "./../products/page/" + pdct.file;
        // AnkerElement.href = "./../products/page/comingsoon.html";

        const boxElement = document.createElement("div");
        boxElement.className = "pdct-box";

        const listElement = document.createElement("li");
        listElement.setAttribute("id", pdct.price);
        
        const titleElement = document.createElement("p");
        titleElement.className = "pdct-name";
        titleElement.innerText = pdct.name;

        const imgElement = document.createElement("img")
        imgElement.className = "pdct-img";
        imgElement.src = img_path + pdct.src;
        // imgElement.alt = "商品画像はまだありません。";

        const boxElementChild = document.createElement("div")
        boxElementChild.className = "pdct-desc";

        const paraElement = document.createElement("p");
        paraElement.className = "pdct-price";
        paraElement.innerText = (Number.isInteger(pdct.price)) ? `値段：${pdct.price}円` : "値段：未定";

        const paraElement2 = document.createElement("p");
        paraElement2.className = "pdct-maker";
        paraElement2.innerText = `製作者：${pdct.maker}`;

        /*
            <div class="pdct-desc">
                <p class="pdct-price"></p>
                <p class="pdct-maker"></p>
            </div>
        */
        boxElementChild.appendChild(paraElement);
        boxElementChild.appendChild(paraElement2);

        /*
            <li id="pdct-?">
                <a href="製品の詳細ページ">
                    <div class="pdct-box">
                        <p class="pdct-name"></p>
                        <img src="" class="pdct-img">
                        <div class="p\dct-desc">
                            <p class="pdct-price"></p>
                            <p class="pdct-maker"></p>
                        </div>
                    </div>
                </a>
            </li>
         */
        boxElement.appendChild(titleElement);
        boxElement.appendChild(imgElement);
        boxElement.appendChild(boxElementChild);
        AnkerElement.appendChild(boxElement);
        listElement.appendChild(AnkerElement);

        /* 
            <ul class="pdct-area">
                <li id="pdct-?">
                    <a href="製品の詳細ページ">
                        <div class="pdct-box">
                            <p class="pdct-name"></p>
                            <img src="" class="pdct-img">
                            <div class="p\dct-desc">
                                <p class="pdct-price"></p>
                                <p class="pdct-maker"></p>
                            </div>
                        </div>
                    </a>
                </li>
            </ul>
        */
        ulElement.appendChild(listElement);
        
        /*
            <main>
                <ul class="pdct-area">
                    <li id="pdct-?">
                        <a href="製品の詳細ページ">
                            <div class="pdct-box">
                                <p class="pdct-name"></p>
                                <img src="" class="pdct-img">
                                <div class="p\dct-desc">
                                    <p class="pdct-price"></p>
                                    <p class="pdct-maker"></p>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </main>
         */
        mainElement[0].appendChild(ulElement);
    });
};

// プルダウンリストの選択項目が変更されたら呼び出す
// その際にプルダウンリストの項目をitemという引数として受け取る
arngmnt.addEventListener("change", (item) => {
    // プルダウンリストの選ばれた項目を取得
    const val = item.target.value;
    const ul = document.getElementById("ulsort");
    // li内の要素をすべて取得する
    const liArray = Array.from(ul.getElementsByTagName("li"));
    liArray.sort((a, b) => {
        aId = parseInt(a.id);
        bId = parseInt(b.id);

        if (isNaN(aId) && isNaN(bId)) return 0;
        else if (isNaN(aId)) return 1;
        else if (isNaN(bId)) return -1;
        else return val == 'asce' ? aId - bId : bId - aId;
    });
    // ulの中の要素を空にする
    ul.innerHtml = "";
    // ソートしたliをulに追加
    liArray.forEach(li => ul.appendChild(li));
});

// DOMが読み込まれてからpdctLoadを呼び出す
document.addEventListener("DOMContentLoaded", pdctLoad());
