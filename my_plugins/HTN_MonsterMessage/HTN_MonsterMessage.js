// --------------------------------------------------------------------------
//
// HTN_MonsterMessage
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/05/03 v0.0.1 開発開始...
//
// --------------------------------------------------------------------------

/*:ja
 * @target MZ
 * @plugindesc モンスターが行動する際にメッセージウィンドウでセリフを表示するプラグイン
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_MonsterMessage
 *
 * @help
 * js/plugins/HTN_MonsterMessage/data/ ディレクトリに配置された
 * JS ファイルを自動で読み込みます。
 * プラグイン管理には、このファイルだけ登録すればあとは登録不要です。
 *
 * --- 登録メソッド ---
 *
 * HTN_MonsterMessage.registerEncountering(エネミーID, fn)
 *   バトル開始時（「○○があらわれた！」の直後）のセリフを登録する
 *   同一エネミーIDが複数体いるトループでは、1体分のみ表示される
 *
 * HTN_MonsterMessage.registerBeforeAttack(エネミーID, fn)
 *   行動前（スキル発動前）のセリフを登録する
 *
 * HTN_MonsterMessage.registerAfterAttack(エネミーID, fn)
 *   行動後（モンスターが元の位置に戻ったあと）のセリフを登録する
 *
 * --- コールバック引数 ---
 *
 *   fn({ skill, subject, targets, target, messages, overwriteNextAction, addComboAttack, comboCount })
 *   ※ registerEncountering の fn は skill / comboCount / overwriteNextAction / addComboAttack を持たない
 *   ※ overwriteNextAction は registerBeforeAttack のみ有効
 *   ※ addComboAttack は registerAfterAttack のみ有効
 *
 *   skill      : 使用スキル ($dataSkills の要素。skill.id や skill.name で参照)
 *   subject    : 行動エネミー (Game_Enemy)
 *   targets    : 対象バトラーの配列（パーティー並び順）
 *   target     : targets[0]（単体攻撃向けショートハンド。対象なしの場合 null）
 *   messages   : メッセージビルダー
 *     .name              話者名（デフォルト: モンスター名）。空文字にすると話者名なしになる
 *     .face              顔グラ [faceName, faceIndex]。デフォルトは ['', 0]（顔グラなし）
 *     .background        背景種別（0: 通常, 1: 暗く, 2: 透明）。デフォルトは 1
 *     .position          表示位置（0: 上, 1: 中, 2: 下）。デフォルトは 2
 *     .push(text)        メッセージをバッファに追加
 *     .pending           バッファにあるメッセージの配列（length で件数確認可）
 *   comboCount : 連撃回数（0 = 初撃、1 = 1 回目の連撃、2 = 2 回目の連撃…）
 *   overwriteNextAction(skillIdOrName) : 発動スキルを上書きする（registerBeforeAttack のみ有効）
 *                        number を渡すとスキルIDで、string を渡すとスキル名で検索して強制使用
 *                        null または引数なしの場合は上書き処理をしない
 *   addComboAttack(skillIdOrName?) : 連撃を予約する（registerAfterAttack のみ有効）
 *                        number を渡すとスキルIDで、string を渡すとスキル名で検索して強制使用
 *                        省略または null のとき AI に行動を委ねる
 *                        コールバック内で comboCount をチェックすることで連撃回数を制限できる
 */

(() => {
  'use strict';

  // エネミーIDをキーとするコールバックのレジストリ
  const _encounterRegistry = {};
  const _beforeRegistry    = {};
  const _afterRegistry     = {};

  const _api = {
    /**
     * 遭遇時のセリフコールバックを登録する
     *
     * @param {number} enemyId
     * @param {function} fn
     */
    registerEncountering(enemyId, fn) {
      _encounterRegistry[enemyId] = fn;
    },

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

    // require() 文脈からツクールのグローバルオブジェクトにアクセスできるよう橋渡し。
    // getter を介すことで、$gameVariables 等が初期化された後も常に最新の値を返す
    const _bridgedGlobals = [
      '$gameVariables', '$gameSwitches', '$gameActors',
      '$gameParty', '$gameTroop', '$gameMap',
      '$dataSkills', '$dataEnemies', '$dataActors', '$dataStates',
    ];

    for (const name of _bridgedGlobals) {
      Object.defineProperty(global, name, {
        get() { return window[name]; },
        configurable: true,
      });
    }
  }

  /**
   * パーティーの並び順にソートして返す
   *
   * @param {Game_Battler[]} targets
   * @returns {Game_Battler[]}
   */
  function sortByPartyOrder(targets) {
    const partyOrder = $gameParty.battleMembers();
    return [...targets].sort((a, b) => partyOrder.indexOf(a) - partyOrder.indexOf(b));
  }

  /**
   * messages ビルダーオブジェクトと内部バッファを生成して返す
   *
   * @param {Game_Enemy} subject
   * @param {number} [defaultBackground=1] background のデフォルト値
   * @returns {{ pending: object[], messages: object }}
   */
  function createMessagesBuilder(subject, defaultBackground = 1) {
    const pending = [];
    const messages = {
      name:       subject.name(),    // デフォルト話者名はモンスター名。空文字にすると話者名なしになる
      face:       ['', 0],           // 顔グラ。例えば妖精は ['Nature', 5]
      background: defaultBackground, // 0: 通常, 1: 暗く, 2: 透明
      position:   2,                 // 0: 上, 1: 中, 2: 下
      pending,                       // 内部で保持するメッセージのバッファ
      push(text) {
        pending.push({
          text,
          name:       this.name,
          face:       [...this.face],
          background: this.background,
          position:   this.position,
        });
      },
    };

    return { pending, messages };
  }

  /**
   * エネミーに強制アクションをセットする
   * スキル指定がある場合は forcing=true で強制使用、null の場合は AI に行動を委ねる
   *
   * @param {Game_Enemy} subject
   * @param {number|string|null} skillIdOrName number ならスキルID、string ならスキル名で検索
   */
  function setupForcedAction(subject, skillIdOrName) {
    subject.clearActions();

    if (skillIdOrName != null) {
      let skillId = null;

      if (typeof skillIdOrName === 'number') {
        skillId = skillIdOrName;
      } else if (typeof skillIdOrName === 'string') {
        const skill = $dataSkills.find(s => s != null && s.name === skillIdOrName);
        skillId = skill != null ? skill.id : null;
      }

      if (skillId != null) {
        const action = new Game_Action(subject, true); // forcing = true で混乱の影響を受けない
        action.setSkill(skillId);
        subject._actions = [action];
      }
    } else {
      subject.makeActions(); // AI に行動を選択させる
    }
  }

  /**
   * コールバックを呼び出し、結果のメッセージをバトルログキューへ積む
   *
   * @param {function} fn
   * @param {{skill: object, subject: Game_Enemy, targets: Game_Battler[], target: Game_Battler|null, comboCount: number}} ctx
   * @param {Window_BattleLog} logWindow
   * @param {boolean} [allowCombo=false] true のとき addComboAttack がコールバック引数に渡される
   */
  function buildAndQueueMessages(fn, ctx, logWindow, allowCombo = false) {
    const { pending, messages } = createMessagesBuilder(ctx.subject);
    const targets = sortByPartyOrder(ctx.targets);

    let _comboRequest = null;
    const addComboAttack = allowCombo
      ? function(skillIdOrName = null) { _comboRequest = { skillIdOrName: skillIdOrName ?? null }; }
      : undefined;

    fn({ ...ctx, targets, target: targets[0] ?? null, messages, addComboAttack });

    for (const m of pending) {
      logWindow.push('showMonsterMessage', m.text, m.name, m.face[0], m.face[1], m.background, m.position);
    }

    if (_comboRequest != null) {
      logWindow.push('setupComboAttack', ctx.subject, _comboRequest.skillIdOrName);
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
   * 連撃用の強制アクションを設定して BattleManager.forceAction を呼ぶ
   *
   * @param {Game_Enemy} subject 攻撃をおこなう対象
   * @param {number|string|null} skillIdOrName number ならスキルID、string ならスキル名で検索。null の場合は AI に委ねる
   */
  Window_BattleLog.prototype.setupComboAttack = function(subject, skillIdOrName) {
    setupForcedAction(subject, skillIdOrName);

    if (subject.numActions() > 0) {
      BattleManager._HTN_MonsterMessage_ComboCount = (BattleManager._HTN_MonsterMessage_ComboCount ?? 0) + 1;
      BattleManager._HTN_MonsterMessage_IsComboAction = true;
      BattleManager.forceAction(subject);
    }
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
   * バトル開始時、遭遇時セリフをキューに積む（表示は updateStart で行う）
   * 同一エネミーIDが複数体いる場合は最初の1体分のみ表示する
   */
  const _BattleManager_displayStartMessages = BattleManager.displayStartMessages;
  BattleManager.displayStartMessages = function() {
    _BattleManager_displayStartMessages.call(this);

    this._HTN_MonsterMessage_EncounterQueue = [];

    const seenIds = new Set();

    for (const enemy of $gameTroop.members()) {
      const enemyId = enemy.enemyId();
      if (seenIds.has(enemyId)) continue;
      seenIds.add(enemyId);

      const fn = _encounterRegistry[enemyId];
      if (fn != null) {
        const targets = $gameParty.battleMembers();
        // 遭遇時のメッセージウィンドウは通常のものを使うのが違和感ないので、第２引数は 0 を指定
        const { pending, messages } = createMessagesBuilder(enemy, 0);

        fn({ subject: enemy, targets, target: targets[0] ?? null, messages });

        this._HTN_MonsterMessage_EncounterQueue.push(...pending);
      }
    }
  };

  /**
   * "start" フェーズ更新時、遭遇時セリフキューが残っていれば 1 件ずつ表示してフェーズを止める
   * キューが空になったら元の処理（フェーズ遷移）へ進む
   */
  const _BattleManager_updateStart = BattleManager.updateStart;
  BattleManager.updateStart = function() {
    const queue = this._HTN_MonsterMessage_EncounterQueue;

    if (queue != null && queue.length > 0) {
      const m = queue.shift();
      $gameMessage.setBackground(m.background);
      $gameMessage.setPositionType(m.position);
      $gameMessage.setSpeakerName(m.name);
      $gameMessage.setFaceImage(m.face[0], m.face[1]);
      $gameMessage.add(m.text);
      return;
    }

    _BattleManager_updateStart.call(this);
  };

  /**
   * 行動開始時に行動前セリフを表示し、action と targets を保存する
   * 連撃でない場合は comboCount をリセットする
   */
  const _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
  Window_BattleLog.prototype.startAction = function(subject, action, targets) {
    let effectiveAction  = action;
    let effectiveTargets = targets;

    if (subject.isEnemy()) {
      if (BattleManager._HTN_MonsterMessage_IsComboAction !== true) {
        BattleManager._HTN_MonsterMessage_ComboCount = 0;
      }
      BattleManager._HTN_MonsterMessage_IsComboAction = false;

      const fn = _beforeRegistry[subject.enemyId()];
      if (fn != null) {
        const comboCount = BattleManager._HTN_MonsterMessage_ComboCount ?? 0;
        const sortedTargets = sortByPartyOrder(targets);
        const { pending, messages } = createMessagesBuilder(subject);

        let _overwriteRequest = null;
        const overwriteNextAction = function(skillIdOrName) {
          if (skillIdOrName != null) {
            _overwriteRequest = skillIdOrName;
          }
        };

        fn({ skill: action.item(), subject, targets: sortedTargets, target: sortedTargets[0] ?? null, messages, comboCount, overwriteNextAction });

        for (const m of pending) {
          this.push('showMonsterMessage', m.text, m.name, m.face[0], m.face[1], m.background, m.position);
        }

        if (_overwriteRequest !== null) {
          setupForcedAction(subject, _overwriteRequest);

          const newAction = subject.currentAction();
          if (newAction != null) {
            effectiveAction  = newAction;
            effectiveTargets = sortByPartyOrder(newAction.makeTargets());
            BattleManager._action  = newAction;
            BattleManager._targets = effectiveTargets;
          }
        }
      }

      // registerAfterAttack で使用できるよう、スキルとターゲットを保存
      // BattleManager が shift() で targets を空にするため shallow copy をおこなう
      this._HTN_MonstarMessage_LastAction  = effectiveAction;
      this._HTN_MonstarMessage_LastTargets = [...effectiveTargets];
    }

    _Window_BattleLog_startAction.call(this, subject, effectiveAction, effectiveTargets);
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
        const action     = this._HTN_MonstarMessage_LastAction;
        const targets    = this._HTN_MonstarMessage_LastTargets;
        const comboCount = BattleManager._HTN_MonsterMessage_ComboCount ?? 0;

        buildAndQueueMessages(fn, { skill: action.item(), subject, targets, target: targets[0] ?? null, comboCount }, this, true);
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
