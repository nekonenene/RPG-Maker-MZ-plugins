# RPGツクールMZ アーキテクチャ・処理フロー

プラグイン開発に役立つクラス構造・処理フロー・フックポイントをまとめたドキュメント。
コアスクリプトを読まないと把握しにくい内部構造を記録する。

---

## バトラーの継承構造

```
Game_BattlerBase
  └── Game_Battler
        ├── Game_Actor
        └── Game_Enemy
```

### Game_BattlerBase の責務

- HP/MP/TP の実値（`_hp`, `_mp`, `_tp`）の保持と `refresh()` によるクランプ
- `setHp(hp)`, `setMp(mp)`, `setTp(tp)` — 絶対値で直接設定し `refresh()` を呼ぶ
- ステート・バフ管理の基礎

### Game_Battler の責務

- `gainHp(value)`, `gainMp(value)`, `gainTp(value)` — **result に変化量を記録してから** `setHp/Mp/Tp` を呼ぶ
- `gainSilentTp(value)` — result に記録せず `setTp` のみ呼ぶ（TPリジェネ用）
- リジェネ処理（`regenerateAll` / `regenerateHp` / `regenerateMp` / `regenerateTp`）
- バトルアクション結果の記録（`_result: Game_ActionResult`）

### result への記録ルール

| メソッド | hpDamage / mpDamage / tpDamage への記録 |
|---|---|
| `gainHp(value)` | `hpDamage = -value`（回復なら負値） |
| `gainMp(value)` | `mpDamage = -value` |
| `gainTp(value)` | `tpDamage = -value` |
| `gainSilentTp(value)` | **記録しない** |
| `setHp/Mp/Tp(value)` | **記録しない** |

---

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

---

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

---

## ダメージ音の呼び出し構造

`Window_BattleLog.performDamage(target)` は `target.performDamage()` を呼ぶだけで、
音の再生はバトラーのサブクラスに委譲されている。

```
Game_Battler.performDamage()   → 何もしない（基底クラス）
Game_Actor.performDamage()     → ダメージモーション + SoundManager.playActorDamage()
Game_Enemy.performDamage()     → ブリンクエフェクト + SoundManager.playEnemyDamage()
```

---

## バトル開始・終了のライフサイクル

```
戦闘開始
  └── Game_Battler.onBattleStart(advantageous)
        └── initTp() が呼ばれる（isPreserveTp() が false のとき）

ターン終了
  └── Game_Battler.onTurnEnd()
        ├── clearResult()
        ├── regenerateAll()
        ├── updateStateTurns()
        ├── updateBuffTurns()
        └── removeStatesAuto(2)

戦闘終了
  └── Game_Battler.onBattleEnd()
```
