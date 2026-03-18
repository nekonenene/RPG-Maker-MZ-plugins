// --------------------------------------------------------------------------
//
// HTN_SmartCharm.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// --------------------------------------------------------------------------

/*:
 * @plugindesc 魅了の状態異常時に、より適切な（？）行動をとるようにします。
 * @target MZ
 * @author ハトネコエ - https://hato-neko.x0.com
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
 * @default %1は魅了されて体に力が入らない。
 * @type string
 *
 * @help HTN_SmartCharm.js
 *
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
 * <SmartCharm_StunRate: 20> （※行動不能になる確率を20%に設定したい場合）
 * <SmartCharm_StunMessage: %1はぼーっとしている。> （※行動不能時のメッセージを変える場合）
 * <SmartCharm_AllowHeal: false> （※敵陣への回復スキルを許可しない場合）
 * <SmartCharm_AllowMagic: false> （※魔法スキルを許可しない場合）
 * <SmartCharm_AllowSpecial: false> （※必殺技を許可しない場合）
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
 * 1. 指定した「行動不能確率(%)」を満たした場合、行動をキャンセルして専用メッセージを表示します。
 * 2. 通常攻撃・魔法攻撃・必殺技を含む、一番威力の高い攻撃手段を選択して使用します。
 * 3. 敵側に、設定した閾値（デフォルト60%）以下のHPを持つ対象がいれば、優先してHP回復スキルを使います。
 *    このとき、魅了を付与してきた相手の回復を最優先します。もしその相手が戦闘不能などで不在の場合は、
 *    同じ種類のモンスター（同IDの敵キャラ）を優先して回復しようとします。
 * 4. 該当のスキルがない、またはMP不足などで使えない場合は通常攻撃をおこないます。
 * 5. 自傷（自分を攻撃）する場合の回避確率は0%になっています。
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

    // <SmartCharm> の付いた状態異常に複数かかっている場合、「優先度」がもっとも高いステートのタグを採用
    const charmState = smartCharmStates[0];

    // 個別タグでの上書き
    if (charmState.meta.SmartCharm_HealThreshold !== undefined) {
      currentHealThreshold = Number(charmState.meta.SmartCharm_HealThreshold);
    }
    if (charmState.meta.SmartCharm_SelfAttackRate !== undefined) {
      currentSelfAttackRate = Number(charmState.meta.SmartCharm_SelfAttackRate);
    }
    if (charmState.meta.SmartCharm_StunRate !== undefined) {
      currentStunRate = Number(charmState.meta.SmartCharm_StunRate);
    }
    if (charmState.meta.SmartCharm_StunMessage !== undefined) {
      currentStunMessage = String(charmState.meta.SmartCharm_StunMessage);
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
   * _smartCharmTarget の指定があれば、それを利用するよう上書き
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
   * 行動不能判定が出ている場合、アクションをスキップしメッセージを表示する
   */
  const _BattleManager_startAction = BattleManager.startAction;
  BattleManager.startAction = function() {
    const subject = this._subject;
    const action = subject.currentAction();

    if (action && action._isSmartCharmStunned) {
      // 行動不能メッセージのあとに状態異常の継続メッセージが出てしまうので違和感を生む時があるが、
      // もともとの魅了や混乱の挙動が「アクション」→「状態異常継続メッセージ」の順なので許容。
      // commit ID: f53d44b2a65f0272 のときに逆順になる実装も検討したが、一貫性がなくなるので不採用。
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
})();
