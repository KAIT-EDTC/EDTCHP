# 学祭 予約状況確認（静的サイトサンプル）

概要: JSONファイルから予約枠を読み込み、空き状況を表示するシンプルな静的サイトのサンプルです。

ファイル:
- `index.html` - メインの静的ページ
- `style.css` - スタイル
- `script.js` - JSONを読み込んでDOMに反映する処理
- `reservations.json` - 予約データ（静的）

使い方:
1. ローカルで確認するには、`index.html` をブラウザで開きます。ただし、ブラウザのCORS制約でローカルファイルfetchが制限される場合があります。簡易的に確認するにはローカルサーバーを使ってください。

   例（PowerShell）:

   ```powershell
   # Pythonがある場合
   python -m http.server 8000
   # または (PowerShell) .NET Core がある場合
   dotnet tool install --global dotnet-serve; dotnet-serve -p 8000
   ```

2. GitHub Pages に置く場合、リポジトリにこのファイル群をコミットして Pages を有効化すればOKです。

カスタマイズ:
- `reservations.json` を編集して時間帯や定員を変更
- `script.js` のステータス判定や表示文言を変更

注意:
- 個人情報は扱わない設計です。Web上では閲覧のみ想定しています。
