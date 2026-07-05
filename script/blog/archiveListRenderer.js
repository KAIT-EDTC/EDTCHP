import { articleIds } from "./../../public/blog/articleData.js";
import { fetchArticle } from "./../contentApi.js";

const DESKTOP_QUERY = "(min-width: 820px)";

function shouldLoadArchive() {
    return window.matchMedia(DESKTOP_QUERY).matches;
}

const articleLoad = async () => {
    if (!shouldLoadArchive()) return;

    const Archives = document.getElementsByClassName("Archives")[0];
    if (!Archives) return;

    // blog-post.html の data-base-path 属性からルートパスを解決
    const basePath = document.body.dataset.basePath || "./";

    // 現在表示中の記事IDを取得（サイドバーから除外するため）
    const params = new URLSearchParams(window.location.search);
    const currentId = params.get("id");

    // 現在記事を除いた先頭5件を並列fetch
    const targetIds = articleIds
        .filter((id) => id !== currentId)
        .slice(0, 5);

    const articles = await Promise.all(
        targetIds.map((id) => fetchArticle(id, basePath))
    );

    // DOM 構築
    const ulElement = document.createElement("ul");
    const fragment = document.createDocumentFragment();

    articles.forEach((article) => {
        if (!article) return;

        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = article.link;

        const span = document.createElement("span");
        span.className = "archives-note";
        span.title = article.title || ""; // ツールチップ用
        span.textContent = article.title || "";

        a.appendChild(span);
        li.appendChild(a);
        fragment.appendChild(li);
    });

    ulElement.appendChild(fragment);
    Archives.appendChild(ulElement);
};

function scheduleArchiveLoad() {
    const run = () => {
        articleLoad().catch((error) => {
            console.error("Archive load error:", error);
        });
    };

    if ("requestIdleCallback" in window) {
        window.requestIdleCallback(run, { timeout: 1500 });
        return;
    }

    window.setTimeout(run, 300);
}

if (document.readyState === "complete") {
    if (shouldLoadArchive()) {
        scheduleArchiveLoad();
    }
} else {
    window.addEventListener("load", () => {
        if (shouldLoadArchive()) {
            scheduleArchiveLoad();
        }
    }, { once: true });
}
