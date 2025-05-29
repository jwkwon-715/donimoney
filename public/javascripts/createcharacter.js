export class CreateCharacter extends Phaser.Scene {
  constructor() {
    super({ key: 'CreateCharacter' });
  }

  preload() {
    const images = [
      'bg_main', 'todragon_basic', 'nabi_basic', 'choco_basic', 'teacher_basic',
      'todragon_chat', 'nabi_chat', 'choco_chat', 'extra_chat'
    ];
    images.forEach(key => this.load.image(key, `images/${key}.png`));
    this.load.json('dialogData', 'data/dialog0.json');
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
    this.storyCharacterData = allScenes.find(scene => scene.id === this.sceneId);
    if (!this.storyCharacterData) {
      console.error(`Scene with id ${this.sceneId} not found`);
      return;
    }

    this.dialogs = this.storyCharacterData.dialogs;
    this.setBackground(this.storyCharacterData.background);
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
      
      return;
    }

    const text = lineData.line?.replace('{이름}', this.playerName);

    switch (lineData.type) {
      case 'line':
        this.showDialogue(lineData.char, text);
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

  clearUI() {
    [
      'dialogBox', 'chatImage', 'nameText', 'dialogueText', 'inputText'
    ].forEach(key => {
      if (this[key]) {
        this[key].destroy();
        this[key] = null;
      }
    });
  }
}
