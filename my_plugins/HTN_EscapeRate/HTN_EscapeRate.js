// --------------------------------------------------------------------------
//
// HTN_EscapeRate.js
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
 * @plugindesc Changes the escape success rate (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_EscapeRate
 *
 * @param DefaultEscapeRate
 * @text Default Escape Rate (%)
 * @desc Escape success rate for enemies without an <EscapeRate> tag in their note.
 * @default 100
 * @type number
 * @min 0
 * @max 100
 *
 * @help
 * Changes the escape success rate.
 *
 * By adding the following tag to an enemy's note field,
 * you can set the escape rate for that specific enemy.
 *
 *   <EscapeRate: 50>   // 50% chance of escaping
 *
 * For enemies without this tag, the plugin parameter
 * "Default Escape Rate" is used (default: 100%).
 *
 * The final escape rate is the average of all enemies
 * in the current troop. Each failed escape attempt
 * increases the escape rate by 10%.
 */

/*:ja
 * @target MZ
 * @plugindesc 逃走成功率を変更できるようにします (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_EscapeRate
 *
 * @param DefaultEscapeRate
 * @text デフォルト逃走確率(%)
 * @desc 敵キャラのメモ欄に <EscapeRate> タグが設定されていない場合の逃走成功率です。
 * @default 100
 * @type number
 * @min 0
 * @max 100
 *
 * @help
 * 逃走成功率を変更できるようにします。
 *
 * 敵キャラのメモ欄に以下のタグを記入することで、
 * その敵キャラに対する逃走確率を個別に設定できます。
 *
 *   <EscapeRate: 50>   // 50%の確率で逃走できる
 *
 * タグが設定されていない敵キャラについては、
 * プラグインパラメータの「デフォルト逃走確率」が使用されます（デフォルト: 100%）。
 *
 * 最終的な逃走確率は、敵グループ内の全敵キャラの逃走確率の平均値になります。
 * 逃走に失敗するたびに、逃走確率が10%ずつ上昇します。
 */

(() => {
  'use strict';

  const pluginName = "HTN_EscapeRate";
  const parameters = PluginManager.parameters(pluginName);
  // デフォルト逃走確率（0〜100の整数）
  const paramDefaultEscapeRate = Number(parameters['DefaultEscapeRate'] ?? 100);

  /**
   * 敵キャラ1体の逃走確率(%)を返す。
   * メモ欄に <EscapeRate: N> タグがあればその値を、なければデフォルト値を返す。
   * @param {Game_Enemy} enemy - 対象の敵キャラ
   * @returns {number} 逃走確率（0〜100の整数）
   */
  function getEscapeRateForEnemy(enemy) {
    const metaValue = enemy.enemy().meta['EscapeRate'];
    if (metaValue != null) {
      return Number(metaValue);
    }

    return paramDefaultEscapeRate;
  }

  /**
   * 逃走確率を計算してセットする。 BattleManager.setup の中で呼び出される。
   * 敵グループ内の全敵キャラの逃走確率の平均値を使用している。
   * 逃走に失敗すると BattleManager.onEscapeFailure により逃走確率が10%ずつ上昇していく。
   */
  BattleManager.makeEscapeRatio = function() {
    const enemies = $gameTroop.members();
    if (enemies.length === 0) {
      this._escapeRatio = paramDefaultEscapeRate / 100;
      return;
    }

    const totalRate = enemies.reduce((sum, enemy) => sum + getEscapeRateForEnemy(enemy), 0);
    this._escapeRatio = totalRate / enemies.length / 100;
  };
})();
