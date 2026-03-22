// --------------------------------------------------------------------------
//
// HTN_TPNoRegenState.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/03/22 v1.0.0 First release
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc Disables TP gain while specific states are active (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_TPNoRegenState
 *
 * @param RecoverBlockedMessage
 * @text Blocked TP message
 * @desc Message shown when TP recovery is blocked. %1 is target name, %2 is TP label.
 * @default %1は%2を回復できない！
 * @type string
 *
 * @param ItemRecover
 * @text Allow TP gain from items
 * @desc If true, TP gain from item effects is allowed during tagged states.
 * @default false
 * @type boolean
 *
 * @param SkillRecover
 * @text Allow TP gain from skills
 * @desc If true, TP gain from skill effects is allowed during tagged states.
 * @default false
 * @type boolean
 *
 * @help
 * Add the following note tag to a state to block TP gain while that state is active:
 * <TPNoRegenState>
 *
 * You can override blocked message per state:
 * <TPNoRegenState_RecoverBlockedMessage: %1 cannot recover %2!>
 *
 * You can override item TP-recover behavior per state:
 * <TPNoRegenState_ItemRecover: true>
 *
 * You can override skill TP-recover behavior per state:
 * <TPNoRegenState_SkillRecover: true>
 *
 * If multiple tagged states are active, only the highest-priority tagged state is used.
 */

/*:ja
 * @target MZ
 * @plugindesc TP増加を無効にするステートが作成できます (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_TPNoRegenState
 *
 * @param RecoverBlockedMessage
 * @text TP回復無効メッセージ
 * @desc TP回復が無効化されたときに表示するメッセージです。%1は対象者名、%2はTP表示名に置き換わります。
 * @default %1の%2を回復できない！
 * @type string
 *
 * @param ItemRecover
 * @text アイテムによるTP回復を許可
 * @desc trueの場合、アイテム効果によるTP増加を許可します。
 * @default false
 * @type boolean
 *
 * @param SkillRecover
 * @text スキルによるTP回復を許可
 * @desc trueの場合、スキル（魔法・必殺技）の効果によるTP増加を許可します。
 * @default false
 * @type boolean
 *
 * @help
 * TP増加を禁止したいステートのメモ欄に、次のタグを記述してください。
 * <TPNoRegenState>
 *
 * ステートごとにTP回復無効の挙動を上書きしたい場合は、
 * 次のタグを併記してください。
 * <TPNoRegenState_RecoverBlockedMessage: %1は%2を回復できない状態だ！>
 * <TPNoRegenState_ItemRecover: true>
 * <TPNoRegenState_SkillRecover: true>
 *
 * なお、 <TPNoRegenState> が設定されたステートに複数種類、同時にかかっている場合は、
 * 「優先度」が最も高いステートのタグを参照します。
 */

(() => {
  'use strict';

  const pluginName = 'HTN_TPNoRegenState';
  const parameters = PluginManager.parameters(pluginName);
  const recoverBlockedMessageDefault = String(parameters.RecoverBlockedMessage || '%1の%2を回復できない！');
  const itemRecoverDefault = String(parameters.ItemRecover) === 'true';
  const skillRecoverDefault = String(parameters.SkillRecover) === 'true';

  /**
   * 文字列や真偽値の入力を真偽値へ変換
   *
   * @param {boolean, string} value 変換対象の値
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

  /**
   * TP増加を禁止する条件に該当するか
   *
   * @param {Game_Battler} battler 対象バトラー
   * @param {boolean} isItemRecover アイテム効果によるTP増加かどうか
   * @param {boolean} isSkillRecover スキル効果によるTP増加かどうか
   * @returns {boolean} TP増加を禁止する場合は true
   */
  const shouldBlockTpGain = (battler, isItemRecover, isSkillRecover) => {
    const state = battler.states().find((s) => s.meta.TPNoRegenState);
    if (!state) return false;

    if (isItemRecover && toBoolean(state.meta.TPNoRegenState_ItemRecover, itemRecoverDefault)) {
      return false;
    }

    if (isSkillRecover && toBoolean(state.meta.TPNoRegenState_SkillRecover, skillRecoverDefault)) {
      return false;
    }

    return true;
  };

  /**
   * TP回復が無効化されたときの表示メッセージを取得
   *
   * @param {Game_Battler} battler 対象バトラー
   * @returns {string} 表示メッセージ
   */
  const recoverBlockedMessage = (battler) => {
    const state = battler.states().find((s) => s.meta.TPNoRegenState);
    if (!state) return '';

    if (state.meta.TPNoRegenState_RecoverBlockedMessage == null) {
      return recoverBlockedMessageDefault.trim();
    } else {
      return String(state.meta.TPNoRegenState_RecoverBlockedMessage).trim();
    }
  };

  const _Game_BattlerBase_setTp = Game_BattlerBase.prototype.setTp;
  Game_BattlerBase.prototype.setTp = function(tp) {
    const currentTp = this.tp;
    const isItemRecover = this._tpNoRegenStateByItem === true;
    const isSkillRecover = this._tpNoRegenStateBySkill === true;

    // 設定しようとしているTPが現在のTPより大きい場合、TPを変化しないように
    if (tp > currentTp && shouldBlockTpGain(this, isItemRecover, isSkillRecover)) {
      tp = currentTp;
      this.result().tpDamage = 0; // 「TPが20増えた！」のようなメッセージが出ないよう 0 で上書き

      if (isItemRecover || isSkillRecover) {
        // 独自フラグを立て、 displayTpDamage 側でメッセージ表示をおこなう
        this.result().tpNoRegenRecoverBlocked = true;
        this.result().tpNoRegenRecoverBlockedMessage = recoverBlockedMessage(this);
      }
    }

    _Game_BattlerBase_setTp.call(this, tp);
  };

  const _Game_Action_itemEffectGainTp = Game_Action.prototype.itemEffectGainTp;
  Game_Action.prototype.itemEffectGainTp = function(target, effect) {
    // TP増加の原因を一時フラグで記録し、gainTp 側で許可判定に利用
    if (this.isItem()) {
      target._tpNoRegenStateByItem = true;
    }
    if (this.isSkill()) {
      target._tpNoRegenStateBySkill = true;
    }

    try {
      _Game_Action_itemEffectGainTp.call(this, target, effect);
    } finally {
      // 一時フラグを確実に解放する
      target._tpNoRegenStateByItem = null;
      target._tpNoRegenStateBySkill = null;
    }
  };

  const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    _Game_ActionResult_clear.call(this);

    // プラグイン独自のフラグを解放
    this.tpNoRegenRecoverBlocked = null;
    this.tpNoRegenRecoverBlockedMessage = null;
  };

  const _Window_BattleLog_displayTpDamage = Window_BattleLog.prototype.displayTpDamage;
  Window_BattleLog.prototype.displayTpDamage = function(target) {
    _Window_BattleLog_displayTpDamage.call(this, target);

    const tpNoRegenRecoverBlocked = target.result().tpNoRegenRecoverBlocked;
    const tpNoRegenRecoverBlockedMessage = target.result().tpNoRegenRecoverBlockedMessage;

    if (target.isAlive() && tpNoRegenRecoverBlocked && tpNoRegenRecoverBlockedMessage) {
      this.push('addText', tpNoRegenRecoverBlockedMessage.format(target.name(), TextManager.tp));
    }
  };
})();
