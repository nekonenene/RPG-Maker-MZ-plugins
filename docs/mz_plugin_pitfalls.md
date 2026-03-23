# RPGツクールMZ プラグイン開発における注意点・前提知識

プラグイン開発の中で実際に踏んだ落とし穴や、知っておくと実装効率が上がる知識をまとめたドキュメント。
`mz_scripts/` を grep する前に、まずここを確認すること。

---

## 独自プロパティの初期化は `initMembers` ではなく `onBattleStart` で

**`initMembers` はセーブデータ読み込み時には呼ばれない。**

`initMembers` が呼ばれるのは `new Game_Actor()` / `new Game_Enemy()` のタイミングのみ。
プロジェクト途中からプラグインを追加した場合や、セーブデータを読み込んで戦闘を開始した場合は、
すでに生成済みのバトラーインスタンスに対して `initMembers` は実行されない。
その結果、独自プロパティが `undefined` のままになり、実行時エラーになる。

**解決策：バトル中にのみ使う独自プロパティは `onBattleStart` で初期化し、`onBattleEnd` でリセットする。**

```javascript
const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function(advantageous) {
  _Game_Battler_onBattleStart.call(this, advantageous);
  this._myCustomData = {}; // ここで初期化
};

const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
Game_Battler.prototype.onBattleEnd = function() {
  _Game_Battler_onBattleEnd.call(this);
  this._myCustomData = {};
};
```

`onBattleStart` は全バトラーに対して毎回戦闘開始時に呼ばれるため、セーブデータ読み込み後でも安全。

---

## `removeState` はゲーム開始時にも呼ばれる

`setupNewGame` → `Game_Battler.prototype.refresh` の流れで、**ゲーム開始時にも `removeState` が呼ばれる**。

`removeState` をフックする場合、独自プロパティがまだ初期化されていない可能性があるため、
必ず `null` チェックを入れること。

```javascript
const _Game_Battler_removeState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function(stateId) {
  _Game_Battler_removeState.call(this, stateId);
  // _myCustomData はゲーム開始時には undefined の可能性があるため null チェック必須
  if (this._myCustomData != null) {
    delete this._myCustomData[stateId];
  }
};
```

---

## `Game_Action.prototype.apply` はバトル外でも呼ばれる

メニュー画面でのアイテム使用や、イベントスクリプトからのスキル実行など、
`apply` は**戦闘中以外でも呼ばれる**。

バトル専用の処理（ドレイン実行者の記録、バトルログへの書き込みなど）をフックする場合は、
冒頭に `$gameParty.inBattle()` チェックを入れること。

```javascript
const _Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
  _Game_Action_apply.call(this, target);
  if (!$gameParty.inBattle()) return; // バトル外は何もしない
  // バトル専用の処理...
};
```

---

## ターン制バトルでのダメージポップアップは直接呼べない

`regenerateAll`（ターン終了時の自然回復）の中でバトラーの `result` を設定して
`startDamagePopup()` を呼んでも、**ターン制バトルではポップアップが表示されない**。

**原因：** `endAllBattlersTurn()` → `onTurnEnd()` → `clearResult()` が同期的に走るため、
スプライト層がポップアップを処理する前に `result` が空になってしまう。
（TPBでは処理タイミングが異なるため問題は起きない）

**解決策：** `Window_BattleLog.push('メソッド名', ...)` でキューに積み、
キュー処理のタイミングで `result` を再セットする。

```javascript
// Window_BattleLog に独自メソッドを追加
Window_BattleLog.prototype.showMyPopup = function(battler, amount) {
  battler._result.hpAffected = true;
  battler._result.hpDamage = -amount; // 負の値 = 回復
  battler.startDamagePopup();
};

// キュー経由で呼び出す
this.push('showMyPopup', battler, amount);
```

---

## `Window_BattleLog` のキューパターン

`Window_BattleLog.push(methodName, ...args)` でメソッド呼び出しをキューに積める。
キューはフレームごとに非同期で処理される。

標準的なテキスト表示パターン：

```javascript
this.push('addText', 'メッセージ');
this.push('wait');
this.push('clear');
```

`Window_BattleLog.prototype` に独自メソッドを定義すれば `push` 経由で呼び出せる。

---

## `displayAutoAffectedStatus` フックでメッセージを挿入する

`Window_BattleLog.prototype.displayAutoAffectedStatus` は、
アクション処理後にステート変化（付与・解除）のメッセージを表示するメソッド。

このメソッドの先頭をフックすると、**ステート変化メッセージの前に**独自メッセージやポップアップを挿入できる。

```javascript
const _displayAutoAffectedStatus = Window_BattleLog.prototype.displayAutoAffectedStatus;
Window_BattleLog.prototype.displayAutoAffectedStatus = function(subject) {
  // ここでキューに積んだものが、ステート変化メッセージより先に処理される
  if (subject._myPendingMessages?.length > 0) {
    for (const msg of subject._myPendingMessages) {
      this.push('addText', msg);
    }
    this.push('wait');
    this.push('clear');
    subject._myPendingMessages = [];
  }
  _displayAutoAffectedStatus.call(this, subject);
};
```

---

## ステートの `meta` はすべて文字列

RPGツクールMZはメモ欄のタグを自動パースして `state.meta` に格納するが、
**値はすべて文字列型**で返ってくる。数値・真偽値への変換は自分で行う必要がある。

```javascript
// <MyTag: 50>  →  state.meta.MyTag === '50'  (文字列)
const value = Number(state.meta.MyTag ?? 0);

// <MyFlag: true>  →  state.meta.MyFlag === 'true'  (文字列)
const flag = String(state.meta.MyFlag).toLowerCase() === 'true';

// <MyTag>  →  state.meta.MyTag === ''  (空文字列、または true の場合もある)
const exists = state.meta.MyTag != null;
```

タグ内の `<` や `>` はHTMLエンティティ（`&lt;` / `&gt;`）でエスケープして書かれる場合があり、
RPGツクールMZは自動変換しないため、`eval` などで使う前に手動で置換が必要。

```javascript
const formula = String(state.meta.MyFormula ?? '').replace('&lt;', '<').replace('&gt;', '>');
```

---

## 通常攻撃によるステート付与の検出

`item().effects` の各要素には `{ code, dataId, value1, value2 }` が入っている。
`code === Game_Action.EFFECT_ADD_STATE`（= 21）がステート付与を意味するが、
**`dataId === 0` は「通常攻撃のステート付与特性」を意味し、具体的なステートIDではない**。

通常攻撃でのステート付与を検出したい場合は `subject().attackStates()` で実際のステートIDを確認する。

```javascript
const hasAddDrainState = this.item().effects.some(
  (e) =>
    e.code === Game_Action.EFFECT_ADD_STATE &&
    (e.dataId === state.id || (e.dataId === 0 && this.subject().attackStates().includes(state.id)))
);
```

---

## エネミーの識別はインデックスで行う

エネミーはアクターの `actorId` のような永続IDを持たない。
**`$gameTroop.members()` 内のインデックス**（0始まり）で識別する。

```javascript
// 保存
const enemyIndex = battler.index(); // Game_Enemy.prototype.index()

// 復元
const enemy = $gameTroop.members()[enemyIndex];
```

同名のエネミーが複数いる場合でもインデックスで区別できる。

---

## アクターの並び順は actorId とは異なる

`actor.actorId()` はデータベース上の固定IDだが、
**パーティーでの並び順は `$gameParty.members()` のインデックス**であり、これは動的に変わる。

表示順などでパーティー順に並べたい場合は `findIndex` を使う。

```javascript
// actorId でソートすると、パーティーの並び順とずれる場合がある
// 正しい並び順ソートは findIndex を使う
const partyOrder = $gameParty.members().findIndex(m => m.actorId() === info.actorId);
```

---

## `BattleManager.allBattleMembers()` で全バトラーを取得

パーティー全員と敵グループ全員をまとめて取得したい場合は `BattleManager.allBattleMembers()` を使う。

```javascript
for (const battler of BattleManager.allBattleMembers()) {
  // Game_Actor / Game_Enemy を問わず全バトラーを処理
}
```

---

## 死亡後のステート解除メッセージを正しい順序で表示する

`die()` のフックの中で `displayAutoAffectedStatus` を直接呼ぶと、
**ダメージ表示や「〇〇は倒れた」メッセージより先にキューへ積まれてしまい**、順序が逆転する。

`BattleManager.displayBattlerStatus` をフックし、死亡バトラーの表示処理が済んだ直後に
ペンディングリストを処理するパターンが有効。

```javascript
const _displayBattlerStatus = BattleManager.displayBattlerStatus;
BattleManager.displayBattlerStatus = function(battler, current) {
  _displayBattlerStatus.call(this, battler, current);

  const pending = BattleManager._myPendingBattlers;
  if (pending == null || pending.length === 0) return;

  BattleManager._myPendingBattlers = [];
  for (const b of pending) {
    _displayBattlerStatus.call(this, b, false);
  }
};
```

また、解除メッセージだけを表示したい（付与メッセージを出したくない）場合は、
`result.addedStates` を一時的に空にしてから呼び出す。

```javascript
const saved = battler._result.addedStates;
battler._result.addedStates = [];
_displayBattlerStatus.call(this, battler, false);
battler._result.addedStates = saved;
```
