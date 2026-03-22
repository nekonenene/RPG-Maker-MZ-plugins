// --------------------------------------------------------------------------
//
// HTN_EnemyJumpOnAction.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/03/22 v1.0.0 First release
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc Enemies jump slightly when it's their turn to act (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_EnemyJumpOnAction
 *
 * @param JumpHeight
 * @text Jump Height (px)
 * @desc Height of the jump in pixels. A larger value makes the enemy jump higher.
 * @default 16
 * @type number
 * @min 1
 * @max 200
 *
 * @param JumpDuration
 * @text Jump Duration (frames)
 * @desc Number of frames for the complete jump animation (up and down). 60 frames = 1 second.
 * @default 12
 * @type number
 * @min 4
 * @max 60
 *
 * @help
 * When an enemy's turn comes and it begins its action,
 * the enemy will jump slightly to make it more visually clear
 * whose turn it is.
 *
 * You can adjust the jump height and duration via plugin parameters.
 */

/*:ja
 * @target MZ
 * @plugindesc 敵の攻撃ターンが来たとき、敵が軽くジャンプします (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_EnemyJumpOnAction
 *
 * @param JumpHeight
 * @text ジャンプの高さ (px)
 * @desc ジャンプする高さをピクセル単位で指定します。大きいほど高くジャンプします。
 * @default 16
 * @type number
 * @min 1
 * @max 200
 *
 * @param JumpDuration
 * @text ジャンプの時間 (フレーム数)
 * @desc ジャンプアニメーション全体のフレーム数です。60フレームが1秒です。
 * @default 12
 * @type number
 * @min 4
 * @max 60
 *
 * @help
 * 敵の攻撃ターンが来たとき、敵が軽くジャンプします。
 * 誰のターンかを視覚的にわかりやすくするためのプラグインです。
 *
 * ジャンプの高さと時間はプラグインパラメータで調整できます。
 */

(() => {
  'use strict';

  const pluginName = "HTN_EnemyJumpOnAction";
  const parameters = PluginManager.parameters(pluginName);

  // ジャンプの高さ（ピクセル単位）
  const paramJumpHeight = Number(parameters['JumpHeight'] ?? 16);
  // ジャンプアニメーションの総フレーム数
  const paramJumpDuration = Number(parameters['JumpDuration'] ?? 12);

  /**
   * メンバー変数を初期化する。ジャンプアニメーション用の変数を追加
   */
  const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
  Sprite_Enemy.prototype.initMembers = function() {
    _Sprite_Enemy_initMembers.call(this);

    this._htnJumpFrame = 0; // 現在のジャンプアニメーションフレーム
    this._htnJumpDuration = 0; // ジャンプアニメーションの総フレーム数（0なら非アクティブ）
  };

  /**
   * 敵が白く光るエフェクト（アクション開始時のみ呼ばれる）を開始する際、ジャンプも開始する
   */
  const _Sprite_Enemy_startWhiten = Sprite_Enemy.prototype.startWhiten;
  Sprite_Enemy.prototype.startWhiten = function() {
    _Sprite_Enemy_startWhiten.call(this);

    this._htnJumpFrame = 0;
    this._htnJumpDuration = paramJumpDuration;
  };

  /**
   * スプライトの状態を毎フレーム更新する。ジャンプアニメーションのフレームを進める
   */
  const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
  Sprite_Enemy.prototype.update = function() {
    _Sprite_Enemy_update.call(this);

    if (this._htnJumpDuration > 0) {
      this._htnJumpFrame++;

      if (this._htnJumpFrame >= this._htnJumpDuration) {
        this._htnJumpFrame = 0;
        this._htnJumpDuration = 0;
      }
    }
  };

  /**
   * スプライトの座標を毎フレーム更新する。
   * ジャンプアニメーション中はY座標をサイン曲線で上下に動かし、自然なジャンプ軌跡を描く。
   * sin(0) = 0, sin(π/2) = 1, sin(π) = 0 であることを利用して、上昇→下降の弧を表現する。
   */
  const _Sprite_Enemy_updatePosition = Sprite_Enemy.prototype.updatePosition;
  Sprite_Enemy.prototype.updatePosition = function() {
    _Sprite_Enemy_updatePosition.call(this);

    if (this._htnJumpDuration > 0) {
      const progress = this._htnJumpFrame / this._htnJumpDuration;
      const jumpOffset = paramJumpHeight * Math.sin(progress * Math.PI);
      this.y -= jumpOffset;
    }
  };
})();
