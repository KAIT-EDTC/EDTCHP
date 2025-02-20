## 環境構築

### Gitの環境構築

- #### Gitのダウンロード & インストール

   まずGitを[ダウンロード](https://git-scm.com/downloads/win)する  
   インストール手順は全部nextを押せばOK  
   Gitをインストールしたら*Git Bash*を起動して、下記のコマンドを入力

   ```bash
   git config --global user.name "任意の名前を入力"  
   git config --global user.email "自分のメアド入力"  
   ```  

   **これでGitコマンドを使えるようになる。**

- #### ローカルリポジトリを作成(リモートからクローンする)

   リポジトリを作成したいディレクトリに移動して、下記のコマンドを入力  

   ```bash
   git clone https://github.com/fami-gb/EDTCHP.git  
   ```  

   これでローカルのリポジトリ作成が完了したので後はvscodeで煮るなり焼くなりしよう。

### Composerの設定

- #### composerのダウンロード & インストール

   まずComposerを[ダウンロード](https://getcomposer.org/Composer-Setup.exe)する。  
   インストール手順は全部Nextを押せばOK(もしエラーダイアログが出たら多分パス設定のとこなのでhogehoge~PATHとかにチェックすればOK)  
   Installボタンを押したらインストール完了  
   ちゃんとインストールされたかを確認するために下記のコマンドを入力(どこでもいいのでcmdやpowershellを開く)

   ```bash
   composer -V
   ```

   上記の入力後、下記のようなアウトプットがされればOK

   ```bash
   Composer version x.x.x yyyy-mm-dd hh:mm:ss
   PHP version x.x.x (指定したパス)
   Run the "diagnose" command to get more detailed diagnostics output.
   ```

- #### パッケージのインストール方法

   今はパッケージが必要なディレクトリはmypageのcalendarだけなので下記のディレクトリにパッケージをインストールする

   ```bash
   cd mypage/calendar
   ```

   次にcomposerコマンドを使ってパッケージをインストールする。  
  composer.jsonがある場合は一個目のコマンドを実行すればOK.

   - ```bash
     composer install
      ```
   - ```bash
      # Googleのapiのためのパッケージ
      composer require google/apiclient:^2.15.0
      
      # .envファイルを開くためのパッケージ
      composer require vlucas/phpdotenv
      ```

## Gitのあれこれ

### ブランチ作成～リモートにプッシュするまで

- ローカルでブランチ作成して移動 `git checkout -b ブランチ名`
- 変更をステージング`git add .`or`git add ディレクトリ名`or`git add ファイル名`  
  `git add .`は**余分な差分を生む可能性があるので注意。**
- ステージングされたものをコミット`git commit -m "メッセージ"`
- コミットをリモートにプッシュ`git push origin リモートに上げたいブランチ名`
