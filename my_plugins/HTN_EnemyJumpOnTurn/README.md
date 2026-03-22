# HTN_EnemyJumpOnTurn

RPGツクールMZ用のプラグインです。

敵の攻撃ターンが来たとき、敵が軽く上下にジャンプすることで、  
誰のターンかを視覚的にわかりやすくすることができます。

## 🛠️ 導入方法

**[【ここを右クリックして「名前を付けてリンク先を保存」みたいな項目を選んでダウンロード】](https://raw.githubusercontent.com/nekonenene/RPG-Maker-MZ-plugins/main/my_plugins/HTN_EnemyJumpOnTurn/HTN_EnemyJumpOnTurn.js)**

プラグインの導入方法については、[ツクール公式サイトの講座ページ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)をご参考に！  
ダウンロードした `HTN_xxx.js` のような名前のファイルを、プロジェクト内の `js/plugins` フォルダーの中に入れてください。

## 🧭 使い方

「プラグイン管理」画面でこのプラグインを追加するだけで機能します。  
設定変更はプラグインパラメータからおこなえます。

### ジャンプの高さ (px)

ジャンプする高さをピクセル単位で指定します。

### ジャンプの時間 (フレーム数)

ジャンプアニメーション全体のフレーム数です。  
60フレームが1秒に相当します。  
デフォルトは `12`（約0.2秒）です。

## 🧩 機能詳細

敵のアクション開始時（ツクール標準の「白く光る」エフェクトが発生するタイミング）と同時に、  
敵スプライトがサイン曲線に沿って上下にジャンプします。

敵の移動時に黒い線が出る場合は  
砂川赳さん制作の「[NRP_BitmapSmoothOff](https://newrpg.seesaa.net/article/484654081.html)」をお試しください。

## 📝 作者情報

ハトネコエ  
**[X : @nekonenene](https://x.com/nekonenene)**  
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
