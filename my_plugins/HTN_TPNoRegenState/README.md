# HTN_TPNoRegenState

RPGツクールMZ用のプラグインです。

TPの回復ができなくなるステート（状態異常）を作成できるようになります。

## 🛠️ 導入方法

**[【ここを右クリックして「名前を付けてリンク先を保存」みたいな項目を選んでダウンロード】](https://raw.githubusercontent.com/nekonenene/RPG-Maker-MZ-plugins/main/my_plugins/HTN_TPNoRegenState/HTN_TPNoRegenState.js)**

プラグインの導入方法については、[ツクール公式サイトの講座ページ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)をご参考に！  
ダウンロードした `HTN_xxx.js` のような名前のファイルを、プロジェクト内の `js/plugins` フォルダーの中に入れてください。

## 🧭 使い方

「プラグイン管理」画面でこのプラグインを追加した後、  
ステートの「メモ」欄に `<TPNoRegenState>` というタグを記入することで、  
そのステートがこのプラグインの効果を持つようになります。

```
<TPNoRegenState>
```

![TPNoRegenState_memo.png](./images/TPNoRegenState_memo.png)

## 🧩 機能詳細

TPの回復には「ターン終了時の自動回復」「被ダメージ時」「アイテムやスキルによるTP回復」など、  
いくつかのトリガーが存在します。  

`<TPNoRegenState>` が設定された状態異常にかかるとTPが上昇しなくなりますが、  
「アイテムやスキルによるTP回復」は、**プラグインパラメータ**や、**ステートごとに設定できるタグ**で許可することもできます。

プラグインパラメータの設定値がデフォルトとなりますが、  
ステートの「メモ」欄に例えば以下のようにタグを記入することで、個別に設定することもできます。  
`<TPNoRegenState>` 以外のタグは、必要なものだけ設定してください。

例えば、以下のように記述すると、スキルでのTP回復は有効な一方、  
アイテムでのTP回復ができず、アイテムでのTP回復時に「○○のやる気は上がらなかった！」という  
メッセージが表示されるようになります。

```
<TPNoRegenState>
<TPNoRegenState_ItemRecover: false>
<TPNoRegenState_SkillRecover: true>
<TPNoRegenState_RecoverBlockedMessage: %1のやる気は上がらなかった！>
```

`<TPNoRegenState>` が設定されたステートを複数用意していて、  
そのステートに同時にかかっている場合は、「優先度」がもっとも高いステートのタグが参照されるのでご注意ください。

ちなみに、TPにダメージを与えるスキルを作れるプラグインとしては  
NUUNさんの「[TPDamageType](https://github.com/nuun888/MZ/blob/master/NUUN_TPDamageType.js)」があります。ご活用ください。

## 📝 作者情報

ハトネコエ  
**[X : @nekonenene](https://x.com/nekonenene)**  
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
