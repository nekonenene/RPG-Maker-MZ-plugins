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

### 戦闘開始

```
BattleManager.startBattle()
  ├── $gameSystem.onBattleStart()
  ├── $gameParty.onBattleStart(preemptive)
  │     └── Game_Battler.onBattleStart(preemptive)
  │           └── initTp() が呼ばれる（isPreserveTp() が false のとき）
  ├── $gameTroop.onBattleStart(surprise)
  │     └── Game_Battler.onBattleStart(surprise)
  │           └── initTp() が呼ばれる（isPreserveTp() が false のとき）
  └── displayStartMessages()
```

### ターン中の行動

```
BattleManager.processTurn()
  ├── action = subject.currentAction()
  ├── action.prepare()
  │     └── 混乱中かつ強制行動でない場合、setConfusion() で通常攻撃へ変更
  ├── action.isValid()
  │     └── 強制行動なら item が存在すれば true、通常行動なら subject.canUse(item)
  ├── BattleManager.startAction()
  │     ├── targets = action.makeTargets()
  │     ├── subject.useItem(action.item())
  │     ├── action.applyGlobal()
  │     └── logWindow.startAction(subject, action, targets)
  └── subject.removeCurrentAction()

BattleManager._phase が "action" の間の更新
  └── Scene_Battle.updateBattleProcess()
        └── BattleManager.update()
              └── BattleManager.updatePhase()
                    └── BattleManager.updateAction()
                          ├── BattleManager.invokeAction(subject, target)
                          │     └── Game_Action.apply(target)
                          └── BattleManager.endAction()
```

`BattleManager.startAction()` は対象リストとログ開始を準備し、`BattleManager._phase` を `"action"` にする。  
実際の対象ごとの適用は、その後のバトル更新ループで `BattleManager.updateAction()` が呼ばれたときに進む。

### ターン終了

```
BattleManager.endAllBattlersTurn()
  ├── Game_Battler.onTurnEnd()
  │     ├── clearResult()
  │     ├── regenerateAll()
  │     ├── updateStateTurns()
  │     ├── updateBuffTurns()
  │     └── removeStatesAuto(2)
  └── BattleManager.displayBattlerStatus(battler, false)
```

### 戦闘終了

```
Scene_Battle.terminate()
  ├── $gameParty.onBattleEnd()
  │     └── Game_Battler.onBattleEnd()
  └── $gameTroop.onBattleEnd()
        └── Game_Battler.onBattleEnd()
```


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
