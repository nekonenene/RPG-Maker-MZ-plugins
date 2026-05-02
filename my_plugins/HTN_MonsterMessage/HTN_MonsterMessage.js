// --------------------------------------------------------------------------
//
// HTN_MonsterMessage
//
// Copyright (c) 2026 hatonekoe
//
// --------------------------------------------------------------------------

/*:ja
 * @target MZ
 * @plugindesc モンスターが行動する際にメッセージウィンドウでセリフを表示するプラグイン
 * @author hatonekoe
 *
 * @help
 * js/plugins/HTN_MonsterMessage/ ディレクトリに配置した JS ファイルを
 * 自動で読み込みます（プラグイン管理への登録不要）。
 *
 * モンスターデータファイルでは以下のようにルールを登録します。
 *   HTN_MonsterMessage.register(エネミーID, [
 *     {
 *       skill:      スキルID,              // 省略可: 使用スキルIDが一致するとき
 *       state:      ステートID,            // 省略可: 対象のいずれかがこのステートを持つとき
 *       name:       "話者名",              // 省略可: メッセージウィンドウの名前欄
 *       face:       ["顔グラ名", index],   // 省略可
 *       background: 0,                    // 省略可: 0=通常 1=暗く 2=透明 (省略時 1)
 *       position:   2,                    // 省略可: 0=上 1=中 2=下 (省略時 2)
 *       message:    "セリフ本文",
 *     },
 *   ]);
 *
 * ルールは配列の先頭から評価し、最初に一致したものを使用します。
 * skill・state を省略すると、その条件は無条件一致とみなします。
 */

(() => {
  'use strict';

  // エネミーIDをキーとするルール配列のレジストリ
  const _registry = {};

  const _api = {
    /**
     * エネミーIDに対応するメッセージルールを登録する
     *
     * @param {number} enemyId
     * @param {Array<{skill?: number, state?: number, name?: string, face?: [string, number], background?: number, position?: number, message: string}>} rules
     */
    register(enemyId, rules) {
      _registry[enemyId] = rules;
    }
  };

  // ブラウザ文脈と Node.js require() 文脈の両方からアクセスできるよう両方に登録する
  window.HTN_MonsterMessage = _api;
  if (typeof global !== 'undefined') {
    global.HTN_MonsterMessage = _api;
  }

  /**
   * 条件に合うルールを解決して返す。一致なしは null を返す
   *
   * @param {number} enemyId
   * @param {number} skillId
   * @param {number[]} targetStateIds
   * @returns {{name?: string, face?: [string, number], background?: number, position?: number, message: string}|null}
   */
  function resolveRule(enemyId, skillId, targetStateIds) {
    const rules = _registry[enemyId];
    if (rules == null) return null;

    for (const rule of rules) {
      const skillMatch = rule.skill == null || rule.skill === skillId;
      const stateMatch = rule.state == null || targetStateIds.includes(rule.state);
      if (skillMatch && stateMatch) {
        return rule;
      }
    }
    return null;
  }

  /**
   * $gameMessage にメッセージをセットしてバトルログキューを停止する
   *
   * @param {string} message
   * @param {string} name
   * @param {string} faceName
   * @param {number} faceIndex
   * @param {number} background
   * @param {number} positionType
   */
  Window_BattleLog.prototype.showMonsterMessage = function(
    message, name, faceName, faceIndex, background, positionType
  ) {
    $gameMessage.setBackground(background);
    $gameMessage.setPositionType(positionType);
    $gameMessage.setSpeakerName(name);
    $gameMessage.setFaceImage(faceName, faceIndex);
    $gameMessage.add(message);
    this.setWaitMode('message');
  };

  /**
   * "message" waitMode を追加: $gameMessage が表示中の間キューを停止する
   */
  const _Window_BattleLog_updateWaitMode = Window_BattleLog.prototype.updateWaitMode;
  Window_BattleLog.prototype.updateWaitMode = function() {
    if (this._waitMode === 'message') {
      if ($gameMessage.isBusy()) {
        return true;
      }
      this._waitMode = '';
      return false;
    }
    return _Window_BattleLog_updateWaitMode.call(this);
  };

  /**
   * 行動開始時にモンスターのセリフをメッセージウィンドウへ表示する
   */
  const _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
  Window_BattleLog.prototype.startAction = function(subject, action, targets) {
    if (subject.isEnemy()) {
      const enemyId = subject.enemyId();
      const skillId = action.item().id;
      const targetStateIds = targets.flatMap(t => t.states().map(s => s.id));
      const rule = resolveRule(enemyId, skillId, targetStateIds);
      if (rule !== null) {
        const name       = rule.name       ?? '';
        const face       = rule.face       ?? ['', 0];
        const background = rule.background ?? 1;
        const position   = rule.position   ?? 2;
        this.push('showMonsterMessage', rule.message, name, face[0], face[1], background, position);
      }
    }
    _Window_BattleLog_startAction.call(this, subject, action, targets);
  };

  // NW.js 環境では js/plugins/HTN_MonsterMessage/ 以下の JS ファイルを自動ロードする
  if (typeof require !== 'undefined') {
    const fs   = require('fs');
    const path = require('path');
    const dir  = path.join(process.cwd(), 'js', 'plugins', 'HTN_MonsterMessage', 'data');

    if (fs.existsSync(dir)) {
      fs.readdirSync(dir)
        .filter(f => f.endsWith('.js'))
        .sort()
        .forEach(f => require(path.join(dir, f)));
    }
  }
})();
