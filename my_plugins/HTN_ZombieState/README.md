# HTN_ZombieState

RPGツクールMZ用のプラグインです。

HP回復をHPダメージに反転させる、いわゆる「ゾンビ」のステート（状態異常）を作成できるようになります。  
MP回復やTP回復の反転にも対応しています。

## 🛠️ 導入方法

**[【ここを右クリックして「名前を付けてリンク先を保存」みたいな項目を選んでダウンロード】](https://raw.githubusercontent.com/nekonenene/RPG-Maker-MZ-plugins/main/my_plugins/HTN_ZombieState/HTN_ZombieState.js)**

プラグインの導入方法については、[ツクール公式サイトの講座ページ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)をご参考に！  
ダウンロードした `HTN_xxx.js` のような名前のファイルを、プロジェクト内の `js/plugins` フォルダーの中に入れてください。

## 🧭 使い方

「プラグイン管理」画面でこのプラグインを追加した後、  
ステートの「メモ」欄に `<ZombieState>` というタグを記入することで、  
そのステートがこのプラグインの効果を持つようになります。

```
<ZombieState>
```

## 🧩 機能詳細

ゾンビ状態のキャラは、HP回復を受けるとHPダメージを受けます。  
スキル・アイテムによる回復だけでなく、ターン終了時のリジェネ（HP再生）も対象です。

ステートの「戦闘終了時に解除」にチェックを入れない場合、  
ゾンビ効果はバトル外でも有効で、メニューからのアイテム使用でもダメージを受けます。

回復によるダメージの音は、プラグインパラメータで設定可能です。  
MP回復によるMP減少の音も、同じように設定可能です。

オプションには他に、「MP回復でMP減少」「TP回復でTP減少」の設定があります。  
プラグインパラメータで全体のデフォルト値を設定するほか、  
ステートの「メモ」欄にタグを記述することで、個別に上書きすることも可能です。

個人的には、TPの反転はゲームとして面白くなりにくそうに感じていて、  
攻撃を受けるなどのたびにTP減少メッセージが出て煩雑ですから、  
TPを上昇させたくないという目的の場合は「[HTN_TPNoRegenState](https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_TPNoRegenState)」を使うほうが、もしかしたら適しているかもしれません。

### タグ一覧

ステートの「メモ」欄に記述できるタグの一覧です。  
`<ZombieState>` 以外のタグは、必要なものだけ設定してください。

- `<ZombieState>`
  このプラグインを有効化するために必要なタグ
- `<ZombieState_AffectMp: true/false>`
  MP回復反転の可否を上書き（`true`でMP回復がMPダメージになる）
- `<ZombieState_AffectTp: true/false>`
  TP回復反転の可否を上書き（`true`でTP増加がTPダメージになる）

`<ZombieState>` が設定されたステートが複数あり、  
１人のキャラがそれらのステートに同時にかかっている場合は、  
「優先度」がもっとも高いステートのタグ設定が参照されます。

#### コピーしやすい用の一覧

```
<ZombieState>
<ZombieState_AffectMp: false>
<ZombieState_AffectTp: false>
```

## ⚠️ 注意点

`setHp()` や `setMp()` が直接呼び出されてHP・MPが増加する場合、ゾンビ反転は正しく機能しますが、  
ダメージポップアップや音は表示されません。  
戦闘不能バトラーへの `setHp(1)`（蘇生）はゾンビ反転の対象外です。

## 📝 作者情報

ハトネコエ  
**[X : @nekonenene](https://x.com/nekonenene)**  
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
