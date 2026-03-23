# HTN_ZombieState

RPGツクールMZ用のプラグインです。

HP回復をHPダメージに反転させる「ゾンビ」状態異常を作成できるようになります。

## 🛠️ 導入方法

**[【ここを右クリックして「名前を付けてリンク先を保存」みたいな項目を選んでダウンロード】](https://raw.githubusercontent.com/nekonenene/RPG-Maker-MZ-plugins/main/my_plugins/HTN_ZombieState/HTN_ZombieState.js)**

プラグインの導入方法については、[ツクール公式サイトの講座ページ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)をご参考に！  
ダウンロードした `HTN_xxx.js` のような名前のファイルを、プロジェクト内の `js/plugins` フォルダーの中に入れてください。

## 🧭 使い方

「プラグイン管理」画面でこのプラグインを追加した後、  
ステートの「メモ」欄に `<ZombieState>` というタグを記入することで、  
そのステートがこのプラグインのゾンビ効果を持つようになります。

```
<ZombieState>
```

## 🧩 機能詳細

ゾンビ状態のバトラーは、HP回復を受けるとHPダメージを受けます。  
スキル・アイテムによる回復だけでなく、ターン終了時のリジェネ（HP再生率）も対象です。  
ゾンビ効果はバトル外でも有効で、メニューからのアイテム使用でもダメージを受けます。

HPダメージを受けるとき、通常とは異なる音が鳴ります（デフォルトは「敵ダメージ」音）。  
プラグインパラメータで音の種類を変更したり、カスタムSEを設定することも可能です。

オプションとして、「MP回復でMP減少」「TP回復でTP減少」の設定もあります。  
プラグインパラメータで全体のデフォルト値を設定するほか、  
ステートごとにタグで個別に上書きすることも可能です。

ゾンビ状態に関連するステートが複数同時に付与されている場合は、  
「優先度」がもっとも高いステートのタグ設定が参照されます。

### タグ一覧

ステートの「メモ」欄に記述できるタグの一覧です。  
`<ZombieState>` 以外のタグは、必要なものだけ設定してください。

- `<ZombieState>`
  このプラグインを有効化するために必要なタグ
- `<ZombieState_AffectMp: true/false>`
  MP回復反転の可否を上書き（`true`でMP回復がMPダメージになる）
- `<ZombieState_AffectTp: true/false>`
  TP回復反転の可否を上書き（`true`でTP増加がTPダメージになる）

#### コピーしやすい用の一覧

```
<ZombieState>
<ZombieState_AffectMp: false>
<ZombieState_AffectTp: false>
```

### 制限事項

サードパーティプラグインが `setHp()` や `setMp()` を直接呼び出してHP・MPを増加させる場合、  
ゾンビ効果が発動しません。`setTp()` の直接呼び出しは正しく処理されます。

## 📝 作者情報

ハトネコエ  
**[X : @nekonenene](https://x.com/nekonenene)**  
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
