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
 * @desc 該当ターゲットのHPがこのパーセンテージ以下の場合、HP回復スキルを使用します。
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
 * @help HTN_SmartCharm.js
 *
 * 【使い方】
 * このプラグインの挙動をさせたいステート（「魅了」などの状態異常）のメモ欄に
 * <SmartCharm>
 * と記述してください。
 *
 * 【ステートごとの個別設定】
 * メモ欄に以下のように記述することで、プラグインパラメータの「回復閾値(%)」や
 * 「自傷確率(%)」をステートごとに上書き設定できます。
 *
 * 設定例：
 * <SmartCharm>
 * <SmartCharm_HealThreshold: 80>
 * <SmartCharm_SelfAttackRate: 10>
 * <SmartCharm_Heal: false>
 * <SmartCharm_Magic: true>
 * <SmartCharm_Special: true>
 *
 * <SmartCharm> が記されたステート（状態異常）になったとき、
 * 以下のような行動をとります。
 *
 * 1. 通常攻撃・魔法攻撃・必殺技を含む、一番威力の高い攻撃手段を選択して使用します。
 * 2. 敵側に、設定した閾値（デフォルト60%）以下のHPを持つ対象がいれば、優先してHP回復スキルを使います。
 *    このとき、魅了を付与してきた相手の回復を最優先します。もしその相手が戦闘不能などで不在の場合は、
 *    同じ種類のモンスター（同IDの敵キャラ）を優先して回復しようとします。
 * 3. 該当のスキルがない、またはMP不足などで使えない場合は通常攻撃をおこないます。
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

    // <SmartCharm> の付いた状態異常に複数かかっている場合、「優先度」がもっとも高いステートのタグを採用
    const charmState = smartCharmStates[0];

    // 個別タグでの上書き
    if (charmState.meta.SmartCharm_HealThreshold !== undefined) {
      currentHealThreshold = Number(charmState.meta.SmartCharm_HealThreshold);
    }
    if (charmState.meta.SmartCharm_SelfAttackRate !== undefined) {
      currentSelfAttackRate = Number(charmState.meta.SmartCharm_SelfAttackRate);
    }
    if (charmState.meta.SmartCharm_Heal !== undefined) {
      currentAllowHeal = String(charmState.meta.SmartCharm_Heal).trim().toLowerCase() !== 'false';
    }
    if (charmState.meta.SmartCharm_Magic !== undefined) {
      currentAllowMagic = String(charmState.meta.SmartCharm_Magic).trim().toLowerCase() !== 'false';
    }
    if (charmState.meta.SmartCharm_Special !== undefined) {
      currentAllowSpecial = String(charmState.meta.SmartCharm_Special).trim().toLowerCase() !== 'false';
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
   * スマートアクション用のターゲット指定があれば、それを利用する
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
   * 魅了を付与した相手を記憶する
   */
  const _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function(target) {
    const wasCharmed = target.states().some(s => s.meta.SmartCharm);

    _Game_Action_apply.call(this, target);

    const isCharmedNow = target.states().some(s => s.meta.SmartCharm);
    if (!wasCharmed && isCharmedNow) {
      target._smartCharmInflicter = this.subject();
    }
  };

  /**
   * 魅了が解除されたら記憶を消去する
   */
  const _Game_Battler_removeState = Game_Battler.prototype.removeState;
  Game_Battler.prototype.removeState = function(stateId) {
    _Game_Battler_removeState.call(this, stateId);

    if (!this.states().some(s => s.meta.SmartCharm)) {
      this._smartCharmInflicter = null;
    }
  };

})();
