import { BootScene } from '/public/javascripts/bootScene.js';
import { GameScene } from '/public/javascripts/gameScene.js';
import { CreateCharacter } from '/public/javascripts/createcharacter.js';

var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH, // 중앙 정렬
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [ BootScene, GameScene, CreateCharacter, ],
};

const game = new Phaser.Game(config);

// 브라우저 창 크기 변경 시 Phaser가 알아서 반응하도록
window.addEventListener('resize', () => {
  game.scale.refresh();
});
