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
 * By default, Window_StatusBase.prototype.drawActorIcons limits the number of
 * displayed state icons based on window width. This plugin lifts that restriction.
 *
 * With "Max icons at once", icons are placed at equal spacing within the
 * available width. If the icon size exceeds the spacing, icons overlap to the right.
 *
 * When "Show all states" is true, icons are grouped by "Max icons at once" and
 * cycle automatically according to "Switch interval".
 */

/*:ja
 * @target MZ
 * @plugindesc メニュー画面で全てのステートアイコンを表示します (v1.0.0)
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
 * @text 切り替わり秒数
 * @desc ページが切り替わるまでの秒数。「すべて表示するか」が true のときに有効
 * @default 1.0
 * @type number
 * @min 0.1
 * @decimals 1
 *
 * @help
 * ツクールMZのデフォルトでは、drawActorIcons はウィンドウの横幅に応じて
 * 表示できるステートアイコン数が制限されます。このプラグインはその制限を撤廃します。
 *
 * 「一度に表示する最大数」に設定した数を元に、横幅を等分した間隔でアイコンを配置します。
 * 間隔よりアイコンが大きい場合、右側のアイコンは重なって表示されます。
 *
 * 「すべて表示するか」が true のとき、「一度に表示する最大数」単位でページに分け、
 * 「切り替わり秒数」の間隔でページが自動的に切り替わります。
 */

(() => {
  'use strict';

  const pluginName = 'HTN_AllStatesInMenu';
  const parameters = PluginManager.parameters(pluginName);
  const maxIconCount = Math.max(1, Number(parameters.MaxIconCount) || 4);
  const showAll = String(parameters.ShowAll) === 'true';
  const switchIntervalSec = Math.max(0.1, Number(parameters.SwitchIntervalSec) || 1.0);

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
    const icons = actor.allIcons();

    if (icons.length === 0) {
      return;
    }

    if (showAll) {
      this._allStatesInMenu_ShowAll = true;
    }

    let displayIcons;

    if (showAll && icons.length > maxIconCount) {
      const framesPerSwitch = Math.round(switchIntervalSec * 60);
      const totalPages = Math.ceil(icons.length / maxIconCount);
      const currentIndex = Math.floor(Graphics.frameCount / framesPerSwitch) % totalPages;
      const startIndex = currentIndex * maxIconCount;

      displayIcons = icons.slice(startIndex, startIndex + maxIconCount);
    } else {
      displayIcons = icons.slice(0, maxIconCount);
    }

    const iconSpacing = width / maxIconCount;
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
    const currentIndex = Math.floor(Graphics.frameCount / framesPerSwitch);

    if (this._allStatesInMenu_Index !== currentIndex) {
      this._allStatesInMenu_Index = currentIndex;
      this.refresh();
    }
  };
})();
