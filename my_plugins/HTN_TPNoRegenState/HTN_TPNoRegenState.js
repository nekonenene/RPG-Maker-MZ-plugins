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
 * @help
 * Add the following note tag to a state to block TP gain while that state is active:
 * <TPNoRegenState>
 *
 * TP loss is still applied normally.
 */

/*:ja
 * @target MZ
 * @plugindesc 特定ステート中のTP増加を無効化します (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_TPNoRegenState
 *
 * @help
 * TP増加を禁止したいステートのメモ欄に、次のタグを記述してください。
 * <TPNoRegenState>
 *
 * このタグ付きステートが有効な間は、TP増加（自動回復・被ダメージ時の増加・
 * スキルやアイテムによる増加・イベントコマンドによる増加）を無効化します。
 *
 * TP減少は通常どおり処理されます。
 */

(() => {
  'use strict';

  /**
   * TP増加を禁止する条件に該当するかを返します。
   * @param {Game_Battler} battler 対象バトラーです。
   * @returns {boolean} 有効ステートに <TPNoRegenState> があれば true を返します。
   */
  const shouldBlockTpGain = (battler) => {
    if (battler == null || typeof battler.states !== 'function') {
      return false;
    }

    return battler.states().some((state) => state && state.meta && state.meta.TPNoRegenState);
  };

  const _Game_Battler_gainTp = Game_Battler.prototype.gainTp;
  Game_Battler.prototype.gainTp = function(value) {
    if (value > 0 && shouldBlockTpGain(this)) {
      return;
    }

    _Game_Battler_gainTp.call(this, value);
  };

  const _Game_Battler_gainSilentTp = Game_Battler.prototype.gainSilentTp;
  Game_Battler.prototype.gainSilentTp = function(value) {
    if (value > 0 && shouldBlockTpGain(this)) {
      return;
    }

    _Game_Battler_gainSilentTp.call(this, value);
  };
})();
