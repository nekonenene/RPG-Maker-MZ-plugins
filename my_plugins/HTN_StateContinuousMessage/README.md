# HTN_StateContinuousMessage

RPGツクールMZ用のプラグインです。

ステートがすでにかかっている対象にステートが再付与されたとき、  
「アクターがこの状態になったとき」や「敵キャラがこの状態になったとき」のメッセージがそのまま表示されますが、  
そうすると、すでに眠っているのに「%1は眠った！」と表示されて違和感がある……ということを解消するプラグインです。  

ステートのメモ欄にタグを記述することで、再付与時に表示するメッセージを設定できます。

## 🛠️ 導入方法

**[【ここを右クリックして「名前を付けてリンク先を保存」みたいな項目を選んでダウンロード】](https://raw.githubusercontent.com/nekonenene/RPG-Maker-MZ-plugins/main/my_plugins/HTN_StateContinuousMessage/HTN_StateContinuousMessage.js)**

プラグインの導入方法については、[ツクール公式サイトの講座ページ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)をご参考に！  
ダウンロードした `HTN_xxx.js` のような名前のファイルを、プロジェクト内の `js/plugins` フォルダーの中に入れてください。

## 🧭 使い方

「プラグイン管理」画面でこのプラグインを追加した後、  
設定を適用したいステートの「メモ」欄に、以下のようなタグを記述します。

### タグ一覧

- `<StateContinuousMessage_Actor: メッセージ>`  
  すでにそのステートにかかっているアクター（プレイヤーキャラ）への再付与時に表示するメッセージです。  
  `%1` と書くと対象者の名前に置換されます。

- `<StateContinuousMessage_Enemy: メッセージ>`  
  すでにそのステートにかかっている敵キャラへの再付与時に表示するメッセージです。  
  `%1` と書くと対象者の名前に置換されます。

- `<StateContinuousMessage_Common: メッセージ>`  
  上の２つを別々に設定するのが面倒な人向けの、アクター・敵キャラ共通の再付与時メッセージです。  
  `_Actor` や `_Enemy` タグが記述されている場合には、そちらが優先されます。

### 記述例

敵味方関係なく、再付与時に「%1はすでに眠っている！」と表示したい場合：

```
<StateContinuousMessage_Common: %1はすでに眠っている！>
```

味方と敵で別々のメッセージを設定したい場合：

```
<StateContinuousMessage_Actor: %1はすでに眠っている！>
<StateContinuousMessage_Enemy: すでに%1を眠らせている！>
```

再付与時のメッセージを表示しないようにする場合：

```
<StateContinuousMessage_Common: >
```

## 💡 参考情報

実はRPGツクールMZでは、ステートが再付与されると継続ターン数が延長されます。  
このプラグインでメッセージを設定する際は、その仕様を踏まえたものにするとプレイヤーに親切です。

一方、そもそもステートの再付与を起こらなくすることも、  
pandaさん制作のプラグイン「[PANDA_NoDuplicateStates](https://www.werepanda.jp/blog/tech/20250720182408.html)」で可能です。

そちらの使用もご検討ください。

## 📝 作者情報

ハトネコエ  
**[X : @nekonenene](https://x.com/nekonenene)**  
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
