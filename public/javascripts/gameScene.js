// GameScene.js
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.spritesheet('todragon_walk', '/images/character/todragon_walk.png', { frameWidth: 900, frameHeight: 756 });
    this.load.image('bg_longmain', '/images/background/bg_longmain.png');
    const objectImageKeys = ['home', 'mart', 'school'];
    objectImageKeys.forEach(key => this.load.image(key, `/images/background/${key}.png`));
    const objectGuidImageKeys = ['mart_guid', 'home_guid', 'school_guid', 'space_guid'];
    objectGuidImageKeys.forEach(key => this.load.image(key, `/images/etc/${key}.png`));
  }

  create() {
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('todragon_walk', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1  //무한반복
    }); 


    const bg = this.add.image(0, 0, 'bg_longmain').setOrigin(0, 0);
    // 화면 높이에 맞게 배경 이미지 스케일 조정
    const scaleY = this.scale.height / bg.height;
    bg.setScale(scaleY);
    // 월드의 크기를 배경 이미지 기준으로 설정
    const worldWidth = bg.width * bg.scaleX;
    const worldHeight = bg.height * bg.scaleY;
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.setBounds(-200, 0, worldWidth + 400, worldHeight + 100);

    // 캐릭터
    this.todragon = this.physics.add.sprite(worldWidth*0.33, worldHeight *0.71, 'todragon_walk')
    .setScale(1)
    .setCollideWorldBounds(true) // 월드 밖 이동 불가
    .setDepth(1);

    //건물 오브젝트
    this.home = this.add.image(worldWidth*0.2, worldHeight*0.57, 'home').setScale(1.4);
    this.school = this.add.image(worldWidth*0.5, worldHeight*0.57, 'school').setScale(1.7);
    this.mart = this.add.image(worldWidth*0.8, worldHeight*0.58, 'mart').setScale(2);

    // 카메라 토드래곤 추적
    this.cameras.main.startFollow(this.todragon, true, 0.08, 0.08);
    // 방향키 입력 설정
    this.cursors = this.input.keyboard.createCursorKeys();
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT); 
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // 건물 위 GUID 이미지
    this.homeGuid = this.add.image(this.home.x, this.home.y - 150, 'home_guid').setVisible(false).setScale(1.7);
    this.martGuid = this.add.image(this.mart.x, this.mart.y - 150, 'mart_guid').setVisible(false).setScale(1.7);
    this.schoolGuid = this.add.image(this.school.x, this.school.y - 150, 'school_guid').setVisible(false).setScale(1.7);

    // SPACE 키 유도 이미지 (화면 정중앙 고정)
    this.spaceGuid = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY-200, 'space_guid')
      .setScrollFactor(0)  // 카메라 고정
      .setVisible(false);
  }

  update() {
    const baseSeed = 400; 
    const runSpeed = 800;
    const isRunning = this.shiftKey.isDown;
    const speed = isRunning ? runSpeed : baseSeed;
    this.todragon.setVelocity(0); // 먼저 멈춤 처리

    if (this.cursors.left.isDown) {
      this.todragon.setVelocityX(-speed);
      this.todragon.anims.play('walk', true);
      this.todragon.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.todragon.setVelocityX(speed);
      this.todragon.anims.play('walk', true);
      this.todragon.setFlipX(false);
    } else {
      this.todragon.setVelocityX(0);
      this.todragon.anims.stop();
      this.todragon.setFrame(5);
    }

    //근접 가이드 
    const todragonOriginalBounds = this.todragon.getBounds();
    const todragonBounds = Phaser.Geom.Rectangle.Inflate(
      Phaser.Geom.Rectangle.Clone(todragonOriginalBounds),
      -todragonOriginalBounds.width * 0.2, 0
    );

    let isNearAny = false;

    const checkNear = (target, targetGuid, inflateX) => {
      const original = target.getBounds();
      const bounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(original), -original.width * inflateX, 0);
      const isNear = Phaser.Geom.Intersects.RectangleToRectangle(todragonBounds, bounds);

      if (isNear) {
        isNearAny = true;

        if (!targetGuid.visible) {
          targetGuid.setVisible(true).setAlpha(0).setY(0);
          this.tweens.add({
            targets: targetGuid,
            alpha: 1,
            y: 100,
            duration: 300,
            ease: 'Cubic.easeInOut'
          });
        }
      } else {
        if (targetGuid.visible && !targetGuid.isFadingOut) {
          targetGuid.isFadingOut = true;
          this.tweens.add({
            targets: targetGuid,
            y: 0,
            alpha: 0,
            duration: 300,
            ease: 'Cubic.easeInOut',
            onComplete: () => {
              targetGuid.setVisible(false);
              targetGuid.setAlpha(1);
              targetGuid.isFadingOut = false;
            }
          });
        }
      }

      return bounds;
    };

    const homeBounds = checkNear(this.home, this.homeGuid, 0.4);
    const martBounds = checkNear(this.mart, this.martGuid, 0.42);
    const schoolBounds = checkNear(this.school, this.schoolGuid, 0.49);

    this.spaceGuid.setVisible(isNearAny);

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(todragonBounds, homeBounds)) {
        window.location.href = '/game/stories/storyList/';
      } else if (Phaser.Geom.Intersects.RectangleToRectangle(todragonBounds, schoolBounds)) {
        window.location.href = '/game/school';
      } else if (Phaser.Geom.Intersects.RectangleToRectangle(todragonBounds, martBounds)) {
        window.location.href = '/game/mart/ItemList';
      } else {
        console.log('접촉된 건물 없음');
      }
    }
  }

}
