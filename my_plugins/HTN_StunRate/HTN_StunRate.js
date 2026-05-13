// --------------------------------------------------------------------------
//
// HTN_StunRate.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/05/13 v1.0.1 継続メッセージの重複表示防止用データが初期化されていなかった内部的な問題を修正
// 2026/05/13 v1.0.0 First release
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc States that have a probability of preventing action (v1.0.1)
 * @author hatonekoe - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_StunRate
 *
 * @param StunRate
 * @text Stun Rate (%)
 * @desc Probability (%) of the battler being unable to act.
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
 * @desc If true, the state's continuation message is shown before the battler acts. If false, shown after.
 * @default true
 * @type boolean
 *
 * @param AllowAttack
 * @text Allow Attack Always
 * @desc If true, normal attacks are never stunned.
 * @default false
 * @type boolean
 *
 * @param AllowGuard
 * @text Allow Guard Always
 * @desc If true, guard actions are never stunned.
 * @default false
 * @type boolean
 *
 * @param AllowItem
 * @text Allow Item Always
 * @desc If true, item actions are never stunned.
 * @default false
 * @type boolean
 *
 * @param AllowMagicSkill
 * @text Allow Magic Skill Always
 * @desc If true, magic skills (skill type ID 1) are never stunned.
 * @default false
 * @type boolean
 *
 * @param AllowSpecialSkill
 * @text Allow Special Skill Always
 * @desc If true, special skills (skill type ID 2) are never stunned.
 * @default false
 * @type boolean
 *
 * @help
 * [How to Use]
 * First, set the state's Restriction to "None".
 * If it is set to "Cannot move", the battler cannot select actions and
 * will always be unable to act.
 *
 * Add the following note tag to any state you want this plugin to apply to:
 * <StunRate>
 *
 * You can also specify the probability (%) alongside the tag to override
 * the plugin parameter default per state.
 * For example, to set a 60% chance of being unable to act:
 * <StunRate: 60>
 *
 * [Per-State Settings]
 * You can override plugin parameter settings per state using these tags:
 *
 * Setting list:
 * <StunRate: 25> (Required. <StunRate> alone is also valid.)
 * <StunRate_Message: %1 is paralyzed!> (Message shown when unable to act)
 * <StunRate_ShowStateMessageBeforeAction: true> (Show continuation message before action)
 * <StunRate_AllowAttack: false> (Always allow normal attacks)
 * <StunRate_AllowGuard: false> (Always allow guard actions)
 * <StunRate_AllowItem: false> (Always allow item use)
 * <StunRate_AllowMagicSkill: false> (Always allow magic skills)
 * <StunRate_AllowSpecialSkill: false> (Always allow special skills)
 *
 * Example state where guard and item use never fail,
 * while other actions fail at a 30% chance:
 *   <StunRate: 30>
 *   <StunRate_Message: %1 is too cursed to move!>
 *   <StunRate_AllowGuard: true>
 *   <StunRate_AllowItem: true>
 *
 * [Note on Stun Messages with Multiple States]
 * If multiple states with the <StunRate> tag are active at the same time,
 * each state is checked for stun in priority order.
 * The message from the first state that triggers stun is displayed.
 *
 * [About Continuation Message Timing]
 * RPG Maker MZ only shows one state continuation message per turn:
 * the one belonging to the highest-priority state.
 * Therefore, even if Show State Message Before Action is set to false,
 * the continuation message is not guaranteed to appear after the action.
 */

/*:ja
 * @target MZ
 * @plugindesc 一定確率で行動できないステート (v1.0.1)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_StunRate
 *
 * @param StunRate
 * @text 行動不能の確率(%)
 * @desc 行動不能になる確率(%)
 * @default 25
 * @type number
 * @min 0
 * @max 100
 *
 * @param Message
 * @text 行動不能時のメッセージ
 * @desc 行動不能の際に表示されるメッセージです。%1は行動者の名前に置き換わります。空欄にするとメッセージはスキップされます
 * @default %1は動けない！
 * @type string
 *
 * @param ShowStateMessageBeforeAction
 * @text 継続メッセージを行動前に表示
 * @desc ステートの継続メッセージを行動の前に表示するか。falseの場合、ツクールMZの本来の挙動同様、行動後に表示されます
 * @default true
 * @type boolean
 *
 * @param AllowAttack
 * @text 通常攻撃を常に許可
 * @desc 通常攻撃をスタンせず必ず行動可能にするか
 * @default false
 * @type boolean
 *
 * @param AllowGuard
 * @text 防御を常に許可
 * @desc 防御をスタンせず必ず行動可能にするか
 * @default false
 * @type boolean
 *
 * @param AllowItem
 * @text アイテム使用を常に許可
 * @desc アイテム使用をスタンせず必ず行動可能にするか
 * @default false
 * @type boolean
 *
 * @param AllowMagicSkill
 * @text 魔法スキルを常に許可
 * @desc 魔法スキル（スキルタイプ１番）をスタンせず必ず行動可能にするか
 * @default false
 * @type boolean
 *
 * @param AllowSpecialSkill
 * @text 必殺技スキルを常に許可
 * @desc 必殺技スキル（スキルタイプ２番）をスタンせず必ず行動可能にするか
 * @default false
 * @type boolean
 *
 * @help
 * 【使い方】
 * まず、ステートの「行動制約」は「なし」に設定してください。
 * 「行動できない」だと、行動の選択ができませんし、常に行動できません。
 *
 * 次に、ステートの「メモ」の欄に以下のようにタグを記述します。
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
 * 設定項目一覧：
 * <StunRate: 25> （※必須。 <StunRate> だけでもOK）
 * <StunRate_Message: %1はしびれている！> （行動不能時のメッセージ）
 * <StunRate_ShowStateMessageBeforeAction: true> （継続メッセージを行動前に表示するか）
 * <StunRate_AllowAttack: false> （通常攻撃を常に許可するか）
 * <StunRate_AllowGuard: false> （防御を常に許可するか）
 * <StunRate_AllowItem: false> （アイテム使用を常に許可するか）
 * <StunRate_AllowMagicSkill: false> （魔法スキルを常に許可するか）
 * <StunRate_AllowSpecialSkill: false> （必殺技スキルを常に許可するか）
 *
 * 防御とアイテム使用は行動失敗せず、他は30%の確率で失敗するステートの設定例：
 *   <StunRate: 30>
 *   <StunRate_Message: %1は呪いで動くことができない！>
 *   <StunRate_AllowGuard: true>
 *   <StunRate_AllowItem: true>
 *
 * 【行動不能時のメッセージの補足】
 * <StunRate> タグを持つステートが複数存在し、それらに同時にかかっている場合、
 * 各ステートで「優先度」の順にスタン判定がおこなわれ、
 * 最初にスタン判定となったステートのメッセージが表示されます。
 *
 * 【継続メッセージの表示タイミングについて】
 * ツクールMZは、ステートの継続メッセージに関して「優先度」が
 * もっとも高い１つだけを表示します。そのため、
 * 「継続メッセージを行動前に表示」を false にしても、
 * 必ずしも行動後に継続メッセージが表示されるわけではありません。
 */

(() => {
  'use strict';

  /**
   * 文字列や真偽値の入力を真偽値へ変換
   *
   * @param {boolean|string} value 変換対象の値
   * @param {boolean} defaultValue 変換不能時の既定値
   * @returns {boolean} 変換後の真偽値を返す
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

  const pluginName = 'HTN_StunRate';
  const pluginParams = PluginManager.parameters(pluginName);
  const paramStunRate = Number(pluginParams.StunRate || 25);
  const paramMessage = String(pluginParams.Message).trim();
  const paramShowStateMessageBeforeAction = toBoolean(pluginParams.ShowStateMessageBeforeAction, true);
  const paramAllowAttack = toBoolean(pluginParams.AllowAttack, false);
  const paramAllowGuard = toBoolean(pluginParams.AllowGuard, false);
  const paramAllowItem = toBoolean(pluginParams.AllowItem, false);
  const paramAllowMagicSkill = toBoolean(pluginParams.AllowMagicSkill, false);
  const paramAllowSpecialSkill = toBoolean(pluginParams.AllowSpecialSkill, false);

  /**
   * スタン判定をスルーするアクションかどうか
   *
   * @param {Game_Action} action 調査対象のアクション
   * @param {object} state ステートデータ
   * @returns {boolean} スタン除外対象の場合は true
   */
  const isNotStunAction = (action, state) => {
    const isMagicSkill = action.isSkill() && action.item().stypeId === 1;
    const isSpecialSkill = action.isSkill() && action.item().stypeId === 2;

    if (action.isAttack() && toBoolean(state.meta.StunRate_AllowAttack, paramAllowAttack)) {
      return true;
    }

    if (action.isGuard() && toBoolean(state.meta.StunRate_AllowGuard, paramAllowGuard)) {
      return true;
    }

    if (action.isItem() && toBoolean(state.meta.StunRate_AllowItem, paramAllowItem)) {
      return true;
    }

    if (isMagicSkill && toBoolean(state.meta.StunRate_AllowMagicSkill, paramAllowMagicSkill)) {
      return true;
    }

    if (isSpecialSkill && toBoolean(state.meta.StunRate_AllowSpecialSkill, paramAllowSpecialSkill)) {
      return true;
    }

    return false;
  };

  /**
   * StunRate ステートの継続メッセージ表示とスタン判定をおこなう
   *
   * NumbStates.js では BattleManager.processTurn 内で clearActions を呼び出すため、スタン時は全行動のキャンセルだが、
   * BattleManager.startAction 内でアクションごとにキャンセル処理をおこなうことにより、行動ごとにスタン判定がおこなわれる。
   * アクターや職業などの特徴で「行動回数追加」を設定していて、１ターンに複数回の行動がおこなわれる場合に挙動が異なる。
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

    if (subject._stunRate_ShownStateIdsBefore === undefined) {
      subject._stunRate_ShownStateIdsBefore = new Set();
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
      // 特定のアクションであればスタン判定をスキップ
      if (isNotStunAction(action, state)) {
        continue;
      }

      const stunRate = state.meta.StunRate !== true ? Number(state.meta.StunRate) : paramStunRate;

      if (Math.random() * 100 < stunRate) {
        isStunned = true;

        if (state.meta.StunRate_Message !== undefined) {
          stunMessage = String(state.meta.StunRate_Message).trim();
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
    if (
      subject._stunRate_ShownStateIdsBefore === undefined ||
      subject._stunRate_ShownStateIdsBefore.size === 0
    ) {
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
      subject._stunRate_ShownStateIdsBefore.clear();
    }
  };
})();
