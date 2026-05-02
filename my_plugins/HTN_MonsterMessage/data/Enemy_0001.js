'use strict';

const ENEMY_ID = 1;
let targetBeforeAttackStateIds = [];

// 攻撃前のセリフ
HTN_MonsterMessage.registerBeforeAttack(ENEMY_ID, ({ skill, subject, _targets, target, messages }) => {
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

    if (target?.isStateAffected(32)) {
      messages.push('あら、もう混乱してる？');
    }
  }

  if (skill.name === '誘惑の歌') {
    if (target?.isStateAffected(33)) {
      messages.push('もっとわたくしに夢中になって♥');
    } else {
      messages.push('あなたはわたくしの虜になるのです♥');
    }
  }

  if (skill.name === '子守唄') {
    if (target?.isStateAffected(34)) {
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
HTN_MonsterMessage.registerAfterAttack(ENEMY_ID, ({ skill, subject, _targets, target, messages }) => {
  if (skill.name === '混乱の歌') {
    if (targetBeforeAttackStateIds.includes(32) && !target?.isStateAffected(33)) {
      messages.push('あら〜？\n混乱が深くなったら誘惑されちゃいました？');
      messages.flush();

      messages.name = '';
      messages.push(`${target.name()}の混乱は魅了に変化した！`);
      messages.flush();

      target.addState(33);
      target.removeState(32);
    }
  }

  if (skill.name === '誘惑の歌') {
    if (target?.isStateAffected(33)) {
      messages.push('うっとりとした素敵な表情になりましたね♥\nかわいい♥');
    }
  }

  messages.flush();
});
