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
 * --- 登録メソッド ---
 *
 * HTN_MonsterMessage.registerBeforeAttack(エネミーID, fn)
 *   行動前（スキル発動前）のセリフを登録する
 *
 * HTN_MonsterMessage.registerAfterAttack(エネミーID, fn)
 *   行動後（モンスターが元の位置に戻ったあと）のセリフを登録する
 *   状態異常の付与など副作用はここで行うと自然
 *
 * --- コールバック引数 ---
 *
 *   fn({ skill, subject, targets, target, messages })
 *
 *   skill    : 使用スキル ($dataSkills の要素。skill.id や skill.name で参照)
 *   subject  : 行動エネミー (Game_Enemy)
 *   targets  : 対象バトラーの配列
 *   target   : targets[0]（単体攻撃向けショートハンド。対象なしの場合 null）
 *   messages : メッセージビルダー
 *     .name         話者名（デフォルト: モンスター名）
 *     .face         顔グラ [faceName, faceIndex]（デフォルト ['', 0]）
 *     .background   背景種別（0=通常 1=暗く 2=透明、デフォルト 1）
 *     .position     表示位置（0=上 1=中 2=下、デフォルト 2）
 *     .pending      積み上がったメッセージの配列（length で件数確認可）
 *     .push(text)   メッセージをバッファに追加
 *     .flush()      no-op（グループの区切りとして任意で呼ぶ）
 */

(() => {
  'use strict';

  // エネミーIDをキーとするコールバックのレジストリ
  const _beforeRegistry = {};
  const _afterRegistry  = {};

  const _api = {
    /**
     * 行動前のセリフコールバックを登録する
     *
     * @param {number} enemyId
     * @param {function} fn
     */
    registerBeforeAttack(enemyId, fn) {
      _beforeRegistry[enemyId] = fn;
    },

    /**
     * 行動後のセリフコールバックを登録する
     *
     * @param {number} enemyId
     * @param {function} fn
     */
    registerAfterAttack(enemyId, fn) {
      _afterRegistry[enemyId] = fn;
    },
  };

  // ブラウザ文脈と Node.js require() 文脈の両方からアクセスできるよう両方に登録する
  window.HTN_MonsterMessage = _api;
  if (typeof global !== 'undefined') {
    global.HTN_MonsterMessage = _api;
  }

  /**
   * コールバックを呼び出し、結果のメッセージをバトルログキューへ積む
   *
   * @param {function} fn
   * @param {{skill: object, subject: Game_Enemy, targets: Game_Battler[], target: Game_Battler|null}} ctx
   * @param {Window_BattleLog} logWindow
   */
  function buildAndQueueMessages(fn, ctx, logWindow) {
    const pending = [];
    const messages = {
      name:       ctx.subject.name(), // デフォルト話者名はモンスター名。空文字にすると話者名なしになる
      face:       ['', 0],            // 顔グラ。例えば妖精は ['Nature', 5]
      background: 1,                  // 0: 通常, 1: 暗く, 2: 透明
      position:   2,                  // 0: 上, 1: 中, 2: 下
      pending,                        // 内部で保持するメッセージのバッファ。flush() でまとめて表示され空に戻る
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

    fn({ ...ctx, messages });

    for (const m of pending) {
      logWindow.push('showMonsterMessage', m.text, m.name, m.face[0], m.face[1], m.background, m.position);
    }
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
   * 行動開始時に行動前セリフを表示し、action と targets を保存する
   */
  const _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
  Window_BattleLog.prototype.startAction = function(subject, action, targets) {
    if (subject.isEnemy()) {
      this._HTN_MonstarMessage_LastAction  = action;
      this._HTN_MonstarMessage_LastTargets = [...targets]; // BattleManager が shift() で同配列を空にするためコピーを保持

      const fn = _beforeRegistry[subject.enemyId()];
      if (fn != null) {
        buildAndQueueMessages(fn, { skill: action.item(), subject, targets, target: targets[0] ?? null }, this);
      }
    }

    _Window_BattleLog_startAction.call(this, subject, action, targets);
  };

  /**
   * 行動終了時（モンスターが元の位置に戻ったあと）に行動後セリフを表示する
   */
  const _Window_BattleLog_endAction = Window_BattleLog.prototype.endAction;
  Window_BattleLog.prototype.endAction = function(subject) {
    _Window_BattleLog_endAction.call(this, subject);

    if (subject.isEnemy()) {
      const fn = _afterRegistry[subject.enemyId()];

      if (fn != null) {
        const action  = this._HTN_MonstarMessage_LastAction;
        const targets = this._HTN_MonstarMessage_LastTargets;
        buildAndQueueMessages(fn, { skill: action.item(), subject, targets, target: targets[0] ?? null }, this);
      }
    }
  };

  // NW.js 環境では js/plugins/HTN_MonsterMessage/data/ 以下の JS ファイルを自動ロードする
  if (typeof require !== 'undefined') {
    const fs   = require('fs');
    const path = require('path');
    const dir  = path.join(process.cwd(), 'js', 'plugins', 'HTN_MonsterMessage', 'data');

    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
      const constantsFile = 'constants.js';

      // 他のファイルが依存しているため constants.js は最初に読み込む
      if (files.includes(constantsFile)) {
        require(path.join(dir, constantsFile));
      }

      files
        .filter(f => f !== constantsFile)
        .sort()
        .forEach(f => require(path.join(dir, f)));
    }
  }
})();
