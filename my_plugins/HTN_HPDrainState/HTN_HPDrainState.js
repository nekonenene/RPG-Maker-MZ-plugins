// --------------------------------------------------------------------------
//
// HTN_HPDrainState.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/03/22 v0.0.1 開発中...
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc Creates a state that drains HP from the afflicted to the drainer each turn (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
 * @url https://github.com/nekoneneve/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_HPDrainState
 *
 * @param AmountType
 * @text Drain amount type
 * @desc Determines how the drain amount is calculated.
 * @default selfMaxHp
 * @type select
 * @option Fixed HP value
 * @value absolute
 * @option % of afflicted's max HP
 * @value selfMaxHp
 * @option % of afflicted's current HP
 * @value selfHp
 * @option % of drainer's max HP
 * @value drainerMaxHp
 * @option % of drainer's missing HP (max HP - current HP)
 * @value drainerMissingHp
 * @option Formula (advanced)
 * @value formula
 *
 * @param Amount
 * @text Drain amount
 * @desc A fixed HP value or a percentage. When type is "formula", this field accepts a JavaScript formula string.
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
 * @desc Message shown when HP drain occurs. %1=afflicted name, %2=drainer name, %3=HP label, %4=drain amount.
 * @default %1 had %4 %3 drained by %2!
 * @type string
 *
 * @param AllowKill
 * @text Allow draining target to 0 HP
 * @desc If false, the afflicted will retain at least 1 HP after draining.
 * @default true
 * @type boolean
 *
 * @help
 * Add the following note tag in a state's Note box to make it an HP drain state:
 * <HPDrainState>
 *
 * The state remembers who applied it. If multiple battlers apply it, only the
 * most recent applier is remembered.
 * At the end of the afflicted battler's turn, HP is drained from the afflicted
 * and recovered by the drainer (up to the drainer's max HP).
 * The state is also removed if the drainer is defeated.
 *
 * --- Per-state overrides (all optional) ---
 * <HPDrainState_AmountType: absolute>          Fixed HP value
 * <HPDrainState_AmountType: selfMaxHp>         % of afflicted's max HP
 * <HPDrainState_AmountType: selfHp>            % of afflicted's current HP
 * <HPDrainState_AmountType: drainerMaxHp>      % of drainer's max HP
 * <HPDrainState_AmountType: drainerMissingHp>  % of drainer's missing HP (max HP - current HP)
 * <HPDrainState_AmountType: formula>           JavaScript formula (advanced)
 *
 * <HPDrainState_Amount: 50>
 * <HPDrainState_Amount: Math.max(drainTarget.mhp / 10, drainer.atk * 2)>
 *
 * When AmountType is "formula", set a JavaScript formula in Amount.
 * Variables: drainTarget, drainer
 * The formula result is rounded up with Math.ceil and clamped to 0 or more.
 * For example, Math.max(drainTarget.mhp / 10, drainer.atk * 2) drains the greater
 * of 1/10 of the afflicted's max HP or twice the drainer's attack power.
 *
 * <HPDrainState_AmountRandomizer: 0>
 *
 * <HPDrainState_DrainMessage: %1 had %4 %3 drained by %2!>
 *
 * <HPDrainState_AllowKill: true>
 * <HPDrainState_AllowKill: false>
 */

/*:ja
 * @target MZ
 * @plugindesc HPを吸収され続けるステート（状態異常）を作成できます (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekoneneve/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_HPDrainState
 *
 * @param AmountType
 * @text 吸収タイプ
 * @desc 吸収量の計算タイプです。
 * @default selfMaxHp
 * @type select
 * @option 固定値（HP）
 * @value absolute
 * @option ドレインされる側の最大HPに対する割合（%）
 * @value selfMaxHp
 * @option ドレインされる側の現在HPに対する割合（%）
 * @value selfHp
 * @option ドレインする側の最大HPに対する割合（%）
 * @value drainerMaxHp
 * @option ドレインする側の「最大HP−現在HP」に対する割合（%）
 * @value drainerMissingHp
 * @option 計算式（上級者向け）
 * @value formula
 *
 * @param Amount
 * @text 吸収量
 * @desc HP量の固定値かパーセンテージの数値を指定します。タイプが計算式(formula)の場合、JavaScript式を記述します。
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
 * @desc HP吸収時に表示するメッセージ。%1=被付与者名、%2=ドレイン実行者名、%3=HPの設定名、%4=吸収量。
 * @default %1は%2に%3を %4 吸収された！
 * @type string
 *
 * @param AllowKill
 * @text 吸収による戦闘不能を許可
 * @desc falseにすると、HP吸収で被付与者のHPが0にならないよう吸収量を制限します。
 * @default true
 * @type boolean
 *
 * @help
 * 【使い方】
 * HP吸収ステートにしたいステートの「メモ」欄に、次のタグを記述してください。
 * <HPDrainState>
 *
 * ステートを付与した相手が記憶され、（最後に付与した１人だけが記憶されます）
 * 被付与者のターン終了時に、HPが付与した相手に渡されます。
 * 付与した者が戦闘不能になった場合、ステートは自動解除されます。
 *
 * 【ステートごとの個別設定（すべて省略可）】
 * 省略した場合はプラグインパラメータの設定値が使用されます。
 *
 * <HPDrainState_AmountType: absolute>          固定値
 * <HPDrainState_AmountType: selfMaxHp>         ドレインされる側の最大HP基準（%）
 * <HPDrainState_AmountType: selfHp>            ドレインされる側の現在HP基準（%）
 * <HPDrainState_AmountType: drainerMaxHp>      ドレインする側の最大HP基準（%）
 * <HPDrainState_AmountType: drainerMissingHp>  ドレインする側の「最大HP−現在HP」基準（%）
 * <HPDrainState_AmountType: formula>           計算式（上級者向け）
 *
 * <HPDrainState_Amount: 50>
 * <HPDrainState_Amount: Math.max(drainTarget.mhp / 10, drainer.atk * 2)>
 *
 * AmountType が「formula（計算式）」のとき、Amount に JavaScript 式を記述します。
 * （難しいので、ツクールに慣れている人向けです）
 * 例えば Math.max(drainTarget.mhp / 10, drainer.atk * 2) と設定すると、
 * 「ドレインされる側の最大HPの10分の1」か「ドレインする側の攻撃力の2倍」かの大きい方が吸収量になります。
 * 変数: drainTarget（ドレインされる側）, drainer（ドレインする側）
 *
 * <HPDrainState_AmountRandomizer: 0>   （ランダム幅を0%に。計算結果が固定値になる）
 * <HPDrainState_AmountRandomizer: 80>  （ランダム幅を80%に。計算結果に0.2〜1.8倍の乗数が掛かる）
 *
 * <HPDrainState_DrainMessage: %1は%2に%3を %4 吸収された！>
 * （%1=被付与者名、%2=ドレイン実行者名、%3=HPの設定名、%4=吸収量）
 *
 * <HPDrainState_AllowKill: true>   （吸収による戦闘不能を許可）
 * <HPDrainState_AllowKill: false>  （吸収で最低1HPを保持）
 */

(() => {
  'use strict';

  const pluginName = 'HTN_HPDrainState';
  const parameters = PluginManager.parameters(pluginName);
  const paramAmountType = String(parameters.AmountType || 'selfMaxHp');
  const paramAmount = String(parameters.Amount ?? '12.5');
  const paramAmountRandomizer = Math.min(80, Math.max(0, Number(parameters.AmountRandomizer ?? 0)));
  const paramDrainMessage = String(parameters.DrainMessage || '%1は%2に%3を %4 吸収された！');
  const paramAllowKill = String(parameters.AllowKill) !== 'false';

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
   * ステートのメタ情報に基づいてHP吸収量を計算する
   *
   * @param {RPG.State} state 対象ステート
   * @param {Game_Battler} drainTarget 被付与者（HPを失う側）
   * @param {Game_Battler} drainer ドレイン実行者（HPを得る側）
   * @returns {number} 吸収するHP量（0以上の整数）
   */
  const calcDrainAmount = (state, drainTarget, drainer) => {
    const amountType = String(state.meta.HPDrainState_AmountType ?? '').trim() || paramAmountType;
    // タグ内に " や ' を書く人もいそうなので削除しておく
    let amount = String(state.meta.HPDrainState_Amount ?? paramAmount).trim().replace(/\'\"/g, '');
    const amountRandomizer = Math.min(80, Math.max(0, Number(state.meta.HPDrainState_AmountRandomizer ?? paramAmountRandomizer)));

    if (amountType !== 'formula') {
      amount = Number(amount);
    }

    let result = 0;

    switch (amountType) {
      case 'absolute':
        result = amount;
        break;
      case 'selfMaxHp':
        result = Math.ceil(drainTarget.mhp * amount / 100);
        break;
      case 'selfHp':
        result = Math.ceil(drainTarget.hp * amount / 100);
        break;
      case 'drainerMaxHp':
        result = Math.ceil(drainer.mhp * amount / 100);
        break;
      case 'drainerMissingHp':
        // ドレイン実行者の「最大HP − 現在HP」（欠損HP）に対するパーセンテージ
        result = Math.ceil((drainer.mhp - drainer.hp) * amount / 100);
        break;
      case 'formula':
        result = Math.ceil(eval(amount));
        break;
      default:
        console.warn(`Unknown HP drain amount type: ${amountType}`);
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
   * HP吸収を実行し、メッセージをバッファに積む
   *
   * @param {Game_Battler} drainTarget 被付与者（HPを失う側）
   * @param {Game_Battler} drainer ドレイン実行者（HPを得る側）
   * @param {number} amount 吸収するHP量
   * @param {RPG.State} state 対象ステート（ステートごとの個別設定に使用）
   */
  const applyHpDrain = (drainTarget, drainer, amount, state) => {
    const allowKill = toBoolean(state.meta.HPDrainState_AllowKill, paramAllowKill);

    // allowKill が false の場合、被付与者のHPが0にならないように吸収量を制限
    let safeAmount = amount;
    if (!allowKill) {
      safeAmount = Math.min(amount, Math.max(0, drainTarget.hp - 1));
    }

    // HP吸収が発生しない場合はここで処理を終了
    if (safeAmount <= 0) return;

    drainTarget.gainHp(-safeAmount);
    drainer.gainHp(safeAmount);

    // ドレイン実行者のポップアップはバトルログのキュー経由で表示する（後述の showHpDrainGainPopup 参照）
    // ターンバトルでは endAllBattlersTurn() -> onTurnEnd() -> clearResult() で result を上書きするため、
    // 仮にここで drainer.startDamagePopup() を直接呼んでも、被付与者のステート処理時にはすでに
    // ドレイン実行者の result が空になっており、 shouldPopupDamage が false でポップアップが出ない
    drainTarget._hpDrainPendingPopups.push({ drainer, amount: safeAmount });

    const drainMessage = state.meta.HPDrainState_DrainMessage != null ? String(state.meta.HPDrainState_DrainMessage) : paramDrainMessage;
    const message = drainMessage.trim().format(drainTarget.name(), drainer.name(), TextManager.hp, safeAmount);

    if (message !== '') {
      drainTarget._hpDrainPendingMessages.push(message);
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
      if (battler._hpDrainerInfo == null) {
        continue;
      }

      // Object.keys() でコピーを取ることで、ループ中の removeState による変更に対して安全にする
      for (const stateIdStr of Object.keys(battler._hpDrainerInfo)) {
        const stateId = Number(stateIdStr);
        const drainer = resolveDrainer(battler._hpDrainerInfo[stateId]);

        if (drainer === deadBattler) {
          battler.removeState(stateId);

          // displayBattlerStatus をここで直接呼ぶと、ダメージ・倒れるメッセージより先にキューへ積まれてしまう。
          // そのため「後で表示が必要なバトラー」として pending リストに追加し、
          // deadBattler の displayBattlerStatus が呼ばれた直後に処理する（後述のエイリアス参照）
          if (BattleManager._hpDrainPendingRecoveringBattlers == null) {
            BattleManager._hpDrainPendingRecoveringBattlers = [];
          }
          BattleManager._hpDrainPendingRecoveringBattlers.push(battler);
        }
      }
    }
  };

  /**
   * スキル・アイテム効果の適用後、新規付与されたHPドレインステートのドレイン実行者を記録する
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

    // このアクションがドレインステートを付与する効果を持つ場合、ドレイン実行者を記録（再付与時は上書き）
    for (const state of target.states()) {
      if (!state.meta.HPDrainState) continue;

      // item().effects は例えば { code: 21, dataId: 5, value1: 1.0, value2: 0 } のような Object を持ち、
      // code: 21 (=EFFECT_ADD_STATE) は「ステート付与」効果を示し、
      // dataId: 5 は付与するステートID、value1: 1.0 は付与確率（100%）を示す。
      // この分岐で、ドレインステートの付与がおこなわれるアクションなのかを確認している。
      const hasAddDrainState = this.item().effects.some(
        (e) => e.code === Game_Action.EFFECT_ADD_STATE && e.dataId === state.id
      );
      if (!hasAddDrainState) continue;

      // ドレイン実行者の情報を記録。味方なら actorId, 敵なら enemyIndex に保存
      if (actionSubject.isActor()) {
        target._hpDrainerInfo[state.id] = { actorId: actionSubject.actorId(), enemyIndex: -1 };
      } else {
        target._hpDrainerInfo[state.id] = { actorId: 0, enemyIndex: actionSubject.index() };
      }
    }
  };

  /**
   * ステート解除時に _hpDrainerInfo から対応エントリを削除する
   *
   * @param {number} stateId 解除するステートID
   */
  const _Game_Battler_removeState = Game_Battler.prototype.removeState;
  Game_Battler.prototype.removeState = function(stateId) {
    _Game_Battler_removeState.call(this, stateId);

    // removeState は setupNewGame -> Game_Battler.prototype.refresh 起点でゲーム開始時にも呼ばれるため分岐が必須
    if (this._hpDrainerInfo != null) {
      delete this._hpDrainerInfo[stateId];
    }
  };

  /**
   * HP/MP/TP自然回復後にHP吸収処理を実行する
   */
  const _Game_Battler_regenerateAll = Game_Battler.prototype.regenerateAll;
  Game_Battler.prototype.regenerateAll = function() {
    _Game_Battler_regenerateAll.call(this);

    this.hpDrainRegenerate();
  };

  /**
   * 独自メソッド：ターン終了時のHP吸収処理
   * this が持っている状態異常の中からHPドレインステートをすべて探し、それぞれのドレイン処理を実行
   */
  Game_Battler.prototype.hpDrainRegenerate = function() {
    if (!this.isAlive()) return;

    const drainStates = this.states().filter((s) => s.meta.HPDrainState);
    if (drainStates.length === 0) return;

    for (const state of drainStates) {
      const drainerInfo = this._hpDrainerInfo ? this._hpDrainerInfo[state.id] : null;
      if (drainerInfo == null) {
        continue;
      }

      const drainer = resolveDrainer(drainerInfo);
      if (drainer == null || !drainer.isAlive()) {
        continue;
      }

      const amount = calcDrainAmount(state, this, drainer);
      applyHpDrain(this, drainer, amount, state); // this から drainer に HP を移動させる
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
   * 独自メソッド：ドレイン実行者のHP回復ポップアップをバトルログのキュー経由で表示する
   * キューで処理されるタイミングで result を再セットすることで、
   * onTurnEnd() の clearResult() で result が消えてしまっている問題を回避
   *
   * @param {Game_Battler} drainer ドレイン実行者（HPを得る側）
   * @param {number} amount 回復したHP量
   */
  Window_BattleLog.prototype.showHpDrainGainPopup = function(drainer, amount) {
    drainer._result.hpAffected = true;
    drainer._result.hpDamage = -amount; // 負の値 = HP回復
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
    // ドレイン実行者のHP回復ポップアップを、テキストメッセージより先にキューへ積む
    const drainPopups = subject._hpDrainPendingPopups;
    if (drainPopups != null && drainPopups.length > 0) {
      for (const { drainer, amount } of drainPopups) {
        this.push('showHpDrainGainPopup', drainer, amount);
      }

      subject._hpDrainPendingPopups = [];
    }

    const drainMessages = subject._hpDrainPendingMessages;
    if (drainMessages != null && drainMessages.length > 0) {
      for (const drainMessage of drainMessages) {
        this.push('addText', drainMessage); // ドレインメッセージをバトルログに表示
      }

      // MZ の標準的なメッセージ表示パターン（addText → wait → clear）に倣い、
      // ドレインメッセージを表示し終えたらクリアする
      this.push('wait');
      this.push('clear');

      subject._hpDrainPendingMessages = [];
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

    const recoveringBattlers = BattleManager._hpDrainPendingRecoveringBattlers;
    if (recoveringBattlers == null || recoveringBattlers.length === 0) {
      return;
    }

    // 再入防止のため、リストをクリアしてからループ開始
    BattleManager._hpDrainPendingRecoveringBattlers = [];
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

    this._hpDrainerInfo = {}; // { <stateId>: { actorId:, enemyIndex: } } の形式で apply メソッドにて代入される
    this._hpDrainPendingMessages = []; // ドレインメッセージの一時保管場所
    this._hpDrainPendingPopups = []; // { drainer, amount } の形式で、ドレイン実行者のHP回復ポップアップを保管
  };

  /**
   * バトル終了時に独自プロパティをリセットする
   */
  const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
  Game_Battler.prototype.onBattleEnd = function() {
    _Game_Battler_onBattleEnd.call(this);

    this._hpDrainerInfo = {};
    this._hpDrainPendingMessages = [];
    this._hpDrainPendingPopups = [];
  };
})();
