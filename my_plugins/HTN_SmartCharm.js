// --------------------------------------------------------------------------
//
// HTN_SmartCharm.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/03/20 v1.0.0 First release
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc 魅了の状態異常時に、より適切な（？）行動をとるようにします (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins?tab=readme-ov-file#htn_smartcharm
 *
 * @param HealThreshold
 * @text 回復閾値(%)
 * @desc 敵陣に、このパーセンテージ以下のHPの相手がいる場合にHP回復スキルを使用します。
 * @default 60
 * @type number
 * @min 1
 * @max 99
 *
 * @param SelfAttackRate
 * @text 自傷確率(%)
 * @desc 攻撃対象として自分自身を選ぶ確率です。0%の場合、自分以外がいればそちらを攻撃します。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param AllowHeal
 * @text 回復スキルの許可
 * @desc 回復スキル（HP回復）を敵に使用するか（trueなら使用する）
 * @default true
 * @type boolean
 *
 * @param AllowMagic
 * @text 魔法スキルの許可
 * @desc 魔法スキル（スキルタイプ：魔法）を味方に使用するか（trueなら使用する）
 * @default true
 * @type boolean
 *
 * @param AllowSpecial
 * @text 必殺技スキルの許可
 * @desc 必殺技スキル（スキルタイプ：必殺技）を味方に使用するか（trueなら使用する）
 * @default true
 * @type boolean
 *
 * @param StunRate
 * @text 行動不能確率(%)
 * @desc 魅了時に何も行動しなくなる確率です。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param StunMessage
 * @text 行動不能時のメッセージ
 * @desc 行動しなかった際に表示するメッセージです。空欄にするとメッセージをスキップします。%1は行動者の名前に置き換わります。
 * @default %1は相手に見とれている。
 * @type string
 *
 * @param ActOnCharmTurn
 * @text 魅了されたターンの行動許可
 * @desc 魅了状態になったターンに手番が回ってきた際、行動をスキップせずに攻撃などを実行するか。
 * @default true
 * @type boolean
 *
 * @param CancelActionOnRecover
 * @text 回復ターンの行動キャンセル
 * @desc 攻撃を受けるなどで魅了状態から回復したターンに手番が回ってきた場合、何も行動しないようにするか。
 * @default true
 * @type boolean
 *
 * @param ShowStateMessageBeforeAction
 * @text 行動前に継続メッセージを表示
 * @desc ステートの継続メッセージを、攻撃などの行動の前に表示するか。（falseの場合、行動後に表示）
 * @default true
 * @type boolean
 *
 * @help
 * 【使い方】
 * このプラグインの挙動をさせたいステート（「魅了」などの状態異常）の「メモ」の欄に
 * <SmartCharm>
 * と記述してください。
 *
 * 【ステートごとの個別設定】
 * ステートの「メモ」に以下のように記述することで、プラグインパラメータの
 * 「回復閾値(%)」や「自傷確率(%)」などを、ステートごとに上書き設定できます。
 *
 * 設定項目一覧：
 * <SmartCharm> （※この記述は必須です）
 * <SmartCharm_HealThreshold: 80> （※回復閾値を80%に設定したい場合）
 * <SmartCharm_SelfAttackRate: 10> （※自傷確率を10%に設定したい場合）
 * <SmartCharm_AllowHeal: false> （※敵陣への回復スキルを許可しない場合）
 * <SmartCharm_AllowMagic: false> （※魔法スキルを許可しない場合）
 * <SmartCharm_AllowSpecial: false> （※必殺技を許可しない場合）
 * <SmartCharm_StunRate: 20> （※行動不能になる確率を20%に設定したい場合）
 * <SmartCharm_StunMessage: %1はぼーっとしている。> （※行動不能時のメッセージを変える場合）
 * <SmartCharm_ActOnCharmTurn: false> （※魅了が付与されたターンには攻撃などの行動を許可しない場合）
 * <SmartCharm_CancelActionOnRecover: false> （※回復ターンの行動キャンセルを無効にする場合）
 * <SmartCharm_ShowStateMessageBeforeAction: false> （※継続メッセージを攻撃などの行動後に表示する場合）
 *
 * 設定例：
 * 例えば、敵陣への回復スキルだけ禁止して、あとはデフォルト通りでいい場合は、
 * 以下の２つをステートの「メモ」に書きます。
 * <SmartCharm>
 * <SmartCharm_AllowHeal: false>
 *
 * 【行動パターンの解説】
 * <SmartCharm> が記されたステート（状態異常）になったとき、
 * 以下のような行動をとります。
 *
 * 1. 指定した「行動不能確率(%)」に応じてそのターンは行動不能となります。
 * 2. 敵側に、設定した閾値（デフォルトは60%）以下のHPを持つ対象がいれば、優先してHP回復スキルを使います。
 *    このとき、魅了を付与してきた相手の回復を最優先します。もしその相手が戦闘不能などで不在の場合は、
 *    同じ種類のモンスター（同IDの敵キャラ）を優先して回復しようとします。
 * 3. 攻撃する場合は、通常攻撃・魔法攻撃・必殺技の中から、一番威力の高い攻撃手段を選択して使用します。
 * 4. MP不足などで使えない場合は通常攻撃をおこないます。
 * 5. 自傷（自分を攻撃）する場合の回避確率は0%になっています。
 * 6. 「回復ターンの行動キャンセル」が有効な場合、行動前にダメージ等で魅了から回復したターンには行動しません。
 *
 * 注意：
 * もともとのスキルが「全体」対象の場合、自傷確率に関わらず全体攻撃になります。
 */

(() => {
  'use strict';

  const pluginName = "HTN_SmartCharm";
  const parameters = PluginManager.parameters(pluginName);
  const paramHealThreshold = Number(parameters['HealThreshold'] || 60);
  const paramSelfAttackRate = Number(parameters['SelfAttackRate'] || 0);
  const paramAllowHeal = String(parameters['AllowHeal']) !== 'false';
  const paramAllowMagic = String(parameters['AllowMagic']) !== 'false';
  const paramAllowSpecial = String(parameters['AllowSpecial']) !== 'false';
  const paramStunRate = Number(parameters['StunRate'] || 0);
  const paramStunMessage = String(parameters['StunMessage']);
  const paramActOnCharmTurn = String(parameters['ActOnCharmTurn']) === 'true';
  const paramCancelActionOnRecover = String(parameters['CancelActionOnRecover']) !== 'false';
  const paramShowStateMessageBeforeAction = String(parameters['ShowStateMessageBeforeAction']) !== 'false';

  const _Game_Action_setConfusion = Game_Action.prototype.setConfusion;
  Game_Action.prototype.setConfusion = function() {
    // デフォルトでは通常攻撃がセットされる
    _Game_Action_setConfusion.call(this);

    const subject = this.subject();

    // 現在かかっている状態異常のうち、ステートのメモ欄に <SmartCharm> の記述があるものを探す
    const smartCharmStates = subject.states().filter(state => state.meta.SmartCharm);

    if (smartCharmStates.length === 0) {
      this._smartCharmTarget = null;
      return;
    }

    // デフォルトパラメータから初期化
    let currentHealThreshold = paramHealThreshold;
    let currentSelfAttackRate = paramSelfAttackRate;
    let currentAllowHeal = paramAllowHeal;
    let currentAllowMagic = paramAllowMagic;
    let currentAllowSpecial = paramAllowSpecial;
    let currentStunRate = paramStunRate;
    let currentStunMessage = paramStunMessage;
    let currentCancelActionOnRecover = paramCancelActionOnRecover;
    let currentShowStateMessageBeforeAction = paramShowStateMessageBeforeAction;

    // <SmartCharm> の付いた状態異常に複数かかっている場合、「優先度」がもっとも高いステートのタグを採用
    const charmState = smartCharmStates[0];

    // 個別タグでの上書き
    if (charmState.meta.SmartCharm_HealThreshold !== undefined) {
      currentHealThreshold = Number(charmState.meta.SmartCharm_HealThreshold);
    }
    if (charmState.meta.SmartCharm_SelfAttackRate !== undefined) {
      currentSelfAttackRate = Number(charmState.meta.SmartCharm_SelfAttackRate);
    }
    if (charmState.meta.SmartCharm_AllowHeal !== undefined) {
      currentAllowHeal = String(charmState.meta.SmartCharm_AllowHeal).trim().toLowerCase() !== 'false';
    }
    if (charmState.meta.SmartCharm_AllowMagic !== undefined) {
      currentAllowMagic = String(charmState.meta.SmartCharm_AllowMagic).trim().toLowerCase() !== 'false';
    }
    if (charmState.meta.SmartCharm_AllowSpecial !== undefined) {
      currentAllowSpecial = String(charmState.meta.SmartCharm_AllowSpecial).trim().toLowerCase() !== 'false';
    }
    if (charmState.meta.SmartCharm_StunRate !== undefined) {
      currentStunRate = Number(charmState.meta.SmartCharm_StunRate);
    }
    if (charmState.meta.SmartCharm_StunMessage !== undefined) {
      currentStunMessage = String(charmState.meta.SmartCharm_StunMessage);
    }
    if (charmState.meta.SmartCharm_CancelActionOnRecover !== undefined) {
      currentCancelActionOnRecover = String(charmState.meta.SmartCharm_CancelActionOnRecover).trim().toLowerCase() !== 'false';
    }
    if (charmState.meta.SmartCharm_ShowStateMessageBeforeAction !== undefined) {
      currentShowStateMessageBeforeAction = String(charmState.meta.SmartCharm_ShowStateMessageBeforeAction).trim().toLowerCase() !== 'false';
    }

    // 個別タグでの上書きを再判定しないで済むよう、このActionに記憶
    this._smartCharmCancelOnRecover = currentCancelActionOnRecover;
    this._showSmartCharmStateMessageBeforeAction = currentShowStateMessageBeforeAction;

    // 行動不能(スタン)判定
    if (Math.random() * 100 < currentStunRate) {
      this.setAttack(); // ダミーのアクションをセット
      this._isSmartCharmStunned = true;
      this._smartCharmStunMessage = currentStunMessage;
      return;
    }

    const friends = subject.friendsUnit().aliveMembers();
    const opponents = subject.opponentsUnit().aliveMembers();

    // 回復は敵部隊へ、攻撃は味方部隊へ
    let targetUnitForHeal = opponents;
    let targetUnitForAttack = friends;

    // どのようなスキルを持っているかを取得 (MP不足や封印状態などを考慮)
    let allSkills = [];
    if (subject.isActor()) {
      allSkills = subject.skills();
    } else if (subject.isEnemy()) {
      // 敵キャラの場合
      allSkills = subject.enemy().actions
        .map(a => $dataSkills[a.skillId])
        .filter(s => !!s);
    }

    // 使用可能なスキル一覧を取得
    const usableSkills = allSkills.filter(skill => {
      if (!subject.canUse(skill)) return false;

      // 魔法スキルの判定（スキルタイプが1）
      const isMagic = skill.stypeId === 1;
      // 必殺技スキルの判定（スキルタイプが2）
      const isSpecial = skill.stypeId === 2;

      if (!currentAllowMagic && isMagic) return false;
      if (!currentAllowSpecial && isSpecial) return false;

      return true;
    });

    // 通常攻撃も候補に入れる
    const attackSkill = $dataSkills[subject.attackSkillId()];
    if (attackSkill && subject.canUse(attackSkill) && !usableSkills.includes(attackSkill)) {
      usableSkills.push(attackSkill);
    }

    let decidedSkill = null;
    let decidedTarget = null;

    // 1. HP回復スキルの判定
    let targetNeedHeal = null;

    if (currentAllowHeal) {
      // 回復が必要なメンバーを抽出
      const healThresholdRatio = currentHealThreshold / 100;
      let targetsNeedingHeal = targetUnitForHeal.filter(member =>
        member.hp <= member.mhp * healThresholdRatio
      );

      if (targetsNeedingHeal.length > 0) {
        // HPの残りパーセンテージが低い順に並び替え
        targetsNeedingHeal.sort((a, b) => (a.hp / a.mhp) - (b.hp / b.mhp));

        // 魅了を付与してきた相手（または同種のモンスター）の条件定義
        const inflicter = subject._smartCharmInflicter;
        let isPriorityTarget = (member) => false;

        if (inflicter) {
          if (inflicter.isAlive() && targetUnitForHeal.includes(inflicter)) {
            isPriorityTarget = (member) => member === inflicter;
          } else if (inflicter.isEnemy()) { // 魅了付与者がモンスターの場合
            // 本人がいない場合、同種のモンスターを探す条件
            isPriorityTarget = (member) => member.isEnemy() && member.enemyId() === inflicter.enemyId();
          }
        }

        // 優先対象がいれば選ぶ、いなければ最もHP割合が低い者を選ぶ
        targetNeedHeal = targetsNeedingHeal.find(isPriorityTarget) || targetsNeedingHeal[0];
      }

      if (targetNeedHeal) {
        // HP回復スキル (damage.type === 3) を探す
        const healSkills = usableSkills.filter(s => s.damage && s.damage.type === 3);
        if (healSkills.length > 0) {
          let bestHealScore = 0;
          let bestSkill = null;

          for (const skill of healSkills) {
            this.setSkill(skill.id);
            const rawVal = this.evalDamageFormula(targetNeedHeal); // 回復量に応じたマイナスの値

            if (rawVal < bestHealScore) {
              bestHealScore = rawVal;
              bestSkill = skill;
            }
          }

          if (bestSkill) {
            decidedSkill = bestSkill;
            decidedTarget = targetNeedHeal;
          }
        }
      }
    }

    // 2. 攻撃対象の決定処理 (自傷確率の考慮)
    let decidedTargetForAttack = null;
    if (targetUnitForAttack.length > 0) {
      const otherTargets = targetUnitForAttack.filter(m => m !== subject);

      if (otherTargets.length === 0) {
        // 自分しかいない場合
        decidedTargetForAttack = targetUnitForAttack[0];
      } else {
        const canAttackSelf = targetUnitForAttack.includes(subject);
        if (canAttackSelf && (Math.random() * 100) < currentSelfAttackRate) {
          decidedTargetForAttack = subject;
        } else {
          decidedTargetForAttack = otherTargets[Math.randomInt(otherTargets.length)];
        }
      }
    }

    // 3. 攻撃・魔法攻撃・必殺技 スキルの判定
    if (!decidedSkill && decidedTargetForAttack) {
      // HPダメージスキル (damage.type === 1: HPダメージ) を探す
      const atkSkills = usableSkills.filter(s => s.damage && s.damage.type === 1);

      let bestAtkScore = -1;
      let bestSkill = null;

      for (const skill of atkSkills) {
        this.setSkill(skill.id);
        // hitType: 0(必中), 1(物理), 2(魔法) に関係なく、「必殺技」もここで拾われます。
        // ダメージ計算をおこない、最も威力が大きなものを選ぶ
        const rawVal = this.evalDamageFormula(decidedTargetForAttack);
        if (rawVal > bestAtkScore) {
          bestAtkScore = rawVal;
          bestSkill = skill;
        }
      }

      if (bestSkill) {
        decidedSkill = bestSkill;
        decidedTarget = decidedTargetForAttack;
      }
    }

    // 決定したスキルとターゲットをセット (見つからなければ通常攻撃のまま)
    if (decidedSkill) {
      this.setSkill(decidedSkill.id);
      this._smartCharmTarget = decidedTarget;
    } else {
      this.setAttack();

      if (decidedTargetForAttack) {
        this._smartCharmTarget = decidedTargetForAttack;
      } else {
        this._smartCharmTarget = null;
      }
    }
  };

  /**
   * 攻撃対象について _smartCharmTarget で指定があれば、それを利用するよう早期return
   */
  const _Game_Action_confusionTarget = Game_Action.prototype.confusionTarget;
  Game_Action.prototype.confusionTarget = function() {
    if (this._smartCharmTarget) {
      return this._smartCharmTarget;
    }

    return _Game_Action_confusionTarget.apply(this, arguments);
  };

  /**
   * スキルの対象範囲(全体など)を混乱時にも適用する
   */
  const _Game_Action_makeTargets = Game_Action.prototype.makeTargets;
  Game_Action.prototype.makeTargets = function() {
    if (!this._forcing && this.subject().isConfused() && this._smartCharmTarget) {
      let targets = [];

      // スキルが全体対象の場合、ターゲットが属しているユニットの生存者全体を対象にする
      if (this.isForAll()) {
        const unit = this._smartCharmTarget.friendsUnit();
        targets = unit.aliveMembers();
      } else {
        targets.push(this.confusionTarget());
      }

      return this.repeatTargets(targets);
    }

    return _Game_Action_makeTargets.apply(this, arguments);
  };

  /**
   * 魅了を誰が付与したかを記憶する
   */
  const _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function(target) {
    const wasCharmed = target.states().some(s => s.meta.SmartCharm);

    _Game_Action_apply.call(this, target);

    const isCharmedNow = target.states().some(s => s.meta.SmartCharm);
    if (!wasCharmed && isCharmedNow) { // すでに魅了されてはおらず、新たに魅了された場合
      const subject = this.subject();
      let inflicter = subject;

      // 魅了を付与した者がすでに魅了されている場合、その「元凶」を引き継ぐ
      // （自陣を攻撃したときに魅了付与が起きた場合を想定）
      if (subject.states().some(s => s.meta.SmartCharm) && subject._smartCharmInflicter) {
        inflicter = subject._smartCharmInflicter;
      }

      target._smartCharmInflicter = inflicter;
    }
  };

  /**
   * 自傷時に回避を発生させない
   */
  const _Game_Action_itemEva = Game_Action.prototype.itemEva;
  Game_Action.prototype.itemEva = function(target) {
    if (this.subject() === target && this.subject().states().some(s => s.meta.SmartCharm)) {
      return 0; // 自傷時は回避率0%
    }

    return _Game_Action_itemEva.call(this, target);
  };

  /**
   * 魅了が解除されたときに、誰から魅了されたかの情報を消去
   */
  const _Game_Battler_removeState = Game_Battler.prototype.removeState;
  Game_Battler.prototype.removeState = function(stateId) {
    _Game_Battler_removeState.call(this, stateId);

    if (!this.states().some(s => s.meta.SmartCharm)) {
      this._smartCharmInflicter = null;
    }
  };

  /**
   * 魅了状態になったターンの行動制御 (ActOnCharmTurn)
   *
   * ActOnCharmTurn が true のとき:
   * - ターン制バトルでは、魅了されたターンに行動をスキップせず、 makeActions() を呼ぶことで行動させる
   * - タイムプログレスバトル（TPB）では clearTpbChargeTime() が呼ばれる前のゲージを保存・復元する
   * - makeTpbActions() は呼ばず、ゲージが満タンになったときの自然なフロー
   *   (finishTpbCharge → startTpbTurn → makeTpbActions) に任せる
   */
  const _Game_Battler_onRestrict = Game_Battler.prototype.onRestrict;
  Game_Battler.prototype.onRestrict = function() {
    // TPBのとき、clearTpbChargeTime() によるゲージリセットに備えて現在のゲージ量を保存する
    const savedTpbChargeTime = BattleManager.isTpb() ? this._tpbChargeTime : null;

    _Game_Battler_onRestrict.call(this); // この中で clearTpbChargeTime() や clearActions() が呼ばれる

    // <SmartCharm> の付いた状態異常にかかっているか
    const smartCharmStates = this.states().filter(s => s.meta.SmartCharm);
    if (smartCharmStates.length === 0) return;

    if (!this.canMove()) return; // 「行動制約：行動できない」などで行動できないなら早期return

    // <SmartCharm> の付いた状態異常に複数かかっている場合、「優先度」がもっとも高いステートのタグを採用
    let actOnCharmTurn = paramActOnCharmTurn;
    if (smartCharmStates[0].meta.SmartCharm_ActOnCharmTurn !== undefined) {
      actOnCharmTurn = String(smartCharmStates[0].meta.SmartCharm_ActOnCharmTurn).trim().toLowerCase() === 'true';
    }

    if (actOnCharmTurn) {
      if (BattleManager.isTpb()) {
        this._tpbChargeTime = savedTpbChargeTime; // ゲージをリセットしない
      } else {
        this.makeActions(); // clearActions() を打ち消し行動させる
      }
    }
  };

  /**
   * 行動不能判定が出ている場合、アクションをスキップしメッセージを表示する
   */
  const _BattleManager_startAction = BattleManager.startAction;
  BattleManager.startAction = function() {
    const subject = this._subject;
    const action = subject.currentAction();

    // 魅了中の継続メッセージを行動前に表示。 displayBattlerStatus 側で本来は表示されるもの
    if (action && action._showSmartCharmStateMessageBeforeAction && subject.states().some(s => s.meta.SmartCharm)) {
      this._logWindow.displayCurrentState(subject);
      subject._shownSmartCharmStateMessageBeforeAction = true;
    }

    // 魅了から回復したターンの行動キャンセル処理
    if (action && action._smartCharmCancelOnRecover && !subject.states().some(s => s.meta.SmartCharm)) {
      // Actionフェーズへの移行処理だけおこない、ターゲットを空にして実質的にスキップする
      this._phase = "action";
      this._action = action;
      this._targets = [];
      subject.cancelMotionRefresh();
      return;
    }

    if (action && action._isSmartCharmStunned) {
      const stunMessage = action._smartCharmStunMessage;
      if (stunMessage) {
        this._logWindow.push("addText", stunMessage.format(subject.name()).trim());
        this._logWindow.push("wait"); // メッセージを読ませるためのウェイト
        this._logWindow.push("clear");
      }

      // Actionフェーズへの移行処理だけおこない、ターゲットを空にしてスキップする
      this._phase = "action";
      this._action = action;
      this._targets = [];
      subject.cancelMotionRefresh();

      return;
    }

    _BattleManager_startAction.call(this);
  };

  /**
   * 行動前に継続メッセージを表示済みの場合、ターン終了時の重複表示を抑制する
   */
  const _BattleManager_displayBattlerStatus = BattleManager.displayBattlerStatus;
  BattleManager.displayBattlerStatus = function(battler, current) {
    // displayCurrentState() 以外の表示をおこない早期returnする
    if (current && battler._shownSmartCharmStateMessageBeforeAction) {
      this._logWindow.displayAutoAffectedStatus(battler);
      this._logWindow.displayRegeneration(battler);
      battler._shownSmartCharmStateMessageBeforeAction = false;
      return;
    }

    _BattleManager_displayBattlerStatus.call(this, battler, current);
  };
})();
