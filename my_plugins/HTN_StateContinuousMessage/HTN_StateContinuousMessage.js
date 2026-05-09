// --------------------------------------------------------------------------
//
// HTN_StateContinuousMessage.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/05/09 v1.0.0 First release
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc Allows you to set a custom message for when a state is reapplied to a battler who already has it. (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_StateContinuousMessage
 *
 * @help
 * By default in RPG Maker MZ, when a state is applied to a battler who
 * already has that state, the normal state application message is shown
 * (e.g., "%1 fell asleep!" even though they are already asleep).
 *
 * This plugin allows you to set a custom message for this "reapply" case
 * via note tags in the state's memo field.
 *
 * === Note Tags (in State's Memo field) ===
 *
 * <StateContinuousMessage_Actor: message>
 *   Message shown when a state is reapplied to an already-affected actor.
 *   Use %1 to embed the target's name.
 *
 * <StateContinuousMessage_Enemy: message>
 *   Message shown when a state is reapplied to an already-affected enemy.
 *   Use %1 to embed the target's name.
 *
 * <StateContinuousMessage_Common: message>
 *   Message shown for both actors and enemies.
 *   Overridden by _Actor or _Enemy tags if also present.
 *
 * If the tag is present but empty (e.g., <StateContinuousMessage_Common: >),
 * no message is displayed.
 *
 * === Examples ===
 *
 * To show "%1 is already asleep!" for both actors and enemies on reapply:
 * <StateContinuousMessage_Common: %1 is already asleep!>
 *
 * To set different messages for actors and enemies:
 * <StateContinuousMessage_Actor: %1 is already asleep!>
 * <StateContinuousMessage_Enemy: %1 is already asleep!>
 *
 * To show no message on reapply:
 * <StateContinuousMessage_Common: >
 */

/*:ja
 * @target MZ
 * @plugindesc すでにかかっているステートが再付与されたときのメッセージを設定 (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_StateContinuousMessage
 *
 * @help
 * RPGツクールMZのデフォルトでは、すでにステートがかかっている対象に
 * 再度同じステートを付与しようとしたとき、通常のステート付与メッセージ
 * （例：「%1は眠った！」）がそのまま表示されてしまいます。
 *
 * このプラグインでは、ステートのメモ欄にタグを記述することで、
 * このような「再付与時」のメッセージを個別に設定できます。
 *
 * === メモ欄のタグ ===
 *
 * <StateContinuousMessage_Actor: メッセージ>
 *   すでにそのステートにかかっているアクターへの再付与時に表示するメッセージ。
 *   %1 と書くと対象者の名前に置換されます。
 *
 * <StateContinuousMessage_Enemy: メッセージ>
 *   すでにそのステートにかかっている敵キャラへの再付与時に表示するメッセージ。
 *   %1 と書くと対象者の名前に置換されます。
 *
 * <StateContinuousMessage_Common: メッセージ>
 *   アクター・敵キャラ共通の再付与時メッセージ。
 *   _Actor や _Enemy タグが同時に記述されている場合、そちらが優先されます。
 *
 * タグが記述されていて内容が空（例：<StateContinuousMessage_Common: >）の場合は、
 * 再付与時のメッセージが表示されなくなります。
 *
 * === 記述例 ===
 *
 * 敵味方関係なく、再付与時に「%1はすでに眠っている！」と表示したい場合：
 * <StateContinuousMessage_Common: %1はすでに眠っている！>
 *
 * 味方と敵で別々のメッセージを設定したい場合：
 * <StateContinuousMessage_Actor: %1はすでに眠っている！>
 * <StateContinuousMessage_Enemy: すでに%1を眠らせている！>
 *
 * 再付与時のメッセージを表示しないようにする場合：
 * <StateContinuousMessage_Common: >
 */

(() => {
  'use strict';

  /**
   * ステートの再付与時メッセージをメモ欄タグから取得する
   *
   * @param {Object} state ステートデータ
   * @param {boolean} isActor 対象がアクターかどうか
   * @returns {string|null} メッセージ文字列、タグなしの場合は null
   */
  const parseContinuousMessage = (state, isActor) => {
    const specificKey = isActor ? 'StateContinuousMessage_Actor' : 'StateContinuousMessage_Enemy';

    if (state.meta[specificKey] != null) {
      return String(state.meta[specificKey]).trim();
    }

    if (state.meta.StateContinuousMessage_Common != null) {
      return String(state.meta.StateContinuousMessage_Common).trim();
    }

    return null;
  };

  /**
   * 結果をクリアする際に stateContinuousMessage_StateIds も初期化する
   *
   * @returns {void}
   */
  const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    _Game_ActionResult_clear.call(this);

    this.stateContinuousMessage_StateIds = [];
  };

  /**
   * ステート付与前にすでにそのステートを持っているか確認し、
   * 持っている場合は継続状態として記録する
   *
   * @param {number} stateId ステートID
   * @returns {void}
   */
  const _Game_Battler_addState = Game_Battler.prototype.addState;
  Game_Battler.prototype.addState = function(stateId) {
    const alreadyAffected = this.isStateAffected(stateId);

    _Game_Battler_addState.call(this, stateId);

    if (alreadyAffected && this.isStateAddable(stateId)) {
      if (!this._result.stateContinuousMessage_StateIds.includes(stateId)) {
        this._result.stateContinuousMessage_StateIds.push(stateId);
      }
    }
  };

  /**
   * 付与されたステートのメッセージを表示する
   * 再付与時はメモ欄タグのメッセージを使用する
   *
   * @param {Game_Battler} target 対象バトラー
   * @returns {void}
   */
  const _Window_BattleLog_displayAddedStates = Window_BattleLog.prototype.displayAddedStates;
  Window_BattleLog.prototype.displayAddedStates = function(target) {
    const result = target.result();
    const continuousStateIds = result.stateContinuousMessage_StateIds;

    // 付与されたステートの中から、継続中のステートは除いた上で本来の処理を実行
    const allAddedStates = result.addedStates;
    result.addedStates = allAddedStates.filter(id => !continuousStateIds.includes(id));

    _Window_BattleLog_displayAddedStates.call(this, target);

    result.addedStates = allAddedStates;

    // 継続中のステートはカスタムメッセージを表示
    for (const stateId of allAddedStates.filter(id => continuousStateIds.includes(id))) {
      const state = $dataStates[stateId];

      if (stateId === target.deathStateId()) {
        this.push('performCollapse', target);
      }

      const msg = parseContinuousMessage(state, target.isActor());
      const stateText = msg !== null ? msg : (target.isActor() ? state.message1 : state.message2);

      if (stateText) {
        this.push('popBaseLine');
        this.push('pushBaseLine');
        this.push('addText', stateText.format(target.name()));
        this.push('waitForEffect');
      }
    }
  };
})();
