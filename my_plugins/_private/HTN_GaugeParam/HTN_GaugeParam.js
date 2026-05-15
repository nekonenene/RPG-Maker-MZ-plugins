// --------------------------------------------------------------------------
//
// HTN_GaugeParam.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc Adds a gauge-based custom parameter to actors (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
 *
 * @param GaugeMax
 * @text Max Value
 * @desc Maximum value of the parameter.
 * @default 100
 * @type number
 * @min 1
 *
 * @param GaugeInitialValue
 * @text Initial Value
 * @desc Initial value assigned to each actor at game start.
 * @default 0
 * @type number
 * @min 0
 *
 * @param GaugeLabel
 * @text Gauge Label
 * @desc Short label shown inside the gauge.
 * @default EP
 * @type string
 *
 * @param MaxCommonEvent
 * @text Common Event on Max
 * @desc Common event ID called when the value reaches the maximum. Set 0 to disable.
 * @default 0
 * @type common_event
 *
 * @param MinCommonEvent
 * @text Common Event on Min
 * @desc Common event ID called when the value reaches 0. Set 0 to disable.
 * @default 0
 * @type common_event
 *
 * @param GaugeColor1
 * @text Gauge Color 1
 * @desc Left gradient color of the gauge (CSS color string).
 * @default #ff80b0
 * @type string
 *
 * @param GaugeColor2
 * @text Gauge Color 2
 * @desc Right gradient color of the gauge (CSS color string).
 * @default #ff0060
 * @type string
 *
 * @command ChangeValue
 * @text Change Value
 * @desc Changes the parameter value of an actor by the specified amount.
 *
 * @arg actorId
 * @text Actor ID
 * @desc ID of the actor to change.
 * @default 1
 * @type actor
 *
 * @arg amount
 * @text Amount
 * @desc Amount to change (positive = increase, negative = decrease).
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @command SetValue
 * @text Set Value
 * @desc Sets the parameter value of an actor to a specific value.
 *
 * @arg actorId
 * @text Actor ID
 * @desc ID of the actor to set.
 * @default 1
 * @type actor
 *
 * @arg value
 * @text Value
 * @desc Value to set.
 * @default 0
 * @type number
 * @min 0
 * @max 9999
 *
 * @command GetValue
 * @text Get Value
 * @desc Stores the parameter value of an actor in a game variable.
 *
 * @arg actorId
 * @text Actor ID
 * @desc ID of the actor to read.
 * @default 1
 * @type actor
 *
 * @arg variableId
 * @text Variable ID
 * @desc ID of the variable to store the value in.
 * @default 1
 * @type variable
 *
 * @help
 * Adds a gauge-based custom parameter to actors.
 * The value ranges from 0 to the configured maximum (default: 100).
 *
 * Note tags for skills and items:
 *   <GaugeParam_Increase: formula>   Increases the target's value.
 *   <GaugeParam_Decrease: formula>   Decreases the target's value.
 *
 * In formulas:
 *   a = action user (attacker/caster)
 *   b = target
 *   v = $gameVariables._data
 *
 * Examples:
 *   <GaugeParam_Increase: 30>
 *   <GaugeParam_Increase: a.atk * 0.5>
 *   <GaugeParam_Decrease: b.mhp * 0.1>
 *
 * Other plugins can access this parameter via the global HTN_GaugeParam class:
 *   HTN_GaugeParam.getValue(actor)
 *   HTN_GaugeParam.setValue(actor, value)
 *   HTN_GaugeParam.changeValue(actor, delta)
 */

/*:ja
 * @target MZ
 * @plugindesc アクターにゲージ付きの独自パラメータを追加します (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 *
 * @param GaugeMax
 * @text 最大値
 * @desc パラメータの最大値
 * @default 100
 * @type number
 * @min 1
 *
 * @param GaugeInitialValue
 * @text 初期値
 * @desc ゲーム開始時に各アクターへ設定されるパラメータの初期値
 * @default 0
 * @type number
 * @min 0
 *
 * @param GaugeLabel
 * @text ゲージラベル
 * @desc ゲージ内に表示する短いラベル文字
 * @default EP
 * @type string
 *
 * @param MaxCommonEvent
 * @text 最大値到達コモンイベント
 * @desc 値が最大値に達したときに呼び出すコモンイベントID（0で無効）
 * @default 0
 * @type common_event
 *
 * @param MinCommonEvent
 * @text 最小値到達コモンイベント
 * @desc 値が0に達したときに呼び出すコモンイベントID（0で無効）
 * @default 0
 * @type common_event
 *
 * @param GaugeColor1
 * @text ゲージカラー1
 * @desc ゲージのグラデーション左端の色（CSS カラー文字列）
 * @default #ff80b0
 * @type string
 *
 * @param GaugeColor2
 * @text ゲージカラー2
 * @desc ゲージのグラデーション右端の色（CSS カラー文字列）
 * @default #ff0060
 * @type string
 *
 * @command ChangeValue
 * @text 値を変化させる
 * @desc アクターのパラメータ値を指定した量だけ変化させます
 *
 * @arg actorId
 * @text アクターID
 * @desc 対象のアクターID
 * @default 1
 * @type actor
 *
 * @arg amount
 * @text 変化量
 * @desc 変化量（正数で増加、負数で減少）
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @command SetValue
 * @text 値を設定する
 * @desc アクターのパラメータ値を指定した値に設定します
 *
 * @arg actorId
 * @text アクターID
 * @desc 対象のアクターID
 * @default 1
 * @type actor
 *
 * @arg value
 * @text 設定値
 * @desc 設定するパラメータ値
 * @default 0
 * @type number
 * @min 0
 * @max 9999
 *
 * @command GetValue
 * @text 値を取得する
 * @desc アクターのパラメータ値をゲーム変数に格納します
 *
 * @arg actorId
 * @text アクターID
 * @desc 対象のアクターID
 * @default 1
 * @type actor
 *
 * @arg variableId
 * @text 変数ID
 * @desc パラメータ値を格納するゲーム変数のID
 * @default 1
 * @type variable
 *
 * @help
 * 【ゲージ付き独自パラメータ追加プラグイン】
 *
 * アクターにゲージ付きの独自パラメータを追加します。
 * 値は0〜設定した最大値（初期値: 100）の範囲で変動します。
 *
 * ■ スキル・アイテムのメモ欄タグ
 * 対象のパラメータ値を変化させるタグをスキルやアイテムのメモ欄に記述します。
 *   <GaugeParam_Increase: 数式>  対象の値を増やします
 *   <GaugeParam_Decrease: 数式>  対象の値を減らします
 *
 * 数式内で使用できる変数:
 *   a = 使用者
 *   b = 対象
 *   v = $gameVariables._data（ゲーム変数の配列）
 *
 * 記述例:
 *   <GaugeParam_Increase: 30>
 *   <GaugeParam_Increase: a.atk * 0.5>
 *   <GaugeParam_Decrease: b.mhp * 0.1>
 *
 * ■ 境界値トリガー
 * 値が最大値に遷移した瞬間に MaxCommonEvent のコモンイベントが呼び出されます。
 * 値が0に遷移した瞬間に MinCommonEvent のコモンイベントが呼び出されます。
 * いずれもすでに境界値の状態からさらに変化しても再発動しません。
 *
 * ■ 他プラグインからの利用
 * グローバルクラス HTN_GaugeParam を通じてアクセスできます:
 *   HTN_GaugeParam.getValue(actor)           値の取得
 *   HTN_GaugeParam.setValue(actor, value)    値の設定
 *   HTN_GaugeParam.changeValue(actor, delta) 値の変化
 */

(() => {
  'use strict';

  const pluginName = 'HTN_GaugeParam';
  const pluginParams = PluginManager.parameters(pluginName);
  const gaugeMax = Math.max(1, Number(pluginParams.GaugeMax || 100));
  const gaugeInitialValue = Math.max(0, Math.min(gaugeMax, Number(pluginParams.GaugeInitialValue || 0)));
  const gaugeLabel = String(pluginParams.GaugeLabel || 'EP');
  const maxCommonEventId = Number(pluginParams.MaxCommonEvent || 0);
  const minCommonEventId = Number(pluginParams.MinCommonEvent || 0);
  const gaugeColor1 = String(pluginParams.GaugeColor1 || '#ff80b0');
  const gaugeColor2 = String(pluginParams.GaugeColor2 || '#ff0060');

  class HTN_GaugeParam {
    /**
     * アクターのパラメータ値を取得する
     *
     * @param {Game_Actor} actor 対象アクター
     * @returns {number} パラメータ値
     */
    static getValue(actor) {
      return actor._HTN_GaugeParam_Value ?? gaugeInitialValue;
    }

    /**
     * アクターのパラメータ値を設定し、境界値への遷移時にコモンイベントを予約する
     *
     * @param {Game_Actor} actor 対象アクター
     * @param {number} value 設定する値
     */
    static setValue(actor, value) {
      const oldValue = HTN_GaugeParam.getValue(actor);
      const newValue = Math.max(0, Math.min(gaugeMax, value));

      actor._HTN_GaugeParam_Value = newValue;

      if (oldValue > 0 && newValue === 0 && minCommonEventId > 0) {
        $gameTemp.reserveCommonEvent(minCommonEventId);
      }

      if (oldValue < gaugeMax && newValue === gaugeMax && maxCommonEventId > 0) {
        $gameTemp.reserveCommonEvent(maxCommonEventId);
      }
    }

    /**
     * アクターのパラメータ値を変化させる
     *
     * @param {Game_Actor} actor 対象アクター
     * @param {number} delta 変化量（正数で増加、負数で減少）
     */
    static changeValue(actor, delta) {
      HTN_GaugeParam.setValue(actor, HTN_GaugeParam.getValue(actor) + delta);
    }
  }

  window.HTN_GaugeParam = HTN_GaugeParam;

  PluginManager.registerCommand(pluginName, 'ChangeValue', (args) => {
    const actor = $gameActors.actor(Number(args.actorId));
    if (actor == null) return;

    HTN_GaugeParam.changeValue(actor, Number(args.amount));
  });

  PluginManager.registerCommand(pluginName, 'SetValue', (args) => {
    const actor = $gameActors.actor(Number(args.actorId));
    if (actor == null) return;

    HTN_GaugeParam.setValue(actor, Number(args.value));
  });

  PluginManager.registerCommand(pluginName, 'GetValue', (args) => {
    const actor = $gameActors.actor(Number(args.actorId));
    const variableId = Number(args.variableId);
    if (actor == null || variableId <= 0) return;

    $gameVariables.setValue(variableId, HTN_GaugeParam.getValue(actor));
  });

  /**
   * パラメータ値を初期値で初期化する
   */
  const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
  Game_Actor.prototype.initMembers = function() {
    _Game_Actor_initMembers.call(this);

    this._HTN_GaugeParam_Value = gaugeInitialValue;
  };

  /**
   * メモタグの数式を評価して0以上の整数を返す
   *
   * @param {string} formula 数式文字列
   * @param {Game_Battler} subject 使用者
   * @param {Game_Battler} targetBattler 対象
   * @returns {number} 計算結果（0以上の整数）
   */
  const evalFormula = (formula, subject, targetBattler) => {
    try {
      const a = subject; // eslint-disable-line no-unused-vars
      const b = targetBattler; // eslint-disable-line no-unused-vars
      const v = $gameVariables._data; // eslint-disable-line no-unused-vars
      const result = eval(formula);
      return Math.max(0, Math.round(isNaN(result) ? 0 : Number(result)));
    } catch (_e) {
      return 0;
    }
  };

  /**
   * スキル・アイテム使用時にメモタグに基づいてパラメータ値を変化させる
   *
   * @param {Game_Battler} target 対象バトラー
   */
  const _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function(target) {
    _Game_Action_apply.call(this, target);

    if (!target.result().isHit()) return;
    if (!target.isActor()) return;

    const item = this.item();
    if (item == null) return;

    const meta = item.meta;
    if (meta == null) return;

    if (meta.GaugeParam_Increase != null) {
      const value = evalFormula(String(meta.GaugeParam_Increase), this.subject(), target);
      HTN_GaugeParam.changeValue(target, value);
    }

    if (meta.GaugeParam_Decrease != null) {
      const value = evalFormula(String(meta.GaugeParam_Decrease), this.subject(), target);
      HTN_GaugeParam.changeValue(target, -value);
    }
  };

  /**
   * ゲージの有効判定（アクターに対してのみ有効）
   *
   * @returns {boolean}
   */
  const _Sprite_Gauge_isValid = Sprite_Gauge.prototype.isValid;
  Sprite_Gauge.prototype.isValid = function() {
    if (this._statusType === 'gaugeparam') {
      return this._battler != null && this._battler.isActor();
    }

    return _Sprite_Gauge_isValid.call(this);
  };

  /**
   * ゲージの現在値
   *
   * @returns {number}
   */
  const _Sprite_Gauge_currentValue = Sprite_Gauge.prototype.currentValue;
  Sprite_Gauge.prototype.currentValue = function() {
    if (this._battler && this._statusType === 'gaugeparam') {
      return HTN_GaugeParam.getValue(this._battler);
    }

    return _Sprite_Gauge_currentValue.call(this);
  };

  /**
   * ゲージの最大値
   *
   * @returns {number}
   */
  const _Sprite_Gauge_currentMaxValue = Sprite_Gauge.prototype.currentMaxValue;
  Sprite_Gauge.prototype.currentMaxValue = function() {
    if (this._statusType === 'gaugeparam') {
      return gaugeMax;
    }

    return _Sprite_Gauge_currentMaxValue.call(this);
  };

  /**
   * ゲージのラベル文字
   *
   * @returns {string}
   */
  const _Sprite_Gauge_label = Sprite_Gauge.prototype.label;
  Sprite_Gauge.prototype.label = function() {
    if (this._statusType === 'gaugeparam') {
      return gaugeLabel;
    }

    return _Sprite_Gauge_label.call(this);
  };

  /**
   * ゲージカラー1（グラデーション左端）
   *
   * @returns {string}
   */
  const _Sprite_Gauge_gaugeColor1 = Sprite_Gauge.prototype.gaugeColor1;
  Sprite_Gauge.prototype.gaugeColor1 = function() {
    if (this._statusType === 'gaugeparam') {
      return gaugeColor1;
    }

    return _Sprite_Gauge_gaugeColor1.call(this);
  };

  /**
   * ゲージカラー2（グラデーション右端）
   *
   * @returns {string}
   */
  const _Sprite_Gauge_gaugeColor2 = Sprite_Gauge.prototype.gaugeColor2;
  Sprite_Gauge.prototype.gaugeColor2 = function() {
    if (this._statusType === 'gaugeparam') {
      return gaugeColor2;
    }

    return _Sprite_Gauge_gaugeColor2.call(this);
  };

  /**
   * バトルステータスやステータス画面にゲージを追加する
   *
   * @param {Game_Actor} actor 対象アクター
   * @param {number} x X座標
   * @param {number} y Y座標
   */
  const _Window_StatusBase_placeBasicGauges = Window_StatusBase.prototype.placeBasicGauges;
  Window_StatusBase.prototype.placeBasicGauges = function(actor, x, y) {
    _Window_StatusBase_placeBasicGauges.call(this, actor, x, y);

    const offset = $dataSystem.optDisplayTp ? 3 : 2;
    this.placeGauge(actor, 'gaugeparam', x, y + this.gaugeLineHeight() * offset);
  };

  /**
   * ゲージ1行分を確保するためゲージ開始位置を上にずらす
   *
   * @param {Rectangle} rect アイテム矩形
   * @returns {number}
   */
  const _Window_BattleStatus_basicGaugesY = Window_BattleStatus.prototype.basicGaugesY;
  Window_BattleStatus.prototype.basicGaugesY = function(rect) {
    return _Window_BattleStatus_basicGaugesY.call(this, rect) - this.gaugeLineHeight();
  };
})();
