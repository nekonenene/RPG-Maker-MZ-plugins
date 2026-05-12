# RPGツクールMZ アーキテクチャ・処理フロー

プラグイン開発に役立つクラス構造や処理フローをまとめたドキュメント

コアスクリプトを読まないと把握しにくい内部構造を記録する。


## バトラーの継承構造

BattleManager.allBattleMembers で取得できる全バトラーのクラス構造

```
Game_Unit
  ├── Game_Party : プレイヤーのパーティ
  └── Game_Troop : 敵グループ
```

```
Game_BattlerBase
  └── Game_Battler
        ├── Game_Actor : アクター（プレイヤーキャラ）
        └── Game_Enemy : 敵キャラ
```


## バトル全体のライフサイクル

`Scene_Battle.update()` は毎フレーム呼ばれ、active かつ busy でないとき `Scene_Battle.updateBattleProcess()` を呼ぶ。  
`updateBattleProcess()` は `BattleManager.update()` を呼び、その中の `BattleManager.updatePhase()` が現在の `_phase` に応じて処理を分岐する。

```
Scene_Battle.update()
  └── Scene_Battle.updateBattleProcess()
        └── BattleManager.update()
              └── BattleManager.updatePhase()
```

### BattleManager._phase の遷移

ターン制バトルでは、基本的に次の順で `_phase` が変わる。`{{ }}` で括られた部分を繰り返す。  
TPB では `"input"` を経由せず `"start"` から `"turn"` に進む。

```sh
{{"start" → "input" → {{"turn" → "action"}} → "turn" → "turnEnd"}} → "battleEnd" → ""（空文字列にリセット）
```


```
BattleManager.startBattle()
  └── _phase = "start"

BattleManager.updateStart()
  ├── ターン制: startInput() → _phase = "input"
  └── TPB: _phase = "turn"

BattleManager.startTurn()
  └── _phase = "turn"

BattleManager.startAction()
  └── _phase = "action"

BattleManager.endAction()
  └── _phase = "turn"

BattleManager.endTurn()
  └── _phase = "turnEnd"

BattleManager.updateTurnEnd()
  ├── ターン制: endAllBattlersTurn() → _phase = "start"
  └── TPB: startTurn() → _phase = "turn"

BattleManager.endBattle(result)
  └── _phase = "battleEnd"

BattleManager.updateBattleEnd()
  └── _phase = ""（空文字列）
```

`BattleManager.updatePhase()` は `_phase` に応じて `updateStart()`、`updateTurn()` など、そのフェーズに適した更新処理をおこなう。  
`"input"` は `updatePhase()` の分岐にない。コマンド入力中の状態を表す。

### 戦闘開始

まずは `_phase` が `"start"` になる。

```
Scene_Battle.start()
  └── BattleManager.startBattle()
        ├── _phase = "start"
        ├── $gameSystem.onBattleStart()
        ├── $gameParty.onBattleStart(preemptive) : プレイヤーの先制攻撃
        │     └── Game_Battler.onBattleStart(preemptive)
        ├── $gameTroop.onBattleStart(surprise) : 敵グループの先制攻撃
        │     └── Game_Battler.onBattleStart(surprise)
        └── displayStartMessages()
```

#### `_phase` が `"start"` のとき

TPB ではすぐに、ターン制バトルではコマンド入力を経て、 `_phase` が `"turn"` になる。

```
BattleManager.updatePhase()
  └── BattleManager.updateStart()
        ├── ターン制: BattleManager.startInput()
        │     ├── _phase = "input"
        │     ├── $gameParty.makeActions()
        │     └── $gameTroop.makeActions()
        │           └── 敵グループの先制攻撃または入力不能なら BattleManager.startTurn() が呼ばれる
        └── TPB: _phase = "turn"
```

`_phase = "input"` 処理とともに `this._inputting = true` が呼ばれ、 `BattleManager.isInputting()` が true になる。  
結果、 `Scene_Battle.update()` 起点で呼ばれる `changeInputWindow` から `startPartyCommandSelection` が呼ばれ、  
`_partyCommandWindow` (Window_PartyCommand) の setup() が呼ばれ、プレイヤーはコマンド入力を求められる。

#### ターン制バトルでのコマンド入力後

```
BattleManager.selectNextCommand()
  └── BattleManager.selectNextActor()
        └── 入力可能なアクターがいなければ BattleManager.startTurn()
              ├── _phase = "turn"
              ├── $gameTroop.increaseTurn()
              ├── BattleManager.makeActionOrders()
              └── logWindow.startTurn()
```

### ターン中の行動

`_phase` が turn → action → turn → action → turn ... と切り替わり、  
１ターンにおける行動主体がいなくなったとき turnEnd へ移行する。  
TPB では１バトラーの行動終了後に turnEnd へ移行する。

#### `_phase` が `"turn"` のとき

`updatePhase()` は `BattleManager.updateTurn()` を呼ぶ：

```
BattleManager.updateTurn()
  └── BattleManager.processTurn()
        ├── action = subject.currentAction()
        ├── action.prepare()
        │     └── 混乱中かつ強制行動でない場合、setConfusion() で通常攻撃へ変更
        ├── action.isValid()
        │     └── 強制行動なら item が存在すれば true、通常行動なら subject.canUse(item)
        ├── BattleManager.startAction()
        │     ├── _phase = "action"
        │     ├── targets = action.makeTargets()  ← 行動対象バトラーの配列
        │     ├── subject.useItem(action.item())
        │     ├── action.applyGlobal()
        │     └── logWindow.startAction(subject, action, targets)
        └── subject.removeCurrentAction()
```

`targets` は、その行動を適用するバトラーの配列。単体攻撃なら1体、全体攻撃なら複数体になる。

`BattleManager.startAction()` は `targets` とログ開始を準備し、`BattleManager._phase` を `"action"` にする。  
この時点では `Game_Action.apply(target)` はまだ呼ばれない。

#### `_phase` が `"action"` のとき

`updatePhase()` は `BattleManager.updateAction()` を呼ぶ：

```
BattleManager.updateAction()
  ├── BattleManager.invokeAction(subject, target)  ← target は targets から取り出した1体
  │     └── Game_Action.apply(target)
  └── 行動対象バトラーが尽きたら BattleManager.endAction()
        ├── logWindow.endAction(subject)
        ├── _phase = "turn"
        └── subject の残り行動がなければ BattleManager.endBattlerActions(subject)
              ├── subject.setActionState("done")（TPB では "undecided"）
              ├── subject.onAllActionsEnd()
              │     ├── clearResult()
              │     ├── removeStatesAuto(1) : 行動終了時のステート解除処理
              │     └── removeBuffsAuto()
              ├── subject.clearTpbChargeTime()
              ├── BattleManager.displayBattlerStatus(subject, true)
              └── BattleManager._subject = null
```

行動対象バトラーが複数いる場合は、`updateAction()` が更新ごとに `targets` から1体ずつ取り出して `invokeAction()` を呼ぶ。

`BattleManager.endAction()` のあと `_phase` は `"turn"` に戻るため、以降の `updatePhase()` は再び `BattleManager.updateTurn()` を呼ぶ。

### ターン終了

`_phase` が `"turn"` のとき、 `updatePhase()` は `BattleManager.updateTurn()` を呼ぶ。  
このとき行動主体がいなければ `endTurn()` を呼び、ターン終了処理に移行していく。

```
BattleManager.updateTurn()
  ├── BattleManager.getNextSubject()
  │     └── 行動順リストから次の行動主体を取り出す
  ├── 行動主体がいれば BattleManager.processTurn()
  └── 行動主体がいなければ BattleManager.endTurn()
        └── _phase = "turnEnd"
```

#### `_phase` が `"turnEnd"` のとき

`_phase` が `"turnEnd"` のとき、次のターンに進む場合と戦闘終了に進む場合がある。  
以下で示すのは次のターンに進む場合のフロー。

```
BattleManager.updatePhase()
  └── BattleManager.updateTurnEnd()
        ├── TPB: BattleManager.startTurn()
        │     └── _phase = "start" → BattleManager.updateStart により _phase = "turn"
        ├── ターン制: BattleManager.endAllBattlersTurn()
        │     ├── Game_Battler.onTurnEnd()
        │     │     ├── clearResult()
        │     │     ├── regenerateAll()
        │     │     ├── updateStateTurns()
        │     │     ├── updateBuffTurns()
        │     │     └── removeStatesAuto(2) : ターン終了時のステート解除処理
        │     └── BattleManager.displayBattlerStatus(battler, false)
        └── ターン制: _phase = "start"
```

### 戦闘終了

`BattleManager.update()` は `updatePhase()` より先に `updateEvent()` を呼ぶ。

そのため `_phase` が `"turnEnd"` でも、勝敗条件を満たしている場合には `updateTurnEnd()` へ進まず `endBattle()` が呼ばれる。

```
Scene_Battle.update()
  └── Scene_Battle.updateBattleProcess()
        └── BattleManager.update()
              ├── BattleManager.updateEvent()
              │     └── BattleManager.updateEventMain() ← _phase が "turnEnd" のとき
              │           ├── $gameTroop.updateInterpreter()
              │           ├── $gameParty.requestMotionRefresh()
              │           └── BattleManager.checkBattleEnd()
              │                 ├── $gameParty.isEscaped()
              │                 │     └── BattleManager.processPartyEscape()
              │                 │           └── BattleManager.processAbort()
              │                 │                 └── BattleManager.endBattle(1)
              │                 ├── $gameParty.isAllDead()
              │                 │     └── BattleManager.processDefeat()
              │                 │           └── BattleManager.endBattle(2)
              │                 └── $gameTroop.isAllDead()
              │                        └── BattleManager.processVictory() : 経験値やアイテム獲得の処理
              │                              └── BattleManager.endBattle(0)
              │                                    └── _phase = "battleEnd"
              └── updateEvent() が true を返すため、このフレームでは updatePhase() は呼ばれない
```

`endBattle(result)` は `_phase` を `"battleEnd"` に変更する。

#### `_phase` が `"battleEnd"` のとき

`BattleManager.update()` から呼んだ `updateEvent()` が false になったとき、  
`updatePhase()` から `updateBattleEnd()` が呼ばれる。

```
BattleManager.updateBattleEnd()
  ├── SceneManager.goto(Scene_Gameover) : 敗北時
  ├── SceneManager.pop()
  │     └── SceneManager.goto(復帰先シーン)
  │           ├── SceneManager._nextScene に復帰先シーンを設定
  │           └── 現在の Scene_Battle.stop()
  └── _phase = ""（空文字列にリセット）
```

#### バトルシーンが終わり、次のシーンに移行する

`SceneManager.goto` により `_nextScene` が設定されると  
`isSceneChanging` が true になるため `changeScene` メソッドはシーンの終了処理を呼び出す。

```
SceneManager.update()
  └── SceneManager.updateMain()
        ├── SceneManager.changeScene()
        │     ├── 現在のシーンの terminate()
        │     │     └── Scene_Battle.terminate()
        │     │           ├── $gameParty.onBattleEnd()
        │     │           │     └── Game_Battler.onBattleEnd()
        │     │           └── $gameTroop.onBattleEnd()
        │     │                 └── Game_Battler.onBattleEnd()
        │     ├── SceneManager._scene = SceneManager._nextScene
        │     └── SceneManager._nextScene = null
        └── SceneManager.updateScene()
```

こうして、元のマップ画面などのシーンに戻る。


## HP/MP/TP 変化の処理フロー

### スキル・アイテムによる変化

```
Game_Action.apply(target)
  ├── executeDamage(target, value)
  │     └── executeHpDamage(target, value)
  │           └── target.gainHp(-value)  ← ダメージは負値として渡す
  └── applyItemEffect(target, effect)
        ├── itemEffectRecoverHp(target, effect)
        │     └── target.gainHp(value)   ← 回復は正値
        ├── itemEffectRecoverMp(target, effect)
        │     └── target.gainMp(value)
        └── itemEffectGainTp(target, effect)
              └── target.gainTp(value)
```

### ターン終了時のリジェネ

```
Game_Battler.onTurnEnd()
  ├── clearResult()          ← resultをリセット
  ├── regenerateAll()
  │     ├── regenerateHp()  → gainHp(value)      ← result に記録される
  │     ├── regenerateMp()  → gainMp(value)      ← result に記録される
  │     └── regenerateTp()  → gainSilentTp(value) ← result に記録されない
  ├── updateStateTurns()
  └── removeStatesAuto(2)
```

### setTp が呼ばれる主なケース

| 呼び出し元 | 状況 |
|---|---|
| `gainTp(value)` | TP増減全般（result 記録あり） |
| `gainSilentTp(value)` | ターン終了リジェネ（result 記録なし） |
| `initTp()` | バトル開始時のTP初期化（`Math.randomInt(25)`） |
| `clearTp()` | TPを0にリセット |


## バトルログの表示フロー

### スキル・アイテム使用時

```
Window_BattleLog.displayActionResults(subject, target)
  ├── push("popupDamage", target)
  ├── push("popupDamage", subject)
  ├── displayDamage(target)
  │     ├── displayHpDamage(target)
  │     │     ├── [hpDamage > 0] push("performDamage", target)  ← ダメージ音
  │     │     ├── [hpDamage < 0] push("performRecovery", target) ← 回復音
  │     │     └── push("addText", ...)
  │     ├── displayMpDamage(target)
  │     │     ├── [mpDamage > 0] （音なし）
  │     │     ├── [mpDamage < 0] push("performRecovery", target)
  │     │     └── push("addText", ...)
  │     └── displayTpDamage(target)
  │           └── ...（MP と同様）
  └── displayAffectedStatus(target)
```

### ターン終了時のリジェネ表示

```
BattleManager.displayBattlerStatus(battler, current)
  ├── logWindow.displayAutoAffectedStatus(battler)
  ├── logWindow.displayCurrentState(battler)   ← current=true のときのみ
  └── logWindow.displayRegeneration(battler)
        └── push("popupDamage", battler)
```


## ダメージ音の呼び出し構造

`Window_BattleLog.performDamage(target)` は `target.performDamage()` を呼ぶだけで、  
音の再生はバトラーのサブクラスに委譲されている。

```
Game_Battler.performDamage()   → 何もしない（基底クラス）
Game_Actor.performDamage()     → ダメージモーション + SoundManager.playActorDamage()
Game_Enemy.performDamage()     → ブリンクエフェクト + SoundManager.playEnemyDamage()
```
