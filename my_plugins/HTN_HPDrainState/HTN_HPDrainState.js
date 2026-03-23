// --------------------------------------------------------------------------
//
// HTN_HPDrainState.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/03/22 v0.0.1 開発中...
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc Creates a state that drains HP from the afflicted to the drainer each turn (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
 * @url https://github.com/nekoneneve/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_HPDrainState
 *
 * @param AmountType
 * @text Default drain type
 * @desc The drain calculation method when no note tag is specified.
 * @default selfMaxHp
 * @type select
 * @option Fixed HP value
 * @value absolute
 * @option % of afflicted's max HP
 * @value selfMaxHp
 * @option % of afflicted's current HP
 * @value selfHp
 * @option % of drainer's max HP
 * @value drainerMaxHp
 * @option % of drainer's missing HP (max HP - current HP)
 * @value drainerMissingHp
 *
 * @param Amount
 * @text Default drain value
 * @desc The drain amount when no note tag is specified. A fixed HP value or a percentage (0-100).
 * @default 10
 * @type number
 * @min 0
 *
 * @param DrainMessage
 * @text Drain message
 * @desc Message shown when HP drain occurs. %1=afflicted name, %2=drainer name, %3=HP label, %4=drain amount.
 * @default %1 had %4 %3 drained by %2!
 * @type string
 *
 * @param AllowKill
 * @text Allow draining to death
 * @desc If false, the afflicted will retain at least 1 HP after draining.
 * @default true
 * @type boolean
 *
 * @help
 * Add the following note tag to a state to make it an HP drain state:
 * <HPDrainState>
 *
 * The state remembers who applied it. At the end of the afflicted battler's
 * turn, HP is transferred from the afflicted to the drainer.
 * The state is also removed if the drainer is defeated.
 *
 * --- Per-state overrides (all optional) ---
 * <HPDrainState_AmountType: absolute>          Fixed HP value
 * <HPDrainState_AmountType: selfMaxHp>         % of afflicted's max HP
 * <HPDrainState_AmountType: selfHp>            % of afflicted's current HP
 * <HPDrainState_AmountType: drainerMaxHp>      % of drainer's max HP
 * <HPDrainState_AmountType: drainerMissingHp>  % of drainer's missing HP (max HP - current HP)
 *
 * <HPDrainState_Amount: 100>
 *
 * <HPDrainState_DrainMessage: %1 had %4 %3 drained by %2!>
 *
 * <HPDrainState_AllowKill: true>
 * <HPDrainState_AllowKill: false>
 */

/*:ja
 * @target MZ
 * @plugindesc HPを吸収され続けるステート（状態異常）を作成できます (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekoneneve/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_HPDrainState
 *
 * @param AmountType
 * @text デフォルト吸収タイプ
 * @desc タグ未指定時の吸収量の計算タイプです。
 * @default selfMaxHp
 * @type select
 * @option 固定値（HP）
 * @value absolute
 * @option 被付与者の最大HPに対する割合（%）
 * @value selfMaxHp
 * @option 被付与者の現在HPに対する割合（%）
 * @value selfHp
 * @option ドレイン実行者の最大HPに対する割合（%）
 * @value drainerMaxHp
 * @option ドレイン実行者の「最大HP−現在HP」に対する割合（%）
 * @value drainerMissingHp
 *
 * @param Amount
 * @text デフォルト吸収量
 * @desc タグ未指定時の吸収量。固定値の場合はHP量、割合の場合はパーセンテージ（0〜100）を指定します。
 * @default 10
 * @type number
 * @min 0
 *
 * @param DrainMessage
 * @text ドレインメッセージ
 * @desc HP吸収時に表示するメッセージ。%1=被付与者名、%2=ドレイン実行者名、%3=HPの設定名、%4=吸収量。
 * @default %1は%2に%3を %4 吸収された！
 * @type string
 *
 * @param AllowKill
 * @text 吸収による戦闘不能を許可
 * @desc falseにすると、HP吸収で被付与者のHPが0にならないよう制限し、最低1HPを保持します。
 * @default true
 * @type boolean
 *
 * @help
 * 【使い方】
 * HP吸収ステートにしたいステートの「メモ」欄に、次のタグを記述してください。
 * <HPDrainState>
 *
 * ステートを付与した相手（ドレイン実行者）が記憶され、
 * 被付与者のターン終了時にHPがドレイン実行者へ渡されます。
 * ドレイン実行者が戦闘不能になった場合にステートは自動解除されます。
 *
 * 【ステートごとの個別設定（すべて省略可）】
 * 省略した場合はプラグインパラメータの設定値が使用されます。
 *
 * <HPDrainState_AmountType: absolute>          固定値
 * <HPDrainState_AmountType: selfMaxHp>         被付与者の最大HP基準（%）
 * <HPDrainState_AmountType: selfHp>            被付与者の現在HP基準（%）
 * <HPDrainState_AmountType: drainerMaxHp>      ドレイン実行者の最大HP基準（%）
 * <HPDrainState_AmountType: drainerMissingHp>  ドレイン実行者の「最大HP−現在HP」基準（%）
 *
 * <HPDrainState_Amount: 100>
 *
 * <HPDrainState_DrainMessage: %1は%2に%3を %4 吸収された！>
 * （%1=被付与者名、%2=ドレイン実行者名、%3=HPの設定名、%4=吸収量）
 *
 * <HPDrainState_AllowKill: true>   （吸収による戦闘不能を許可）
 * <HPDrainState_AllowKill: false>  （吸収で最低1HPを保持）
 */

(() => {
  'use strict';

  const pluginName = 'HTN_HPDrainState';
  const parameters = PluginManager.parameters(pluginName);
  const paramAmountType = String(parameters.AmountType || 'selfMaxHp');
  const paramAmount = Number(parameters.Amount ?? 10);
  const paramDrainMessage = String(parameters.DrainMessage || '%1は%2に%3を %4 吸収された！');
  const paramAllowKill = String(parameters.AllowKill) !== 'false';

  /**
   * 文字列や真偽値の入力を真偽値へ変換する
   *
   * @param {boolean | string} value 変換対象の値
   * @param {boolean} defaultValue 変換不能時の既定値
   * @returns {boolean} 変換後の真偽値
   */
  const toBoolean = (value, defaultValue) => {
    const strValue = String(value).trim().toLowerCase();

    if (strValue === 'true') {
      return true;
    } else if (strValue === 'false') {
      return false;
    }

    return defaultValue;
  };

  /**
   * ドレイン実行者の情報オブジェクトから実際のバトラーインスタンスを返す
   *
   * @param {{ actorId: number, enemyIndex: number }} drainerInfo ドレイン実行者の情報
   * @returns {Game_Battler | null} 対応するバトラー。見つからない場合は null
   */
  const resolveDrainer = (drainerInfo) => {
    if (drainerInfo == null) return null;

    if (drainerInfo.actorId > 0) {
      return $gameActors.actor(drainerInfo.actorId) ?? null;
    } else if (drainerInfo.enemyIndex >= 0) {
      return $gameTroop.members()[drainerInfo.enemyIndex] ?? null;
    }

    return null;
  };

  /**
   * ステートのメタ情報に基づいてHP吸収量を計算する
   *
   * @param {RPG.State} state 対象ステート
   * @param {Game_Battler} drainTarget 被付与者（HPを失う側）
   * @param {Game_Battler} drainer ドレイン実行者（HPを得る側）
   * @returns {number} 吸収するHP量（0以上の整数）
   */
  const calcDrainAmount = (state, drainTarget, drainer) => {
    const amountType = String(state.meta.HPDrainState_AmountType ?? '').trim() || paramAmountType;
    const amount = Number(state.meta.HPDrainState_Amount ?? paramAmount);

    let result = 0;
    switch (amountType) {
      case 'absolute':
        result = amount;
        break;
      case 'selfMaxHp':
        result = Math.ceil(drainTarget.mhp * amount / 100);
        break;
      case 'selfHp':
        result = Math.ceil(drainTarget.hp * amount / 100);
        break;
      case 'drainerMaxHp':
        result = Math.ceil(drainer.mhp * amount / 100);
        break;
      case 'drainerMissingHp':
        // ドレイン実行者の「最大HP − 現在HP」（欠損HP）に対するパーセンテージ
        result = Math.ceil((drainer.mhp - drainer.hp) * amount / 100);
        break;
      default:
        result = amount;
    }

    return Math.max(0, result);
  };

  /**
   * HP吸収を実行し、メッセージをバッファに積む
   *
   * @param {Game_Battler} drainTarget 被付与者（HPを失う側）
   * @param {Game_Battler} drainer ドレイン実行者（HPを得る側）
   * @param {number} amount 吸収するHP量
   * @param {RPG.State} state 対象ステート（ステートごとの個別設定に使用）
   */
  const applyHpDrain = (drainTarget, drainer, amount, state) => {
    const allowKill = toBoolean(state.meta.HPDrainState_AllowKill, paramAllowKill);

    // allowKill が false の場合、被付与者のHPが0にならないように吸収量を制限
    let safeAmount = amount;
    if (!allowKill) {
      safeAmount = Math.min(amount, Math.max(0, drainTarget.hp - 1));
    }

    // HP吸収が発生しない場合はここで処理を終了
    if (safeAmount <= 0) return;

    drainTarget.gainHp(-safeAmount);
    drainer.gainHp(safeAmount);

    // ドレイン実行者のHP回復ポップアップを即時キューに積む
    drainer.startDamagePopup();

    const drainMessage = state.meta.HPDrainState_DrainMessage != null ? String(state.meta.HPDrainState_DrainMessage) : paramDrainMessage;
    const message = drainMessage.trim().format(drainTarget.name(), drainer.name(), TextManager.hp, safeAmount);

    if (message !== '') {
      drainTarget._hpDrainPendingMessages.push(message);
    }
  };

  /**
   * ドレイン実行者の死亡時に、ドレイン対象者を探して状態異常を解除する
   *
   * @param {Game_BattlerBase} deadBattler 死亡したバトラー
   */
  const removeDrainStatesByDrainer = (deadBattler) => {
    // 戦闘中でないなら早期return
    if (!$gameParty.inBattle()) {
      return;
    }

    // 各バトラーに関して、誰にドレインを受けているのかを見ていき、
    // その中に deadBattler がいるなら、対応するステートを解除する
    for (const battler of BattleManager.allBattleMembers()) {
      if (battler._hpDrainerInfo == null) {
        continue;
      }

      // Object.keys() でコピーを取ることで、ループ中の removeState による変更に対して安全にする
      for (const stateIdStr of Object.keys(battler._hpDrainerInfo)) {
        const stateId = Number(stateIdStr);
        const drainer = resolveDrainer(battler._hpDrainerInfo[stateId]);

        if (drainer === deadBattler) {
          battler.removeState(stateId);

          // displayBattlerStatus をここで直接呼ぶと、ダメージ・倒れるメッセージより先にキューへ積まれてしまう。
          // そのため「後で表示が必要なバトラー」として pending リストに追加し、
          // deadBattler の displayBattlerStatus が呼ばれた直後に処理する（後述のエイリアス参照）
          if (BattleManager._hpDrainPendingRecoveringBattlers == null) {
            BattleManager._hpDrainPendingRecoveringBattlers = [];
          }
          BattleManager._hpDrainPendingRecoveringBattlers.push(battler);
        }
      }
    }
  };

  /**
   * 独自プロパティを初期化する
   */
  const _Game_Battler_initMembers = Game_Battler.prototype.initMembers;
  Game_Battler.prototype.initMembers = function() {
    _Game_Battler_initMembers.call(this);

    this._hpDrainerInfo = {}; // { stateId: { actorId:, enemyIndex: } } の形式で apply メソッドにて代入される
    this._hpDrainPendingMessages = []; // ドレインメッセージの一時保管場所
  };

  /**
   * スキル・アイテム効果の適用後、新規付与されたHPドレインステートのドレイン実行者を記録する
   *
   * @param {Game_Battler} target スキル・アイテムの使用相手
   */
  const _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function(target) {
    _Game_Action_apply.call(this, target);

    const actionSubject = this.subject(); // アクションの主体

    // このアクションがドレインステートを付与する効果を持つ場合、ドレイン実行者を記録（再付与時は上書き）
    for (const state of target.states()) {
      if (!state.meta.HPDrainState) continue;

      // item().effects は例えば { code: 21, dataId: 5, value1: 1.0, value2: 0 } のような Object を持ち、
      // code: 21 (=EFFECT_ADD_STATE) は「ステート付与」効果を示し、
      // dataId: 5 は付与するステートID、value1: 1.0 は付与確率（100%）を示す。
      // この分岐で、ドレインステートの付与がおこなわれるアクションなのかを確認している。
      const hasAddDrainState = this.item().effects.some(
        (e) => e.code === Game_Action.EFFECT_ADD_STATE && e.dataId === state.id
      );
      if (!hasAddDrainState) continue;

      // initMembers より前に呼ばれた場合に備えて初期化
      if (target._hpDrainerInfo == null) {
        target._hpDrainerInfo = {};
      }

      // ドレイン実行者の情報を記録。味方なら actorId, 敵なら enemyIndex に保存
      if (actionSubject.isActor()) {
        target._hpDrainerInfo[state.id] = { actorId: actionSubject.actorId(), enemyIndex: -1 };
      } else {
        target._hpDrainerInfo[state.id] = { actorId: 0, enemyIndex: actionSubject.index() };
      }
    }
  };

  /**
   * ステート解除時に _hpDrainerInfo から対応エントリを削除する
   *
   * @param {number} stateId 解除するステートID
   */
  const _Game_Battler_removeState = Game_Battler.prototype.removeState;
  Game_Battler.prototype.removeState = function(stateId) {
    _Game_Battler_removeState.call(this, stateId);

    if (this._hpDrainerInfo != null) {
      delete this._hpDrainerInfo[stateId];
    }
  };

  /**
   * HP/MP/TP自然回復後にHP吸収処理を実行する
   */
  const _Game_Battler_regenerateAll = Game_Battler.prototype.regenerateAll;
  Game_Battler.prototype.regenerateAll = function() {
    _Game_Battler_regenerateAll.call(this);

    this.hpDrainRegenerate();
  };

  /**
   * 独自メソッド：ターン終了時のHP吸収処理
   * this が持っている状態異常の中からHPドレインステートをすべて探し、それぞれのドレイン処理を実行
   */
  Game_Battler.prototype.hpDrainRegenerate = function() {
    if (!this.isAlive()) return;

    const drainStates = this.states().filter((s) => s.meta.HPDrainState);
    if (drainStates.length === 0) return;

    for (const state of drainStates) {
      const drainerInfo = this._hpDrainerInfo ? this._hpDrainerInfo[state.id] : null;
      if (drainerInfo == null) {
        continue;
      }

      const drainer = resolveDrainer(drainerInfo);
      if (drainer == null || !drainer.isAlive()) {
        continue;
      }

      const amount = calcDrainAmount(state, this, drainer);
      applyHpDrain(this, drainer, amount, state); // this から drainer に HP を移動させる
    }
  };

  /**
   * 誰かが死亡したとき、ドレイン実行者であれば、被付与者からドレインステートを解除
   */
  const _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
  Game_BattlerBase.prototype.die = function() {
    _Game_BattlerBase_die.call(this);

    removeDrainStatesByDrainer(this);
  };

  /**
   * 状態変化メッセージの表示前に、バッファされたHP吸収メッセージを先に表示する
   * displayAutoAffectedStatus より前に出すことで、死亡メッセージの前にドレインメッセージが表示される
   *
   * @param {Game_Battler} subject 対象バトラー
   */
  const _Window_BattleLog_displayAutoAffectedStatus = Window_BattleLog.prototype.displayAutoAffectedStatus;
  Window_BattleLog.prototype.displayAutoAffectedStatus = function(subject) {
    const drainMessages = subject._hpDrainPendingMessages;
    if (drainMessages != null && drainMessages.length > 0) {
      for (const drainMessage of drainMessages) {
        this.push('addText', drainMessage); // ドレインメッセージをバトルログに表示
      }

      // MZ の標準的なメッセージ表示パターン（addText → wait → clear）に倣い、
      // ドレインメッセージを表示し終えたらクリアする
      this.push('wait');
      this.push('clear');

      subject._hpDrainPendingMessages = [];
    }

    _Window_BattleLog_displayAutoAffectedStatus.call(this, subject);
  };

  /**
   * displayBattlerStatus が呼ばれた直後に、pending リストに積まれたバトラーの状態変化も続けて表示する
   * ドレイン実行者の死亡によってステートが解除される、被付与者の解除メッセージを、
   * ドレイン実行者の受けるダメージ表示や、倒れるメッセージの後に出すための仕組み
   *
   * @param {Game_Battler} battler 表示対象のバトラー
   * @param {boolean} current true なら現在の状態も表示する
   */
  const _BattleManager_displayBattlerStatus = BattleManager.displayBattlerStatus;
  BattleManager.displayBattlerStatus = function(battler, current) {
    _BattleManager_displayBattlerStatus.call(this, battler, current);

    const recoveringBattlers = BattleManager._hpDrainPendingRecoveringBattlers;
    if (recoveringBattlers == null || recoveringBattlers.length === 0) {
      return;
    }

    // 再入防止のため、リストをクリアしてからループ開始
    BattleManager._hpDrainPendingRecoveringBattlers = [];
    for (const recoveringBattler of recoveringBattlers) {
      _BattleManager_displayBattlerStatus.call(this, recoveringBattler, false);
    }
  };

  /**
   * バトル終了時に独自プロパティをリセットする（ initMembers でやったことと内容は同じ）
   */
  const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
  Game_Battler.prototype.onBattleEnd = function() {
    _Game_Battler_onBattleEnd.call(this);

    this._hpDrainerInfo = {};
    this._hpDrainPendingMessages = [];
  };
})();
