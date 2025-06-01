export class SuccessScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SuccessScene' });
  }

  preload() {
    // 이미지 프리로드
    this.load.image('bg', '/images/배경.png');
    this.load.image('homeIcon', '/images/home_icon.png');
    this.load.image('closeIcon', '/images/close_icon.png');
    this.load.image('stickerSmile', '/images/sticker_smile.png');
    this.load.image('stickerBlueHeart', '/images/sticker_blueHeart.png');
    this.load.image('stickerConfetti', '/images/sticker_confetti.png');
    this.load.image('stickerHeart', '/images/sticker_heart.png');
    this.load.image('stickerStar', '/images/sticker_star.png');
    this.load.image('stickerThumb', '/images/sticker_thumb.png');
  }

  create() {
    // 배경 이미지
    this.add.image(400, 300, 'bg').setDisplaySize(800, 600);

    // 스티커들
    this.add.image(200, 150, 'stickerSmile').setScale(0.5);
    this.add.image(600, 150, 'stickerBlueHeart').setScale(0.5);
    this.add.image(400, 100, 'stickerConfetti').setScale(0.5);
    this.add.image(300, 400, 'stickerHeart').setScale(0.5);
    this.add.image(500, 400, 'stickerStar').setScale(0.5);
    this.add.image(400, 260, 'stickerThumb').setScale(0.5);

    // 텍스트
    this.add.text(400, 200, '~을 클리어 했어요!', {
      fontSize: '32px',
      color: '#000',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // 버튼: 다시 하기
    const retryBtn = this.add.text(300, 350, '다시 하기', {
      fontSize: '24px',
      backgroundColor: '#eee',
      color: '#000',
      padding: { x: 20, y: 10 },
      borderRadius: 10,
    }).setInteractive().on('pointerdown', () => {
      window.location.href = '/game/school/quiz/typeList';
    });

    // 버튼: 끝내기
    const endBtn = this.add.text(450, 350, '끝내기', {
      fontSize: '24px',
      backgroundColor: '#eee',
      color: '#000',
      padding: { x: 20, y: 10 },
      borderRadius: 10,
    }).setInteractive().on('pointerdown', () => {
      this.scene.start('MainGameScene'); // 메인으로 이동
    });

    // 홈 아이콘 버튼
    this.add.image(50, 50, 'homeIcon').setInteractive().on('pointerdown', () => {
      window.location.href = '/game/main';  // 또는 storyList 등 원하는 경로
    }).setScale(0.5);

    // 닫기 아이콘 버튼
    this.add.image(750, 50, 'closeIcon').setInteractive().on('pointerdown', () => {
      window.location.href = '/game/main';  // 또는 storyList 등 원하는 경로
    }).setScale(0.5);
  }
}
