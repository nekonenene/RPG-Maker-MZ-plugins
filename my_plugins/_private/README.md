# _private : 作業場

開発中のものや、公開はしなさそうなプラグインを置いておくディレクトリ

## 開発時のアドバイス

rsync でプロジェクトフォルダに送ると動作確認が楽です。  
（ `--delete` オプションは、少しのミスで送信先のファイルが大量削除されて痛い目を見たので使用しないほうがいいです……）

```bash
rsync -av ./my_plugins/_private/HTN_MonsterMessage ~/Documents/RPGMakerMZ/SampleProject/js/plugins
```

Mac は fswatch で変更を監視するとさらに楽。

```bash
brew install fswatch

fswatch -o ./my_plugins/_private/HTN_MonsterMessage | xargs -n1 -I{} rsync -av ./my_plugins/_private/HTN_MonsterMessage ~/Documents/RPGMakerMZ/SampleProject/js/plugins
```

## デプロイメント

macOS は [NW.js の差し替えをしないと](https://rpgtkool.hatenablog.com/entry/2024/10/23/140944)デバッグビルドが不安定になる問題があったが、  
本番ビルドを動かすのも一苦労・・・。

### macOS でのデプロイメント

https://note.com/gala_pag_os/n/nd8a7a458fc3b にあるように、  
[nwjs.io](https://nwjs.io) から「NORMAL」をダウンロードし、  
`nw.js` の中身の `Contents/Resources` フォルダ以外を、  
Output フォルダの Game.app の中身の `Contents` にコピペしてくる必要がある。

### ブラウザ向けのデプロイメント

Output フォルダの `index.html` をブラウザで開くだけでは動かない。

[serve](https://www.npmjs.com/package/serve) などを使ってローカルサーバーを立てる必要がある。  
serve は Vercel が作っているものなので安心。

```bash
npx serve ~/Documents/RPGMakerMZ/Output/SampleProject/
```

特に指定していなければ http://localhost:3000 で立ち上がる。ポート指定は `-p` オプション。
