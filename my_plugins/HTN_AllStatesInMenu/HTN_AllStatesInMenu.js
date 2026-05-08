// --------------------------------------------------------------------------
//
// HTN_AllStatesInMenu.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/05/09 v0.0.1 開発中
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc Shows all state icons in the menu (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_AllStatesInMenu
 *
 * @param MaxIconCount
 * @text Max icons at once
 * @desc Maximum number of state icons displayed at one time.
 * @default 4
 * @type number
 * @min 1
 *
 * @param ShowAll
 * @text Show all states
 * @desc If true, all state icons are shown by cycling through pages when they exceed Max icons at once.
 * @default true
 * @type boolean
 *
 * @param SwitchIntervalSec
 * @text Switch interval (seconds)
 * @desc Time in seconds between icon page switches. Used when Show all states is true.
 * @default 1.0
 * @type number
 * @min 0.1
 * @decimals 1
 *
 * @help
 * A plugin that shows all state icons in the menu.
 *
 * Note: This plugin overrides Window_StatusBase.prototype.drawActorIcons,
 * which may conflict with other plugins that customize the menu screen.
 */

/*:ja
 * @target MZ
 * @plugindesc メニュー画面に全てのステートアイコンを表示 (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_AllStatesInMenu
 *
 * @param MaxIconCount
 * @text 一度に表示する最大数
 * @desc 一度に表示するステートアイコンの最大数
 * @default 4
 * @type number
 * @min 1
 *
 * @param ShowAll
 * @text すべて表示するか
 * @desc trueにすると、「一度に表示する最大数」を超えた分をページ切り替えで順番に表示する
 * @default true
 * @type boolean
 *
 * @param SwitchIntervalSec
 * @text 切り替え秒数
 * @desc ページが切り替わるまでの秒数。「すべて表示するか」が true のときに有効
 * @default 1.0
 * @type number
 * @min 0.1
 * @decimals 1
 *
 * @help
 * メニュー画面に全てのステートアイコンを表示するプラグインです。
 *
 * Window_StatusBase.prototype.drawActorIcons を上書きしているため、
 * メニュー画面をカスタマイズする
 * 他のプラグインと競合する可能性がある点にご注意ください。
 */

(() => {
  'use strict';

  const pluginName = 'HTN_AllStatesInMenu';
  const parameters = PluginManager.parameters(pluginName);
  const maxIconCount = Math.max(1, Number(parameters.MaxIconCount) || 4);
  const showAll = String(parameters.ShowAll) === 'true';
  const switchIntervalSec = Math.max(0.1, Number(parameters.SwitchIntervalSec) || 1.0);

  /**
   * メニューを開いたとき、ページ切り替えの基準フレームをリセットする
   */
  const _Scene_Menu_start = Scene_Menu.prototype.start;
  Scene_Menu.prototype.start = function() {
    _Scene_Menu_start.call(this);

    this._statusWindow._allStatesInMenu_OpenFrame = Graphics.frameCount;
  };

  /**
   * スキル画面を開いたとき、ページ切り替えの基準フレームをリセットする
   */
  const _Scene_Skill_start = Scene_Skill.prototype.start;
  Scene_Skill.prototype.start = function() {
    _Scene_Skill_start.call(this);

    this._statusWindow._allStatesInMenu_OpenFrame = Graphics.frameCount;
  };

  /**
   * ステータス画面を開いたとき、ページ切り替えの基準フレームをリセットする
   */
  const _Scene_Status_start = Scene_Status.prototype.start;
  Scene_Status.prototype.start = function() {
    _Scene_Status_start.call(this);

    this._statusWindow._allStatesInMenu_OpenFrame = Graphics.frameCount;
  };

  /**
   * アイテムやスキルの使用対象を選ぶウィンドウが開かれるときに、ページ切り替えの基準フレームをリセットする
   */
  const _Window_StatusBase_show = Window_StatusBase.prototype.show;
  Window_StatusBase.prototype.show = function() {
    _Window_StatusBase_show.call(this);

    this._allStatesInMenu_OpenFrame = Graphics.frameCount;
  };

  /**
   * ステートアイコンを均等間隔で配置し、全ステートをページ切り替えで表示する
   *
   * コアスクリプトの drawActorIcons を上書きしているので、他のプラグインと競合する可能性に注意
   *
   * @param {Game_Actor} actor 対象アクター
   * @param {number} x 描画X座標
   * @param {number} y 描画Y座標
   * @param {number} width 描画領域の横幅
   * @returns {void}
   */
  Window_StatusBase.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    const delta = ImageManager.standardIconWidth - ImageManager.iconWidth;
    const iconWidth = ImageManager.standardIconWidth;
    const icons = actor.allIcons();
    const iconsCount = icons.length;

    if (iconsCount === 0) {
      return;
    }

    if (showAll) {
      this._allStatesInMenu_ShowAll = true;
    }

    let displayIcons;

    if (showAll && iconsCount > maxIconCount) {
      const framesPerSwitch = Math.round(switchIntervalSec * 60);
      const totalPages = Math.ceil(iconsCount / maxIconCount);
      const elapsedFrames = Graphics.frameCount - (this._allStatesInMenu_OpenFrame ?? 0);
      const currentIndex = Math.floor(elapsedFrames / framesPerSwitch) % totalPages;
      const startIndex = currentIndex * maxIconCount;

      displayIcons = icons.slice(startIndex, startIndex + maxIconCount);
    } else {
      displayIcons = icons.slice(0, maxIconCount);
    }

    let iconSpacing;

    if (iconsCount < maxIconCount) {
      // アイコンが１ページに収まる場合は、できるだけ重なりが少なくなるよう配置していく
      if (iconsCount * iconWidth <= width) {
        iconSpacing = iconWidth;
      } else {
        iconSpacing = width / iconsCount;
      }
    } else {
      // アイコンが２ページ以上に続く場合は、２ページ目以降も同じ間隔で配置
      iconSpacing = width / maxIconCount;
    }

    let iconX = x + delta / 2;

    for (const icon of displayIcons) {
      this.drawIcon(icon, iconX, y + 2);
      iconX += iconSpacing;
    }
  };

  /**
   * ページ切り替えタイミングを検知してウィンドウを更新する
   *
   * @returns {void}
   */
  const _Window_StatusBase_update = Window_StatusBase.prototype.update;
  Window_StatusBase.prototype.update = function() {
    _Window_StatusBase_update.call(this);

    if (!this._allStatesInMenu_ShowAll) {
      return;
    }

    const framesPerSwitch = Math.round(switchIntervalSec * 60);
    const elapsedFrames = Graphics.frameCount - (this._allStatesInMenu_OpenFrame ?? 0);
    const currentIndex = Math.floor(elapsedFrames / framesPerSwitch);

    // Index が切り替わるタイミング（≒切り替え秒数）で drawActorIcons を refresh を介して呼び出す
    if (this._allStatesInMenu_Index !== currentIndex) {
      this._allStatesInMenu_Index = currentIndex;
      this.refresh();
    }
  };
})();
