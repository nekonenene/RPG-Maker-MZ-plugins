// --------------------------------------------------------------------------
//
// HTN_MPDrainState.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/03/23 v1.0.0 First release
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc Creates a state that drains MP from the afflicted to the drainer each turn (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
 * @url https://github.com/nekoneneve/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_MPDrainState
 *
 * @param AmountType
 * @text Drain amount type
 * @desc Determines how the drain amount is calculated.
 * @default selfMaxMp
 * @type select
 * @option Fixed MP value
 * @value absolute
 * @option % of afflicted's max MP
 * @value selfMaxMp
 * @option % of afflicted's current MP
 * @value selfMp
 * @option % of drainer's max MP
 * @value drainerMaxMp
 * @option % of drainer's missing MP (max MP - current MP)
 * @value drainerMissingMp
 * @option Formula (advanced)
 * @value formula
 *
 * @param Amount
 * @text Drain amount
 * @desc A fixed MP value or a percentage. When type is "formula", this field accepts a JavaScript formula string.
 * @default 12.5
 * @type string
 *
 * @param AmountRandomizer
 * @text Drain amount randomizer (%)
 * @desc Random multiplier width (%). 0=fixed, 20=0.8 to 1.2x.
 * @default 0
 * @type number
 * @min 0
 * @max 80
 *
 * @param DrainMessage
 * @text Drain message
 * @desc Message shown when MP drain occurs. %1=afflicted name, %2=drainer name, %3=MP label, %4=drain amount.
 * @default %1 had %4 %3 drained by %2!
 * @type string
 *
 * @param AllowDeplete
 * @text Allow draining target to 0 MP
 * @desc If false, the afflicted will retain at least 1 MP after draining.
 * @default true
 * @type boolean
 *
 * @param MultiDrainer
 * @text Allow multiple drainers
 * @desc If true, re-applying the state to the same target accumulates drainers instead of replacing. MP is drained to all of them. The state is only removed when all drainers are defeated.
 * @default false
 * @type boolean
 *
 * @help
 * Add the following note tag in a state's Note box to make it an MP drain state:
 * <MPDrainState>
 *
 * The state remembers who applied it. By default, only the most recent applier
 * is remembered. With MultiDrainer enabled, all appliers are remembered.
 * At the end of the afflicted battler's turn, MP is drained from the afflicted
 * and recovered by the drainer (up to the drainer's max MP).
 * The state is also removed if the drainer is defeated.
 *
 * --- Per-state overrides (all optional) ---
 * <MPDrainState_AmountType: absolute>          Fixed MP value
 * <MPDrainState_AmountType: selfMaxMp>         % of afflicted's max MP
 * <MPDrainState_AmountType: selfMp>            % of afflicted's current MP
 * <MPDrainState_AmountType: drainerMaxMp>      % of drainer's max MP
 * <MPDrainState_AmountType: drainerMissingMp>  % of drainer's missing MP (max MP - current MP)
 * <MPDrainState_AmountType: formula>           JavaScript formula (advanced)
 *
 * <MPDrainState_Amount: 50>
 * <MPDrainState_Amount: Math.max(drainTarget.mmp / 10, drainer.mat * 2)>
 *
 * When AmountType is "formula", set a JavaScript formula in Amount.
 * Variables: drainTarget, drainer
 * The formula result is rounded up with Math.ceil and clamped to 0 or more.
 * For example, Math.max(drainTarget.mmp / 10, drainer.mat * 2) drains the greater
 * of 1/10 of the afflicted's max MP or twice the drainer's magic attack power.
 * Note: In tags, < and > can be written as &lt; and &gt; to avoid parsing issues.
 *
 * <MPDrainState_AmountRandomizer: 0>
 *
 * <MPDrainState_DrainMessage: %1 had %4 %3 drained by %2!>
 *
 * <MPDrainState_AllowDeplete: true>
 * <MPDrainState_AllowDeplete: false>
 *
 * <MPDrainState_MultiDrainer: true>   Enable multi-drainer for this state
 * <MPDrainState_MultiDrainer: false>  Disable multi-drainer for this state
 */

/*:ja
 * @target MZ
 * @plugindesc MPを吸収され続けるステート（状態異常）を作成できます (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekoneneve/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_MPDrainState
 *
 * @param AmountType
 * @text 吸収タイプ
 * @desc 吸収量の計算タイプです。
 * @default selfMaxMp
 * @type select
 * @option 固定値（MP）
 * @value absolute
 * @option ドレインされる側の最大MPに対する割合（%）
 * @value selfMaxMp
 * @option ドレインされる側の現在MPに対する割合（%）
 * @value selfMp
 * @option ドレインする側の最大MPに対する割合（%）
 * @value drainerMaxMp
 * @option ドレインする側の「最大MP−現在MP」に対する割合（%）
 * @value drainerMissingMp
 * @option 計算式（上級者向け）
 * @value formula
 *
 * @param Amount
 * @text 吸収量
 * @desc MP量の固定値かパーセンテージの数値を指定します。タイプが計算式(formula)の場合、JavaScript式を記述します。
 * @default 12.5
 * @type string
 *
 * @param AmountRandomizer
 * @text 吸収量のランダム幅（%）
 * @desc 吸収量に与えるランダム性。例えば20のとき、計算結果に0.8〜1.2倍のランダムな乗数が掛かります。
 * @default 0
 * @type number
 * @min 0
 * @max 80
 *
 * @param DrainMessage
 * @text ドレインメッセージ
 * @desc MP吸収時に表示するメッセージ。%1=被付与者名、%2=ドレイン実行者名、%3=MPの設定名、%4=吸収量。
 * @default %1は%2に%3を %4 吸収された！
 * @type string
 *
 * @param AllowDeplete
 * @text 吸収によるMP枯渇を許可
 * @desc falseにすると、MP吸収で被付与者のMPが0にならないよう吸収量を制限します。
 * @default true
 * @type boolean
 *
 * @param MultiDrainer
 * @text 複数のドレイン実行者を許可
 * @desc 許可すると、ステートが治る前に他のキャラから付与された場合に、そのキャラからもMP吸収を受けるようになります。
 * @default false
 * @type boolean
 *
 * @help
 * 【使い方】
 * MP吸収ステートにしたいステートの「メモ」欄に、次のタグを記述してください。
 * <MPDrainState>
 *
 * ステートを付与した相手が記憶され、
 * 被付与者のターン終了時に、MPが付与した相手に渡されます。
 * 付与した者が戦闘不能になった場合、ステートは自動解除されます。
 *
 * デフォルトでは最後に付与した１人だけが記憶されますが、
 * 「複数のドレイン実行者を許可」を true にすると複数人を記憶できます。
 * その場合はターン終了時に複数人からMPがドレインされ、
 * また、付与した全員が倒されたときにステートが自動解除されます。
 *
 * 【ステートごとの個別設定（すべて省略可）】
 * 省略した場合はプラグインパラメータの設定値が使用されます。
 *
 * <MPDrainState_AmountType: absolute>          固定値
 * <MPDrainState_AmountType: selfMaxMp>         ドレインされる側の最大MP基準（%）
 * <MPDrainState_AmountType: selfMp>            ドレインされる側の現在MP基準（%）
 * <MPDrainState_AmountType: drainerMaxMp>      ドレインする側の最大MP基準（%）
 * <MPDrainState_AmountType: drainerMissingMp>  ドレインする側の「最大MP−現在MP」基準（%）
 * <MPDrainState_AmountType: formula>           計算式（上級者向け）
 *
 * <MPDrainState_Amount: 50>
 * <MPDrainState_Amount: Math.max(drainTarget.mmp / 10, drainer.mat * 2)>
 *
 * AmountType が「formula（計算式）」のとき、Amount に JavaScript 式を記述します。
 * （難しいので、ツクールに慣れている人向けです）
 * 例えば Math.max(drainTarget.mmp / 10, drainer.mat * 2) と設定すると、
 * 「ドレインされる側の最大MPの10分の1」か「ドレインする側の魔法攻撃力の2倍」かの大きい方が吸収量になります。
 * 変数: drainTarget（ドレインされる側）, drainer（ドレインする側）
 * 文字列内の &lt; は < に、 &gt; は > に変換されますので、タグで式を書くときにご活用ください。
 *
 * <MPDrainState_AmountRandomizer: 0>   （ランダム幅を0%に。計算結果が固定値になる）
 * <MPDrainState_AmountRandomizer: 80>  （ランダム幅を80%に。計算結果に0.2〜1.8倍の乗数が掛かる）
 *
 * <MPDrainState_DrainMessage: %1は%2に%3を %4 吸収された！>
 * （%1=被付与者名、%2=ドレイン実行者名、%3=MPの設定名、%4=吸収量）
 *
 * <MPDrainState_AllowDeplete: true>   （吸収によるMP枯渇を許可）
 * <MPDrainState_AllowDeplete: false>  （吸収で最低1MPを保持）
 *
 * <MPDrainState_MultiDrainer: true>   （複数のドレイン実行者を許可）
 * <MPDrainState_MultiDrainer: false>  （最後に付与した１人だけを記憶）
 */

(() => {
  'use strict';

  const pluginName = 'HTN_MPDrainState';
  const parameters = PluginManager.parameters(pluginName);
  const paramAmountType = String(parameters.AmountType || 'selfMaxMp');
  const paramAmount = String(parameters.Amount ?? '12.5');
  const paramAmountRandomizer = Math.min(80, Math.max(0, Number(parameters.AmountRandomizer ?? 0)));
  const paramDrainMessage = String(parameters.DrainMessage || '%1は%2に%3を %4 吸収された！');
  const paramAllowDeplete = String(parameters.AllowDeplete) !== 'false';
  const paramMultiDrainer = String(parameters.MultiDrainer) === 'true';

  /**
   * 文字列や真偽値の入力を真偽値へ変換する
   *
   * @param {boolean | string} value 変換対象の値
   * @param {boolean} defaultValue 変換不能時の既定値
   * @returns {boolean} 変換後の真偽値
   */
  const toBoolean = (value, defaultValue) => {
    const strValue = String(value).trim().toLowerCase();

    if (strValue === 'true') {
      return true;
    } else if (strValue === 'false') {
      return false;
    }

    return defaultValue;
  };

  /**
   * ドレイン実行者の情報オブジェクトからバトラーインスタンスを返す
   *
   * @param {{ actorId: number, enemyIndex: number }} drainerInfo ドレイン実行者の情報
   * @returns {Game_Battler | null} 対応するバトラー。見つからない場合は null
   */
  const resolveDrainer = (drainerInfo) => {
    if (drainerInfo == null) return null;

    if (drainerInfo.actorId > 0) {
      return $gameActors.actor(drainerInfo.actorId) ?? null;
    } else if (drainerInfo.enemyIndex >= 0) {
      return $gameTroop.members()[drainerInfo.enemyIndex] ?? null;
    }

    return null;
  };

  /**
   * ステートのメタ情報に基づいてMP吸収量を計算する
   *
   * @param {RPG.State} state 対象ステート
   * @param {Game_Battler} drainTarget 被付与者（MPを失う側）
   * @param {Game_Battler} drainer ドレイン実行者（MPを得る側）
   * @returns {number} 吸収するMP量（0以上の整数）
   */
  const calcDrainAmount = (state, drainTarget, drainer) => {
    const amountType = String(state.meta.MPDrainState_AmountType ?? '').trim() || paramAmountType;
    // タグ内に " や ' を書かれた場合に削除。 &lt; や &gt; は置換して対応
    let amount = String(state.meta.MPDrainState_Amount ?? paramAmount).trim().replace(/[\'\"]/g, '').replace("&lt;", "<").replace("&gt;", ">");
    const amountRandomizer = Math.min(80, Math.max(0, Number(state.meta.MPDrainState_AmountRandomizer ?? paramAmountRandomizer)));

    if (amountType !== 'formula') {
      amount = Number(amount);
    }

    let result = 0;

    switch (amountType) {
      case 'absolute':
        result = amount;
        break;
      case 'selfMaxMp':
        result = Math.ceil(drainTarget.mmp * amount / 100);
        break;
      case 'selfMp':
        result = Math.ceil(drainTarget.mp * amount / 100);
        break;
      case 'drainerMaxMp':
        result = Math.ceil(drainer.mmp * amount / 100);
        break;
      case 'drainerMissingMp':
        // ドレイン実行者の「最大MP − 現在MP」（欠損MP）に対するパーセンテージ
        result = Math.ceil((drainer.mmp - drainer.mp) * amount / 100);
        break;
      case 'formula':
        // わかりやすいメッセージに直して例外を投げ直す
        try {
          result = Math.ceil(eval(amount));
        } catch (e) {
          console.error(`MP吸収の計算式の評価中にエラーが発生しました。式「${amount}」エラー内容「${e.message}」`);
          throw new Error(`Error evaluating MP drain formula: ${amount}. Original error: ${e.message}`);
        }
        break;
      default:
        console.warn(`Unknown MP drain amount type: ${amountType}`);
        result = amount;
    }

    // AmountRandomizer が 0 より大きい場合、(1 - r/100) 〜 (1 + r/100) の乗数をランダムに掛ける
    if (amountRandomizer > 0) {
      const multiplier = 1 + (Math.random() * 2 - 1) * amountRandomizer / 100;
      result = Math.ceil(result * multiplier);
    }

    return Math.max(0, result);
  };

  /**
   * MP吸収を実行し、メッセージをバッファに積む
   *
   * @param {Game_Battler} drainTarget 被付与者（MPを失う側）
   * @param {Game_Battler} drainer ドレイン実行者（MPを得る側）
   * @param {number} amount 吸収するMP量
   * @param {RPG.State} state 対象ステート（ステートごとの個別設定に使用）
   */
  const applyMpDrain = (drainTarget, drainer, amount, state) => {
    const allowDeplete = toBoolean(state.meta.MPDrainState_AllowDeplete, paramAllowDeplete);

    // allowDeplete が false の場合、被付与者のMPが0にならないように吸収量を制限
    let safeAmount = amount;
    if (!allowDeplete) {
      safeAmount = Math.min(amount, Math.max(0, drainTarget.mp - 1));
    }

    // MP吸収が発生しない場合はここで処理を終了
    if (safeAmount <= 0) return;

    drainTarget.gainMp(-safeAmount);
    drainer.gainMp(safeAmount);

    // ドレイン実行者のポップアップはバトルログのキュー経由で表示する（後述の showMpDrainGainPopup 参照）
    // ターンバトルでは endAllBattlersTurn() -> onTurnEnd() -> clearResult() で result を上書きするため、
    // 仮にここで drainer.startDamagePopup() を直接呼んでも、被付与者のステート処理時にはすでに
    // ドレイン実行者の result が空になっており、 shouldPopupDamage が false でポップアップが出ない
    drainTarget._mpDrainPendingPopups.push({ drainer, amount: safeAmount });

    const drainMessage = state.meta.MPDrainState_DrainMessage != null ? String(state.meta.MPDrainState_DrainMessage) : paramDrainMessage;
    const message = drainMessage.trim().format(drainTarget.name(), drainer.name(), TextManager.mp, safeAmount);

    if (message !== '') {
      drainTarget._mpDrainPendingMessages.push(message);
    }
  };

  /**
   * ドレイン実行者の死亡時に、ドレイン対象者を探して状態異常を解除する
   *
   * @param {Game_BattlerBase} deadBattler 死亡したバトラー
   */
  const removeDrainStatesByDrainer = (deadBattler) => {
    // 戦闘中でないなら早期return
    if (!$gameParty.inBattle()) {
      return;
    }

    // 各バトラーに関して、誰にドレインを受けているのかを見ていき、
    // その中に deadBattler がいるなら、対応するステートを解除する
    for (const battler of BattleManager.allBattleMembers()) {
      // 戦闘中でないときの早期returnがあるので大丈夫なはずだけど、念のため未定義時はスキップ
      if (battler._mpDrainerInfo == null) {
        continue;
      }

      // Object.keys() でコピーを取ることで、ループ中の removeState による変更に対して安全にする
      for (const stateIdStr of Object.keys(battler._mpDrainerInfo)) {
        const stateId = Number(stateIdStr);
        const drainerInfoList = battler._mpDrainerInfo[stateId];
        const remainingDrainers = drainerInfoList.filter(info => resolveDrainer(info) !== deadBattler);

        // ドレイン実行者のうち倒された人がいた場合の処理
        if (remainingDrainers.length < drainerInfoList.length) {
          // ドレイン実行者が全員倒されたときの処理
          if (remainingDrainers.length === 0) {
            // 全員倒れた場合はステート解除
            battler.removeState(stateId);

            // displayBattlerStatus をここで直接呼ぶと、
            // 状態異常から回復したメッセージが、ドレイン実行者が受けたダメージや倒れるメッセージよりも先に出てしまう。
            // そのため一時変数に追加し、ドレイン実行者の displayBattlerStatus が呼ばれたときに処理する
            if (BattleManager._mpDrainPendingRecoveringBattlers == null) {
              BattleManager._mpDrainPendingRecoveringBattlers = [];
            }
            BattleManager._mpDrainPendingRecoveringBattlers.push(battler);
          } else {
            // ドレイン実行者にまだ生存者がいる場合、リストを更新するだけでステートは解除しない
            battler._mpDrainerInfo[stateId] = remainingDrainers;
          }
        }
      }
    }
  };

  /**
   * スキル・アイテム効果の適用後、新規付与されたMPドレインステートのドレイン実行者を記録する
   *
   * @param {Game_Battler} target スキル・アイテムの使用相手
   */
  const _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function(target) {
    _Game_Action_apply.call(this, target);

    // バトル中でないならドレイン実行者の記録は不要なので早期return
    if (!$gameParty.inBattle()) {
      return;
    }

    const actionSubject = this.subject(); // アクションの主体

    // このアクションがドレインステートを付与する効果を持つ場合、ドレイン実行者を記録
    for (const state of target.states()) {
      if (!state.meta.MPDrainState) continue;

      // item().effects は例えば { code: 21, dataId: 5, value1: 1.0, value2: 0 } のような Object を持ち、
      // code: 21 (=EFFECT_ADD_STATE) は「ステート付与」効果を示し、
      // dataId: 5 は付与するステートID、value1: 1.0 は付与確率（100%）を示す。
      // この分岐で、ドレインステートの付与がおこなわれるアクションなのかを確認している。
      const hasAddDrainState = this.item().effects.some(
        (e) => e.code === Game_Action.EFFECT_ADD_STATE && e.dataId === state.id
      );
      if (!hasAddDrainState) continue;

      // ドレイン実行者の情報を記録。味方なら actorId, 敵なら enemyIndex に保存
      const multiDrainer = toBoolean(state.meta.MPDrainState_MultiDrainer, paramMultiDrainer);
      const newInfo = actionSubject.isActor()
        ? { actorId: actionSubject.actorId(), enemyIndex: -1 }
        : { actorId: 0, enemyIndex: actionSubject.index() };

      if (multiDrainer) {
        // MultiDrainer 有効時：既存リストに追記（同一バトラーの重複追加はスキップ）
        const existing = target._mpDrainerInfo[state.id] ?? [];
        const alreadyIn = existing.some(info => resolveDrainer(info) === actionSubject);
        if (!alreadyIn) {
          target._mpDrainerInfo[state.id] = [...existing, newInfo];
        }
      } else {
        // MultiDrainer 無効時：上書き（従来の挙動）
        target._mpDrainerInfo[state.id] = [newInfo];
      }
    }
  };

  /**
   * ステート解除時に _mpDrainerInfo から対応エントリを削除する
   *
   * @param {number} stateId 解除するステートID
   */
  const _Game_Battler_removeState = Game_Battler.prototype.removeState;
  Game_Battler.prototype.removeState = function(stateId) {
    _Game_Battler_removeState.call(this, stateId);

    // removeState は setupNewGame -> Game_Battler.prototype.refresh 起点でゲーム開始時にも呼ばれるため分岐が必須
    if (this._mpDrainerInfo != null) {
      delete this._mpDrainerInfo[stateId];
    }
  };

  /**
   * HP/MP/TP自然回復後にMP吸収処理を実行する
   */
  const _Game_Battler_regenerateAll = Game_Battler.prototype.regenerateAll;
  Game_Battler.prototype.regenerateAll = function() {
    _Game_Battler_regenerateAll.call(this);

    this.mpDrainRegenerate();
  };

  /**
   * 独自メソッド：ターン終了時のMP吸収処理
   * this が持っている状態異常の中からMPドレインステートをすべて探し、それぞれのドレイン処理を実行
   */
  Game_Battler.prototype.mpDrainRegenerate = function() {
    if (!this.isAlive()) return;

    const drainStates = this.states().filter((s) => s.meta.MPDrainState);
    if (drainStates.length === 0) return;

    for (const state of drainStates) {
      const drainerInfoList = this._mpDrainerInfo ? this._mpDrainerInfo[state.id] : null;
      if (drainerInfoList == null || drainerInfoList.length === 0) {
        continue;
      }

      // MultiDrainer 有効時は drainerInfoList.length が 2 以上になっている場合がある
      // パーティー順 → エネミーインデックス順でソートし、メッセージ表示順を一定にする
      const sortedDrainerInfoList = [...drainerInfoList].sort((a, b) => {
        const orderOf = (info) => {
          if (info.actorId > 0) {
            return $gameParty.members().findIndex(m => m.actorId() === info.actorId);
          }
          return 1000 + info.enemyIndex; // エネミーはアクターの後
        };
        return orderOf(a) - orderOf(b);
      });

      for (const drainerInfo of sortedDrainerInfoList) {
        const drainer = resolveDrainer(drainerInfo);
        if (drainer == null || !drainer.isAlive()) {
          continue;
        }

        const amount = calcDrainAmount(state, this, drainer);
        applyMpDrain(this, drainer, amount, state); // this （被付与者）から drainer に MP を移動させる
      }
    }
  };

  /**
   * 誰かが死亡したとき、ドレイン実行者であれば、被付与者からドレインステートを解除
   */
  const _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
  Game_BattlerBase.prototype.die = function() {
    _Game_BattlerBase_die.call(this);

    removeDrainStatesByDrainer(this);
  };

  /**
   * 独自メソッド：ドレイン実行者のMP回復ポップアップをバトルログのキュー経由で表示する
   * キューで処理されるタイミングで result を再セットすることで、
   * onTurnEnd() の clearResult() で result が消えてしまっている問題を回避
   *
   * @param {Game_Battler} drainer ドレイン実行者（MPを得る側）
   * @param {number} amount 回復したMP量
   */
  Window_BattleLog.prototype.showMpDrainGainPopup = function(drainer, amount) {
    drainer._result.mpAffected = true;
    drainer._result.mpDamage = -amount; // 負の値 = MP回復
    drainer.startDamagePopup();
  };

  /**
   * ドレイン実行者のポップアップとドレインメッセージを、状態変化メッセージの前にキューへ積む
   * displayAutoAffectedStatus より前に出すことで、死亡メッセージの前にドレインメッセージが表示される
   *
   * @param {Game_Battler} subject 対象バトラー
   */
  const _Window_BattleLog_displayAutoAffectedStatus = Window_BattleLog.prototype.displayAutoAffectedStatus;
  Window_BattleLog.prototype.displayAutoAffectedStatus = function(subject) {
    // ドレイン実行者のMP回復ポップアップを、テキストメッセージより先にキューへ積む
    const drainPopups = subject._mpDrainPendingPopups;
    if (drainPopups != null && drainPopups.length > 0) {
      for (const { drainer, amount } of drainPopups) {
        this.push('showMpDrainGainPopup', drainer, amount);
      }

      subject._mpDrainPendingPopups = [];
    }

    const drainMessages = subject._mpDrainPendingMessages;
    if (drainMessages != null && drainMessages.length > 0) {
      for (const drainMessage of drainMessages) {
        this.push('addText', drainMessage); // ドレインメッセージをバトルログに表示
      }

      // MZ の標準的なメッセージ表示パターン（addText → wait → clear）に倣い、
      // ドレインメッセージを表示し終えたらクリアする
      this.push('wait');
      this.push('clear');

      subject._mpDrainPendingMessages = [];
    }

    _Window_BattleLog_displayAutoAffectedStatus.call(this, subject);
  };

  /**
   * displayBattlerStatus が呼ばれた直後に、pending リストに積まれたバトラーの状態変化も続けて表示する
   * ドレイン実行者の死亡によってステートが解除される、被付与者の解除メッセージを、
   * ドレイン実行者の受けるダメージ表示や、倒れるメッセージの後に出すための仕組み
   *
   * @param {Game_Battler} battler 表示対象のバトラー
   * @param {boolean} current true なら現在の状態も表示する
   */
  const _BattleManager_displayBattlerStatus = BattleManager.displayBattlerStatus;
  BattleManager.displayBattlerStatus = function(battler, current) {
    _BattleManager_displayBattlerStatus.call(this, battler, current);

    const recoveringBattlers = BattleManager._mpDrainPendingRecoveringBattlers;
    if (recoveringBattlers == null || recoveringBattlers.length === 0) {
      return;
    }

    // 再入防止のため、リストをクリアしてからループ開始
    BattleManager._mpDrainPendingRecoveringBattlers = [];
    for (const recoveringBattler of recoveringBattlers) {
      _BattleManager_displayBattlerStatus.call(this, recoveringBattler, false);
    }
  };

  /**
   * バトル開始時に独自プロパティを初期化する
   *
   * @param {boolean} advantageous 先制攻撃かどうか
   */
  const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
  Game_Battler.prototype.onBattleStart = function(advantageous) {
    _Game_Battler_onBattleStart.call(this, advantageous);

    this._mpDrainerInfo = {}; // { <stateId>: [{ actorId:, enemyIndex: }, ...] } の形式で apply メソッドにて代入される
    this._mpDrainPendingMessages = []; // ドレインメッセージの一時保管場所
    this._mpDrainPendingPopups = []; // { drainer, amount } の形式で、ドレイン実行者のMP回復ポップアップを保管
  };

  /**
   * バトル終了時に独自プロパティをリセットする
   */
  const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
  Game_Battler.prototype.onBattleEnd = function() {
    _Game_Battler_onBattleEnd.call(this);

    this._mpDrainerInfo = {};
    this._mpDrainPendingMessages = [];
    this._mpDrainPendingPopups = [];
  };
})();
