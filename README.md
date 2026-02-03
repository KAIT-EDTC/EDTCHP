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

   ```bash
   git config --global user.name "任意の名前を入力"  
   git config --global user.email "自分のメアド入力"  
   ```  

   これで、Gitのコマンドが使えるようになるはずです。

### ローカルリポジトリを作成(リモートからクローンする)

   リポジトリを作成したいディレクトリに移動して、下記のコマンドを入力してください。  

   ```bash
   git clone https://github.com/fami-gb/EDTCHP.git  
   ```  

   これで、EDTCHPというディレクトリが生成されるはずです。

### Dockerを使って環境構築

   Dockerを使うためには、まず`Docker Desktop`をインストールする必要があります。  
   [ここ](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-win-amd64&_gl=1*1bie0kg*_gcl_au*MTc5NTcyMzc0OS4xNzcwMTQ2NDk2*_ga*MjQ2NTkzNDAuMTc3MDE0NjQ5Ng..*_ga_XJWPQMJYHQ*czE3NzAxNDY0OTYkbzEkZzEkdDE3NzAxNDY1MDYkajUwJGwwJGgw)からダウンロードし、インストールをしてください(サインインなどは一切する必要はありません。)

   VSCodeでEDTCHPを開いたら、`Ctrl+J`でターミナルを起動し下記のコマンドを実行します。

   ```bash
   docker-compose up -d --build
   ```

   ページを閲覧する際は `localhost:8080/base.html`などにアクセスします。  
   DBを確認する際は `localhost:8888`にアクセスします。

   DBのスキーマを変更した際はボリュームごと削除してください。

   ```bash
   # ボリュームごと削除
   docker-compose down -v
   
   # 再起動
   docker-compose up -d
   ```

   特定のサービス(プロセス)を終了させたい場合は、下記のようにします。

   ```bash
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

> [!IMPORTANT]
> `.env`やパスワードを含んだ`init.sql`は絶対にコミットに含めないようにしましょう。
> `.env`は`.gitignore`で除外しているので特段気にすることはないです。
