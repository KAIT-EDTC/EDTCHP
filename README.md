# EDTCHP

団体のホームページ。  
ブログや製品の紹介を行う。

また、メンバー専用のマイページも作成中

## 環境構築

### Gitのダウンロード & インストール

   まずGitを[ダウンロード](https://git-scm.com/downloads/win)してください。  
   インストール手順は全部nextを押せばOKです。  
   GitをインストールしたらGit Bashを起動して、下記のコマンドを入力してください。

   > [!TIP]
   > Githubのアカウントがある場合は、同じものを使うと良いです。

   ```powershell
   git config --global user.name "任意の名前を入力"  
   git config --global user.email "自分のメアド入力"  
   ```  

   これで、Gitのコマンドが使えるようになるはずです。

### ローカルリポジトリを作成(リモートからクローンする)

   リポジトリを作成したいディレクトリに移動して、下記のコマンドを入力してください。  

   ```powershell
   git clone https://github.com/fami-gb/EDTCHP.git  
   ```  

   これで、EDTCHPというディレクトリが生成されるはずです。

### 環境変数の設定

   > [!TIP]
   > 機密情報を裸の状態のままgitで管理してしまうと、第三者にDBの情報やGoogleのCredentialを開示することになってしまいます。また本番環境と開発環境でDB等の設定を変更するのはとても面倒です。  
   > そうしたことを防ぐために`.env`で機密情報を環境変数として管理します。`.env`を`.gitignore`に追加することでgitの追跡対象外とすることが出来るので、gitにプッシュしてしまうのを防げます。  

   `.env.example`は`.env`の変数名だけを取り出したファイルです。  
   環境変数を設定するためにまず、`.env.example`をコピーして`.env`にリネームしてください。  
   今の`.env`は変数名しかないので、値をそれぞれ設定する必要があります。  
   この値については、現在 @fami-gb が保持しているので、お手数ですが都度DMにてやり取りをします。

### Dockerを使って環境構築

   Dockerを使うためには、まず`Docker Desktop`をインストールする必要があります。  
   [ここ](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-win-amd64&_gl=1*1bie0kg*_gcl_au*MTc5NTcyMzc0OS4xNzcwMTQ2NDk2*_ga*MjQ2NTkzNDAuMTc3MDE0NjQ5Ng..*_ga_XJWPQMJYHQ*czE3NzAxNDY0OTYkbzEkZzEkdDE3NzAxNDY1MDYkajUwJGwwJGgw)からダウンロードし、インストールをしてください(サインインなどは一切する必要はありません。)

   > [!NOTE]
   > Docker Desktopは起動した状態にしておいてください。

   VSCodeでEDTCHPを開いたら、`Ctrl+J`でターミナルを起動し下記のコマンドを実行します。

   ```powershell
   docker-compose up -d --build
   ```

   ページを閲覧する際は `localhost:8080/base.html`などにアクセスします。  
   DBを確認する際は `localhost:8888`にアクセスします。

   DBのスキーマを変更した際はボリュームごと削除してください。

   ```powershell
   # ボリュームごと削除
   docker-compose down -v
   
   # 再起動
   docker-compose up -d
   ```

   特定のサービス(プロセス)を終了させたい場合は、下記のようにします。

   ```powershell
   docker-compose stop サービス名
   ```

## 開発環境について

### ブログ

ブログのトップページはルートディレクトリの`blog.html`です。  
そこから`blog/blog-data`の各記事にアクセスします。  
ブログトップの各記事の表示には`js/articleListRenderer.js`を使用しています。(データは`data/articleData.js`を参照)

### プロダクト

ブログのトップページはルートディレクトリの`product-top.html`です。  
そこから`products/page`の各プロダクトページにアクセスします。  
プロダクトトップの各プロダクトの表示には`js/productListRenderer.js`を使用しています。(データは`data/pdctData.js`を参照)

### マイページ

マイページはDB等を使用するため、PHPで処理をしています。  
バックエンドのような役割をしているのが、`KAMAGI`ディレクトリです。  
メンバーが閲覧するページは`mypage-kamagi`ディレクトリに格納されています。

> [!CAUTION]
> `.env`やパスワードを含んだ`init.sql`は絶対にコミットに含めないようにしましょう。
> `.env`は`.gitignore`で除外しているので特段気にすることはないです。
