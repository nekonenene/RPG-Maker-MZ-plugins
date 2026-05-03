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
 * @param ShowHp
 * @text Show HP Gauge
 * @desc Show the enemy HP gauge.
 * @type boolean
 * @default true
 *
 * @param ShowMp
 * @text Show MP Gauge
 * @desc Show the enemy MP gauge.
 * @type boolean
 * @default true
 *
 * @param ShowTp
 * @text Show TP Gauge
 * @desc Show the enemy TP gauge.
 * @type boolean
 * @default true
 *
 * @param ShowValue
 * @text Show Numeric Values
 * @desc Show the numeric values on gauges.
 * @type boolean
 * @default false
 *
 * @param ShowLabel
 * @text Show Labels
 * @desc Show labels (HP / MP / TP) on gauges. Label text follows the game system settings.
 * @type boolean
 * @default true
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
 * @default 2
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
 * @default 0
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
 *   <HTN_DisplayEnemyHpMpTp_Hide>
 */

/*:ja
 * @target MZ
 * @plugindesc 戦闘中に敵キャラのHP・MP・TPをゲージで表示します (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_DisplayEnemyHpMpTp
 *
 * @param ShowHp
 * @text HPゲージを表示
 * @desc 敵キャラのHPゲージを表示するか
 * @type boolean
 * @default true
 *
 * @param ShowMp
 * @text MPゲージを表示
 * @desc 敵キャラのMPゲージを表示するか
 * @type boolean
 * @default true
 *
 * @param ShowTp
 * @text TPゲージを表示
 * @desc 敵キャラのTPゲージを表示するか
 * @type boolean
 * @default true
 *
 * @param ShowValue
 * @text 数値を表示
 * @desc ゲージ上にHP・MP・TPの数値を表示するか
 * @type boolean
 * @default false
 *
 * @param ShowLabel
 * @text ラベルを表示
 * @desc ゲージ上にHP・MP・TP等のラベルを表示するか。ラベル文字列はゲームのシステム設定に従います
 * @type boolean
 * @default true
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
 * @desc 各ゲージの横幅（ピクセル）
 * @type number
 * @default 128
 * @min 32
 *
 * @param GaugeHeight
 * @text ゲージバーの高さ
 * @desc ゲージバーの高さ（ピクセル）
 * @type number
 * @default 12
 * @min 1
 *
 * @param GaugeMargin
 * @text ゲージ間の余白
 * @desc ゲージ同士の縦方向の余白（ピクセル）
 * @type number
 * @default 2
 * @min 0
 *
 * @param GaugeOffsetX
 * @text X位置調整
 * @desc 敵キャラ中央からの横方向のズレ（ピクセル）。負で左、正で右
 * @type number
 * @default 0
 * @min -9999
 * @max 9999
 *
 * @param GaugeOffsetY
 * @text Y位置調整
 * @desc 縦方向の追加ズレ（ピクセル）。正で下、負で上
 * @type number
 * @default 0
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
 *   <HTN_DisplayEnemyHpMpTp_Hide>
 */

(() => {
  'use strict';

  const pluginName = "HTN_DisplayEnemyHpMpTp";
  const params = PluginManager.parameters(pluginName);
  const SHOW_HP = params.ShowHp !== 'false';
  const SHOW_MP = params.ShowMp !== 'false';
  const SHOW_TP = params.ShowTp !== 'false';
  const SHOW_VALUE = params.ShowValue === 'true';
  const SHOW_LABEL = params.ShowLabel !== 'false';
  const GAUGE_POSITION = params.GaugePosition || 'bottom';
  const GAUGE_WIDTH = Number(params.GaugeWidth || 128);
  const GAUGE_HEIGHT = Number(params.GaugeHeight || 12);
  const GAUGE_MARGIN = Number(params.GaugeMargin || 2);
  const GAUGE_OFFSET_X = Number(params.GaugeOffsetX || 0);
  const GAUGE_OFFSET_Y = Number(params.GaugeOffsetY || 0);

  // 表示する型のリスト（HP→MP→TP の順）
  const GAUGE_TYPES = [];
  if (SHOW_HP) GAUGE_TYPES.push('hp');
  if (SHOW_MP) GAUGE_TYPES.push('mp');
  if (SHOW_TP) GAUGE_TYPES.push('tp');

  function Sprite_HTN_EnemyHpMpTpGauge() {
    this.initialize(...arguments);
  }

  Sprite_HTN_EnemyHpMpTpGauge.prototype = Object.create(Sprite_Gauge.prototype);
  Sprite_HTN_EnemyHpMpTpGauge.prototype.constructor = Sprite_HTN_EnemyHpMpTpGauge;

  /**
   * ゲージビットマップの横幅を返す
   *
   * @returns {number}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.bitmapWidth = function() {
    return GAUGE_WIDTH;
  };

  /**
   * ゲージバーの高さを返す
   *
   * @returns {number}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.gaugeHeight = function() {
    return GAUGE_HEIGHT;
  };

  /**
   * テキスト領域の高さを返す
   * ラベル・数値を非表示のときはゲージバーの高さと同じにしてビットマップを節約する
   *
   * @returns {number}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.textHeight = function() {
    if (!SHOW_LABEL && !SHOW_VALUE) {
      return GAUGE_HEIGHT;
    }

    return Math.max(24, GAUGE_HEIGHT);
  };

  /**
   * ゲージビットマップの縦幅を返す
   *
   * @returns {number}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.bitmapHeight = function() {
    if (!SHOW_LABEL && !SHOW_VALUE) {
      return GAUGE_HEIGHT + 4;
    }

    return this.textHeight() + 8;
  };

  /**
   * ゲージバーの描画開始X座標を返す
   * ラベル非表示のときはバー全体に横幅を使う
   *
   * @returns {number}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.gaugeX = function() {
    if (!SHOW_LABEL) return 0;
    return Sprite_Gauge.prototype.gaugeX.call(this);
  };

  /**
   * ゲージの表示有効性を判定する
   * 敵が生存中かつバトル中のみ有効。メタタグで非表示指定があれば無効
   *
   * @returns {boolean}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.isValid = function() {
    if (!this._battler) return false;
    if (!this._battler.isAlive()) return false;
    if (!$gameParty.inBattle()) return false;
    if (this._battler.isEnemy() && this._battler.enemy().meta['HTN_DisplayEnemyHpMpTp_Hide']) {
      return false;
    }
    return true;
  };

  /**
   * ラベルを描画する
   * ShowLabel が false のときはスキップ
   *
   * @returns {void}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.drawLabel = function() {
    if (!SHOW_LABEL) return;
    Sprite_Gauge.prototype.drawLabel.call(this);
  };

  /**
   * 数値を描画する
   * ShowValue が false のときはスキップ
   *
   * @returns {void}
   */
  Sprite_HTN_EnemyHpMpTpGauge.prototype.drawValue = function() {
    if (!SHOW_VALUE) return;
    Sprite_Gauge.prototype.drawValue.call(this);
  };

  //--------------------------------------------------------------------------
  // Sprite_Enemy の拡張

  if (GAUGE_TYPES.length === 0) return;

  /**
   * initMembers をフックしてゲージスプライト配列を生成・追加する
   *
   * @returns {void}
   */
  const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
  Sprite_Enemy.prototype.initMembers = function() {
    _Sprite_Enemy_initMembers.call(this);

    this._htnDisplayEnemyHpMpTp_gaugeSprites = [];

    for (const type of GAUGE_TYPES) {
      const sprite = new Sprite_HTN_EnemyHpMpTpGauge();
      sprite.anchor.x = 0.5;
      this.addChild(sprite);
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
    const n = entries.length;
    const bitmapH = entries[0].sprite.bitmapHeight();
    const step = bitmapH + GAUGE_MARGIN;

    for (let i = 0; i < n; i++) {
      const { sprite } = entries[i];
      sprite.x = GAUGE_OFFSET_X;

      if (GAUGE_POSITION === 'top') {
        if (this.bitmap && this.bitmap.isReady()) {
          // ゲージスタック全体を敵画像の上に積む（HP が最上部、末尾ゲージが敵の直上）
          sprite.y = -this.bitmap.height - (n - i) * bitmapH - (n - 1 - i) * GAUGE_MARGIN + GAUGE_OFFSET_Y;
        }
      } else {
        sprite.y = GAUGE_OFFSET_Y + i * step;
      }

      sprite.visible = sprite.isValid();
    }
  };
})();
