# HTN_MPDrainState

RPGツクールMZ用のプラグインです。

ターンが終わるたびにMPを吸収されるステート（状態異常）を作成できるようになります。

HPドレインについては  
**[HTN_HPDrainState](https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_HPDrainState)** をお使いください。

## 🛠️ 導入方法

**[【ここを右クリックして「名前を付けてリンク先を保存」みたいな項目を選んでダウンロード】](https://raw.githubusercontent.com/nekonenene/RPG-Maker-MZ-plugins/main/my_plugins/HTN_MPDrainState/HTN_MPDrainState.js)**

プラグインの導入方法については、[ツクール公式サイトの講座ページ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)をご参考に！  
ダウンロードした `HTN_xxx.js` のような名前のファイルを、プロジェクト内の `js/plugins` フォルダーの中に入れてください。

## 🧭 使い方

「プラグイン管理」画面でこのプラグインを追加した後、  
ステートの「メモ」欄に `<MPDrainState>` というタグを記入することで、  
そのステートがこのプラグインの効果を持つようになります。

```
<MPDrainState>
```

## 🧩 機能詳細

`<MPDrainState>` が設定されたステートを付与された側（ドレインされる側）は、  
自分のターンが終わるたびに一定量のMPが失われ、そのMPがステートを付与してきた相手（ドレインする側）に渡されます。

ステートを付与してきた相手が戦闘不能になった際に、ステートは自動的に解除されます。

通常は、最後にステートを付与した相手１人だけがドレインする側として記憶されますが、  
プラグインのパラメータで「複数のドレイン実行者を許可」を true にした場合、  
ステートが治る前に別のキャラから同じステートを付与されたときに、ドレイン実行者が追加されます。  
ターン終了時にドレイン実行者全員からMPを吸収され、ステートを付与した全員が倒された際に、ステートは自動解除されます。

吸収量の計算タイプや吸収量は、プラグインパラメータで設定できます。  
プラグインパラメータの設定値がデフォルトとなりますが、  
ステートの「メモ」欄にタグを記入することで、ステートごとに設定を上書きすることもできます。

### 吸収タイプ（AmountType）について

吸収量の計算方法は以下の6種類から選択できます。

| 値 | 計算方法 |
|---|---|
| `absolute` | 固定値（指定したMP量がそのまま吸収される） |
| `selfMaxMp` | ドレインされる側の最大MPに対するパーセンテージ |
| `selfMp` | ドレインされる側の現在MPに対するパーセンテージ |
| `drainerMaxMp` | ドレインする側の最大MPに対するパーセンテージ |
| `drainerMissingMp` | ドレインする側の「最大MP − 現在MP」（失ったMP）に対するパーセンテージ |
| `formula` | JavaScript の式で自由に計算（上級者向け） |

`formula` を選択した場合は、`Amount` に JavaScript の式を記述します。  
式の中では以下の変数が使用できます。

| 変数 | 内容 |
|---|---|
| `drainTarget` | ドレインされる側 |
| `drainer` | ドレインする側 |

例えば `Math.max(drainTarget.mmp / 10, drainer.mat * 2)` と設定すると、  
「ドレインされる側の最大MPの10分の1」と「ドレインする側の魔法攻撃力の2倍」のどちらか大きい方の値が吸収量になります。

⚠️ `formula` タイプは、スキルのダメージ計算式を書くことに慣れた方向けの上級者機能です。  
式の書き方に間違いがあるとエラーが発生するのでお気をつけください。  
`&lt;` は `<` に、 `&gt;` は `>` に変換されます。

式の書き方は、このあとの「💡 参考情報」の項でも触れています。

### タグ一覧

ステートの「メモ」欄に記述できるタグの一覧です。  
`<MPDrainState>` 以外のタグは、  
プラグインのパラメータで設定した値を上書きしない場合には記述しなくて大丈夫です。

- `<MPDrainState>`  
  このプラグインを有効化するために必要なタグ  
- `<MPDrainState_AmountType: タイプ>`  
  吸収タイプを上書き（`absolute` / `selfMaxMp` / `selfMp` / `drainerMaxMp` / `drainerMissingMp` / `formula`）  
- `<MPDrainState_Amount: 数値または式>`  
  吸収量を上書き。タイプが `absolute` なら固定MP量、割合系なら 0〜100 のパーセンテージ、`formula` なら JavaScript 式  
- `<MPDrainState_AmountRandomizer: 数値>`  
  吸収量のランダム幅（%）を上書き（0〜80。例: `20` と設定すると計算結果に 0.8〜1.2 倍のランダムな乗数が掛かる）  
- `<MPDrainState_DrainMessage: テキスト>`  
  MP吸収時のメッセージを上書き（`%1` はドレインされる側の名前、`%2` はドレインする側の名前、`%3` は「ＭＰ」の表示名、`%4` は吸収量に置換される）  
- `<MPDrainState_MultiDrainer: true/false>`  
  複数のドレイン実行者を許可するか上書き（`true` にすると、ステートが治る前に別のキャラから再付与された場合、複数のキャラからMPドレインがされるようになる。付与者全員が倒された際にステートが自動解除される）

#### コピーしやすい用の一覧

```
<MPDrainState>
<MPDrainState_AmountType: selfMaxMp>
<MPDrainState_Amount: 10>
<MPDrainState_AmountRandomizer: 0>
<MPDrainState_DrainMessage: %1は%2に%3を %4 吸収された！>
<MPDrainState_MultiDrainer: false>
```

## 💡 参考情報

このプラグインとHPドレインをおこなう「**[HTN_HPDrainState](https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_HPDrainState)**」を併用した上で、  
HPドレイン → MPドレイン の順にメッセージの表示がされるようにしたい場合は、  
「プラグイン管理」画面の「プラグインリスト」で  
**`HTN_MPDrainState` (MP) が上、 `HTN_HPDrainState` (HP) が下**の順に並べてください。直感とは逆の順番なので注意です。

### 式の書き方

吸収タイプに式を使うのは上級者向けの機能ではありますが、  
表現の幅は広がりますので、書く人向けにいくつか説明を加えておきます。

| 変数 | 内容 |
|---|---|
| `drainTarget` | ドレインされる側 |
| `drainer` | ドレインする側 |

それぞれのキャラ情報は、スキルのダメージ計算式と同様に参照可能です。

| 変数名 | 内容 | 変数名 | 内容 |
|---|---|---|---|
| `hp` | HP | `mhp` | 最大HP |
| `mp` | MP | `mmp` | 最大MP |
| `tp` | TP | `level` | レベル |
| `atk` | 攻撃力 | `def` | 防御力 |
| `mat` | 魔法攻撃力 | `mdf` | 魔法防御力 |
| `agi` | 敏捷性 | `luk` | 運 |

これらを組み合わせて表現します。（※ただし、敵は level を持たないため注意が必要です）  
以下に例を紹介します。

例１： **ドレインする側のMPが満タンになる以上は吸わない**

```
# プラグインパラメータに書く場合
Math.min(drainer.mmp - drainer.mp, drainTarget.mmp * 0.1)

# ステートのメモ欄に書くタグの場合
<MPDrainState_Amount: Math.min(drainer.mmp - drainer.mp, drainTarget.mmp * 0.1)>
```

ドレインされる側の最大MPの10%を吸いますが、  
ドレインする側の「最大MP − 現在MP」（失ったMP）を吸収量の上限とするようになります。

例２： **魔法ダメージの計算式風**

```
# プラグインパラメータに書く場合
30 + drainer.mat * 2 - drainTarget.mdf * 2

# ステートのメモ欄に書くタグの場合
<MPDrainState_Amount: 30 + drainer.mat * 2 - drainTarget.mdf * 2>
```

30をベースの値として、  
(ドレインする側の魔法攻撃力の2倍 - ドレインされる側の魔法防御力の2倍) の値を加えます。  

もし、ドレインされる側の魔法防御力が高くて、  
例えば 30 + 40 * 2 - 50 * 2 = -10 のようにマイナスの値になった場合は、吸収量は 0 になります。

30ダメージを保証したい場合は以下のように書くといいでしょう。

```
# プラグインパラメータに書く場合
30 + Math.max(drainer.mat * 2 - drainTarget.mdf * 2, 0)

# ステートのメモ欄に書くタグの場合
<MPDrainState_Amount: 30 + Math.max(drainer.mat * 2 - drainTarget.mdf * 2, 0)>
```

例３： **TPが10以下のときだけ大ダメージ**

```
# プラグインパラメータに書く場合
(drainTarget.tp <= 10) ? 1000 : 50

# ステートのメモ欄に書くタグの場合
<MPDrainState_Amount: (drainTarget.tp &lt;= 10) ? 1000 : 50>
```

ドレインされる側のTPが10以下のときは1000ダメージを吸い、  
それ以外のときは50ダメージを吸います。

タグ内で `<` や `>` を直接書くとタグの解釈に影響が出てしまうため、  
このプラグインでは `&lt;` を `<` に、 `&gt;` を `>` に変換して対応しています。


## 📝 作者情報

ハトネコエ  
**[X : @nekonenene](https://x.com/nekonenene)**  
HP : [https://hato-neko.x0.com](https://hato-neko.x0.com)

バグ報告や要望などは [X](https://x.com/nekonenene) にメンションでお寄せください。

## 📄 ライセンス

MIT License ( https://opensource.org/license/mit )
