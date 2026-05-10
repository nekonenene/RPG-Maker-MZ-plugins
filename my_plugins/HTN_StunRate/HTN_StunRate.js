// --------------------------------------------------------------------------
//
// HTN_StunRate.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/05/11 v0.0.1 開発中
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc States that have a probability of preventing action (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_StunRate
 *
 * @param StunRate
 * @text Stun Rate (%)
 * @desc Default probability (%) that the battler cannot act when the tagged state is active.
 * @default 25
 * @type number
 * @min 0
 * @max 100
 *
 * @param Message
 * @text Stun Message
 * @desc Message displayed when the battler cannot act. %1 is replaced with the battler's name. Leave empty to skip.
 * @default %1 cannot move!
 * @type string
 *
 * @param ShowStateMessageBeforeAction
 * @text Show State Message Before Action
 * @desc If true, the state's continuation message (message3) is shown before the battler acts instead of after.
 * @default true
 * @type boolean
 *
 * @help
 * Add the following note tag to a state to give it a stun probability:
 * <StunRate: 60>
 *
 * The value specifies the probability (%) of the battler being unable to act.
 * Omitting the value uses the plugin parameter default:
 * <StunRate>
 *
 * You can override the stun message per state:
 * <StunRate_Message: %1 is paralyzed!>
 *
 * You can override whether to show the continuation message before action:
 * <StunRate_ShowStateMessageBeforeAction: false>
 *
 * If multiple tagged states are active, each state's stun probability is
 * checked independently. The first state to trigger stun determines the message.
 * For ShowStateMessageBeforeAction, each state's setting is applied individually.
 */

/*:ja
 * @target MZ
 * @plugindesc 一定確率で行動できないステート (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_StunRate
 *
 * @param StunRate
 * @text 行動不能の確率(%)
 * @desc 行動不能になるデフォルトの確率(%)
 * @default 25
 * @type number
 * @min 0
 * @max 100
 *
 * @param Message
 * @text 行動不能時のメッセージ
 * @desc 行動不能の際に表示されるメッセージです。%1は行動者の名前に置き換わります。空欄にするとメッセージはスキップされます。
 * @default %1は動けない！
 * @type string
 *
 * @param ShowStateMessageBeforeAction
 * @text 行動前に継続メッセージを表示
 * @desc ステートの継続メッセージを行動の前に表示するか。falseの場合、ツクールMZの本来の挙動と同じく、行動の後に表示されます。
 * @default true
 * @type boolean
 *
 * @help
 * 【使い方】
 * このプラグインを適用したいステートの「メモ」の欄に、以下のようにタグを記述します。
 * <StunRate>
 *
 * 行動不能の確率(%)の半角数字とともにタグを記述すれば、
 * プラグインパラメータで設定した「行動不能の確率」をステートごとに上書きできます。
 * 例えば、60%の確率で行動不能にする場合は、以下のように記述します。
 * <StunRate: 60>
 *
 * 【ステートごとの個別設定】
 * 他にも、ステートの「メモ」欄に以下のようなタグを記述することで、
 * プラグインパラメータの設定をステートごとに上書きできます。
 *
 * 行動不能時のメッセージを設定する例:
 *   <StunRate_Message: %1はしびれている！>
 * 継続メッセージを行動後に表示したい場合の設定例:
 *   <StunRate_ShowStateMessageBeforeAction: false>
 * （※ツクールMZは、ステートの継続メッセージに関して「優先度」がもっとも高い１つだけを
 *   表示する仕様のため、false に設定しても必ず表示されるわけではありません）
 *
 * 【行動不能時のメッセージの補足】
 * <StunRate> タグを持つステートが複数存在し、それらに同時にかかっている場合、
 * 各ステートで「優先度」の順にスタン判定がおこなわれ、
 * 最初にスタン判定となったステートのメッセージが表示されます。
 */

(() => {
  'use strict';

  const pluginName = 'HTN_StunRate';
  const parameters = PluginManager.parameters(pluginName);
  const paramStunRate = Number(parameters.StunRate || 25);
  const paramMessage = String(parameters.Message);
  const paramShowStateMessageBeforeAction = String(parameters.ShowStateMessageBeforeAction) !== 'false';

  /**
   * バトル開始時に独自プロパティを初期化する
   *
   * @param {boolean} advantageous
   * @returns {void}
   */
  const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
  Game_Battler.prototype.onBattleStart = function(advantageous) {
    _Game_Battler_onBattleStart.call(this, advantageous);

    this._stunRate_ShownStateIdsBefore = new Set();
  };

  /**
   * StunRate ステートの継続メッセージ表示とスタン判定をおこなう
   *
   * @returns {void}
   */
  const _BattleManager_startAction = BattleManager.startAction;
  BattleManager.startAction = function() {
    const subject = this._subject;
    const stunStates = subject.states().filter(s => s.meta.StunRate !== undefined);

    // StunRate ステートが付与されていないなら、元の startAction メソッドを呼び出して終了
    if (stunStates.length === 0) {
      _BattleManager_startAction.call(this);
      return;
    }

    const action = subject.currentAction();

    // 各ステートの設定が true かつ message3 が存在する場合に継続メッセージを表示
    for (const state of stunStates) {
      let showMessage = paramShowStateMessageBeforeAction;
      if (state.meta.StunRate_ShowStateMessageBeforeAction !== undefined) {
        showMessage = String(state.meta.StunRate_ShowStateMessageBeforeAction).trim().toLowerCase() !== 'false';
      }

      if (showMessage && state.message3 !== '') {
        this._logWindow.push('addText', state.message3.format(subject.name()));
        this._logWindow.push('wait');
        this._logWindow.push('clear');

        subject._stunRate_ShownStateIdsBefore.add(state.id);
      }
    }

    // 各ステートで独立してスタン判定
    let isStunned = false;
    let stunMessage = paramMessage;

    for (const state of stunStates) {
      const stunRate = state.meta.StunRate !== true ? Number(state.meta.StunRate) : paramStunRate;

      if (Math.random() * 100 < stunRate) {
        isStunned = true;

        if (state.meta.StunRate_Message !== undefined) {
          stunMessage = String(state.meta.StunRate_Message);
        }

        break;
      }
    }

    if (isStunned) {
      if (stunMessage !== '') {
        this._logWindow.push('addText', stunMessage.format(subject.name()).trim());
        this._logWindow.push('wait');
        this._logWindow.push('clear');
      }

      // Actionフェーズへの移行処理だけおこない、ターゲットを空にしてスキップする
      this._phase = 'action';
      this._action = action;
      this._targets = [];
      subject.cancelMotionRefresh();

      return;
    }

    _BattleManager_startAction.call(this);
  };

  /**
   * 行動前に継続メッセージを表示済みの場合、重複表示を避けつつ未表示のステートのメッセージを表示する
   *
   * @param {Game_Battler} subject
   * @returns {void}
   */
  const _Window_BattleLog_displayCurrentState = Window_BattleLog.prototype.displayCurrentState;
  Window_BattleLog.prototype.displayCurrentState = function(subject) {
    if (subject._stunRate_ShownStateIdsBefore == null || subject._stunRate_ShownStateIdsBefore.size === 0) {
      _Window_BattleLog_displayCurrentState.call(this, subject);
      return;
    }

    // 一時的に subject._states から表示済みのステートを除外して、元の displayCurrentState を呼び出す
    const savedStates = subject._states;
    subject._states = savedStates.filter(stateId => !subject._stunRate_ShownStateIdsBefore.has(stateId));

    try {
      _Window_BattleLog_displayCurrentState.call(this, subject);
    } finally {
      subject._states = savedStates;
    }
  };
})();
