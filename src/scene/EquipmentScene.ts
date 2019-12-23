class EquipmentScene extends Scene {
    configs = [
        { icon: '', bg: '', name: '搜索结果', type: 0 },
        { icon: '', bg: 'equip_bg_1_png', name: '最新内容', type: 15 },
        { icon: '', bg: 'equip_bg_2_png', name: '疾病档案', type: 16 },
        { icon: '', bg: 'equip_bg_3_png', name: '产品资料', type: 17 },
        { icon: '', bg: 'equip_bg_4_png', name: '竞品分析', type: 18 },
    ]

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

        let y = 325
        for (let config of this.configs) {
            if (config.type == 0) {
                continue
            }
            let bg: egret.Bitmap = Util.createBitmapByName(config.bg)
            this.addChild(bg)
            if (config.type % 2 != 0) {
                bg.x = this.stage.stageWidth / 2 - bg.width
            } else {
                bg.x = this.stage.stageWidth / 2
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