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

fswatch -o ./my_plugins/_private/HTN_MonsterMessage | xargs -n1 -I{} rsync -a ./my_plugins/_private/HTN_MonsterMessage ~/Documents/RPGMakerMZ/SampleProject/js/plugins
```
