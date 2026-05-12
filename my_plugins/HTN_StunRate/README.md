# HTN_StunRate

RPGツクールMZ用のプラグインです。

一定確率で行動できないステート（状態異常）を作成できるようになります。  
[公式プラグイン](https://rpgmakerofficial.com/product/mz/download/dl_plugin.html)の「NumbState.js」だと、行動不能時のメッセージをステートIDごとに設定できなかったため作成しました。

## 🛠️ 導入方法

**[【ここを右クリックして「名前を付けてリンク先を保存」みたいな項目を選んでダウンロード】](https://raw.githubusercontent.com/nekonenene/RPG-Maker-MZ-plugins/main/my_plugins/HTN_StunRate/HTN_StunRate.js)**

プラグインの導入方法については、[ツクール公式サイトの講座ページ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)をご参考に！  
ダウンロードした `HTN_xxx.js` のような名前のファイルを、プロジェクト内の `js/plugins` フォルダーの中に入れてください。

## 🧭 使い方

「プラグイン管理」画面でこのプラグインを追加した後、  
ステートの「メモ」欄にタグを記入することで、  
そのステートがこのプラグインの効果を持つようになります。

ステートの **「行動制約」は「行動できない」ではなく「なし」に設定する** よう気を付けてください。

```
<StunRate>
```

単純に `<StunRate>` と書く場合、プラグインパラメータの「行動不能の確率(%)」の値が使用されますが、  
以下の例のように、行動不能の確率をいっしょに指定することも可能です。

```
<StunRate: 60>
```

この場合、このステートではプラグインパラメータの「行動不能の確率(%)」は無視され、  
60%の確率で行動不能になります。

## 🧩 機能詳細

プラグインパラメータの設定値がデフォルトとなりますが、  
ステートの「メモ」欄にタグを記入することで、個別に設定することも可能です。  
必要に応じて設定してください。

### タグ一覧

ステートの「メモ」欄に記述できるタグの一覧です。  
`<StunRate>` または `<StunRate: 確率>` 以外のタグは、  
プラグインのパラメータで設定した値を上書きしない場合には記述しなくて大丈夫です。

- `<StunRate: 確率>`  
  このプラグインを有効化するために必要なタグ。値は行動不能になる確率(%)を指定。省略するとプラグインパラメータのデフォルト値を使用
- `<StunRate_Message: テキスト>`  
  行動不能になったときの表示メッセージを上書き（文字列内の `%1` は行動者名に置換されます）
- `<StunRate_ShowStateMessageBeforeAction: true/false>`  
  ステートの継続メッセージを、行動の前に表示するかの設定を上書き

#### コピーしやすい用の一覧

```
<StunRate: 25>
<StunRate_Message: %1は動けない！>
<StunRate_ShowStateMessageBeforeAction: true>
```

### 行動不能時のメッセージの補足

`<StunRate>` タグを持つステートが複数存在し、それらに同時にかかっている場合、
各ステートで「優先度」の順にスタン判定がおこなわれ、
最初にスタン判定となったステートのメッセージが表示されます。

### 継続メッセージの表示タイミングについて

RPGツクールMZの仕様では、ステートの継続メッセージに関して、  
継続メッセージが設定されているステートのうち、「優先度」がもっとも高い１つのみが表示されます。  
（参考: `Game_BattlerBase.prototype.mostImportantStateText` ）

そのため、プラグインパラメータの「行動前に継続メッセージを表示」を false に設定することや  
メモ欄に `<StunRate_ShowStateMessageBeforeAction: false>` と記述することをおこなっても、  
必ずしも継続メッセージが行動後に表示されるわけではないことにご注意ください。

## 📝 作者情報

ハトネコエ  
**[X : @nekonenene](https://x.com/nekonenene)**  
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
