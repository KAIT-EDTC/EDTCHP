const IMAGE_DIR_PATH = "./products/img/";
// 商品画像が無い時はIMAGE_DIR_PATH + "写真の名前"をALTER_IMAGE_PATHに変更してください
const ALTER_IMAGE_PATH = "./img/EDTC-icon.webp";

// ここに商品を追加すればOK
// 未定 = to be decided
export const pdct_list = [
    {
        name: "防犯ブザー",
        headline: "本格的な機械工作体験をしてみませんか？<br>作りながら防犯ブザーの仕組みを理解しよう！",
        src: IMAGE_DIR_PATH + "buzzer.jpg",
        file: "product-buzzer.html",
        tags: ["1000円", "全年齢"],
        maker: "足立遥大"
    },
    {
        name: "ArtoRo(アトロ)",
        headline: "まるで動物のようについてくるロボット<br>仕組みから学ぶ、ロボット製作体験！",
        src: IMAGE_DIR_PATH + "ArtoRo-front.webp",
        file: "product-ArtoRo.html",
        tags: ["未定", "中学生"],
        maker: "番倉もえ"
    },
    {
        name: "LogicLineTracerV2",
        headline: "安価に短時間で作れる！<br>ロジックICを使ったライントレーサー",
        src: IMAGE_DIR_PATH + "LogicLineTracerV2.jpg",
        file: "product-LogicLineTracer.html",
        tags: ["1000円～1500円", "高校生"],
        maker: "須藤陸"
    },
    {
        name: "組み換えロボット",
        headline: "自由な発想で自分だけのロボットを作ろう！<br>組み替えて作るロボット",
        src: ALTER_IMAGE_PATH,
        file: "product-kumikaeRobot.html",
        tags: ["600円", "小学生"],
        maker: new Date().getFullYear() + 1 - 2023 + "年生"
    },
    {
        name: "ぶるぶるくん",
        headline: "虫のように振動する！？<br>モーターを使った不思議なロボット",
        src: IMAGE_DIR_PATH + "buruburu.webp",
        file: "product-buruburu.html",
        tags: ["500円", "小学生"],
        maker: "鈴木一平"
    },
    {
        name: "相撲ロボット",
        headline: "ロボットで相撲をしよう！<br>リンク機構を用いた相撲ロボット",
        src: IMAGE_DIR_PATH + "SumoRobot.webp",
        file: "product-SumoRobot.html",
        tags: ["未定", "中学生"],
        maker: "上條慶"
    },
    {
        name: "ライントレース迷路ロボット",
        headline: "ライントレースで迷路を攻略しよう！<br>自分で作った迷路をロボットが走る！",
        src: IMAGE_DIR_PATH + "MazeLineTracer.webp",
        file: "product-MazeLineTracer.html",
        tags: ["未定", "中学生"],
        maker: new Date().getFullYear() + 1 - 2023 + "年生"
    },
    {
        name: "ライントレーサー",
        headline: "ライントレースの基本を学ぼう！<br>基盤からプログラミングまで体験できる！",
        src: IMAGE_DIR_PATH + "LineTracer.webp",
        file: "product-LineTracer.html",
        tags: ["5500円", "中学生"],
        maker: "須藤陸"
    },
    // {
    //     name: "商品名",
    //     headline: "商品のキャッチコピー",
    //     src: IMAGE_DIR_PATH + "写真の名前(products/img/に入ってる写真の名前)",
    //     file: "詳細ページのファイル名(products/page/に入ってるファイル名)",
    //     tags: ["価格", "年齢層"],
    //     maker: "製作者名"
    // }
];
