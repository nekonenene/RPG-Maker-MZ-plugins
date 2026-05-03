'use strict';

const ENEMY_ID = 1;
const S  = HTN_MonsterMessage.STATE;
const GV = HTN_MonsterMessage.GAME_VARIABLE;
let targetBeforeAttackStateIds = [];

// 遭遇時のセリフ
HTN_MonsterMessage.registerEncountering(ENEMY_ID, ({ subject, target, messages, callCommonEvent }) => {
  const metCount = $gameVariables.value(GV.MET_ENEMY_0001);

  if (metCount === 0) {
    messages.push('あら、はじめまして');
  } else {
    messages.push('またお会いできて光栄ですわ♥');
  }

  $gameVariables.setValue(GV.MET_ENEMY_0001, metCount + 1);
});

// 攻撃前のセリフ
HTN_MonsterMessage.registerBeforeAttack(ENEMY_ID, ({ skill, subject, target, messages, callCommonEvent, overwriteNextAction }) => {
  const rand = Math.random();
  targetBeforeAttackStateIds = target ? target.states().map(state => state.id) : [];

  if (skill.name === '混乱の歌') {
    if (rand < 0.3) {
      messages.push('頭の中をカラッポにいたしましょう？');
    } else if (rand < 0.6) {
      messages.push('嫌なことも全部忘れる歌ですわ♥');
    } else {
      messages.push('混乱に身を委ねましょう');
    }

    if (target?.isStateAffected(S.CONFUSION)) {
      messages.push('あら、もう混乱してる？');
    }
  }

  if (skill.name === '誘惑の歌') {
    if (target?.isStateAffected(S.CHARM)) {
      messages.push('もっとわたくしに夢中になって♥');
    } else {
      messages.push('あなたはわたくしの虜になるのです♥');
    }
  }

  if (skill.name === '子守唄') {
    if (target?.isStateAffected(S.SLEEP)) {
      messages.push('ふふふ、かわいらしい寝顔ですね♥\nこのままずっと眠っていてもいいのですよ？');
    } else {
      messages.push('お疲れを癒やして差し上げますわ♥');
    }
  }

  if (skill.name === '攻撃') {
    if (target?.isStateAffected(S.SLEEP) && rand < 0.1) {
      messages.push('眠っているところに攻撃してはかわいそうね。\n歌って差し上げますわ♥');
      overwriteNextAction('誘惑の歌');
    } else {
      messages.push('いきますわ！');
    }
  }
});

// 攻撃後のセリフ
HTN_MonsterMessage.registerAfterAttack(ENEMY_ID, ({ skill, subject, target, messages, callCommonEvent, comboCount, addComboAttack }) => {
  const rand = Math.random();

  if (target.hp <= 0) {
    messages.push('お疲れですか？\nでは、ゆっくりお休みください……♥');

    messages.name = '';
    messages.push(`${subject.name()}は${target.name()}に顔を近付け、\nにこやかと見つめている`);
    messages.name = subject.name();
    return;
  }

  if (skill.name === '混乱の歌') {
    if (target.result().isStateAdded(S.CONFUSION)) {
      if (targetBeforeAttackStateIds.includes(S.CONFUSION) && !target?.isStateAffected(S.CHARM)) {
        messages.push('混乱が深くなったら目がトロンとしてきちゃいましたね〜');

        messages.name = '';
        messages.push(`${target.name()}の混乱は魅了に変化した！`);
        messages.name = subject.name();

        target.addState(S.CHARM);
        target.removeState(S.CONFUSION);
      }
    }
  }

  if (skill.name === '誘惑の歌') {
    // スキルに成功したか
    // MEMO: 失敗時でも target.result().isHit() は true, target.result().missed は false になることを確認済み
    if (target.result().success) {
      if (!targetBeforeAttackStateIds.includes(S.CHARM) && target?.isStateAffected(S.CHARM)) {
        messages.push('うっとりとした素敵な表情になりましたね♥\nかわいい♥');
      }
    } else {
      if (!target?.isStateAffected(S.CHARM)) {
        messages.push('そんな……我慢なさらなくとも……');
      }
    }
  }

  if (skill.name === '往復ビンタ') {
    if (targetBeforeAttackStateIds.includes(S.SLEEP) && !target?.isStateAffected(S.SLEEP)) {
      messages.push('おはようございます♥\n寝起きの顔もかわいらしいですね♥');
    }
  }

  // 眠り続けているとき、往復ビンタを低い確率で開始
  if (targetBeforeAttackStateIds.includes(S.SLEEP) && target?.isStateAffected(S.SLEEP)) {
    if (comboCount === 0 && rand < 0.4) {
      messages.push('かわいらしい寝顔ですが、\nそろそろ起こしてあげたほうがいいかしら？');
      addComboAttack('往復ビンタ');
    } else if (skill.name === '往復ビンタ' && comboCount > 0) {
      if (comboCount < 5) { // 最大5回まで
        messages.push('まだ眠ってるんですか？\nお寝坊さんですね〜\nもう１回しちゃいますよ？');
        addComboAttack('往復ビンタ');
      } else {
        messages.push('もう！\nこんなに起きないなんて、もう知りませんからね！');
      }
    }
  }
});
