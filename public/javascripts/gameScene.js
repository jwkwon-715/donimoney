// GameScene.js
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    const characterImageKeys = [
      'todragon_basic', 'todragon_curious', 'todragon_embrrassed', 'todragon_happy', 'todragon_shame', 'todragon_surprised', 'todragon_worried',
      'nabi_basic', 'nabi_pathetic', 'choco_basic', 'choco_embarrassed',
      'dony_basic', 'dony_disappointed', 'dony_angry', 'dony_happy', 'dony_smile', 'dony_surprised', 'dony_worried',
      'dony_history1', 'dony_history2', 'dony_history3', 'dony_history4', 'dony_history5'
    ];
    const backgroundImageKeys = [
      'bg_main', 'bg_school', 'bg_longmain'
    ];
    const etcImageKeys = [
      'todragon_chat', 'nabi_chat', 'choco_chat', 'dony_chat','extra_chat',
    ];
    characterImageKeys.forEach(key => this.load.image(key, `images/character/${key}.png`));
    backgroundImageKeys.forEach(key => this.load.image(key, `images/background/${key}.png`));
    etcImageKeys.forEach(key => this.load.image(key, `images/etc/${key}.png`));
  }

  create() {
    const goStory = this.add.text(
      20, 20,
      '스토리 보기',              
      {
        fontSize: '28px',         
        fill: '#000000',         
        align: 'center'        
      }
    ).setOrigin(0, 0).setScrollFactor(0).setDepth(10).setInteractive();

    // 클릭 이벤트 처리: '스토리 보기' 클릭 시 스토리 씬으로 전환
    goStory.on('pointerdown', () => {
      this.scene.start('StoryScene'); // 'StoryScene'으로 전환
    });

    const bg = this.add.image(0, 0, 'bg_longmain').setOrigin(0, 0);
    // 화면 높이에 맞게 배경 이미지 스케일 조정
    const scaleY = this.scale.height / bg.height;
    bg.setScale(scaleY);
    // 월드의 크기를 배경 이미지 기준으로 설정
    const worldWidth = bg.width * bg.scaleX;
    const worldHeight = bg.height * bg.scaleY;
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // 드래곤을 Physics 객체로 생성
    this.todragon = this.physics.add.image(worldWidth / 2, worldHeight-220, 'todragon_basic');
    this.todragon.setScale(0.25);
    this.todragon.setCollideWorldBounds(true); // 월드 밖으로 못 나가게

    // 카메라가 드래곤을 따라가도록 설정
    this.cameras.main.startFollow(this.todragon, true, 0.08, 0.08);
    
    // 방향키 입력 설정
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const speed = 200; // 이동 속도
    this.todragon.setVelocity(0); // 먼저 멈춤 처리

    if (this.cursors.left.isDown) {
      this.todragon.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.todragon.setVelocityX(speed);
    }
  }
}
