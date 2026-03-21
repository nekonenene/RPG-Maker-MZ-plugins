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
 * You can override item TP-recover behavior per state:
 * <TPNoRegenState_ItemRecover: true>
 *
 * You can override skill TP-recover behavior per state:
 * <TPNoRegenState_SkillRecover: true>
 *
 * If multiple tagged states are active, only the highest-priority tagged state is used.
 *
 * TP loss is still applied normally.
 */

/*:ja
 * @target MZ
 * @plugindesc 特定ステート中のTP増加を無効化します (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_TPNoRegenState
 *
 * @param ItemRecover
 * @text アイテムTP回復を許可
 * @desc trueの場合、タグ付きステート中でもアイテム効果によるTP増加を許可します。
 * @default false
 * @type boolean
 *
 * @param SkillRecover
 * @text スキルTP回復を許可
 * @desc trueの場合、タグ付きステート中でもスキル効果によるTP増加を許可します。
 * @default false
 * @type boolean
 *
 * @help
 * TP増加を禁止したいステートのメモ欄に、次のタグを記述してください。
 * <TPNoRegenState>
 *
 * ステートごとにアイテムTP回復の挙動を上書きしたい場合は、
 * 次のタグを併記してください。
 * <TPNoRegenState_ItemRecover: true>
 * <TPNoRegenState_SkillRecover: true>
 * 複数の対象ステートが同時に有効な場合は、優先度が最も高い1つだけを参照します。
 *
 * TP減少は通常どおり処理されます。
 */

(() => {
  'use strict';

  const pluginName = 'HTN_TPNoRegenState';
  const parameters = PluginManager.parameters(pluginName);
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
    const states = battler.states().filter((state) => state.meta.TPNoRegenState);

    if (states.length === 0) {
      return false;
    }

    // <TPNoRegenState> の付いた状態異常に複数かかっている場合、「優先度」がもっとも高いステートのタグを採用
    const state = states[0];

    if (isItemRecover && toBoolean(state.meta.TPNoRegenState_ItemRecover, itemRecoverDefault)) {
      return false;
    }

    if (isSkillRecover && toBoolean(state.meta.TPNoRegenState_SkillRecover, skillRecoverDefault)) {
      return false;
    }

    return true;
  };

  const _Game_Battler_gainTp = Game_Battler.prototype.gainTp;
  Game_Battler.prototype.gainTp = function(value) {
    const isItemRecover = this._tpNoRegenStateByItem === true;
    const isSkillRecover = this._tpNoRegenStateBySkill === true;

    if (value > 0 && shouldBlockTpGain(this, isItemRecover, isSkillRecover)) {
      value = 0;
    }

    _Game_Battler_gainTp.call(this, value);
  };

  const _Game_Battler_gainSilentTp = Game_Battler.prototype.gainSilentTp;
  Game_Battler.prototype.gainSilentTp = function(value) {
    const isItemRecover = this._tpNoRegenStateByItem === true;
    const isSkillRecover = this._tpNoRegenStateBySkill === true;

    if (value > 0 && shouldBlockTpGain(this, isItemRecover, isSkillRecover)) {
      value = 0;
    }

    _Game_Battler_gainSilentTp.call(this, value);
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
})();
