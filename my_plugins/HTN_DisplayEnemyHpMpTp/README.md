# HTN_DisplayEnemyHpMpTp

RPGツクールMZ用のプラグインです。

戦闘中に敵キャラのHP・MP・TPをゲージ（バー）で表示できるようになります。  
戦闘のデバッグ時に便利です。

## 🛠️ 導入方法

**[【ここを右クリックして「名前を付けてリンク先を保存」みたいな項目を選んでダウンロード】](https://raw.githubusercontent.com/nekonenene/RPG-Maker-MZ-plugins/main/my_plugins/HTN_DisplayEnemyHpMpTp/HTN_DisplayEnemyHpMpTp.js)**

プラグインの導入方法については、[ツクール公式サイトの講座ページ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)をご参考に！  
ダウンロードした `HTN_xxx.js` のような名前のファイルを、プロジェクト内の `js/plugins` フォルダーの中に入れてください。

## 🧭 使い方

「プラグイン管理」画面でこのプラグインを追加するだけで機能します。  
設定変更はプラグインの「パラメータ」欄からおこなえます。

### プラグインパラメータ

| パラメータ | 説明 |
|---|---|
| HPゲージを表示 | HPゲージの表示・非表示 |
| MPゲージを表示 | MPゲージの表示・非表示 |
| TPゲージを表示 | TPゲージの表示・非表示 |
| 数値を表示 | HP・MP・TP の数値の表示・非表示 |
| ラベルを表示 | ゲージラベルの表示・非表示 |
| ゲージの表示位置 | 敵画像の下 or 上 |
| ゲージの横幅 | 各ゲージの横幅 (px) |
| ゲージバーの高さ | ゲージバーの高さ (px) |
| ゲージ間の余白 | ゲージ同士の縦方向の余白 (px) |
| X位置調整 | 敵キャラ中央からの横ズレ（負で左、正で右） |
| Y位置調整 | 縦方向の追加のズレ（正で下、負で上） |

## 🧩 機能詳細

- 敵が死亡するとゲージは非表示になります

### タグ一覧

敵キャラの「メモ」欄に記述できるタグの一覧です。  

- `<HTN_DisplayEnemyHpMpTp_Hide>`  
  ゲージをすべて非表示にします  

## 📝 作者情報

ハトネコエ  
**[X : @nekonenene](https://x.com/nekonenene)**  
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
