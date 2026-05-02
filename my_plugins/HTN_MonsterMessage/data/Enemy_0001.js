// --------------------------------------------------------------------------
//
// HTN_MonsterMessage - エネミーID:1 のセリフデータ
//
// Copyright (c) 2026 hatonekoe
//
// --------------------------------------------------------------------------

'use strict';

HTN_MonsterMessage.register(1, ({ skill, subject, _targets, actor, messages }) => {
  const rand = Math.random();

  if (skill.name === '混乱の歌') {
    if (rand < 0.3) {
      messages.push('頭の中をカラッポにいたしましょう？');
    } else if (rand < 0.6) {
      messages.push('ラララ〜♪\nだんだんと考えられなくなってきましたね？');
    } else {
      messages.push('混乱しましょうね〜');
    }

    if (actor?.isStateAffected(32)) {
      messages.push('あら、もう混乱してる？');
    }
  }

  if (skill.name === '誘惑の歌') {
    if (actor?.isStateAffected(33)) {
      messages.push('もっとわたくしに夢中になって♥');
    } else {
      messages.push('あなたはわたくしの虜になるのです♥');
    }
  }

  if (skill.name === '子守唄') {
    if (actor?.isStateAffected(34)) {
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
