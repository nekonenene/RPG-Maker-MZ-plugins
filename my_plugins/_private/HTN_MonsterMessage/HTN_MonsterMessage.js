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
 * HTN_MonsterMessage.registerBattleStart(fn)
 *   戦闘開始時の処理を登録する
 *
 * HTN_MonsterMessage.registerEncountering(敵キャラID, fn)
 *   バトル開始時（「○○があらわれた！」の直後）のセリフを登録する
 *
 * HTN_MonsterMessage.registerBeforeAttack(敵キャラID, fn)
 *   行動前（スキル発動前）のセリフを登録する
 *
 * HTN_MonsterMessage.registerAfterAttack(敵キャラID, fn)
 *   行動後のセリフを登録する
 *
 * HTN_MonsterMessage.registerTurnEnd(敵キャラID, fn)
 *   ターン終了時のセリフを登録する
 *
 * --- コールバック引数 ---
 *
 *   fn({ enemy, skill, targets, target, messages, callCommonEvent, overwriteNextAction, addComboAttack, comboCount })
 *   ※ registerEncountering の fn は skill / comboCount / overwriteNextAction / addComboAttack を持たない
 *   ※ registerTurnEnd の fn は skill / comboCount / overwriteNextAction / addComboAttack を持たない
 *   ※ overwriteNextAction は registerBeforeAttack のみ有効
 *   ※ addComboAttack は registerAfterAttack のみ有効
 *   ※ setNextAction は registerTurnEnd のみ有効
 *
 *   enemy      : セリフを喋る敵キャラ (Game_Enemy)
 *   skill      : 使用スキル ($dataSkills の要素。skill.id や skill.name で参照)
 *   targets    : 対象バトラーの配列（パーティー並び順）
 *   target     : targets[0]（単体攻撃向けショートハンド。対象なしの場合 null）
 *   messages   : メッセージビルダー
 *     .name              話者名（デフォルト: モンスター名）。空文字にすると話者名なしになる
 *     .face              顔グラ [faceName, faceIndex]。デフォルトは ['', 0]（顔グラなし）
 *     .background        背景種別（0: 通常, 1: 暗く, 2: 透明）。デフォルトは 1
 *     .position          表示位置（0: 上, 1: 中, 2: 下）。デフォルトは 2
 *     .push(text)        メッセージをバッファに追加
 *     .pending           バッファにあるメッセージの配列（length で件数確認可）
 *   callCommonEvent(commonEventId) : メッセージ後にコモンイベントを呼び出す
 *   comboCount : 連撃回数（0 = 初撃、1 = 1 回目の連撃、2 = 2 回目の連撃…）
 *   overwriteNextAction(skillIdOrName) : 発動スキルを上書きする（registerBeforeAttack のみ有効）
 *                        number を渡すとスキルIDで、string を渡すとスキル名で検索して強制使用
 *                        混乱やスキル封印、MP/TP不足などの使用可否判定を加味しない
 *                        null または引数なしの場合は上書き処理をしない
 *   addComboAttack(skillIdOrName?) : 連撃を予約する（registerAfterAttack のみ有効）
 *                        number を渡すとスキルIDで、string を渡すとスキル名で検索して強制使用
 *                        混乱やスキル封印、MP/TP不足などの使用可否判定を加味しない
 *                        省略または null のとき AI に行動を委ねる
 *                        コールバック内で comboCount をチェックすることで連撃回数を制限できる
 *   setNextAction(skillIdOrName, { forcing }) : 次ターンの行動を予約する（registerTurnEnd のみ有効）
 *                        forcing は省略時 true。false の場合は使用可否判定を加味され、設定した行動が上書きされうる
 */

(() => {
  'use strict';

  // registerBattleStart で登録されるコールバック一覧
  const _battleStartCallbacks = [];

  // 敵キャラIDをキーとするコールバックのレジストリ
  const _encounterRegistry = {};
  const _beforeRegistry    = {};
  const _afterRegistry     = {};
  const _turnEndRegistry   = {};

  const _api = {
    /**
     * 戦闘開始時のコールバックを登録する
     *
     * @param {function} fn
     */
    registerBattleStart(fn) {
      _battleStartCallbacks.push(fn);
    },

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

    /**
     * ターン終了時のセリフコールバックを登録する
     *
     * @param {number} enemyId
     * @param {function} fn
     */
    registerTurnEnd(enemyId, fn) {
      _turnEndRegistry[enemyId] = fn;
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
   * @param {Game_Enemy} enemy
   * @param {number} [defaultBackground=1] background のデフォルト値
   * @returns {{ pending: object[], messages: object }}
   */
  function createMessagesBuilder(enemy, defaultBackground = 1) {
    const pending = [];
    const messages = {
      name:       enemy.name(),      // デフォルト話者名はモンスター名。空文字にすると話者名なしになる
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
   * 次におこなうアクションをセットする
   * スキル指定がある場合は指定スキルを使用、null の場合は AI に行動を委ねる
   *
   * @param {Game_Enemy} subject 行動主体
   * @param {number|string|null} skillIdOrName number ならスキルID、string ならスキル名で検索
   * @param {boolean} [forcing=true] 混乱やスキル封印、MP/TP不足などの影響を加味せずセットするか
   */
  function setupNextAction(subject, skillIdOrName, forcing = true) {
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
        const action = new Game_Action(subject, forcing);
        action.setSkill(skillId);
        subject._actions = [action];
      }
    } else {
      subject.makeActions(); // AI に行動を選択させる
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
  Window_BattleLog.prototype.htnMonsterMessage_ShowMonsterMessage = function(
    message, name, faceName, faceIndex, background, positionType
  ) {
    $gameMessage.setBackground(background);
    $gameMessage.setPositionType(positionType);
    $gameMessage.setSpeakerName(name);
    $gameMessage.setFaceImage(faceName, faceIndex);
    $gameMessage.add(message);
    this.setWaitMode('HTN_MonsterMessage_MessageWait');
  };

  /**
   * コモンイベントを専用インタープリタで実行し、完了するまでキューを停止する
   * BattleManager.updateEvent に依存しないため、action フェーズ中でも動作する
   *
   * @param {number} commonEventId
   */
  Window_BattleLog.prototype.htnMonsterMessage_RunCommonEvent = function(commonEventId) {
    const commonEvent = $dataCommonEvents[commonEventId];
    if (commonEvent != null) {
      this._HTN_MonsterMessage_CommonEventInterpreter = new Game_Interpreter();
      this._HTN_MonsterMessage_CommonEventInterpreter.setup(commonEvent.list);
      this.setWaitMode('HTN_MonsterMessage_CommonEventWait');
    }
  };

  /**
   * 連撃用の強制アクションを設定して BattleManager.forceAction を呼ぶ
   *
   * @param {Game_Enemy} subject 攻撃をおこなう対象
   * @param {number|string|null} skillIdOrName number ならスキルID、string ならスキル名で検索。null の場合は AI に委ねる
   */
  Window_BattleLog.prototype.htnMonsterMessage_SetupComboAttack = function(subject, skillIdOrName) {
    setupNextAction(subject, skillIdOrName, true);

    if (subject.numActions() > 0) {
      BattleManager._HTN_MonsterMessage_ComboCount = (BattleManager._HTN_MonsterMessage_ComboCount ?? 0) + 1;
      BattleManager._HTN_MonsterMessage_IsComboAction = true;
      BattleManager.forceAction(subject);
    }
  };

  /**
   * waitMode を追加し、メッセージ処理やコモンイベント処理が完了するまで BattleManager の進行を止める
   *
   * 戦闘中の registerBeforeAttack, registerAfterAttack で使われる処理で、
   * モンスター遭遇時の registerEncountering で使われる処理待ちは displayStartMessages と updateStart でおこなわれている
   */
  const _Window_BattleLog_updateWaitMode = Window_BattleLog.prototype.updateWaitMode;
  Window_BattleLog.prototype.updateWaitMode = function() {
    if (this._waitMode === 'HTN_MonsterMessage_MessageWait') {
      if ($gameMessage.isBusy()) {
        return true;
      }

      this._waitMode = '';

      return false;
    }

    if (this._waitMode === 'HTN_MonsterMessage_CommonEventWait') {
      const interpreter = this._HTN_MonsterMessage_CommonEventInterpreter;

      if (interpreter != null && interpreter.isRunning()) {
        interpreter.update();

        // コモンイベントの「戦闘行動の強制」 (command339) が実行されると waitMode: "action" waitMode で止まり、
        // BattleManager.updateEvent() が呼ばれないためデッドロックになり進行しなくなる。
        // isActionForced() が true ならば即座に解放してデッドロックを回避する。
        if (BattleManager.isActionForced()) {
          this._HTN_MonsterMessage_CommonEventInterpreter = null;
          this._waitMode = '';
          return false;
        }

        return true;
      }

      this._HTN_MonsterMessage_CommonEventInterpreter = null;
      this._waitMode = '';

      return false;
    }

    return _Window_BattleLog_updateWaitMode.call(this);
  };

  /**
   * バトル開始時、遭遇時セリフをキューに積む（表示は updateStart でおこなう）
   */
  const _BattleManager_displayStartMessages = BattleManager.displayStartMessages;
  BattleManager.displayStartMessages = function() {
    _BattleManager_displayStartMessages.call(this);

    this._HTN_MonsterMessage_EncounterQueue        = [];
    this._HTN_MonsterMessage_EncounterCommonEvents = [];

    for (const enemy of $gameTroop.members()) {
      const enemyId = enemy.enemyId();
      const fn = _encounterRegistry[enemyId];
      if (fn != null) {
        const targets = $gameParty.battleMembers();
        // 遭遇時のメッセージウィンドウは通常のものを使うのが違和感ないので、第２引数は 0 を指定
        const { pending, messages } = createMessagesBuilder(enemy, 0);
        // ここで $gameTemp.reserveCommonEvent を呼ぶと遭遇メッセージより先にコモンイベントが実行されてしまう。
        // なぜなら updateEventMain は isBusy() = false のとき（＝メッセージ表示中でないとき）にすぐ呼ばれるため。
        // そのため ID をここでは保持しておき、updateStart でメッセージキューが尽きたときにコモンイベントが走るようにする。
        const callCommonEvent = (commonEventId) => { this._HTN_MonsterMessage_EncounterCommonEvents.push(commonEventId); };

        fn({ enemy, targets, target: targets[0] ?? null, messages, callCommonEvent });

        this._HTN_MonsterMessage_EncounterQueue.push(...pending);
      }
    }
  };

  /**
   * "start" フェーズ更新時、遭遇時メッセージのキューが残っていれば 1 件ずつ表示してフェーズを止める
   *
   * メッセージキューが空になったとき、コモンイベントがあるなら $gameTemp に予約し次フレームの updateEventMain で処理させる。
   * どちらも空になったら元の処理（フェーズ遷移）へ進む
   */
  const _BattleManager_updateStart = BattleManager.updateStart;
  BattleManager.updateStart = function() {
    // 遭遇時のメッセージ
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

    // コモンイベント
    const encounterCommonEvents = this._HTN_MonsterMessage_EncounterCommonEvents;
    if (encounterCommonEvents != null && encounterCommonEvents.length > 0) {
      for (const id of encounterCommonEvents.splice(0)) {
        $gameTemp.reserveCommonEvent(id);
      }

      return; // 次フレームで updateEventMain が予約済みイベントを拾う
    }

    _BattleManager_updateStart.call(this);
  };

  /**
   * コールバックを呼び出し、メッセージとコモンイベントをログウィンドウのキューへ積む
   *
   * @param {function} fn
   * @param {{enemy: Game_Enemy, skill: object, targets: Game_Battler[], comboCount: number}} ctx
   * @param {Window_BattleLog} logWindow
   * @param {object} [extraArgs={}] fn に追加で渡す引数（overwriteNextAction / addComboAttack など）
   */
  function invokeCallbackAndQueue(fn, ctx, logWindow, extraArgs = {}) {
    const { pending, messages } = createMessagesBuilder(ctx.enemy);
    const _commonEventRequests = [];
    const callCommonEvent = (commonEventId) => { _commonEventRequests.push(commonEventId); };

    fn({ ...ctx, target: ctx.targets[0] ?? null, messages, callCommonEvent, ...extraArgs });

    for (const m of pending) {
      logWindow.push('htnMonsterMessage_ShowMonsterMessage', m.text, m.name, m.face[0], m.face[1], m.background, m.position);
    }
    for (const id of _commonEventRequests) {
      logWindow.push('htnMonsterMessage_RunCommonEvent', id);
    }
  }

  /**
   * ターン終了時コールバックを、生存している登録済みモンスター全員に対して呼び出す
   *
   * @param {Window_BattleLog} logWindow
   */
  function invokeTurnEndCallbacks(logWindow) {
    const actors = $gameParty.battleMembers();
    const enemies = $gameTroop.aliveMembers();

    for (const enemy of enemies) {
      const fn = _turnEndRegistry[enemy.enemyId()];
      if (fn == null) continue;

      const { pending, messages } = createMessagesBuilder(enemy);
      const commonEventRequests = [];
      let nextActionRequest = null;
      const callCommonEvent = (commonEventId) => { commonEventRequests.push(commonEventId); };
      const setNextAction = function(skillIdOrName, options = {}) {
        if (skillIdOrName == null) return;

        nextActionRequest = {
          skillIdOrName,
          forcing: options == null || options.forcing !== false,
        };
      };

      fn({
        enemy,
        targets: actors,
        target: actors[0] ?? null,
        messages,
        callCommonEvent,
        setNextAction,
      });

      if (nextActionRequest != null) {
        BattleManager._HTN_MonsterMessage_NextActionRequests[enemy.index()] = nextActionRequest;
      }

      for (const m of pending) {
        logWindow.push('htnMonsterMessage_ShowMonsterMessage', m.text, m.name, m.face[0], m.face[1], m.background, m.position);
      }
      for (const id of commonEventRequests) {
        logWindow.push('htnMonsterMessage_RunCommonEvent', id);
      }
    }
  }

  /**
   * 戦闘開始時に独自プロパティを初期化
   */
  const _BattleManager_startBattle = BattleManager.startBattle;
  BattleManager.startBattle = function() {
    this._HTN_MonsterMessage_NextActionRequests = {};

    // registerBattleStart で登録された処理を順番に呼び出す
    for (const fn of _battleStartCallbacks) {
      fn();
    }

    _BattleManager_startBattle.call(this);
  };

  /**
   * 行動予約があれば、敵キャラの行動決定後に上書きする
   */
  const _Game_Enemy_makeActions = Game_Enemy.prototype.makeActions;
  Game_Enemy.prototype.makeActions = function() {
    _Game_Enemy_makeActions.call(this);

    const requests = BattleManager._HTN_MonsterMessage_NextActionRequests;
    const request = requests[this.index()] ?? null;
    delete requests[this.index()];

    if (request == null) return;

    const originalActions = [...this._actions];
    setupNextAction(this, request.skillIdOrName, request.forcing);

    // スキルが見つからなかった場合は通常の行動決定に戻す
    if (this.currentAction() == null) {
      this._actions = originalActions;
    }
  };

  /**
   * 行動開始時に行動前セリフを表示
   * overwriteNextAction が指定された場合はアクションを差し替える
   * 連撃でない場合は comboCount をリセットする
   */
  const _BattleManager_startAction = BattleManager.startAction;
  BattleManager.startAction = function() {
    const subject = this._subject;

    if (subject.isEnemy()) {
      if (this._HTN_MonsterMessage_IsComboAction !== true) {
        this._HTN_MonsterMessage_ComboCount = 0;
      }
      this._HTN_MonsterMessage_IsComboAction = false;

      const fn = _beforeRegistry[subject.enemyId()];
      if (fn != null) {
        const action = subject.currentAction();
        const comboCount = this._HTN_MonsterMessage_ComboCount ?? 0;
        const targets = sortByPartyOrder(action.makeTargets());

        let _overwriteRequest = null;
        const overwriteNextAction = function(skillIdOrName) {
          if (skillIdOrName != null) {
            _overwriteRequest = skillIdOrName;
          }
        };

        invokeCallbackAndQueue(fn, { enemy: subject, skill: action.item(), targets, comboCount }, this._logWindow, { overwriteNextAction });

        if (_overwriteRequest !== null) {
          const originalActions = [...subject._actions];
          setupNextAction(subject, _overwriteRequest, true);

          // スキルが見つからなかった場合は元のアクションに戻す
          if (subject.currentAction() == null) {
            subject._actions = originalActions;
          }
        }
      }
    }

    _BattleManager_startAction.call(this);

    // registerAfterAttack で使用できるよう、スキルとターゲットを保存
    // _targets は updateAction の shift() で空になるため shallow copy をおこなう
    if (subject.isEnemy()) {
      this._HTN_MonsterMessage_LastAction  = this._action;
      this._HTN_MonsterMessage_LastTargets = [...this._targets];
    }
  };

  /**
   * 行動結果の表示（ダメージ表示など）がされた後にセリフを表示する。連撃のためのキュー追加もおこなう
   */
  const _BattleManager_endAction = BattleManager.endAction;
  BattleManager.endAction = function() {
    const subject = this._subject;

    _BattleManager_endAction.call(this);

    if (subject.isEnemy()) {
      const fn = _afterRegistry[subject.enemyId()];
      if (fn != null) {
        const action = this._HTN_MonsterMessage_LastAction;
        const comboCount = this._HTN_MonsterMessage_ComboCount ?? 0;
        const targets = sortByPartyOrder(this._HTN_MonsterMessage_LastTargets);

        let _comboRequest = null;
        const addComboAttack = function(skillIdOrName = null) {
          _comboRequest = { skillIdOrName: skillIdOrName ?? null };
        };

        invokeCallbackAndQueue(fn, { enemy: subject, skill: action.item(), targets, comboCount }, this._logWindow, { addComboAttack });

        if (_comboRequest != null) {
          this._logWindow.push('htnMonsterMessage_SetupComboAttack', subject, _comboRequest.skillIdOrName);
        }
      }
    }
  };

  /**
   * ターン終了処理後に、モンスターのターン終了時セリフを表示する
   *
   * リジェネや、ターン経過でのステート解消後に呼ばれる処理。
   * TPB バトルでこのメソッドは呼ばれない
   */
  const _BattleManager_endAllBattlersTurn = BattleManager.endAllBattlersTurn;
  BattleManager.endAllBattlersTurn = function() {
    _BattleManager_endAllBattlersTurn.call(this);

    invokeTurnEndCallbacks(this._logWindow);
  };

  /**
   * 戦闘終了時に独自プロパティを削除
   */
  const _BattleManager_endBattle = BattleManager.endBattle;
  BattleManager.endBattle = function(result) {
    _BattleManager_endBattle.call(this, result);

    delete this._HTN_MonsterMessage_ComboCount;
    delete this._HTN_MonsterMessage_EncounterCommonEvents;
    delete this._HTN_MonsterMessage_EncounterQueue;
    delete this._HTN_MonsterMessage_IsComboAction;
    delete this._HTN_MonsterMessage_LastAction;
    delete this._HTN_MonsterMessage_LastTargets;
    delete this._HTN_MonsterMessage_NextActionRequests;

    if (this._logWindow != null) {
      console.log(this._logWindow);
      delete this._logWindow._HTN_MonsterMessage_CommonEventInterpreter;
    }
  };

  //// ---- 以下、 NW.js（デスクトップ）とブラウザ両対応の、データ読み込み処理 ----

  // データファイルの読み込み完了を示すフラグ
  _api._finishedDataLoading = false;

  // 逐次ロードキュー。data/index.js 経由で各ファイルが積まれる
  const _dataFileQueue = [];

  /**
   * ブラウザ環境向けデータファイルローダー
   *
   * data/index.js 内で HTN_MonsterMessage.loadDataScript の形式で呼び出す。
   * キューに積まれ、前ファイルの実行完了後に順次処理される
   *
   * @param {string} filename - 'HTN_MonsterMessage/data/constants' のような拡張子のないパス
   */
  _api.loadDataScript = function(filename) {
    _dataFileQueue.push(filename);
  };

  /**
   * キューの先頭ファイルを XHR で取得し new Function() で実行する。
   * 完了後に次のキューを処理し、すべて終わったら _finishedDataLoading を立てる
   */
  function _processNextDataFile() {
    if (_dataFileQueue.length === 0) {
      _api._finishedDataLoading = true;
      return;
    }

    const filename = _dataFileQueue.shift();
    const url = 'js/plugins/' + filename + '.js';
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);

    xhr.onload = function() {
      if (xhr.status === 200 || xhr.status === 0) {
        // new Function でラップし独立スコープで実行することで
        // ファイル間の const/let 変数名の衝突を防ぐ
        (new Function(xhr.responseText))();
      }
      _processNextDataFile();
    };

    xhr.onerror = function() {
      _processNextDataFile();
    };

    xhr.send();
  }

  // js/plugins/HTN_MonsterMessage/data/ 以下の JS ファイルを読み込む
  if (Utils.isNwjs()) {
    // NW.js（デスクトップ）版: require を使い、fs でスキャンして同期
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

    _api._finishedDataLoading = true; // いちおう true にしておく
  } else {
    // ブラウザ版: data/index.js に書かれたファイルを XHR + new Function() で逐次ロードしていく

    // 全データファイルが読み込まれるまで DataManager.isDatabaseLoaded を false にする
    const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
      return _DataManager_isDatabaseLoaded.call(this) && _api._finishedDataLoading;
    };

    _api.loadDataScript('HTN_MonsterMessage/data/index');
    _processNextDataFile();
  }
})();
