// selectタブ
const arngmnt = document.getElementById("arrangement");
const img_path = "./../products/img/";

// ここに商品を追加すればOK
// idは今のところ使用予定なし
const pdct_list = [
    { id:1, name:"ブザー", src:"buzzer.jpg", file:"product-buzzer.html",  price:1000, maker:"足立遥大" },
    { id:2, name:"ArtoRo", src:"ArtoRo.png", file:"product-ArtoRo.html", price:"未定", maker:"番倉もえ" },
    { id:3, name:"お絵描きロボット", src:"drawRobot.jpg", file:"product-DrawRobot.html",  price:"未定", maker:"渡邉芯" },
    { id:4, name:"LogicLineTracer", src:"LogicLineTracer.jpg", file:"product-LogicLineTracerV2.html", price:"未定", maker:"須藤陸" },
    { id:5, name:"組み換えロボット", src:"KumikaeRobot.jpg", file:"product-kumikaeRobot.html", price:"未定", maker:"二年" },
    { id:6, name:"ぶるぶるくん", src:"BuruBuruKun.jpg", file:"product-buruburu.html", price:500, maker:"鈴木一平" },
    { id:7, name:"相撲ロボット", src:"SumoRobot.jpg", file:"product-SumoRobot.html", price:"未定", maker:"上條慶" },
    { id:8, name:"ライントレース迷路ロボット", src:"MazeLineTracer.jpg", file:"product-MazeLineTracer.html", price:"未定", maker:"二年" }
];

// ul内に要素を追加する関数
const pdctLoad = () => {
    const mainElement = document.getElementsByTagName("main");
    const ulElement = document.getElementById("ulsort");

    pdct_list.forEach((pdct) => {
        const boxElement = document.createElement("li");
        boxElement.className = "pdct-box";
        boxElement.setAttribute("id", pdct.price);

        const AnkerElement = document.createElement("a");
        AnkerElement.className = "pdct-anker";
        // AnkerElement.href = "./../products/page/" + pdct.file;
        AnkerElement.href = "./../products/page/comingsoon.html";

        const titleElement = document.createElement("p");
        titleElement.className = "pdct-name";
        titleElement.innerText = pdct.name;

        const imgElement = document.createElement("img")
        imgElement.className = "pdct-img";
        // imgElement.src = img_path + pdct.src;
        imgElement.alt = "商品画像はまだありません。";

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
            <li id="pdct-?" class="pdct-box">
                <a href="製品の詳細ページ"><p class="pdct-name"></p></a>
                <img src="" class="pdct-img">
                <div class="p\dct-desc">
                    <p class="pdct-price"></p>
                    <p class="pdct-maker"></p>
                </div>
            </li>
         */
        

        AnkerElement.appendChild(titleElement);
        AnkerElement.appendChild(imgElement);
        AnkerElement.appendChild(boxElementChild);
        boxElement.appendChild(AnkerElement);

        /* 
            <ul class="pdct-area">
                <li id="pdct-?" class="pdct-box">
                    <p>タイトル</p>
                    <img src="" class="pdct-img">
                    <div class="pdct-desc">
                        <p class="pdct-price"></p>
                        <p class="pdct-maker"></p>
                    </div>
                </li>
            </ul>
        */
        ulElement.appendChild(boxElement);
        
        /*
            <main>
                <ul class="pdct-area">
                    <li id="pdct-?" class="pdct-box">
                        <p>タイトル</p>
                        <img src="" class="pdct-img">
                        <div class="pdct-desc">
                            <p class="pdct-price"></p>
                            <p class="pdct-maker"></p>
                        </div>
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
    if (val == "acse") {
        liArray.sort((a, b) => a.id - b.id); // a-b>0 -> [b,a] , a-b<0 -> [a,b]
    } else if (val == "decs") {
        liArray.sort((a, b) => b.id - a.id); // b-a>0 -> [b,a] , b-a<0 -> [a,b]
    }
    // ulの中の要素を空にする
    ul.innerHtml = "";
    // ソートしたliをulに追加
    liArray.forEach(li => ul.appendChild(li));
});

// DOMが読み込まれてからpdctLoadを呼び出す
document.addEventListener("DOMContentLoaded", pdctLoad);
