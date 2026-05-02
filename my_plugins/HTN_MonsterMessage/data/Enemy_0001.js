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
      messages.push('ラララ〜♪\nだんだんと考えられなくなってきましたね？');
    } else {
      messages.push('混乱しましょうね〜');
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
      messages.push('だんだん眠くなってくるでしょう？');
    }
  }

  // デフォルトメッセージ
  if (messages.pending.length === 0) {
    messages.push('いきますわ！');
  }

  messages.flush();
});

// 攻撃後のセリフ
HTN_MonsterMessage.registerAfterAttack(ENEMY_ID, ({ skill, subject, target, messages }) => {
  if (skill.name === '混乱の歌') {
    if (targetBeforeAttackStateIds.includes(S.CONFUSION) && !target?.isStateAffected(S.CHARM)) {
      messages.push('あら〜？\n混乱が深くなったら目がトロンとしてきちゃいましたね〜');
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
