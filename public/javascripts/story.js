import { StoryScene1 } from '/public/javascripts/story1.js';


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
  backgroundColor: '#000',
  scene: [StoryScene1]
};

const game = new Phaser.Game(config);
console.log(game);

document.getElementById('start-story1').addEventListener('click', () => {
    game.scene.start('Story1Scene1');
});