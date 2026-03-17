// --------------------------------------------------------------------------
//
// SaveMax
//
// Copyright (c) 2016-2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/03/18 ver2.0.0 ツクールMZに対応
// 2016/09/12 ver1.0.0 first release
// 2016/09/10 ver0.0.1 開発開始
//
// --------------------------------------------------------------------------

/*:
 * @target MV MZ
 * @plugindesc Change the maximum number of save slots
 * @author hatonekoe - https://hato-neko.x0.com
 *
 * @help
 * Change the maximum number of save slots. (Default: 20)
 * In RPG Maker MZ, it is counted without including the autosave.
 *
 * @param Max Quantity
 * @desc The maximum number of save slots
 * @default 20
 *
 */

/*:ja
 * @target MV MZ
 * @plugindesc セーブ最大数を変更します
 * @author ハトネコエ - https://hato-neko.x0.com
 *
 * @help
 * セーブできる最大数を変更します。デフォルトは 20 です。
 * ツクールMZでオートセーブをONにしている場合、
 * オートセーブのスロットは含まずにカウントします。
 *
 * @param Max Quantity
 * @desc セーブ最大数
 * @default 20
 *
 */

(function() {

  const pluginName = "HTN_SaveMax";

  const parameters = PluginManager.parameters(pluginName);
  const saveMax = Number(parameters["Max Quantity"]);

  DataManager.maxSavefiles = function() {
    if (Utils.RPGMAKER_NAME === "MZ" && $gameSystem && $gameSystem.isAutosaveEnabled()) {
      return saveMax + 1;
    }

    return saveMax;
  };

})();
