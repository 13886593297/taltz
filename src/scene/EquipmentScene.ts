class EquipmentScene extends Scene {
    configs = [
        { icon: '', bg: '', name: '搜索结果', type: 0 },
        { icon: '', bg: 'equip_bg_1_png', name: '疾病档案', type: 12 },
        { icon: '', bg: 'equip_bg_2_png', name: '产品资料', type: 13 },
        { icon: '', bg: 'equip_bg_3_png', name: '竞品分析', type: 14 },
    ]

    constructor() {
        super()
        Util.setTitle('装备库')
        this.btn_bg = "close_png"
    }

    public init() {
        super.setBackground()
        this.initList()
    }

    private initList() {
        let title = Util.createBitmapByName('equip_title_png')
        title.y = 20
        this.addChild(title)

        let y = 320
        let x = (this.stage.stageWidth - 300) / 2
        for (let config of this.configs) {
            if (config.type == 0) {
                continue
            }
            let bg: egret.Bitmap = Util.createBitmapByName(config.bg)
            this.addChild(bg)
            bg.x = x
            bg.y = y
            bg.touchEnabled = true
            bg.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                Util.playMusic('model_select_mp3')
                let scene = new EquipList(config)
                ViewManager.getInstance().changeScene(scene)
            }, this)
            y += bg.height
        }

        let searchInput = new SearchInput('')
        searchInput.x = (this.stage.stageWidth - 515) / 2
        searchInput.y = 200
        this.addChild(searchInput)
    }
}