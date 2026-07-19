/**
 * ホームページ NEWS セクション レンダラー
 *
 * .news ul にブログ最新記事 5 件を動的に挿入する。
 * dateで降順ソートする。
 */

// TODO: ソートが色んなスクリプトに散らばってるので一つのロジックにまとめたい。

import { articleIds } from '../public/blog/articleData.js';
import { fetchArticle } from './contentApi.js';

const newsList = document.querySelector('.news ul');
if (newsList) {
    Promise.all(articleIds.map((id) => fetchArticle(id)))
        .then((articles) => {
            articles
                .filter(Boolean)
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 5)
                .forEach((article) => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = article.link;
                    a.textContent = `${article.date} ${article.title}`;
                    li.appendChild(a);
                    newsList.appendChild(li);
                });
        });
}