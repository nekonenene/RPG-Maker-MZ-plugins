'use strict';

const ENEMY_ID = 1;
const S  = HTN_MonsterMessage.STATE;
const GV = HTN_MonsterMessage.GAME_VARIABLES;
let targetBeforeAttackStateIds = [];

// 遭遇時のセリフ
HTN_MonsterMessage.registerEncountering(ENEMY_ID, ({ subject, target, messages }) => {
  const metCount = $gameVariables.value(GV.MET_ENEMY_0001);

  if (metCount === 0) {
    messages.push('あら、はじめまして');
  } else {
    messages.push('またお会いできて光栄ですわ♥');
  }

  $gameVariables.setValue(GV.MET_ENEMY_0001, metCount + 1);

  messages.flush();
});

// 攻撃前のセリフ
HTN_MonsterMessage.registerBeforeAttack(ENEMY_ID, ({ skill, subject, target, messages }) => {
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
      messages.push('お疲れを癒して差し上げますわ♥');
    }
  }

  if (skill.name === '攻撃') {
    messages.push('いきますわ！');
  }

  messages.flush();
});

// 攻撃後のセリフ
HTN_MonsterMessage.registerAfterAttack(ENEMY_ID, ({ skill, subject, target, messages, comboCount }) => {
  const rand = Math.random();

  // 眠り続けているとき、往復ビンタを低い確率で開始
  if (targetBeforeAttackStateIds.includes(S.SLEEP) && target?.isStateAffected(S.SLEEP)) {
    if (comboCount === 0 && rand < 0.5) {
      messages.push('かわいらしい寝顔ですが、\nそろそろ起こしてあげたほうがいいかしら？');
      messages.flush();

      messages.addComboAttack('往復ビンタ');
      return;
    } else if (skill.name === '往復ビンタ' && comboCount > 0 && comboCount < 5) {
      messages.push('まだ眠ってるんですか？\nお寝坊さんですね〜\nもう１回しちゃいますよ？');
      messages.flush();

      messages.addComboAttack('往復ビンタ');
      return;
    }
  }

  if (skill.name === '往復ビンタ' && !target?.isStateAffected(S.SLEEP)) {
    messages.push('おはようございます♥\n寝起きの顔もかわいらしいですね♥');
    messages.flush();
  }

  if (skill.name === '混乱の歌') {
    if (targetBeforeAttackStateIds.includes(S.CONFUSION) && !target?.isStateAffected(S.CHARM)) {
      messages.push('混乱が深くなったら目がトロンとしてきちゃいましたね〜');
      messages.flush();

      messages.name = '';
      messages.push(`${target.name()}の混乱は魅了に変化した！`);
      messages.flush();

      target.addState(S.CHARM);
      target.removeState(S.CONFUSION);
    }
  }

  if (skill.name === '誘惑の歌') {
    if (target?.isStateAffected(S.CHARM)) {
      messages.push('うっとりとした素敵な表情になりましたね♥\nかわいい♥');
    }
  }

  messages.flush();
});
