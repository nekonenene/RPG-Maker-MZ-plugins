# HTN_TPNoRegenState

RPGツクールMZ用のプラグインです。

特定のステート中だけ、TPの増加を無効化できます。

## 🛠️ 導入方法

**[【ここを右クリックして「名前を付けてリンク先を保存」みたいな項目を選んでダウンロード】](https://raw.githubusercontent.com/nekonenene/RPG-Maker-MZ-plugins/main/my_plugins/HTN_TPNoRegenState/HTN_TPNoRegenState.js)**

プラグインの導入方法については、[ツクール公式サイトの講座ページ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)をご参考に！  
ダウンロードした `HTN_xxx.js` のような名前のファイルを、プロジェクト内の `js/plugins` フォルダーの中に入れてください。

## 🧭 使い方

「プラグイン管理」画面でこのプラグインを追加した後、  
ステートの「メモ」欄に `<TPNoRegenState>` というタグを記入することで、  
そのステートがこのプラグインの効果を持つようになります。

```text
<TPNoRegenState>
```

## 🧩 機能詳細

上記タグが付いているステートが1つでも有効な間は、対象バトラーのTP増加を無効化します。

- 自動回復によるTP増加
- 被ダメージ時のTP増加
- スキル・アイテムによるTP増加
- イベントコマンドによるTP増加

TP減少は通常どおり処理されます。

ちなみに、TPにダメージを与えるスキルを作れるプラグインとしては  
NUUNさんの「[TPDamageType](https://github.com/nuun888/MZ/blob/master/NUUN_TPDamageType.js)」がありますので、ご活用ください。

## 📝 作者情報

ハトネコエ  
**[X : @nekonenene](https://x.com/nekonenene)**  
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
