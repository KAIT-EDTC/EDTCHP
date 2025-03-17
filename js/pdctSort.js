// selectタブ
const arngmnt = document.getElementById("arrangement");
const img_path = "./../products/img/";

// ここに商品を追加すればOK
// tbd = to be decided
const pdct_list = [
    {
        name: "ブザー",
        src: "buzzer.jpg",
        file: "product-buzzer.html",
        price: 1000,
        maker: "足立遥大"
    },
    {
        name: "ArtoRo(アトロ)",
        src: "ArtoRo.png",
        file: "product-ArtoRo.html",
        price: "tbd",
        maker: "番倉もえ"
    },
    {
        name: "LogicLineTracer<br>(ロジックライントレーサー)",
        src: "LogicLineTracer.jpg",
        file: "product-LogicLineTracerV2.html",
        price: "tbd",
        maker: "須藤陸"
    },
    {
        name: "組み換えロボット",
        src: "NullPic.png",
        file: "product-kumikaeRobot.html",
        price: "tbd",
        maker: "2年"
    },
    {
        name: "ぶるぶるくん",
        src: "NullPic.png",
        file: "product-buruburu.html",
        price: 500,
        maker: "鈴木一平"
    },
    {
        name: "相撲ロボット",
        src: "SumoRobot.jpg",
        file: "product-SumoRobot.html",
        price: "tbd",
        maker: "上條慶"
    },
    {
        name: "ライントレース迷路ロボット",
        src: "MazeLineTracer.jpg",
        file: "product-MazeLineTracer.html",
        price: "tbd",
        maker: "2年"
    }
];

// ul内に要素を追加する関数
const pdctLoad = () => {
    const mainElement = document.getElementsByTagName("main")[0];
    const ulElement = document.createElement("ul");
    ulElement.className = "pdct-container";

    pdct_list.forEach((pdct) => {
        const listElement = document.createElement("li");
        listElement.className = "pdct-contents";
        listElement.setAttribute("id", pdct.price);

        const AnkerElement = document.createElement("a");
        AnkerElement.href = "./../products/page/" + pdct.file;
        // AnkerElement.href = "./../products/page/comingsoon.html";

        const boxElement = document.createElement("div");
        boxElement.className = "pdct-box";

        const imgElement = document.createElement("img")
        imgElement.className = "pdct-img";
        imgElement.src = img_path + pdct.src;
        // imgElement.alt = "商品画像はまだありません。";
        
        const boxChildElement = document.createElement("div")
        boxChildElement.className = "pdct-details";

        const titleElement = document.createElement("h2");
        titleElement.className = "pdct-name";
        titleElement.innerHTML = pdct.name;

        const paraElement = document.createElement("p");
        paraElement.className = "pdct-price";
        paraElement.innerText = (Number.isInteger(pdct.price)) ? `${pdct.price}円` : "未定";

        const paraElement2 = document.createElement("p");
        paraElement2.className = "pdct-maker";
        paraElement2.innerText = pdct.maker;

        boxChildElement.appendChild(titleElement);
        boxChildElement.appendChild(paraElement);
        boxChildElement.appendChild(paraElement2);

        boxElement.appendChild(imgElement);
        boxElement.appendChild(boxChildElement);
        AnkerElement.appendChild(boxElement);
        listElement.appendChild(AnkerElement);

        ulElement.appendChild(listElement);
        
        /**
         * <main>
         *  <ul class="pdct-list">
         *    <li id="値段が入る" class="pdct-contents">
         *      <a class="pdct-anker" href="製品の詳細ページ">
         *        <div class="pdct-box">
         *        <img class="pdct-img">
         *          <div class="pdct-desc">
         *            <h2 class-"pdct-name"></h2>
         *            <p class="pdct-price"></p>
         *            <p class="pdct-maker"></p>
         *          </div>
         *        </div>
         *      </a>
         *    </li>
         *  </ul>
         * </main>
         */
        mainElement.appendChild(ulElement);
    });
};

// プルダウンリストの選択項目が変更されたら呼び出す
// その際にプルダウンリストの項目をitemという引数として受け取る
arngmnt.addEventListener("change", (item) => {
    // プルダウンリストの選ばれた項目を取得
    const val = item.target.value;
    const ul = document.getElementsByClassName("pdct-container")[0];
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
