# HTN_ForcedSkillState

RPGツクールMZ用のプラグインです。

一定確率で、指定したスキルを勝手に使ってしまうステート（状態異常）を作成できるようになります。

## 🛠️ 導入方法

**[【ここを右クリックして「名前を付けてリンク先を保存」みたいな項目を選んでダウンロード】](https://raw.githubusercontent.com/nekonenene/RPG-Maker-MZ-plugins/main/my_plugins/HTN_ForcedSkillState/HTN_ForcedSkillState.js)**

プラグインの導入方法については、[ツクール公式サイトの講座ページ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)をご参考に！  
ダウンロードした `HTN_xxx.js` のような名前のファイルを、プロジェクト内の `js/plugins` フォルダーの中に入れてください。

## 🧭 使い方

「プラグイン管理」画面でこのプラグインを追加した後、  
ステートの「メモ」欄に `<ForcedSkillState>` というタグを記入することで、  
そのステートがこのプラグインの効果を持つようになります。

設定例：

```
<ForcedSkillState>
<ForcedSkillState_Rate: 50>
<ForcedSkillState_Skill: 2>
```

この例の場合、このステートが付与されたキャラクターは、  
50%の確率でスキルID: 2（通常は防御）のスキルを勝手に使います。

## 🧩 機能詳細

`<ForcedSkillState>` が設定された状態異常にかかると、  
行動開始時に一定確率で指定スキルを勝手に使ってしまいます。

強制スキルは、MP不足、封印、スキルタイプ封印などの使用条件を無視して発動します。  
対象はもとの行動から引き継がず、差し替わったスキルの範囲に合わせて自動で選ばれます。

プラグインパラメータの設定値がデフォルトとなりますが、  
ステートの「メモ」欄にタグを記入することで、個別に設定することも可能です。  
`<ForcedSkillState>` 以外のタグは、必要なものだけ設定してください。

例えば、以下のように記述すると、10%の確率でスキルID 2 または 7 のスキルを勝手に使います。  
`2` が2つ設定されているため、スキルID 2 はスキルID 7 より選ばれやすくなります。  
`0` は正の整数ではないため無視されます。

```
<ForcedSkillState>
<ForcedSkillState_Rate: 10>
<ForcedSkillState_Skill: 2,2,7,0>
```

`ForcedSkillState_Skill` に有効な候補がない場合のみ、  
`ForcedSkillState_SkillName` が参照されます。

```
<ForcedSkillState>
<ForcedSkillState_SkillName: 防御,身を守る>
```

スキル名に `<` や `>` を含めたい場合は、  
`&lt;` や `&gt;` と記述してください。

例えば、スキル名が「つよいこうげき(>_<)」の場合、  
`<ForcedSkillState_SkillName: つよいこうげき(&gt;_&lt;)>` と記述します。

`<ForcedSkillState>` が設定されたステートが複数用意されていて、  
それらのステートに同時にかかっている場合は、「優先度」の高いステートから順番に判定されます。  
最初に発動し、有効な候補スキルを持つステートが行動を上書きします。

### タグ一覧

ステートの「メモ」欄に記述できるタグの一覧です。  
`<ForcedSkillState>` 以外のタグは、  
プラグインのパラメータで設定した値を上書きしない場合には記述しなくて大丈夫です。

- `<ForcedSkillState>`  
  このプラグインを有効化するために必要なタグ
- `<ForcedSkillState_Rate: 10>`  
  指定スキルを勝手に使う確率を上書き
- `<ForcedSkillState_Skill: 2,2,7,0>`  
  候補スキルIDを指定。正の整数かつ存在するスキルIDだけが候補になります
- `<ForcedSkillState_SkillName: 防御,身を守る>`  
  候補スキル名を指定。Skill に有効な候補がない場合のみ参照されます
- `<ForcedSkillState_ShowStateMessageBeforeAction: true/false>`  
  ステートの継続メッセージを行動前に表示するかを上書き

#### コピーしやすい用の一覧

```
<ForcedSkillState>
<ForcedSkillState_Rate: 5>
<ForcedSkillState_Skill: 2>
<ForcedSkillState_SkillName: 防御>
<ForcedSkillState_ShowStateMessageBeforeAction: true>
```

## 📝 作者情報

ハトネコエ  
**[X : @nekonenene](https://x.com/nekonenene)**  
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
