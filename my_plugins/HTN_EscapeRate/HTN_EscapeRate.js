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
 * @target MV MZ
 * @plugindesc Changes the escape success rate (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
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
 * @param EscapeRateIncrement
 * @text Escape Rate Increment on Failure (%)
 * @desc Amount (%) added to the escape rate after each failed escape attempt.
 * @default 10
 * @type number
 * @min 0
 * @max 100
 *
 * @param EscapeRateBonus
 * @text Escape Rate Bonus per Defeated Enemy (%)
 * @desc Bonus escape rate (%) added per defeated enemy. Formula: defeated enemies * this value.
 * @default 0
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
 *   <EscapeRate: 60>   // 60% chance of escaping
 *
 * For enemies without this tag, the plugin parameter
 * "Default Escape Rate" is used (default: 100%).
 *
 * The base escape rate is the average of all enemies in the troop.
 * A bonus is then added based on the number of defeated enemies:
 *   bonus = defeated enemy count * Escape Rate Bonus (%)
 *
 * Each failed escape attempt increases the escape rate by
 * the "Escape Rate Increment on Failure" value (default: 10%).
 */

/*:ja
 * @target MV MZ
 * @plugindesc 逃走成功率をパーセンテージでカンタンに設定できます (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_EscapeRate
 *
 * @param DefaultEscapeRate
 * @text デフォルト逃走成功率(%)
 * @desc 敵キャラのメモ欄に <EscapeRate> タグが設定されていない場合の逃走成功率です。
 * @default 100
 * @type number
 * @min 0
 * @max 100
 *
 * @param EscapeRateIncrement
 * @text 逃走失敗時の逃走成功率の上昇量(%)
 * @desc 逃走に失敗するたびに逃走確率に加算される値です。ツクールのデフォルトは10%です。
 * @default 10
 * @type number
 * @min 0
 * @max 100
 *
 * @param EscapeRateBonus
 * @text 倒した敵1体ごとの逃走ボーナス率(%)
 * @desc 倒した敵の数 × この値 がボーナスとして逃走成功率に加算されます。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @help
 * 逃走成功率をパーセンテージでカンタンに設定できます。
 *
 * 敵キャラの「メモ」欄に以下のタグを記入することで、
 * その敵キャラに対する逃走確率を個別に設定できます。
 *
 *   <EscapeRate: 60>   // 60%の確率で逃走できる
 *
 * タグが設定されていない敵キャラについては、
 * プラグインパラメータの「デフォルト逃走成功率」が使用され、
 * 基本逃走確率は、敵グループ内の全敵キャラの逃走確率の平均値となります。
 *
 * さらに、倒した敵の数が多いほど逃走成功率にボーナスが加算されます。
 * ボーナス = 撃破した敵の数 × 「倒した敵1体あたりの逃走ボーナス率」
 *
 * 逃走に失敗するたびに「逃走失敗時の逃走成功率の上昇量」が加算されます（デフォルト: 10%）。
 */

(() => {
  'use strict';

  const pluginName = "HTN_EscapeRate";
  const parameters = PluginManager.parameters(pluginName);

  // デフォルト逃走成功率（0〜100の整数）
  const paramDefaultEscapeRate = Number(parameters['DefaultEscapeRate'] ?? 100);
  // 逃走失敗時の逃走成功率の上昇量（0〜100の整数）
  const paramEscapeRateIncrement = Number(parameters['EscapeRateIncrement'] ?? 10);
  // 倒した敵1体あたりの逃走ボーナス率（0〜100の整数）
  const paramEscapeRateBonus = Number(parameters['EscapeRateBonus'] ?? 0);

  /**
   * 敵キャラ1体の逃走確率(%)を返す。
   * メモ欄に <EscapeRate: N> タグがあればその値を、なければデフォルト値を返す。
   *
   * @param {Game_Enemy} enemy - 対象の敵キャラ
   * @returns {number} 逃走確率（0〜100の整数）
   */
  function getEscapeRateOfEnemy(enemy) {
    const metaValue = enemy.enemy().meta.EscapeRate;
    if (metaValue != null) {
      return Number(metaValue);
    }

    return paramDefaultEscapeRate;
  }

  /**
   * 逃走確率を計算してセットする。 BattleManager.setup の中で呼び出される。
   * 敵グループ内の全敵キャラの逃走確率の平均値を使用している。
   */
  BattleManager.makeEscapeRatio = function() {
    const enemies = $gameTroop.members();
    if (enemies.length === 0) {
      this._escapeRatio = paramDefaultEscapeRate / 100;
      return;
    }

    const totalRate = enemies.reduce((sum, enemy) => sum + getEscapeRateOfEnemy(enemy), 0);
    this._escapeRatio = totalRate / enemies.length / 100;
  };

  /**
   * 撃破した敵の数に基づく逃走成功率ボーナス（0〜1の小数）を返す。
   * ボーナス = 撃破した敵の数 × paramEscapeRateBonus / 100
   *
   * @returns {number}
   */
  function calcEscapeBonus() {
    const defeatedCount = $gameTroop.members().length - $gameTroop.aliveMembers().length;

    return defeatedCount * paramEscapeRateBonus / 100;
  }

  /**
   * 逃走処理をおこなう。
   * ボーナスを逃走判定の直前に加算し、判定後に取り除くことで次回以降に影響しないようにしている。
   * また、元の処理で加算される逃走確率の増分（0.1固定）をカスタム値で置き換えている。
   * ツクールMVでは processEscape 内、MZでは onEscapeFailure 内で増分が加算されるが、
   * どちらも元の処理呼び出し前後の _escapeRatio の差分として検出・補正できる。
   *
   * @returns {boolean} 逃走成功なら true
   */
  const _BattleManager_processEscape = BattleManager.processEscape;
  BattleManager.processEscape = function() {
    // 以前の逃走成功率に、残り敵数に応じたボーナスを加算
    const bonus = calcEscapeBonus();
    this._escapeRatio += bonus;
    if (this._escapeRatio > 1) {
      this._escapeRatio = 1;
    }
    const ratioWithBonus = this._escapeRatio;

    const result = _BattleManager_processEscape.call(this);
    if (!result) {
      // 逃走に失敗した場合に逃走成功率を上げる
      this._escapeRatio = ratioWithBonus + paramEscapeRateIncrement / 100;
    }

    // 逃走を再びおこなったときにボーナスが二重に加算されないよう、ボーナス分を取り除く
    this._escapeRatio -= bonus;

    return result;
  };
})();
