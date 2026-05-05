// --------------------------------------------------------------------------
//
// HTN_DisplayEnemyHpMpTp.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/05/03 v1.0.0 First release
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc Displays enemy HP, MP, and TP as gauges during battle. (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_DisplayEnemyHpMpTp
 *
 * @param ShowHpGauge
 * @text Show HP Gauge
 * @desc Show the enemy HP gauge.
 * @type boolean
 * @default true
 *
 * @param ShowMpGauge
 * @text Show MP Gauge
 * @desc Show the enemy MP gauge.
 * @type boolean
 * @default true
 *
 * @param ShowTpGauge
 * @text Show TP Gauge
 * @desc Show the enemy TP gauge.
 * @type boolean
 * @default true
 *
 * @param ShowValue
 * @text Show Numeric Values
 * @desc Show the numeric values on gauges.
 * @type boolean
 * @default true
 *
 * @param ValueFontSize
 * @text Value Font Size
 * @desc Font size for the numeric values on gauges.
 * @type number
 * @default 12
 * @min 1
 *
 * @param ShowLabel
 * @text Show Labels
 * @desc Show labels (HP / MP / TP) on gauges. Label text follows the game system settings.
 * @type boolean
 * @default true
 *
 * @param LabelFontSize
 * @text Label Font Size
 * @desc Font size for the labels on gauges.
 * @type number
 * @default 16
 * @min 1
 *
 * @param GaugePosition
 * @text Gauge Position
 * @desc Position of the gauges relative to the enemy sprite.
 * @type select
 * @option Below enemy
 * @value bottom
 * @option Above enemy
 * @value top
 * @default bottom
 *
 * @param GaugeWidth
 * @text Gauge Width
 * @desc Width of each gauge in pixels.
 * @type number
 * @default 128
 * @min 32
 *
 * @param GaugeHeight
 * @text Gauge Bar Height
 * @desc Height of the gauge bar in pixels.
 * @type number
 * @default 12
 * @min 1
 *
 * @param GaugeMargin
 * @text Gauge Margin
 * @desc Vertical spacing between gauges in pixels.
 * @type number
 * @default 0
 * @min 0
 *
 * @param GaugeOffsetX
 * @text X Offset
 * @desc Horizontal offset from the enemy's center (px). Negative shifts left, positive shifts right.
 * @type number
 * @default 0
 * @min -9999
 * @max 9999
 *
 * @param GaugeOffsetY
 * @text Y Offset
 * @desc Additional vertical offset (px). Positive moves down, negative moves up.
 * @type number
 * @default -60
 * @min -9999
 * @max 9999
 *
 * @help
 * HTN_DisplayEnemyHpMpTp
 *
 * Displays enemy HP, MP, and TP as gauges during battle.
 * Each gauge updates in real time.
 *
 * Label text respects the game system settings.
 * For example, if you rename TP to "Spirit", the label will show "Spirit".
 *
 * To hide all gauges for a specific enemy, add the following tag
 * to the enemy's Note field:
 *   <DisplayEnemyHpMpTp_Hide>
 *
 * The following tags can be added to an enemy's Note field to override
 * the plugin parameters for that enemy:
 *   <DisplayEnemyHpMpTp_ShowValue: true>
 *   <DisplayEnemyHpMpTp_GaugePosition: top>
 *   <DisplayEnemyHpMpTp_GaugeWidth: 200>
 *   <DisplayEnemyHpMpTp_GaugeOffsetX: 0>
 *   <DisplayEnemyHpMpTp_GaugeOffsetY: 0>
 */

/*:ja
 * @target MZ
 * @plugindesc 戦闘中に敵キャラのHP・MP・TPをゲージで表示します (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_DisplayEnemyHpMpTp
 *
 * @param ShowHpGauge
 * @text HPゲージを表示
 * @desc 敵キャラのHPゲージを表示するか
 * @type boolean
 * @default true
 *
 * @param ShowMpGauge
 * @text MPゲージを表示
 * @desc 敵キャラのMPゲージを表示するか
 * @type boolean
 * @default true
 *
 * @param ShowTpGauge
 * @text TPゲージを表示
 * @desc 敵キャラのTPゲージを表示するか
 * @type boolean
 * @default true
 *
 * @param ShowValue
 * @text 数値を表示
 * @desc ゲージ上にHP・MP・TPの数値を表示するか
 * @type boolean
 * @default true
 *
 * @param ValueFontSize
 * @text 数値のフォントサイズ
 * @desc ゲージ上の数値のフォントサイズ
 * @type number
 * @default 12
 * @min 1
 *
 * @param ShowLabel
 * @text ラベルを表示
 * @desc ゲージ上にHP・MP・TP等のラベルを表示するか。ラベル文字列はゲームのシステム設定に従います
 * @type boolean
 * @default true
 *
 * @param LabelFontSize
 * @text ラベルのフォントサイズ
 * @desc ラベルのフォントサイズ
 * @type number
 * @default 16
 * @min 1
 *
 * @param GaugePosition
 * @text ゲージの表示位置
 * @desc 敵キャラ画像に対してゲージを表示する場所
 * @type select
 * @option 敵画像の下
 * @value bottom
 * @option 敵画像の上
 * @value top
 * @default bottom
 *
 * @param GaugeWidth
 * @text ゲージの横幅
 * @desc ゲージの横幅 (px)
 * @type number
 * @default 128
 * @min 32
 *
 * @param GaugeHeight
 * @text ゲージの高さ
 * @desc ゲージの高さ (px)
 * @type number
 * @default 12
 * @min 1
 *
 * @param GaugeMargin
 * @text ゲージ間の余白
 * @desc ゲージ同士の縦方向の余白 (px)
 * @type number
 * @default 0
 * @min 0
 *
 * @param GaugeOffsetX
 * @text X位置調整
 * @desc 横方向の位置調整 (px)。負の値で左、正の値で右へ
 * @type number
 * @default 0
 * @min -9999
 * @max 9999
 *
 * @param GaugeOffsetY
 * @text Y位置調整
 * @desc 縦方向の位置調整 (px)。負の値で上、正の値で下へ
 * @type number
 * @default -60
 * @min -9999
 * @max 9999
 *
 * @help
 * 戦闘中に敵キャラのHP・MP・TPをゲージで表示します。
 * 各ゲージはリアルタイムで更新されます。
 *
 * ラベルはゲームのシステム設定に従います。
 * たとえばTPを「気力」に設定している場合、ラベルには「気力」の略称が表示されます。
 *
 * 特定の敵キャラのゲージをすべて非表示にしたい場合は、
 * 敵キャラのメモ欄に以下のタグを記述してください。
 *   <DisplayEnemyHpMpTp_Hide>
 *
 * 敵キャラのメモ欄に以下のタグを記述することで、
 * その敵キャラだけプラグインパラメータの設定を上書きできます。
 *   <DisplayEnemyHpMpTp_ShowValue: true>
 *   <DisplayEnemyHpMpTp_GaugePosition: top>
 *   <DisplayEnemyHpMpTp_GaugeWidth: 200>
 *   <DisplayEnemyHpMpTp_GaugeOffsetX: 0>
 *   <DisplayEnemyHpMpTp_GaugeOffsetY: 0>
 */

(() => {
  'use strict';

  const pluginName = "HTN_DisplayEnemyHpMpTp";
  const parameters = PluginManager.parameters(pluginName);
  const showHpGauge = String(parameters.ShowHpGauge) === 'true';
  const showMpGauge = String(parameters.ShowMpGauge) === 'true';
  const showTpGauge = String(parameters.ShowTpGauge) === 'true';
  const showValueDefault = String(parameters.ShowValue) === 'true';
  const valueFontSize = Number(parameters.ValueFontSize) || 12;
  const showLabel = String(parameters.ShowLabel) === 'true';
  const labelFontSize = Number(parameters.LabelFontSize) || 16;
  const gaugePositionDefault = String(parameters.GaugePosition) || 'bottom';
  const gaugeWidthDefault = Number(parameters.GaugeWidth) || 128;
  const gaugeHeight = Number(parameters.GaugeHeight) || 12;
  const gaugeMargin = Number(parameters.GaugeMargin) || 0;
  const gaugeOffsetXDefault = Number(parameters.GaugeOffsetX) || 0;
  const gaugeOffsetYDefault = Number(parameters.GaugeOffsetY) || -60;

  // 表示する型のリスト（HP→MP→TP の順）
  const gaugeTypes = [];
  if (showHpGauge) gaugeTypes.push('hp');
  if (showMpGauge) gaugeTypes.push('mp');
  if (showTpGauge) gaugeTypes.push('tp');

  // どのゲージも表示しないなら、以下の処理は不要なのでここで return
  if (gaugeTypes.length === 0) return;

  //// -v- Sprite_Gauge を継承した Sprite_HTN_EnemyHpMpTpGauge クラスを定義 -v-

  function Sprite_HTN_EnemyHpMpTpGauge() {
    this.initialize(...arguments);
  }

  Sprite_HTN_EnemyHpMpTpGauge.prototype = Object.create(Sprite_Gauge.prototype);
  Sprite_HTN_EnemyHpMpTpGauge.prototype.constructor = Sprite_HTN_EnemyHpMpTpGauge;

  /**
   * エネミーのメタタグを返す。バトラー未設定時は空オブジェクトを返す
   *
   * @returns {Object}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.enemyMeta = function() {
    if (this._battler && this._battler.isEnemy()) {
      return this._battler.enemy().meta;
    }

    return {};
  };

  /**
   * 数値を表示するか。タグで上書きされていればそちらを優先する
   *
   * @returns {boolean}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.showValue = function() {
    const meta = this.enemyMeta();
    if (meta.DisplayEnemyHpMpTp_ShowValue != null) {
      return String(meta.DisplayEnemyHpMpTp_ShowValue).trim() === 'true';
    }

    return showValueDefault;
  };

  /**
   * バトラー確定後にタグの値でビットマップを再生成してからセットアップする
   *
   * @param {Game_Enemy} battler
   * @param {string} statusType
   * @returns {void}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.setup = function(battler, statusType) {
    this._battler = battler; // bitmapWidth/Height で参照できるよう先にセット

    this.bitmap.destroy();
    this.createBitmap();

    Sprite_Gauge.prototype.setup.call(this, battler, statusType);
  };

  /**
   * ゲージビットマップの横幅を返す。タグで上書きされていればそちらを優先する
   *
   * @returns {number}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.bitmapWidth = function() {
    const meta = this.enemyMeta();
    if (meta.DisplayEnemyHpMpTp_GaugeWidth != null) {
      return Number(meta.DisplayEnemyHpMpTp_GaugeWidth);
    }

    return gaugeWidthDefault;
  };

  /**
   * ゲージバーの高さを返す
   *
   * @returns {number}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.gaugeHeight = function() {
    return gaugeHeight;
  };

  /**
   * ラベルのフォントサイズを返す
   *
   * @returns {number}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.labelFontSize = function() {
    return labelFontSize;
  };

  /**
   * 数値のフォントサイズを返す
   *
   * @returns {number}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.valueFontSize = function() {
    return valueFontSize;
  };

  /**
   * テキスト領域の高さを返す
   * ラベル・数値を非表示のときはゲージバーの高さと同じにしてビットマップを節約する
   *
   * @returns {number}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.textHeight = function() {
    if (!showLabel && !this.showValue()) {
      return gaugeHeight;
    }

    return Math.max(Math.max(labelFontSize, valueFontSize), gaugeHeight);
  };

  /**
   * ゲージビットマップの縦幅を返す
   *
   * @returns {number}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.bitmapHeight = function() {
    if (!showLabel && !this.showValue()) {
      return gaugeHeight;
    }

    // ラベルの文字が埋もれないよう 4px の余白を設ける
    return this.textHeight() + 4;
  };

  /**
   * ゲージバーの描画開始X座標を返す
   * ラベル非表示のときはバー全体に横幅を使う
   *
   * @returns {number}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.gaugeX = function() {
    if (!showLabel) return 0;

    return Sprite_Gauge.prototype.gaugeX.call(this);
  };

  /**
   * ゲージの表示有効性を判定する
   * 敵が生存中かつバトル中のみ有効。エネミーのメモ欄のタグで非表示指定があれば無効
   *
   * @returns {boolean}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.isValid = function() {
    if (!this._battler) return false;
    if (!this._battler.isAlive()) return false;
    if (!$gameParty.inBattle()) return false;

    if (this._battler.isEnemy() && this._battler.enemy().meta['DisplayEnemyHpMpTp_Hide']) {
      return false;
    }

    return true;
  };

  /**
   * ラベルを描画する。ShowLabel が false ならスキップ
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.drawLabel = function() {
    if (!showLabel) return;

    Sprite_Gauge.prototype.drawLabel.call(this);
  };

  /**
   * 数値を描画する。ShowValue が false ならスキップ
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.drawValue = function() {
    if (!this.showValue()) return;

    Sprite_Gauge.prototype.drawValue.call(this);
  };

  //// -v- Sprite_Enemy の拡張 -v-

  /**
   * initMembers をフックしてゲージスプライト配列を生成・追加する
   *
   * @returns {void}
   */
  const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
  Sprite_Enemy.prototype.initMembers = function() {
    _Sprite_Enemy_initMembers.call(this);

    this._htnDisplayEnemyHpMpTp_gaugeSprites = [];

    for (const type of gaugeTypes) {
      const sprite = new Sprite_HTN_EnemyHpMpTpGauge();
      sprite.anchor.x = 0.5;
      this._htnDisplayEnemyHpMpTp_gaugeSprites.push({ sprite, type });
    }
  };

  /**
   * setBattler をフックして各ゲージスプライトにバトラーをセットする
   *
   * @param {Game_Enemy} battler
   * @returns {void}
   */
  const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
  Sprite_Enemy.prototype.setBattler = function(battler) {
    _Sprite_Enemy_setBattler.call(this, battler);

    for (const { sprite, type } of this._htnDisplayEnemyHpMpTp_gaugeSprites) {
      sprite.setup(battler, type);
    }
  };

  /**
   * update をフックしてゲージスプライトの位置と表示状態を毎フレーム更新する
   *
   * @returns {void}
   */
  const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
  Sprite_Enemy.prototype.update = function() {
    _Sprite_Enemy_update.call(this);

    if (this._enemy) {
      this.htnDisplayEnemyHpMpTp_updateGaugePositions();
    }
  };

  /**
   * ゲージスプライトの座標と visible を更新する
   *
   * @returns {void}
   */
  Sprite_Enemy.prototype.htnDisplayEnemyHpMpTp_updateGaugePositions = function() {
    const entries = this._htnDisplayEnemyHpMpTp_gaugeSprites;
    const bitmapH = entries[0].sprite.bitmapHeight();
    const step = bitmapH + gaugeMargin;

    // タグによるエネミーごとの設定値の上書き
    const meta = this._enemy.enemy().meta;
    const gaugePosition = meta.DisplayEnemyHpMpTp_GaugePosition != null
      ? String(meta.DisplayEnemyHpMpTp_GaugePosition).trim()
      : gaugePositionDefault;
    const gaugeOffsetX = meta.DisplayEnemyHpMpTp_GaugeOffsetX != null
      ? Number(meta.DisplayEnemyHpMpTp_GaugeOffsetX)
      : gaugeOffsetXDefault;
    const gaugeOffsetY = meta.DisplayEnemyHpMpTp_GaugeOffsetY != null
      ? Number(meta.DisplayEnemyHpMpTp_GaugeOffsetY)
      : gaugeOffsetYDefault;

    const entriesLength = entries.length;
    for (let i = 0; i < entriesLength; i++) {
      const { sprite } = entries[i];
      sprite.x = this.x + gaugeOffsetX;

      if (gaugePosition === 'top') {
        if (this.bitmap && this.bitmap.isReady()) {
          // ゲージスタック全体を敵画像の上に積む（HP が最上部、末尾ゲージが敵の直上）
          sprite.y = this.y - this.bitmap.height - (entriesLength - i) * bitmapH - (entriesLength - 1 - i) * gaugeMargin + gaugeOffsetY;
        }
      } else {
        sprite.y = this.y + gaugeOffsetY + i * step;
      }

      sprite.visible = sprite.isValid();
    }
  };

  //// -v- Spriteset_Battle の拡張 -v-

  /**
   * createEnemies をフックして、全敵スプライトの上に描画されるゲージ専用コンテナを追加する
   */
  const _Spriteset_Battle_createEnemies = Spriteset_Battle.prototype.createEnemies;
  Spriteset_Battle.prototype.createEnemies = function() {
    _Spriteset_Battle_createEnemies.call(this);

    // 敵スプライトより後に addChild することで、敵グループよりも前面に描画される
    const container = new Sprite();
    this._battleField.addChild(container);

    for (const enemySprite of this._enemySprites) {
      for (const { sprite } of enemySprite._htnDisplayEnemyHpMpTp_gaugeSprites) {
        container.addChild(sprite);
      }
    }
  };
})();
