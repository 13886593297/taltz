class EquipmentScene extends Scene {
    constructor() {
        super()
        Util.setTitle('装备库')
    }

    public init() {
        super.setBackground()
        this.initList()
    }

    private initList() {
        let title = Util.createBitmapByName('equip_title_png')
        title.y = 20
        this.addChild(title)

        let y = 370
        for (let config of EquipmentConfigs) {
            if (config.type == 0) {
                continue
            }
            let bg: egret.Bitmap = Util.createBitmapByName(config.bg)
            this.addChild(bg)
            if (config.type % 2 != 0) {
                bg.x = this.stage.stageWidth / 2 - bg.width - 30
            } else {
                bg.x = this.stage.stageWidth / 2 + 30
            }
            if (config.type < 17) {
                bg.y = y
            } else {
                bg.y = y + bg.height
            }
            
            bg.touchEnabled = true
            bg.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                Util.playMusic('model_select_mp3')
                let scene = new EquipList(config)
                ViewManager.getInstance().changeScene(scene)
            }, this)
        }

        let searchInput = new SearchInput('')
        searchInput.x = (this.stage.stageWidth - 515) / 2
        searchInput.y = 230
        this.addChild(searchInput)
    }
}