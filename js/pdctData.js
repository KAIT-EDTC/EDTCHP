IMAGE_DIR_PATH = "./products/img/";
ALTER_IMAGE_PATH = "./img/EDTC-icon.png";

// ここに商品を追加すればOK
// 未定 = to be decided
export const pdct_list = [
    {
        name: "ブザー",
        src: ALTER_IMAGE_PATH,
        file: "product-buzzer.html",
        tags: [1000, "全年齢"],
        maker: "足立遥大"
    },
    {
        name: "ArtoRo(アトロ)",
        src: IMAGE_DIR_PATH + "ArtoRo.png",
        file: "product-ArtoRo.html",
        tags: ["未定", "中学生"],
        maker: "番倉もえ"
    },
    {
        name: "LogicLineTracer<br>(ロジックライントレーサー)",
        src: IMAGE_DIR_PATH + "LogicLineTracer.jpg",
        file: "product-LogicLineTracer.html",
        tags: ["未定", "高校生"],
        maker: "須藤陸"
    },
    {
        name: "組み換えロボット",
        src: ALTER_IMAGE_PATH,
        file: "product-kumikaeRobot.html",
        tags: ["未定", "小学生"],
        maker: new Date().getFullYear() + 1 - 2023 + "年生"
    },
    {
        name: "ぶるぶるくん",
        src: ALTER_IMAGE_PATH,
        file: "product-buruburu.html",
        tags: [500, "小学生"],
        maker: "鈴木一平"
    },
    {
        name: "相撲ロボット",
        src: IMAGE_DIR_PATH + "SumoRobot.jpg",
        file: "product-SumoRobot.html",
        tags: ["未定", "中学生"],
        maker: "上條慶"
    },
    {
        name: "ライントレース迷路ロボット",
        src: IMAGE_DIR_PATH + "MazeLineTracer.jpg",
        file: "product-MazeLineTracer.html",
        tags: ["未定", "中学生"],
        maker: new Date().getFullYear() + 1 - 2023 + "年生"
    }
];
