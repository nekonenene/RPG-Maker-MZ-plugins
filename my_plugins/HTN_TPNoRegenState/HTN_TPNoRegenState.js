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
 * @param ItemRecover
 * @text Allow TP gain from items
 * @desc If true, TP gain from an item's Add TP effect is allowed during tagged states.
 * @default false
 * @type boolean
 *
 * @param SkillRecover
 * @text Allow TP gain from skills
 * @desc If true, TP gain from a skill's Add TP effect is allowed during tagged states.
 * @default false
 * @type boolean
 *
 * @param RecoverBlockedMessage
 * @text Blocked TP message
 * @desc Message shown when item/skill TP recovery is blocked. %1 is target name, %2 is TP label.
 * @default %1 cannot recover %2!
 * @type string
 *
 * @help
 * Add the following note tag to a state to block TP gain while that state is active:
 * <TPNoRegenState>
 *
 * You can override item TP-recover behavior per state:
 * <TPNoRegenState_ItemRecover: true>
 *
 * You can override skill TP-recover behavior per state:
 * <TPNoRegenState_SkillRecover: true>
 *
 * You can override blocked message per state:
 * <TPNoRegenState_RecoverBlockedMessage: %1 cannot recover %2!>
 *
 * If multiple tagged states are active, only the tagged state with the highest database priority is used.
 */

/*:ja
 * @target MZ
 * @plugindesc TPの回復ができなくなるステート（状態異常）を作成できます (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_TPNoRegenState
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
 * @param RecoverBlockedMessage
 * @text TP回復無効メッセージ
 * @desc アイテムやスキルによるTP回復が失敗したことを示すメッセージです。%1は対象者名、%2はTPの表示名に置き換わります。
 * @default %1の%2を回復できない！
 * @type string
 *
 * @help
 * 【使い方】
 * TP増加を禁止したいステートのメモ欄に、次のタグを記述してください。
 * <TPNoRegenState>
 *
 * 【ステートごとの個別設定】
 * ステートの「メモ」に以下のように記述することで、
 * プラグインパラメータの設定をステートごとに上書きできます。
 *
 * 設定項目一覧：
 * <TPNoRegenState> （※この記述は必須です）
 * <TPNoRegenState_ItemRecover: true> （アイテムによるTP回復を許可する場合）
 * <TPNoRegenState_SkillRecover: true> （魔法や必殺技によるTP回復を許可する場合）
 * <TPNoRegenState_RecoverBlockedMessage: %1は%2を回復できない状態だ！> （TP回復に失敗したことを示すメッセージを変更する場合。%1は対象者名、%2はTPの表示名に置き換わる）
 *
 * 設定例：
 * 例えば、以下のように記述すると、スキルでのTP回復は有効な一方、
 * アイテムでのTP回復ができず、アイテムでのTP回復時に「○○のやる気は上がらなかった！」という
 * メッセージが表示されるようになります。
 *
 * <TPNoRegenState>
 * <TPNoRegenState_ItemRecover: false>
 * <TPNoRegenState_SkillRecover: true>
 * <TPNoRegenState_RecoverBlockedMessage: %1のやる気は上がらなかった！>
 *
 * なお、 <TPNoRegenState> が設定されたステートが複数種類あって、それらに同時にかかっている場合は、
 * 「優先度」が最も高いステートのタグが参照されます。
 */

(() => {
  'use strict';

  const pluginName = 'HTN_TPNoRegenState';
  const parameters = PluginManager.parameters(pluginName);
  const itemRecoverDefault = String(parameters.ItemRecover) === 'true';
  const skillRecoverDefault = String(parameters.SkillRecover) === 'true';
  const recoverBlockedMessageDefault = String(parameters.RecoverBlockedMessage || '%1の%2を回復できない！');

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

    // 設定しようとしているTPが現在のTPより大きい場合、TPを変化しないように。
    // NOTE: gainTp, gainSilentTp の value を 0 にする実装方針も考えられたが、
    // NRP_RecoverAfterAction のように setTp を直接呼び出すプラグインもあるためこの実装を採用。
    // このプラグインには影響ないが、 itemEffectGainTp 内で makeSuccess が呼ばれ、
    // TP回復をしていないのに result().success が true になることが他に影響を及ぼさないか少し心配。
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
