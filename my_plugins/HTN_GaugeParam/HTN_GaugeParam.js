// --------------------------------------------------------------------------
//
// HTN_GaugeParam.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/05/16 v0.0.1 開発開始
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
 * @param ResetOnRecoverAll
 * @text Reset on Full Recovery
 * @desc If true, resets the parameter value to the initial value when a full recovery occurs (e.g., inn, event command).
 * @default true
 * @type boolean
 *
 * @param GaugeName
 * @text Parameter Name
 * @desc Name of the parameter used in messages.
 * @default EP
 * @type string
 *
 * @param GaugeLabel
 * @text Gauge Label
 * @desc Short label shown inside the gauge.
 * @default EP
 * @type string
 *
 * @param GaugeIncreaseMessage
 * @text Increase Message
 * @desc Message when the value increases. %1=target name, %2=parameter name, %3=amount. Leave empty to hide.
 * @default %1's %2 increased by %3!
 * @type string
 *
 * @param GaugeDecreaseMessage
 * @text Decrease Message
 * @desc Message when the value decreases. %1=target name, %2=parameter name, %3=amount. Leave empty to hide.
 * @default %1's %2 decreased by %3!
 * @type string
 *
 * @param RecoverySound
 * @text Recovery Sound Direction
 * @desc Which change direction plays the recovery sound.
 * @default increase
 * @type select
 * @option On Increase
 * @value increase
 * @option On Decrease
 * @value decrease
 * @option None
 * @value none
 *
 * @param MinCommonEvent
 * @text Common Event on Min
 * @desc Common event ID called when the value reaches 0. Set 0 to disable.
 * @default 0
 * @type common_event
 *
 * @param MaxCommonEvent
 * @text Common Event on Max
 * @desc Common event ID called when the value reaches the maximum. Set 0 to disable.
 * @default 0
 * @type common_event
 *
 * @param ShowInStatus
 * @text Show in Status Screen
 * @desc Show the gauge in the status screen.
 * @default true
 * @type boolean
 *
 * @param PriorityOverTP
 * @text Priority Over TP in Status
 * @desc When TP is displayed, replace the TP gauge with this gauge in the status screen. Has no effect when ShowInStatus is false.
 * @default true
 * @type boolean
 *
 * @param ShowInBattle
 * @text Show in Battle Status
 * @desc Show the gauge in the battle status window. It is displayed after HP/MP/TP as a fourth gauge.
 * @default true
 * @type boolean
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
 * Note tags for states (applied each turn, like poison):
 *   <GaugeParam_Increase: formula>   Increases the bearer's value each turn.
 *   <GaugeParam_Decrease: formula>   Decreases the bearer's value each turn.
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
 *   <GaugeParam_Decrease: v[1]>
 *
 * Other plugins can access this parameter via the global HTN_GaugeParam class:
 *   HTN_GaugeParam.getValue(actor)
 *   HTN_GaugeParam.setValue(actor, value)
 *   HTN_GaugeParam.changeValue(actor, delta)
 */

/*:ja
 * @target MZ
 * @plugindesc アクターにゲージ付きの独自パラメータを追加 (v1.0.0)
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
 * @param ResetOnRecoverAll
 * @text 全回復時に初期値にリセット
 * @desc 全回復（宿屋・イベントコマンドなど）が発生したとき、パラメータ値を初期値に戻す
 * @default true
 * @type boolean
 *
 * @param GaugeName
 * @text パラメータ名
 * @desc メッセージで使用するパラメータの名称
 * @default EP
 * @type string
 *
 * @param GaugeLabel
 * @text ゲージラベル
 * @desc ゲージ内に表示する短いラベル文字
 * @default EP
 * @type string
 *
 * @param GaugeIncreaseMessage
 * @text 増加メッセージ
 * @desc パラメータが増加したときに表示するメッセージ。空欄にすると非表示
 * @default %1の%2が %3 増えた！
 * @type string
 *
 * @param GaugeDecreaseMessage
 * @text 減少メッセージ
 * @desc パラメータが減少したときに表示するメッセージ。空欄にすると非表示
 * @default %1の%2が %3 減った！
 * @type string
 *
 * @param RecoverySound
 * @text 戦闘中の回復音
 * @desc 戦闘中に回復音を鳴らす条件
 * @default increase
 * @type select
 * @option パラメータ増加時
 * @value increase
 * @option パラメータ減少時
 * @value decrease
 * @option 鳴らさない
 * @value none
 *
 * @param MinCommonEvent
 * @text 最小値でのコモンイベント
 * @desc 値が0に達したときに呼び出すコモンイベントID（0で無効）
 * @default 0
 * @type common_event
 *
 * @param MaxCommonEvent
 * @text 最大値でのコモンイベント
 * @desc 値が最大値に達したときに呼び出すコモンイベントID（0で無効）
 * @default 0
 * @type common_event
 *
 * @param ShowInStatus
 * @text ステータス画面に表示
 * @desc ステータス画面にゲージを表示する
 * @default true
 * @type boolean
 *
 * @param PriorityOverTP
 * @text ステータス画面でTPより優先
 * @desc 「ステータス画面に表示」がオンで、TP表示もオンのとき、TPゲージでなくこのゲージを表示する
 * @default true
 * @type boolean
 *
 * @param ShowInBattle
 * @text 戦闘画面に表示
 * @desc 戦闘画面のバトルステータスにゲージを表示する。HP/MP/TPの後に4本目として表示される
 * @default true
 * @type boolean
 *
 * @param GaugeColor1
 * @text ゲージ左端カラー
 * @desc ゲージのグラデーション左端の色（HTMLカラーコード）
 * @default #ff80b0
 * @type string
 *
 * @param GaugeColor2
 * @text ゲージ右端カラー
 * @desc ゲージのグラデーション右端の色（HTMLカラーコード）
 * @default #ff0060
 * @type string
 *
 * @command ChangeValue
 * @text 値を変化させる
 * @desc アクターのパラメータ値を指定した量だけ変化させます（正の数で増加、負の数で減少）
 *
 * @arg actorId
 * @text アクターID
 * @desc 対象のアクターID
 * @default 1
 * @type actor
 *
 * @arg amount
 * @text 変化量
 * @desc 変化量（正の数で増加、負の数で減少）
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
 * アクターにゲージ付きの独自パラメータを追加します。
 * 値は０〜設定した最大値の範囲で変動します。
 *
 * ■ スキル・アイテムのメモ欄タグ
 * 対象のパラメータ値を変化させるタグをスキルやアイテムのメモ欄に記述します。
 *   <GaugeParam_Increase: 数式>  対象の値を増やします
 *   <GaugeParam_Decrease: 数式>  対象の値を減らします
 *
 * ■ ステートのメモ欄タグ（毒などのように毎ターン効果を適用）
 * ステートのメモ欄に記述すると、そのステートを持つアクターのターン開始時に毎回効果を適用します。
 *   <GaugeParam_Increase: 数式>  毎ターン値を増やします
 *   <GaugeParam_Decrease: 数式>  毎ターン値を減らします
 *
 * 数式内で使用できる変数：
 *   a = 使用者
 *   b = 対象
 *   v = ゲーム変数（例えば v[1] でゲーム変数ID 0001 の値）
 *
 * 記述例：
 *   <GaugeParam_Increase: 5>
 *   <GaugeParam_Increase: a.atk * 0.5>
 *   <GaugeParam_Decrease: (a.mat - b.mdf) / 2>
 *   <GaugeParam_Decrease: v[1]>
 *
 * ■ 境界値トリガー
 * 値が最大値に遷移した瞬間に MaxCommonEvent のコモンイベントが呼び出されます。
 * 値が0に遷移した瞬間に MinCommonEvent のコモンイベントが呼び出されます。
 * いずれも、すでに境界値の状態からさらに変化しても再発動しません。
 *
 * ■ 他プラグインからの利用
 * このプラグインを先に読み込んでいるとき、
 * グローバルクラス HTN_GaugeParam を通じてパラメータの値にアクセスできます：
 *   HTN_GaugeParam.getValue(actor)           値の取得
 *   HTN_GaugeParam.setValue(actor, value)    第２引数の値に設定
 *   HTN_GaugeParam.changeValue(actor, delta) 第２引数の値で増減
 */

(() => {
  'use strict';

  const pluginName = 'HTN_GaugeParam';
  const pluginParams = PluginManager.parameters(pluginName);
  const gaugeMax = Math.max(1, Number(pluginParams.GaugeMax || 100));
  const gaugeInitialValue = Math.max(0, Math.min(gaugeMax, Number(pluginParams.GaugeInitialValue || 0)));
  const resetOnRecoverAll = String(pluginParams.ResetOnRecoverAll) !== 'false';
  const gaugeName = String(pluginParams.GaugeName || 'EP');
  const gaugeLabel = String(pluginParams.GaugeLabel || 'EP');
  const gaugeIncreaseMessage = String(pluginParams.GaugeIncreaseMessage ?? '');
  const gaugeDecreaseMessage = String(pluginParams.GaugeDecreaseMessage ?? '');
  const recoverySoundDirection = String(pluginParams.RecoverySound || 'increase');
  const minCommonEventId = Number(pluginParams.MinCommonEvent || 0);
  const maxCommonEventId = Number(pluginParams.MaxCommonEvent || 0);
  const showInStatus = String(pluginParams.ShowInStatus) !== 'false';
  const priorityOverTP = String(pluginParams.PriorityOverTP) !== 'false';
  const showInBattle = String(pluginParams.ShowInBattle) !== 'false';
  const gaugeColor1 = String(pluginParams.GaugeColor1 || '#ff80b0');
  const gaugeColor2 = String(pluginParams.GaugeColor2 || '#ff0060');

  class HTN_GaugeParam {
    /**
     * アクターのパラメータ値を取得
     *
     * @param {Game_Actor} actor 対象アクター
     * @returns {number} パラメータ値
     */
    static getValue(actor) {
      return actor._HTN_GaugeParam_Value ?? gaugeInitialValue;
    }

    /**
     * アクターのパラメータ値を設定し、境界値への遷移時にはコモンイベントを予約
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
     * アクターのパラメータ値を増加・減少させる
     *
     * @param {Game_Actor} actor 対象アクター
     * @param {number} delta 変化量（正で増加、負で減少）
     */
    static changeValue(actor, delta) {
      HTN_GaugeParam.setValue(actor, HTN_GaugeParam.getValue(actor) + delta);
    }
  }

  window.HTN_GaugeParam = HTN_GaugeParam; // グローバルクラスとして公開

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
   * ニューゲーム開始時などの createGameObjects から、 new Game_Actor を介して呼ばれるメソッド
   * 独自パラメータの値を初期値にセットする
   */
  const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
  Game_Actor.prototype.initMembers = function() {
    _Game_Actor_initMembers.call(this);

    this._HTN_GaugeParam_Value = gaugeInitialValue;
  };

  /**
   * 全回復時にパラメータ値を初期値にリセットする
   *
   * @returns {void}
   */
  const _Game_BattlerBase_recoverAll = Game_BattlerBase.prototype.recoverAll;
  Game_BattlerBase.prototype.recoverAll = function() {
    _Game_BattlerBase_recoverAll.call(this);

    if (resetOnRecoverAll && this.isActor()) {
      this._HTN_GaugeParam_Value = gaugeInitialValue;
    }
  };

  /**
   * メモタグの数式を評価して0以上の整数を返す
   *
   * @param {string} formula 数式文字列
   * @param {Game_Battler} subject 行動の主体（スキル・アイテムの使用者、ステートの持ち主）
   * @param {Game_Battler} targetBattler 対象
   * @returns {number} 計算結果（0以上の整数）
   */
  const evalFormula = (formula, subject, targetBattler) => {
    try {
      const unescapedFormula = String(formula).replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();

      const a = subject; // eslint-disable-line no-unused-vars
      const b = targetBattler; // eslint-disable-line no-unused-vars
      const v = $gameVariables._data; // eslint-disable-line no-unused-vars
      const result = eval(unescapedFormula);

      return Math.max(0, Math.round(isNaN(result) ? 0 : Number(result)));
    } catch (_e) {
      return 0;
    }
  };

  /**
   * 行動結果の初期化で独自プロパティも初期化
   */
  const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    _Game_ActionResult_clear.call(this);

    this._HTN_GaugeParam_Change = 0;
  };

  /**
   * メニュー画面でのスキル・アイテムの使用可否を判断する
   *
   * @param {Game_Battler} target 対象バトラー
   * @returns {boolean} 意味のある使用効果が含まれるか
   */
  const _Game_Action_hasItemAnyValidEffects = Game_Action.prototype.hasItemAnyValidEffects;
  Game_Action.prototype.hasItemAnyValidEffects = function(target) {
    // 元のメソッドを呼び出し、有効な効果があるならそのまま true を返す
    if (_Game_Action_hasItemAnyValidEffects.call(this, target)) return true;

    if (!target.isActor()) return false;

    const item = this.item();
    if (item == null) return false;

    const meta = item.meta;
    if (meta == null) return false;

    const currentValue = HTN_GaugeParam.getValue(target);
    if (meta.GaugeParam_Increase != null && currentValue === gaugeMax) return false;
    if (meta.GaugeParam_Decrease != null && currentValue === 0) return false;

    return true;
  };

  /**
   * スキル・アイテム使用時に、メモ欄のタグに基づいてパラメータ値を変化させる
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

    const valueBefore = HTN_GaugeParam.getValue(target);

    if (meta.GaugeParam_Increase != null) {
      const value = evalFormula(String(meta.GaugeParam_Increase), this.subject(), target);
      HTN_GaugeParam.changeValue(target, value);
    }

    if (meta.GaugeParam_Decrease != null) {
      const value = evalFormula(String(meta.GaugeParam_Decrease), this.subject(), target);
      HTN_GaugeParam.changeValue(target, -value);
    }

    target.result()._HTN_GaugeParam_Change = HTN_GaugeParam.getValue(target) - valueBefore;

    if (target.result()._HTN_GaugeParam_Change !== 0) {
      this.makeSuccess(target);
    }
  };

  /**
   * アクターがかかっているステートのタグに基づいて、毎ターン、パラメータ値を変化させる
   *
   * @returns {void}
   */
  const _Game_Battler_regenerateAll = Game_Battler.prototype.regenerateAll;
  Game_Battler.prototype.regenerateAll = function() {
    _Game_Battler_regenerateAll.call(this);

    if (!this.isAlive() || !this.isActor()) return;

    const valueBefore = HTN_GaugeParam.getValue(this);

    for (const state of this.states()) {
      if (state.meta.GaugeParam_Increase != null) {
        const value = evalFormula(String(state.meta.GaugeParam_Increase), this, this);
        HTN_GaugeParam.changeValue(this, value);
      }

      if (state.meta.GaugeParam_Decrease != null) {
        const value = evalFormula(String(state.meta.GaugeParam_Decrease), this, this);
        HTN_GaugeParam.changeValue(this, -value);
      }
    }

    this._HTN_GaugeParam_RegenChange = HTN_GaugeParam.getValue(this) - valueBefore;
  };

  /**
   * ゲージの有効判定（アクターに対してのみ有効）
   *
   * @returns {boolean}
   */
  const _Sprite_Gauge_isValid = Sprite_Gauge.prototype.isValid;
  Sprite_Gauge.prototype.isValid = function() {
    if (this._statusType === 'htn_gauge_param') {
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
    if (this._battler && this._statusType === 'htn_gauge_param') {
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
    if (this._statusType === 'htn_gauge_param') {
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
    if (this._statusType === 'htn_gauge_param') {
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
    if (this._statusType === 'htn_gauge_param') {
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
    if (this._statusType === 'htn_gauge_param') {
      return gaugeColor2;
    }

    return _Sprite_Gauge_gaugeColor2.call(this);
  };

  /**
   * スキル・アイテム使用時のパラメータ変化をバトルログに表示
   *
   * @param {Game_Battler} target 対象バトラー
   */
  const _Window_BattleLog_displayDamage = Window_BattleLog.prototype.displayDamage;
  Window_BattleLog.prototype.displayDamage = function(target) {
    _Window_BattleLog_displayDamage.call(this, target);

    if (!target.isAlive()) return;

    const change = target.result()._HTN_GaugeParam_Change;

    if (change == null || change === 0) return;

    const amount = Math.abs(change);

    if (change > 0) {
      if (recoverySoundDirection === 'increase') this.push('performRecovery', target);
      if (gaugeIncreaseMessage !== '') this.push('addText', gaugeIncreaseMessage.format(target.name(), gaugeName, amount));
    } else {
      if (recoverySoundDirection === 'decrease') this.push('performRecovery', target);
      if (gaugeDecreaseMessage !== '') this.push('addText', gaugeDecreaseMessage.format(target.name(), gaugeName, amount));
    }
  };

  /**
   * ターン終了時のパラメータ変化をバトルログに表示（ステートによる変化を想定）
   *
   * @param {Game_Battler} subject バトラー
   */
  const _Window_BattleLog_displayRegeneration = Window_BattleLog.prototype.displayRegeneration;
  Window_BattleLog.prototype.displayRegeneration = function(subject) {
    _Window_BattleLog_displayRegeneration.call(this, subject);

    if (!subject.isActor()) return;

    const change = subject._HTN_GaugeParam_RegenChange;

    if (change == null || change === 0) return;

    const amount = Math.abs(change);

    if (change > 0) {
      if (recoverySoundDirection === 'increase') this.push('performRecovery', subject);
      if (gaugeIncreaseMessage !== '') this.push('addText', gaugeIncreaseMessage.format(subject.name(), gaugeName, amount));
    } else {
      if (recoverySoundDirection === 'decrease') this.push('performRecovery', subject);
      if (gaugeDecreaseMessage !== '') this.push('addText', gaugeDecreaseMessage.format(subject.name(), gaugeName, amount));
    }
  };

  /**
   * ゲージを戦闘画面・ステータス画面に配置
   *
   * 戦闘画面: ShowInBattle が true のとき HP/MP/TP の後に4本目として配置
   * ステータス画面: デフォルトの画面レイアウトだと最大で3本までしか配置できないので、priorityOverTP が true のときは TP ゲージの代わりに配置
   *
   * @param {Game_Actor} actor 対象アクター
   * @param {number} x X座標
   * @param {number} y Y座標
   */
  const _Window_StatusBase_placeBasicGauges = Window_StatusBase.prototype.placeBasicGauges;
  Window_StatusBase.prototype.placeBasicGauges = function(actor, x, y) {
    if (this instanceof Window_BattleStatus) {
      _Window_StatusBase_placeBasicGauges.call(this, actor, x, y);

      if (showInBattle) {
        const offset = $dataSystem.optDisplayTp ? 3 : 2;
        this.placeGauge(actor, 'htn_gauge_param', x, y + this.gaugeLineHeight() * offset);
      }

      return;
    }

    if (!showInStatus || ($dataSystem.optDisplayTp && !priorityOverTP)) {
      _Window_StatusBase_placeBasicGauges.call(this, actor, x, y);
    } else {
      this.placeGauge(actor, 'hp', x, y);
      this.placeGauge(actor, 'mp', x, y + this.gaugeLineHeight());
      this.placeGauge(actor, 'htn_gauge_param', x, y + this.gaugeLineHeight() * 2);
    }
  };

  /**
   * 戦闘時のステータス表示において、独自パラメータのゲージ分を確保するため Y 座標を調整
   *
   * @param {Rectangle} rect アイテム矩形
   * @returns {number}
   */
  const _Window_BattleStatus_basicGaugesY = Window_BattleStatus.prototype.basicGaugesY;
  Window_BattleStatus.prototype.basicGaugesY = function(rect) {
    if (showInBattle) {
      return _Window_BattleStatus_basicGaugesY.call(this, rect) - this.gaugeLineHeight();
    }

    return _Window_BattleStatus_basicGaugesY.call(this, rect);
  };
})();
