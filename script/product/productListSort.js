// selectタブ
const orderByBox = document.getElementsByClassName("pdct-orderBy")[0];
const ageByBox = document.getElementsByClassName("pdct-ageBy")[0];

// プルダウンリストの選択項目が変更されたら呼び出す
orderByBox.addEventListener("change", (item) => {
    // プルダウンリストの選ばれた項目を取得
    const val = item.target.value;
    const ul = document.getElementsByClassName("pdct-container")[0];
    // li内の要素をすべて取得する
    const liArray = Array.from(ul.getElementsByClassName("pdct-contents"));
    liArray.sort((a, b) => {
        const priceTextA = a.getAttribute('data-price');
        const priceTextB = b.getAttribute('data-price');
        // 「～」を含む場合は高い値段の方を取得する
        const priceA = parseInt(priceTextA.match(/～\s*(\d+)円/)?.[1] || priceTextA.match(/\d+(?=円)/)?.[0]);
        const priceB = parseInt(priceTextB.match(/～\s*(\d+)円/)?.[1] || priceTextB.match(/\d+(?=円)/)?.[0]);

        if (isNaN(priceA) && isNaN(priceB)) return 0;
        else if (isNaN(priceA)) return 1;
        else if (isNaN(priceB)) return -1;
        else return val === 'asce' ? priceA - priceB : priceB - priceA;
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
