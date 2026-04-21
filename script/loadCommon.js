/**
 * 共通ヘッダー・フッターを動的に生成・挿入するモジュール
 *
 * 使い方:
 *   <body data-base-path="./">
 *     <div id="common-header"></div>
 *     <!-- ページ固有のコンテンツ -->
 *     <div id="common-footer"></div>
 *     <script type="module" src="./js/loadCommon.js"></script>
 *   </body>
 *
 * data-base-path: ルートディレクトリへの相対パス
 *   ルート直下のページ → "./"
 *   blog/blog-data/ 配下のページ → "./../../"
 */

function getBasePath() {
  return document.body.dataset.basePath || "./";
}

function renderHeader(basePath) {
  return `
    <header>
        <a href="${basePath}base.html"><img src="${basePath}public/img/EDTC-icon.webp" alt="EDTC"
                style="display: block; height: 60px; width: auto;"></a>
        <a href="${basePath}base.html" class="title">EDTC</a>
        <!--==========モバイルのみ表示==========-->
        <nav class="sp-only">
            <div class="gnav-toggle">
                <input id="gnav-input" type="checkbox" class="gnav-hidden">
                <label id="gnav-open" for="gnav-input"><span></span></label>
                <label class="gnav-unshown" id="gnav-close" for="gnav-input"></label>
                <div id="gnav-content">
                    <ul class="gnav-menu">
                        <li class="gnav-item"><a href="${basePath}base.html">Home<br>ホーム</a></li>
                        <li class="gnav-item"><a href="${basePath}blog.html">Blog<br>ブログ</a></li>
                        <li class="gnav-item"><a href="${basePath}product-top.html">Product<br>プロダクト</a></li>
                        <li class="gnav-item"><a href="${basePath}achievements.html">Achievements<br>実績</a></li>
                        <li class="gnav-item"><a href="${basePath}contact-us.html">Contact<br>お問い合わせ</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <!--==========PCのみ表示==========-->
        <nav class="pc-only">
            <ul>
                <li class="gnav-sec"><a href="${basePath}base.html"><span>Home</span><br>ホーム</a></li>
                <li class="gnav-sec"><a href="${basePath}blog.html"><span>Blog</span><br>ブログ</a></li>
                <li class="gnav-sec"><a href="${basePath}product-top.html"><span>Product</span><br>プロダクト</a></li>
                <li class="gnav-sec"><a href="${basePath}achievements.html"><span>Achievements</span><br>実績</a></li>
                <li class="gnav-sec"><a href="${basePath}contact-us.html"><span>Contact</span><br>お問い合わせ</a></li>
                <div class="sns_button twitter">
                    <a href="https://x.com/kait_edtc" title="Tweet"><i class="fa fa-twitter"></i></a>
                </div>
                <div class="sns_button instagram">
                    <a href="https://www.instagram.com/kait.edtc/" title="instagram"><i class="fa fa-instagram"></i></a>
                </div>
            </ul>
        </nav>
    </header>`;
}

function renderFooter(basePath) {
  return `
    <footer>
        <div class="flex">
            <ul class="footer-list">
                <li style="text-align: center;">
                    <p class="gyou-a"></p>
                    <a href="${basePath}base.html">ホーム　</a>
                    <a href="${basePath}blog.html">ブログ　</a>
                    <a href="${basePath}product-top.html">プロダクト</a>
                    <a href="${basePath}achievements.html">実績</a>
                    <hr size="100%">
                </li>
                <li style="text-align: center;">
                    <a href="${basePath}contact-us.html">お問い合わせ</a>
                    <hr size="100%">
                    <p class="gyou"></p>
                    <b><img src="${basePath}public/img/EDTC-icon.webp" alt="EDTCロゴ" height="50px" width="auto" class="syasinn">
                        <font size="12">EDTC</font>
                    </b>
                    <p class="gyou"></p>
                    <p>
                        <font size="3">学校法人 幾徳学園　神奈川工科大学<br>mail :kait.edtc@gmail.com</font>
                    </p>
                    <p class="gyou-b"></p>
                    <p>©　2024　KAIT　EDTC　All Rights Reserved</p>
                </li>
            </ul>
        </div>
    </footer>`;
}

function initCommon() {
  const basePath = getBasePath();

  const headerEl = document.getElementById("common-header");
  if (headerEl) {
    headerEl.outerHTML = renderHeader(basePath);
  }

  const footerEl = document.getElementById("common-footer");
  if (footerEl) {
    footerEl.outerHTML = renderFooter(basePath);
  }
}

// ES modules are deferred — DOM is parsed when this runs
document.addEventListener("DOMContentLoaded", initCommon);

export { renderHeader, renderFooter, initCommon };
