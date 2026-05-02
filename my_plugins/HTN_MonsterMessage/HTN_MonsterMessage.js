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
 * js/plugins/HTN_MonsterMessage/data/ ディレクトリに配置した JS ファイルを
 * 自動で読み込みます（プラグイン管理への登録不要）。
 *
 * モンスターデータファイルでは以下のようにコールバックを登録します。
 *   HTN_MonsterMessage.register(エネミーID, ({ skill, subject, targets, target, messages }) => {
 *     messages.name = '話者名';
 *     messages.face = ['顔グラ名', index];   // 省略可
 *     messages.background = 1;              // 省略可: 0=通常 1=暗く 2=透明 (省略時 1)
 *     messages.position   = 2;              // 省略可: 0=上 1=中 2=下 (省略時 2)
 *
 *     if (skillId === 5 && target && target.hp / target.mhp < 0.5) {
 *       messages.push('ちょうどいい……弱っているな！');
 *     } else {
 *       messages.push('かかれ！');
 *     }
 *     messages.flush(); // 省略可（スタイル上の区切り）
 *   });
 *
 * コールバック引数:
 *   skill    : 使用スキル ($dataSkills の要素。skill.id や skill.name で参照)
 *   subject  : 行動エネミー (Game_Enemy)
 *   targets  : 対象バトラーの配列
 *   target   : targets[0]（単体攻撃向けショートハンド。対象なしの場合 null）
 *   messages : メッセージビルダー
 *     .name       話者名（文字列）
 *     .face       顔グラ [faceName, faceIndex]（デフォルト ['', 0]）
 *     .background 背景種別
 *     .position   表示位置
 *     .push(text) メッセージをバッファに追加
 *     .flush()    no-op（グループの区切りとして任意で呼ぶ）
 */

(() => {
  'use strict';

  // エネミーIDをキーとするコールバックのレジストリ
  const _registry = {};

  const _api = {
    /**
     * エネミーIDに対応するセリフコールバックを登録する
     *
     * @param {number} enemyId
     * @param {function} fn
     */
    register(enemyId, fn) {
      _registry[enemyId] = fn;
    }
  };

  // ブラウザ文脈と Node.js require() 文脈の両方からアクセスできるよう両方に登録する
  window.HTN_MonsterMessage = _api;
  if (typeof global !== 'undefined') {
    global.HTN_MonsterMessage = _api;
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
      const fn = _registry[subject.enemyId()];
      if (fn != null) {
        const pending = [];
        const messages = {
          name:       subject.name(), // デフォルト話者名はモンスター名。空文字にすると話者名なしになる
          face:       ['', 0], // 顔グラ。例えば妖精は ['Nature', 5]
          background: 1, // 0: 通常, 1: 暗く, 2: 透明
          position:   2, // 0: 上, 1: 中, 2: 下
          pending,       // 内部で保持するメッセージのバッファ。flush() でまとめて表示され空に戻る
          push(text) {
            pending.push({
              text,
              name:       this.name,
              face:       [...this.face],
              background: this.background,
              position:   this.position,
            });
          },
          flush() {},
        };

        fn({
          skill: action.item(),
          subject,
          targets,
          target: targets[0] ?? null,
          messages,
        });

        for (const m of pending) {
          this.push('showMonsterMessage', m.text, m.name, m.face[0], m.face[1], m.background, m.position);
        }
      }
    }

    _Window_BattleLog_startAction.call(this, subject, action, targets);
  };

  // NW.js 環境では js/plugins/HTN_MonsterMessage/data/ 以下の JS ファイルを自動ロードする
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
