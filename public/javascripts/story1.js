export class StoryScene1 extends Phaser.Scene {
  constructor() {
    super({ key: 'StoryScene1' });
  }

  init(data) {
    this.sceneId = data.sceneId ?? 1;
    this.playerName = data.playerName ?? '토드래곤';
  }

  preload() {
    const characterImageKeys = [
      'todragon_basic', 'nabi_basic', 'choco_basic', 'dony_basic',
      'dony_history1', 'dony_history2', 'dony_history3', 'dony_history4', 'dony_history5'
    ];
    const backgroundImageKeys = [
      'bg_main', 'bg_school', 'colorbg',
    ];
    const etcImageKeys = [
      'todragon_chat', 'nabi_chat', 'choco_chat', 'dony_chat','extra_chat',
    ];
    characterImageKeys.forEach(key => this.load.image(key, `images/character/${key}.png`));
    backgroundImageKeys.forEach(key => this.load.image(key, `images/background/${key}.png`));
    etcImageKeys.forEach(key => this.load.image(key, `images/etc/${key}.png`));

    this.load.json('dialogData', 'data/dialog1.json');
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
      'noname': ''
    };

    this.nameBgColors = {
      'todragon': 0xFFBBDA,
      'choco': 0xB78164,
      'nabi': 0xFFB55D,
      'dony': 0x78C0FF,
      'teacher': 0x09537A,
      'mart_owner': 0x09537A,
      'mom': 0x09537A,
      'noname': 0x09537A
    };

    const allScenes = this.cache.json.get('dialogData');
    this.storyData1 = allScenes.find(scene => scene.id === this.sceneId);
    if (!this.storyData1) {
      console.error(`Scene with id ${this.sceneId} not found`);
      return;
    }

    this.dialogs = this.storyData1.dialogs;
    this.setBackground(this.storyData1.background);
    this.dialogIndex = 0;

    this.showNextLine();
  }

  getCurrentLineData() {
    return this.dialogs[this.dialogIndex];
  }

  goToNextScene() {
    const nextId = this.sceneId + 1;
    const allScenes = this.cache.json.get('dialogData');
    const nextSceneData = allScenes.find(scene => scene.id === nextId);

    if (!nextSceneData) {
      console.log('final scene complete!');
      return false;
    }

    this.sceneId = nextId;
    this.storyData1 = nextSceneData;
    this.dialogs = nextSceneData.dialogs;
    this.setBackground(nextSceneData.background);
    this.dialogIndex = 0;
    return true;
  }

  showNextLine() {
    const lineData = this.getCurrentLineData();

    if (!lineData) {
      if (this.goToNextScene()) {
        this.showNextLine();
      }
      return;
    }

    const text = lineData.line?.replace('{이름}', this.playerName);

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

  showDialogue(char, text, noClick = false) {
    this.renderDialogueLine({
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
      { x: 260, y: 350 },
      { x: 610, y: 250 },
      { x: 960, y: 350 },
      { x: 1310, y: 250 },
      { x: 1660, y: 350 }
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
        const image = this.add.image(pos.x, pos.y, data.image).setScale(0.8).setDepth(1);
        this.moneyImages.push(image);
      }

      const showLine = () => {
        const text = lines[lineIndex];
        this.renderDialogueLine({
          char: data.char || 'dony',
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
          }
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

    const answerY = this.scale.height * 0.18;
    const spacing = this.scale.width / (answers.length + 1);

    answers.forEach((answer, idx) => {
      const x = spacing * (idx + 1);

      const tempText = this.add.text(0, 0, answer.text, {
        fontSize: '40px',
        fontFamily: 'Cafe24Dongdong'
      });
      const width = tempText.width + 48;
      const height = tempText.height + 24;
      tempText.destroy();

      const btnBg = this.add.graphics();
      btnBg.fillStyle(0xFFFCF5, 1);
      btnBg.fillRoundedRect(x - width / 2, answerY - height / 2, width, height, 30);

      const btnText = this.add.text(x, answerY, answer.text, {
        fontSize: '40px',
        fill: '#222',
        fontFamily: 'Cafe24Dongdong'
      }).setOrigin(0.5);

      btnBg.setInteractive(
        new Phaser.Geom.Rectangle(x - width / 2, answerY - height / 2, width, height),
        Phaser.Geom.Rectangle.Contains
      ).on('pointerdown', () => {
        this.destroyUI();
        this.dialogIndex++;
        this.showNextLine();
      });

      this.answerButtons.push(btnBg, btnText);
    });
  }

  renderDialogueLine({ char, text, noClick = false, onClick = null }) {
    this.destroyUI();

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height * 0.87;
    const isMainChar = ['nabi', 'choco', 'todragon', 'dony'].includes(char);
    const chatBoxKey = isMainChar ? `${char}_chat` : 'extra_chat';
    const characterImageKey = isMainChar ? `${char}_basic` : null;

    this.dialogBox = this.add.image(centerX, centerY, chatBoxKey).setScale(0.8).setDepth(2);

    if (characterImageKey) {
      this.chat_image = this.add.image(centerX - 600, centerY - 160, characterImageKey).setScale(0.65).setDepth(1);
    }

    const boxWidth = this.dialogBox.width * this.dialogBox.scaleX;
    const boxHeight = this.dialogBox.height * this.dialogBox.scaleY;
    const textStartX = centerX - boxWidth / 2 + 60;
    const textStartY = centerY - boxHeight / 2 - 10;

    const displayName = this.charNameMap?.[char] ?? char;
    this.nameText = this.add.text(textStartX, textStartY, displayName, {
      fontSize: '40px',
      fontFamily: 'Cafe24Dongdong',
      strokeThickness: 1,
      stroke: '#000000',
      fill: '#000000'
    }).setDepth(3);

    const { x, y, width, height } = this.nameText.getBounds();
    const nameBgColor = this.nameBgColors?.[char] ?? 0xffffff;
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
      this.dialogBox.setInteractive();
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

    ['dialogueText', 'nameText', 'dialogBox', 'chat_image', 'nameBg'].forEach(key => {
      if (this[key]) {
        this[key].destroy();
        this[key] = null;
      }
    });

    if (this.answerButtons) {
      this.answerButtons.forEach(btn => btn?.destroy?.());
      this.answerButtons = null;
    }
  }
}
