# HTN_EscapeRate

RPGツクールMZ用のプラグインです。

逃走成功率を変更できるようになります。  
デフォルトは100%に設定してあり、確実に逃走できるようになっています。

## 🛠️ 導入方法

**[【ここを右クリックして「名前を付けてリンク先を保存」みたいな項目を選んでダウンロード】](https://raw.githubusercontent.com/nekonenene/RPG-Maker-MZ-plugins/main/my_plugins/HTN_EscapeRate/HTN_EscapeRate.js)**

プラグインの導入方法については、[ツクール公式サイトの講座ページ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)をご参考に！
ダウンロードした `HTN_xxx.js` のような名前のファイルを、プロジェクト内の `js/plugins` フォルダーの中に入れてください。

## 🧭 使い方

「プラグイン管理」画面でこのプラグインを追加すると、  
逃走成功率を変更できるようになります。

プラグインの「パラメータ」で、  
「デフォルト逃走成功率(%)」を設定できます。

デフォルト値の 100% の場合、常に逃走に成功します。

## 🧩 機能詳細

敵キャラの「メモ」欄に以下のようなタグを記入することで、  
その敵キャラに対する逃走確率を個別に設定できます。

```
<EscapeRate: 50>
```

逃走確率は、**敵グループ内の全敵キャラの逃走確率の平均値**になります。

例えば、以下のような敵グループの場合：

- スライム（タグなし） → デフォルト逃走確率（例: 100%）
- ドラゴン（`<EscapeRate: 20>`） → 20%

平均は `(100 + 20) / 2 = 60%` となり、60% の確率で逃走できます。

なお、逃走に失敗するたびに、逃走確率が10%ずつ上昇していきます。  
これはツクールMZのもともとの挙動です。

## 📝 作者情報

ハトネコエ
**[X : @nekonenene](https://x.com/nekonenene)**
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
