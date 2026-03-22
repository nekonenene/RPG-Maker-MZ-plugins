# HTN_EscapeRate

RPGツクールMV, RPGツクールMZ の両方に対応したプラグインです。

逃走成功率をパーセンテージでカンタンに設定できるようになります。  
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
<EscapeRate: 60>
```

逃走確率は、**敵グループ内の全敵キャラの逃走確率の平均値**になります。

例えば、以下のような敵グループの場合：

- スライム（タグなし） → デフォルト逃走確率（例: 100%）
- ドラゴン（`<EscapeRate: 60>`） → 60%

平均は `(100 + 60) / 2 = 80%` となり、80% の確率で逃走できます。

なお、逃走に失敗するたびに、逃走確率が10%ずつ上昇していきます。  
これはツクールMV/MZのもともとの挙動です。

## 💡 参考情報

逃走成功率を変更できるプラグインは、他にもいろいろあります。

- 砂川赳さん制作の「[NRP_EscapeRatio](https://newrpg.seesaa.net/article/500211133.html)」  
  自分で逃走確率の計算式を記すことができる。逃走成功率を上げる防具を作れるなど高機能な一方、計算式に苦手意識がある人には難しいかも。ツクールMV/MZの両対応。
- ポテトードラゴンさん制作の「[Escape](https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/3_Game/Battle/Escape.js)」  
  逃走成功率をパーセンテージで設定。逃走成功率を変数から読み出すことも出来る。ツクールMZのみの対応だけど、コード見る感じはMVでも動きそう？
- DarkPlasmaさん制作の「[DarkPlasma_FixEscapeRatio](https://raw.githubusercontent.com/elleonard/DarkPlasma-MZ-Plugins/release/DarkPlasma_FixEscapeRatio.js)」  
  逃走確率を完全に固定。逃走に失敗しても逃走確率が10%ずつ上昇しないようにしている。その関係で、ツクールMZのみの対応。

理想の逃走成功率の挙動に合わせて、プラグインをお選びください。  
「必ず逃走できるようにする」という目的であれば、このプラグイン含め、上記のどのプラグインでも実現可能です！

## 📝 作者情報

ハトネコエ
**[X : @nekonenene](https://x.com/nekonenene)**
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
