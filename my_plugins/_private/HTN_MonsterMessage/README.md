# HTN_MonsterMessage

RPGツクールMZ用のプラグインです。

⚠️ **公開を意識せず作っているので、汎用性や厳密さはあまり考慮していません。**

モンスターが行動する際に、通常のメッセージウィンドウでセリフを表示できます。  
表示条件・内容・ステート付与などを JS で自由に記述できます。

どんなふうに設定できるかは `data/Enemy_0001.js` が参考になりますが、  
攻撃対象が１人であることを前提とした作りになっています。

## ディレクトリ構成

RPGツクールMZのプロジェクトファイルに、以下のように配置することを想定しています。

```
js/plugins/
└── HTN_MonsterMessage/
    ├── HTN_MonsterMessage.js   ← プラグイン管理に登録するのはこれだけ
    └── data/
        ├── constants.js        ← ステートID・変数IDなどの定数（最初に読み込まれる）
        ├── Enemy_0001.js       ← エネミーID 1 のセリフ定義
        └── Enemy_0002.js       ← エネミーID 2 のセリフ定義（以降同様）
```

`data/` 以下の JS ファイルは自動で読み込まれます。  
`constants.js` は他ファイルより先に読み込まれることが保証されています。

## API

### 登録メソッド

```javascript
HTN_MonsterMessage.registerEncountering(エネミーID, fn)
```
バトル開始時のセリフを登録します。  
同一エネミーIDが複数体いるトループでは、1体分のみ表示されます。

```javascript
HTN_MonsterMessage.registerBeforeAttack(エネミーID, fn)
```
行動前のセリフを登録します。

```javascript
HTN_MonsterMessage.registerAfterAttack(エネミーID, fn)
```
行動後のセリフを登録します。

### コールバック引数

```javascript
fn({ skill, subject, targets, target, messages, callCommonEvent, overwriteNextAction, addComboAttack, comboCount })
```

| 引数 | 型 | 説明 |
|---|---|---|
| `skill` | object | 使用スキル（`$dataSkills` の要素）。`skill.id` や `skill.name` で参照。`registerEncountering` では渡されない |
| `subject` | Game_Enemy | 行動エネミー |
| `targets` | Game_Battler[] | 対象バトラーの配列（パーティー並び順） |
| `target` | Game_Battler or null | `targets[0]` のショートハンド。対象なしの場合 null |
| `messages` | object | メッセージビルダー（後述） |
| `callCommonEvent` | function | メッセージ後にコモンイベントを呼び出す（後述） |
| `overwriteNextAction` | function or undefined | 発動スキル上書き関数（`registerBeforeAttack` のみ有効。後述） |
| `addComboAttack` | function or undefined | 連撃予約関数（`registerAfterAttack` のみ有効。後述） |
| `comboCount` | number | 連撃回数（0 = 初撃、1 = 1回目の連撃…）。`registerEncountering` では渡されない |

### messages ビルダー

| プロパティ / メソッド | 説明 |
|---|---|
| `.name` | 話者名。デフォルトはモンスター名。空文字で話者名なし |
| `.face` | 顔グラ `[faceName, faceIndex]`。デフォルト `['', 0]`（顔グラなし） |
| `.background` | 背景種別（0: 通常、1: 暗く、2: 透明）。デフォルト 1。`registerEncountering` のみデフォルト 0 |
| `.position` | 表示位置（0: 上、1: 中、2: 下）。デフォルト 2 |
| `.push(text)` | メッセージをバッファに追加。`\n` で改行 |
| `.pending` | バッファ内のメッセージ配列（`.length` で件数確認可） |

### callCommonEvent

```javascript
callCommonEvent(commonEventId)
```

指定IDのコモンイベントを呼び出します。  
内部では `$gameTemp.reserveCommonEvent(commonEventId)` を呼んでいます。

いずれの場合も、`messages` で積んだセリフが表示され尽くしてから実行されます。

実装は少し複雑なことになっていて、コモンイベントの内容によってはバグります。

registerBeforeAttack もしくは registerAfterAttack 内で callCommonEvent を呼び出したとき、  
コモンイベントの「戦闘行動の強制」があると進行不能になるバグがあったため、  
「戦闘行動の強制」だけ実行し、コモンイベントはそこで終了するような挙動にしています。

| 呼び出し元 | コモンイベントの開始タイミング | 備考 |
|---|---|---|
| `registerEncountering` | セリフ完了後 | `$gameTroop._interpreter` で実行（`$gameTemp.reserveCommonEvent` 経由） |
| `registerBeforeAttack` | セリフ完了後・アクション実行直前 | ログウィンドウ内の独立したインタープリタで実行 |
| `registerAfterAttack` | セリフ完了後 | 同上 |

### overwriteNextAction

```javascript
overwriteNextAction(skillIdOrName)
```

`registerBeforeAttack` のコールバック内でのみ有効です。  
`number` を渡すとスキルIDで、`string` を渡すとスキル名で検索し、指定したスキルを使用するようアクションを変更します。

ただし、このアクションは `forcing = true`（強制行動）として実行されるため、  
MPやTPが必要量より不足していても発動し、 paySkillCost の実装を見る限りではマイナスになりえます。

### addComboAttack

```javascript
addComboAttack(skillIdOrName?)
```

`registerAfterAttack` のコールバック内でのみ有効です。  
呼ぶと、現在の行動が終わった後にもう一度モンスターが行動します。

- `number` を渡すとスキルIDで、`string` を渡すとスキル名で検索して強制使用する（混乱などのステートを加味しない）
- 省略または `null` を渡した場合や、スキル名が見つからない場合は自動で行動が決まる

`comboCount` をチェックすることで連撃回数を制限できます。

## data/ ファイルの書き方

### constants.js

ステートIDや変数IDなど、複数のファイルから参照する定数をまとめます。  
これによって、あとからIDが変わったときに修正箇所を最小限にできます。

```javascript
'use strict';

// ステートID
HTN_MonsterMessage.STATE = {
  POISON: 4,
  SLEEP:  5,
};

// 変数ID（$gameVariables.value() で使う変数のID）
// ツクールのデータベースで定義した変数の数の範囲内でないと setValue が無視されるので注意
HTN_MonsterMessage.GAME_VARIABLE = {
  MET_ENEMY_0001: 1,
};

// コモンイベントID
HTN_MonsterMessage.COMMON_EVENT = {
  SENTAKUSHI_TEST: 1,
};
```

### Enemy_xxxx.js

エネミーごとにファイルを分けます。各ファイルはモジュールスコープで独立しているため、  
異なるファイルで同じ変数名を使っても衝突しません。

```javascript
'use strict';

const ENEMY_ID = 2;
const S = HTN_MonsterMessage.STATE;
const GV = HTN_MonsterMessage.GAME_VARIABLE;
const CE = HTN_MonsterMessage.COMMON_EVENT;
let targetBeforeAttackStateIds = [];

// 遭遇時のセリフ
HTN_MonsterMessage.registerEncountering(ENEMY_ID, ({ subject, targets, target, messages, callCommonEvent }) => {
  messages.push('遭遇時のセリフのテスト');
});

// 攻撃前のセリフ
HTN_MonsterMessage.registerBeforeAttack(ENEMY_ID, ({ skill, subject, targets, target, messages, callCommonEvent, comboCount }) => {
  targetBeforeAttackStateIds = target ? target.states().map(state => state.id) : [];

  messages.push('攻撃前のセリフのテスト');
});

// 攻撃後のセリフ
HTN_MonsterMessage.registerAfterAttack(ENEMY_ID, ({ skill, subject, targets, target, messages, callCommonEvent, comboCount, addComboAttack }) => {
  // 敵すべてに攻撃が当たった後のセリフ
  if (targets.every(t => t.result().success)) {
    messages.push('攻撃成功時のセリフ');
  }

  // デフォルトメッセージ
  if (messages.pending.length === 0) {
    messages.push('攻撃後のセリフのテスト');
  }
});
```
