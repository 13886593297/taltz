
class PkItem extends eui.Group {
    private data

    constructor(data) {
        super()
        this.data = data
        this.init()
    }

    private init() {
        let stageW = ViewManager.getInstance().stage.stageWidth
        let icon: egret.Bitmap = Util.createBitmapByName(this.data.icon)
        icon.x = (stageW - icon.width) / 2
        this.addChild(icon)

        if (this.data.title) {
            let titleBg = Util.createBitmapByName('pk_list_text_bg_png')
            titleBg.x = (stageW - titleBg.width) / 2
            titleBg.y = icon.height + 20
            this.addChild(titleBg)

            let title = new egret.TextField()
            title.text = this.data.title
            title.width = titleBg.width
            title.height = titleBg.height
            title.x = titleBg.x
            title.y = titleBg.y - 5
            title.verticalAlign = egret.VerticalAlign.MIDDLE
            title.textAlign = 'center'
            title.size = 30
            this.addChild(title)
        }
    }
}