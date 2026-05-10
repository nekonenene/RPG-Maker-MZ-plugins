# HTN_StunRate

RPGツクールMZ用のプラグインです。

一定確率で行動できないステート（状態異常）を作成できるようになります。

## 🛠️ 導入方法

**[【ここを右クリックして「名前を付けてリンク先を保存」みたいな項目を選んでダウンロード】](https://raw.githubusercontent.com/nekonenene/RPG-Maker-MZ-plugins/main/my_plugins/HTN_StunRate/HTN_StunRate.js)**

プラグインの導入方法については、[ツクール公式サイトの講座ページ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)をご参考に！  
ダウンロードした `HTN_xxx.js` のような名前のファイルを、プロジェクト内の `js/plugins` フォルダーの中に入れてください。

## 🧭 使い方

「プラグイン管理」画面でこのプラグインを追加した後、  
ステートの「メモ」欄に `<StunRate: 確率>` というタグを記入することで、  
そのステートがこのプラグインの効果を持つようになります。

```
<StunRate: 60>
```

上記の例では、そのステートが有効な間、行動者は60%の確率で行動不能になります。

確率の値を省略した場合は、プラグインパラメータの「行動不能確率(%)」の値が使用されます。

```
<StunRate>
```

## 🧩 機能詳細

プラグインパラメータの設定値がデフォルトとなりますが、  
ステートの「メモ」欄にタグを記入することで、個別に設定することも可能です。  
`<StunRate>` 以外のタグは、必要なものだけ設定してください。

例えば、以下のように記述すると、そのステートの保持者は50%の確率で行動不能になり、  
行動不能になったターンに「○○はしびれている！」というメッセージが表示されます。

```
<StunRate: 50>
<StunRate_Message: %1はしびれている！>
```

### 複数ステートについて

`<StunRate>` が設定されたステートに複数同時にかかっている場合、  
それぞれのステートで独立して行動不能の判定をおこないます。  
最初に判定が成立したステートのメッセージが表示されます。

### タグ一覧

ステートの「メモ」欄に記述できるタグの一覧です。  
`<StunRate>` または `<StunRate: 確率>` 以外のタグは、  
プラグインのパラメータで設定した値を上書きしない場合には記述しなくて大丈夫です。

- `<StunRate: 確率>`  
  このプラグインを有効化するために必要なタグ。値は行動不能になる確率(%)を指定。省略するとプラグインパラメータのデフォルト値を使用
- `<StunRate_Message: テキスト>`  
  行動不能になったときの表示メッセージを上書き（文字列内の `%1` は行動者名に置換されます）
- `<StunRate_ShowStateMessageBeforeAction: true/false>`  
  ステートの継続メッセージを行動の前に表示するかどうかを上書き

#### コピーしやすい用の一覧

```
<StunRate: 60>
<StunRate_Message: %1は動けない！>
<StunRate_ShowStateMessageBeforeAction: true>
```

## 📝 作者情報

ハトネコエ  
**[X : @nekonenene](https://x.com/nekonenene)**  
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
