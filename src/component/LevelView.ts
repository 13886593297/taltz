class LevelView extends eui.Group {
    public levelData
    private readonly IMGS = ["bg_level_pass_png", "bg_level_cur_png", "bg_level_nopass_png"]

    constructor(level) {
        super()
        this.levelData = level
        this.init()
    }

    private init() {
        let grayFliter = Util.grayFliter()
        let group = new eui.Group()
        this.addChild(group)

        if (this.levelData.status == 2) {
            group.filters = [grayFliter]
        }
        
        let bg = Util.createBitmapByName(this.IMGS[this.levelData.status])
        group.addChild(bg)

        // 每关的名称
        let text = new egret.TextField()
        text.width = bg.width
        text.height = bg.height - 30
        text.textFlow = [
            { text: this.levelData.flag + '\n' },
            { text: this.levelData.name }
        ]
        text.textColor = 0xffffff
        text.lineSpacing = 15
        text.textAlign = egret.HorizontalAlign.CENTER
        text.verticalAlign = egret.VerticalAlign.MIDDLE
        text.size = 32
        group.addChild(text)
    }
}