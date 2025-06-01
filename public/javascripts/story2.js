const imagesMap = {
1: ['bg_school', 'nabi_basic', 'choco_basic', 'todragon_curious', 'todragon_basic', 'choco_embarrassed', 'nabi_pathetic', 'todragon_embrrassed', 'todragon_shame'],
2: ['bg_main', 'todragon_shame', 'dony_basic', 'todragon_surprised', 'dony_happy', 'todragon_basic', 'dony_smile', 'todragon_embrrassed' ],
3: ['dony_basic', 'dony_smile', 'todragon_happy', 'dony_history1', 'dony_history2', 'dony_history3', 'dony_history4', 'dony_history5'],
4: ['bg_main', 'dony_basic', 'dony_worried', 'todragon_happy', 'todragon_embrrassed'],
5: ['bg_home', 'mom_basic', 'todragon_basic', 'dony_basic', 'todragon_worried'],
6: ['bg_main', 'dony_surprised', 'todragon_worried', 'todragon_surprised', 'streetbird_basic', 'todragon_basic'],
7: ['bg_mart', 'todragon_hat', 'dony_smile', 'todragon_hat_worried', 'dony_basic', 'todragon_hat_embrrassed', 'todragon_hat_surprised', 'dony_surprised', 'dony_worried', 'dony_angry', 'manager_basic'],
8: ['bg_mart', 'dony_smile', 'todragon_worried', 'dony_basic', 'todragon_basic', 'todragon_happy', 'manager_basic'],
9: ['bg_home', 'todragon_worried', 'dony_basic', 'dony_surprised', 'todragon_basic', 'todragon_happy', 'dony_happy', 'dony_smile'],
success: ['sticker_smile', 'sticker_blueHeart', 'sticker_confetti', 'sticker_heart', 'sticker_star', 'sticker_thumb', 'home_icon', 'close_icon' ],
fail: [ 'sticker_tear', 'sticker_thumdown', 'sticker_darkheart', 'sticker_sadface', 'home_icon', 'close_icon' ]
};


export class StoryScene2 extends Phaser.Scene {
  constructor() {
    super({ key: 'StoryScene2' });
  }

  init(data) {
    this.storyId = data.storyId;
    this.sceneId = data.sceneId ?? 5;
    this.playerName = data.playerName;
  }

  preload() {
    const etcImageKeys = [
      'todragon_chat', 'nabi_chat', 'choco_chat', 'dony_chat','extra_chat',
    ];
    etcImageKeys.forEach(key => this.load.image(key, `/images/etc/${key}.png`));
    this.load.json('dialogData', 'http://localhost:3000/jsonFiles/dialog2.json');
}

 create() {
    this.charNameMap = {
      'todragon': '토드래곤',
      'choco': '초코',
      'nabi': '나비',
      'dony': '도니',
      'teacher': '선생님',
      'mart_owner': '마트 주인',
      'mom': '엄마',
      'streetbird': '상인'
    };

    this.nameBgColors = {
      'todragon': 0xFFBBDA,
      'choco': 0xB78164,
      'nabi': 0xFFB55D,
      'dony': 0x78C0FF,
      'teacher': 0x09537A,
      'mart_owner': 0x09537A,
      'mom': 0x09537A,
      'streetbird': 0x09537A
    };

    // 캐시에서 데이터 가져오기 전에 존재 여부 확인
    if (!this.cache.json.has('dialogData')) {
      console.error('dialogData가 로드되지 않았습니다');
      return;
    }

    const response = this.cache.json.get('dialogData');
    const allScenes = response.data.json_content;
    this.storyData = allScenes.find(scene => scene.id === this.sceneId);
    if (!this.storyData) {
      console.error(`Scene with id ${this.sceneId} not found`);
      return;
    }

    this.dialogs = this.storyData.dialogs;
    this.loadImagesForId(this.sceneId, () => {
        this.setBackground(this.storyData.background);
        this.dialogIndex = 0;
        this.showNextLine();
    });
  }

  getCurrentLineData() {
    return this.dialogs[this.dialogIndex];
  }

  goToNextScene() {
    if (this.sceneId === 7) {
        return false;
    }
    const nextId = this.sceneId + 1;
    const response = this.cache.json.get('dialogData');
    const allScenes = response.data.json_content;
    const nextSceneData = allScenes.find(scene => scene.id === nextId);

    if (!nextSceneData) {
      this.updateProg();  
      this.loadImagesForId('success', () => {
        this.showSuccessPopup();
      });
      return false;
    }

    this.sceneId = nextId;
    this.storyData = nextSceneData;
    this.dialogs = nextSceneData.dialogs;
    this.dialogIndex = 0;
    //  이미지 로드 완료 후에만 씬 초기화
    this.loadImagesForId(nextId, () => {
      this.setBackground(nextSceneData.background);
      this.showNextLine();
    });
  }

  showNextLine() {
    const lineData = this.getCurrentLineData();

    if (!lineData) {
      // id가 7인 씬에서는 다음 씬으로 넘어가지 않음
      if (this.sceneId === 7) {   
        this.loadImagesForId('fail', () => {
          this.showFailsPopup();   
        });
        return;
      }
      if (this.goToNextScene()) {
        this.showNextLine();
      }
      return;
    }
    const text = lineData.line?.replace('{이름}', this.playerName);

    // nextId가 있으면, 해당 id로 바로 이동
    if (lineData.nextId) {
        this.goToSceneById(Number(lineData.nextId));
        return;
    }
    switch (lineData.type) {
      case 'line':
        this.showDialogue(lineData.char, text);
        break;
      case 'question':
        this.showQuestion(lineData.question, lineData);
        break;
      case 'show_history':
        if (this.sceneId === 3) this.showMoneyHistory(lineData);
        break;
    }
  }

  goToSceneById(nextId) {
    const response = this.cache.json.get('dialogData');
    const allScenes = response.data.json_content; 
    const nextSceneData = allScenes.find(scene => scene.id === nextId);

    if (!nextSceneData) {
        console.log('scene not found');
        return false;
    }

    this.sceneId = nextId;
    this.storyData = nextSceneData;
    this.dialogs = nextSceneData.dialogs;
    this.loadImagesForId(nextId, () => {
      this.setBackground(nextSceneData.background);
      this.showNextLine();
    });
    this.dialogIndex = 0;
    return true;
  }
    
  showDialogue(char, text, noClick = false) {
    const lineData = this.getCurrentLineData();
    const name = lineData.name;
    
    this.renderDialogueLine({
      name,
      char,
      text,
      noClick,
      onClick: () => {
        this.destroyUI();
        this.dialogIndex++;
        this.showNextLine();
      }
    });
    
  }

  showMoneyHistory() {
    const dialogs = this.dialogs.slice(this.dialogIndex).filter(d => d.type === 'show_history');
    this.dialogIndex += dialogs.length;

    let currentIndex = 0;

    const baseX = this.scale.width / 6;
    const baseY = this.scale.height / 2.5;

    const positions = [
      { x: 260, y: 550 },
      { x: 610, y: 250 },
      { x: 960, y: 550 },
      { x: 1310, y: 250 },
      { x: 1660, y: 550 }
    ];

    this.moneyImages = [];

    const showNextEvent = () => {
      if (currentIndex >= dialogs.length) {
        this.input.once('pointerdown', () => {
          this.moneyImages.forEach(img => img.destroy());
          this.destroyUI();
          this.showNextLine();
        });
        return;
      }

      const data = dialogs[currentIndex];
      const lines = [data.line1, data.line2].filter(Boolean);

      let lineIndex = 0;

      if (data.image) {
        const pos = positions[currentIndex] || positions[positions.length - 1];
        const image = this.add.image(pos.x, pos.y, data.image).setScale(1).setDepth(1);
        this.moneyImages.push(image);
      }

      const showLine = () => {
        const name = data.name;
        const char = data.char;
        const text = lines[lineIndex];

        
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height * 0.87;

        this.renderDialogueLine({
          name,
          char,
          text,
          onClick: () => {
            lineIndex++;
            if (lineIndex < lines.length) {
              showLine();
            } else {
              this.destroyUI();
              currentIndex++;
              showNextEvent();
            }
          },      
        showCharacterImages: false
        });
      };

      showLine();
    };

    showNextEvent();
  }

  showQuestion(questionText, lineData) {
        const answers = [];
    for (let i = 0; i < lineData.answerCount; i++) {
      answers.push({
        text: lineData[`answer${i}`],
        type: `answer${i}`
      });
    }

    this.showDialogue(lineData.char, questionText, true);
    this.answerButtons = [];

    
    this.questionBg = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.5 
    ).setDepth(10);

    const answerYStart = this.scale.height * 0.4;
    const maxLineWidth = this.scale.width - 100;
    const lineHeight = 150;

    const paddingX = 150;
    const fontSize = 64;
    const fontStyle = {
      fontSize: `${fontSize}px`,
      fill: "#222",
      fontFamily: "Cafe24Dongdong"
    };

    // 버튼 텍스트 길이에 따라 width 계산
    const measuredButtons = answers.map(answer => {
      const tempText = this.add.text(0, 0, answer.text, fontStyle).setVisible(false);
      const width = tempText.width + 80;
      const height = tempText.height + 40;
      tempText.destroy(); // 메모리 낭비 방지
      return { answer, width, height };
    });

    // 줄 나누기
    const lines = [];
    let currentLine = [];
    let currentLineWidth = 0;

    measuredButtons.forEach(btn => {
      const spacing = currentLine.length > 0 ? paddingX : 0;
      if (currentLineWidth + btn.width + spacing > maxLineWidth) {
        lines.push(currentLine);
        currentLine = [];
        currentLineWidth = 0;
      }
      currentLine.push(btn);
      currentLineWidth += btn.width + spacing;
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    // 줄마다 버튼 배치
    lines.forEach((line, lineIndex) => {
      const totalWidth = line.reduce((sum, btn, i) => sum + btn.width + (i > 0 ? paddingX : 0), 0);
      let startX = (this.scale.width - totalWidth) / 2;
      const y = answerYStart + lineHeight * lineIndex;

      line.forEach(({ answer, width, height }, i) => {
        const x = startX + width / 2;

        const btnBg = this.add.graphics().setDepth(11);
        btnBg.fillStyle(0xfffcf5, 1);
        btnBg.fillRoundedRect(x - width / 2, y - height / 2, width, height, 50);

        const btnText = this.add.text(x, y, answer.text, fontStyle)
          .setOrigin(0.5)
          .setDepth(12);

        // 애니메이션
        btnBg.y += 100;
        btnText.y += 100;
        this.tweens.add({
          targets: [btnBg, btnText],
          y: "-=10",
          ease: "Sine.easeInOut",
          duration: 900,
          yoyo: true,
          repeat: -1
        });

        // 인터랙션
        btnBg.setInteractive(
          new Phaser.Geom.Rectangle(x - width / 2, y - height / 2, width, height),
          Phaser.Geom.Rectangle.Contains
        )
      .on('pointerdown', () => {
        this.destroyUI();
        if (answer.type === 'answer0') {
          this.dialogIndex++;
          this.showNextLine();
        } else if (answer.type === 'answer1') {
          this.dialogIndex += 3;
          this.showNextLine();
        }
      })
      .on('pointerover', () => {
        this.input.manager.canvas.style.cursor = 'pointer';
      })
      .on('pointerout', () => {
        this.input.manager.canvas.style.cursor = 'default';
      })
      .setDepth(11);
    
      this.answerButtons.push(btnBg, btnText);
      startX += width + paddingX;
      });
    });
  }

  renderDialogueLine({ name, char, text, noClick = false, onClick = null, showCharacterImages = true }) {
    this.destroyUI();

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height * 0.87;
    const isMainChar = ['nabi', 'choco', 'todragon', 'dony'].includes(name);
    const chatBoxKey = isMainChar ? `${name}_chat` : 'extra_chat';
    const characterImageKey = char;

    this.dialogBox = this.add.image(centerX, centerY, chatBoxKey).setScale(0.8).setDepth(2);

    // 캐릭터 이미지 출력 여부 제어
    if (showCharacterImages) {
      if (name === 'todragon' && characterImageKey) {
        this.todragonImage = this.add.image(centerX - 500, centerY - 300, characterImageKey).setScale(1.3).setDepth(1);
      }

      if (name !== 'todragon' && characterImageKey) {
        const todragonImgKey = (this.sceneId === 7) ? 'todragon_hat' : 'todragon_basic';
        this.todragonImage = this.add.image(centerX - 500, centerY - 300, todragonImgKey).setScale(1.3).setDepth(1);
        this.speakingCharImage = this.add.image(centerX + 500, centerY - 300, characterImageKey).setScale(1.3).setDepth(1);
      }
    }

    const boxWidth = this.dialogBox.width * this.dialogBox.scaleX;
    const boxHeight = this.dialogBox.height * this.dialogBox.scaleY;
    const textStartX = centerX - boxWidth / 2 + 60;
    const textStartY = centerY - boxHeight / 2 - 10;

    const displayName = name === 'todragon' ? this.playerName : (this.charNameMap?.[name] ?? name);
    this.nameText = this.add.text(textStartX, textStartY, displayName, {
      fontSize: '40px',
      fontFamily: 'Cafe24Dongdong',
      strokeThickness: 1,
      stroke: '#000000',
      fill: '#000000'
    }).setDepth(3);

    const { x, y, width, height } = this.nameText.getBounds();
    const nameBgColor = this.nameBgColors?.[name] ?? 0xffffff;
    this.nameBg = this.add.graphics();
    this.nameBg.fillStyle(nameBgColor, 1);
    this.nameBg.fillRoundedRect(x - 20, y - 10, width + 40, height + 20, 30);
    this.nameBg.setDepth(2);

    this.dialogueText = this.add.text(textStartX, textStartY + 20, text, {
      fontSize: '40px',
      fill: '#000000',
      fontFamily: 'Cafe24Dongdong',
      padding: { top: 60, bottom: 10 },
      wordWrap: { width: boxWidth - 200 }
    }).setDepth(3);

    if (!noClick) {
      this.dialogBox.setInteractive({ cursor: 'pointer' });
      this.dialogBox.once('pointerdown', () => {
        if (onClick) onClick();
      });
    }
  }


  setBackground(background) {
    if (this.bg) this.bg.destroy();
    this.bg = null;

    if (typeof background === 'string' && background.startsWith('bg_')) {
      this.bg = this.add.image(0, 0, background).setOrigin(0).setDepth(0);
    } else {
      this.cameras.main.setBackgroundColor(background || '#ffffff');
    }
  }

  destroyUI() {
    this.input.removeAllListeners();

    ['dialogueText', 'nameText', 'dialogBox', 'nameBg', 'todragonImage', 'speakingCharImage'].forEach(key => {
      if (this[key]) {
        this[key].destroy();
        this[key] = null;
      }
    });
    if (this.answerButtons) {
      this.answerButtons.forEach(btn => btn?.destroy?.());
      this.answerButtons = null;
    }
    if (this.questionBg ) {
      this.questionBg .destroy();
      this.questionBg  = null;
    }
  }

  loadImagesForId(id, onComplete) {
    const images = imagesMap[id] || [];
    const toLoad = images.filter(key => !this.textures.exists(key));

    if (toLoad.length === 0) {
      onComplete();
      return;
    }

    this.load.reset();
    this.load.removeAllListeners();

    toLoad.forEach(key => {
      let url;
      // 1. 배경 이미지
      if (key.startsWith('bg_')) {
        url = `/images/background/${key}.png`;
      } 
      // 2. 스티커 & 아이콘
      else if (key.startsWith('sticker_') || key === 'home_icon' || key === 'close_icon') {
        url = `/images/${key}.png`;
      } 
      // 3. 캐릭터 이미지
      else {
        url = `/images/character/${key}.png`;
      }
      this.load.image(key, url);
    });

    this.load.once('complete', () => {
      onComplete();
    });

    this.load.on('loaderror', (file) => {
      console.error(`로드 실패: ${file.key}`);
    });

    this.load.start();
  }

  //성공 팝업
  showSuccessPopup() {
    const cam = this.cameras.main;
    this.add.image(cam.centerX, cam.centerY - 350, 'sticker_thumb').setScale(0.6).setDepth(104);
    this.add.image(cam.centerX - 500, cam.centerY - 100, 'sticker_heart').setScale(0.6).setDepth(101);
    this.add.image(cam.centerX - 450, cam.centerY + 150, 'sticker_star').setScale(0.6).setDepth(101);
    this.add.image(cam.centerX + 450, cam.centerY - 150, 'sticker_Smile').setScale(0.6).setDepth(101);
    this.add.image(cam.centerX + 450, cam.centerY + 180, 'sticker_blue_heart').setScale(0.6).setDepth(100);
    this.add.image(cam.centerX + 450, cam.centerY + 300, 'sticker_confetti').setScale(0.6).setDepth(101);

    //배경 검정 처리
    this.popupOverlay = this.add.rectangle(
      cam.centerX, cam.centerY,
      cam.width, cam.height,
      0x000000, 0.5 
    ).setDepth(99);

    // 팝업 박스 (흰 배경 )
    this.popupBox = this.add.rectangle(
      this.cameras.main.centerX, this.cameras.main.centerY,
      800, 600, 0xFFFFFF, 1
    ).setDepth(102);

    // 노란배경
    this.popupBg = this.add.rectangle(
      this.cameras.main.centerX+50, this.cameras.main.centerY+50,
      800, 600, 0xFFD700, 1
    ).setDepth(100);

    this.add.text(
      this.cameras.main.centerX, this.cameras.main.centerY - 20,
      "참 잘했어요!", {
        fontSize: '96px',
        color: '#333333',
        fontFamily: 'Cafe24Dongdong'
      }
    ).setOrigin(0.5).setDepth(102);

    // "다시 하기" 버튼
    this.retryBtn = this.add.text(
      this.cameras.main.centerX - 160, this.cameras.main.centerY + 150,
      " 다시 하기 ", {
        fontSize: '48px',
        backgroundColor: '#FFE180',
        color: '#333',
        padding: { x: 20, y: 10 },
        fontFamily: 'Cafe24Dongdong',
        align: 'center'
      }
    ).setOrigin(0.5).setInteractive({ cursor: 'pointer' }).setDepth(103)
    .on('pointerdown', () => {
      window.location.href = `/stories/${this.storyId}`;
    });

    this.nextBtn = this.add.text(
      this.cameras.main.centerX + 160, this.cameras.main.centerY + 150,
      "스토리 목록", {
        fontSize: '48px',
        backgroundColor: '#F9CF45',
        color: '#333',
        padding: { x: 20, y: 10 },
        fontFamily: 'Cafe24Dongdong',
        align: 'center'
      }
    ).setOrigin(0.5).setInteractive({ cursor: 'pointer' }).setDepth(103)
    .on('pointerdown', () => {
      window.location.href = '/game/stories/storyList';
    });

    //홈 아이콘 배경 (좌측 상단)
    const homeBgSize = 100; // 정사각형 한 변의 길이 (픽셀)
    const homeBgX = cam.width * 0.07;
    const homeBgY = cam.height * 0.08;
    const homeBgRadius = 18; // 둥근 모서리 반지름

    const homeBg = this.add.graphics().setDepth(102);
    homeBg.fillStyle(0x3B9EF7, 1); // #3B9EF7
    homeBg.fillRoundedRect(
      homeBgX - homeBgSize / 2, // 좌상단 X
      homeBgY - homeBgSize / 2, // 좌상단 Y
      homeBgSize, homeBgSize,
      homeBgRadius // 둥근 모서리
    );

    // 홈 아이콘 (정중앙에 배치)
    this.homeBtn = this.add.image(homeBgX, homeBgY, 'home_icon')
      .setInteractive({ cursor: 'pointer' }).setDepth(103).setScale(0.6)
      .on('pointerdown', () => {
        window.location.href = '/game/main';
      });

    // 닫기 아이콘 배경 (우측 상단)
    const closeBgSize = 100;
    const closeBgX = cam.width * 0.93;
    const closeBgY = cam.height * 0.08;
    const closeBgRadius = 18;

    const closeBg = this.add.graphics().setDepth(102);
    closeBg.fillStyle(0xEF5454, 1);
    closeBg.fillRoundedRect(
      closeBgX - closeBgSize / 2,
      closeBgY - closeBgSize / 2,
      closeBgSize, closeBgSize,
      closeBgRadius
    );

    // 닫기 아이콘 (정중앙에 배치)
    this.closeBtn = this.add.image(closeBgX, closeBgY, 'close_icon')
      .setInteractive({ cursor: 'pointer' }).setDepth(103).setScale(0.6)
      .on('pointerdown', () => {
        window.location.href = '/game/stories/storyList';
    });
  }

  //실패 팝업
  showFailsPopup() {
    const cam = this.cameras.main;
    this.add.image(cam.centerX, cam.centerY - 300, 'sticker_sadface').setScale(0.6).setDepth(104);
    this.add.image(cam.centerX - 480, cam.centerY - 50, 'sticker_darkheart').setScale(0.6).setDepth(101);
    this.add.image(cam.centerX + 470, cam.centerY - 120, 'sticker_tear').setScale(0.6).setDepth(101);
    this.add.image(cam.centerX + 480, cam.centerY + 160, 'sticker_thumdown').setScale(0.6).setDepth(101);

    //배경 검정 처리
    this.popupOverlay = this.add.rectangle(
      cam.centerX, cam.centerY,
      cam.width, cam.height,
      0x000000, 0.5 
    ).setDepth(99);

    // 팝업 박스 (흰 배경 )
    this.popupBox = this.add.rectangle(
      this.cameras.main.centerX, this.cameras.main.centerY,
      800, 600, 0xFFFFFF, 1
    ).setDepth(102);

    // 뒤 회색배경
    this.popupBg = this.add.rectangle(
      this.cameras.main.centerX+50, this.cameras.main.centerY+50,
      800, 600, 0x929292, 1
    ).setDepth(100);

    this.add.text(
      this.cameras.main.centerX, this.cameras.main.centerY - 20,
      "다시 도전해 보세요!", {
        fontSize: '96px',
        color: '#333333',
        fontFamily: 'Cafe24Dongdong'
      }
    ).setOrigin(0.5).setDepth(102);

    // "다시 하기" 버튼
    this.retryBtn = this.add.text(
      this.cameras.main.centerX - 160, this.cameras.main.centerY + 150,
      " 다시 하기 ", {
        fontSize: '48px',
        backgroundColor: '#D2D2D2',
        color: '#333',
        padding: { x: 20, y: 10 },
        fontFamily: 'Cafe24Dongdong',
        align: 'center'
      }
    ).setOrigin(0.5).setInteractive({ cursor: 'pointer' }).setDepth(103)
    .on('pointerdown', () => {
      window.location.href = `/stories/${this.storyId}`;
    });

    this.nextBtn = this.add.text(
      this.cameras.main.centerX + 160, this.cameras.main.centerY + 150,
      "스토리 목록", {
        fontSize: '48px',
        backgroundColor: '#787878',
        color: '#333',
        padding: { x: 20, y: 10 },
        fontFamily: 'Cafe24Dongdong',
        align: 'center'
      }
    ).setOrigin(0.5).setInteractive({ cursor: 'pointer' }).setDepth(103)
    .on('pointerdown', () => {
      window.location.href = '/game/stories/storyList';
    });

    //홈 아이콘 배경 (좌측 상단)
    const homeBgSize = 100; // 정사각형 한 변의 길이 (픽셀)
    const homeBgX = cam.width * 0.07;
    const homeBgY = cam.height * 0.08;
    const homeBgRadius = 18; // 둥근 모서리 반지름

    const homeBg = this.add.graphics().setDepth(102);
    homeBg.fillStyle(0x3B9EF7, 1); // #3B9EF7
    homeBg.fillRoundedRect(
      homeBgX - homeBgSize / 2, // 좌상단 X
      homeBgY - homeBgSize / 2, // 좌상단 Y
      homeBgSize, homeBgSize,
      homeBgRadius // 둥근 모서리
    );

    // 홈 아이콘 (정중앙에 배치)
    this.homeBtn = this.add.image(homeBgX, homeBgY, 'home_icon')
      .setInteractive({ cursor: 'pointer' }).setDepth(103).setScale(0.6)
      .on('pointerdown', () => {
        window.location.href = '/game/main';
      });

    // 닫기 아이콘 배경 (우측 상단)
    const closeBgSize = 100;
    const closeBgX = cam.width * 0.93;
    const closeBgY = cam.height * 0.08;
    const closeBgRadius = 18;

    const closeBg = this.add.graphics().setDepth(102);
    closeBg.fillStyle(0xEF5454, 1);
    closeBg.fillRoundedRect(
      closeBgX - closeBgSize / 2,
      closeBgY - closeBgSize / 2,
      closeBgSize, closeBgSize,
      closeBgRadius
    );

    // 닫기 아이콘 (정중앙에 배치)
    this.closeBtn = this.add.image(closeBgX, closeBgY, 'close_icon')
      .setInteractive({ cursor: 'pointer' }).setDepth(103).setScale(0.6)
      .on('pointerdown', () => {
        window.location.href = '/game/stories/storyList';
    });
  }

  updateProg(){
    fetch('/game/stories/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      storyId: this.storyId 
    })
  })
  .then(response => {
    if (!response.ok) throw new Error('서버 에러 발생');
    console.log('스토리 완료 기록 성공!');
  })
  .catch(err => console.error(err));
  }
}
