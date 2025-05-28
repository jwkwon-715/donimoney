// BootScene.js
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
        this.cameras.main.backgroundColor = Phaser.Display.Color.ValueToColor(0x000000); 
  }

  create() {
    const text = this.add.text(
      this.scale.width / 2,     
      this.scale.height / 2,    
      '도니뭐니',                
      {
        fontSize: '48px',         
        fill: '#FFFFFF',        
        fontFamily: 'Arial',     
        align: 'center'        
      }
    );
    text.setOrigin(0.5, 0.5);

    // 클릭 시 게임 씬으로 이동
    this.input.once('pointerdown', () => {
      this.scene.start('GameScene'); // 클릭 시 게임 씬으로 전환
    });
  }
}
