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

class PkItem2 extends eui.Group {
    private data

    constructor(data) {
        super()
        this.data = data
        this.init()
    }

    private init() {
        let stageW = ViewManager.getInstance().stage.stageWidth
        let bg: egret.Bitmap = Util.createBitmapByName('pk_title_bg_png')
        bg.x = (stageW - bg.width) / 2
        this.width = bg.width
        this.height = bg.height
        this.addChild(bg)

        let title = new egret.TextField()
        title.text = this.data.title
        title.width = 168
        title.height = 63
        title.x = 110
        title.verticalAlign = 'middle'
        title.textAlign = 'center'
        title.size = 30
        this.addChild(title)

        let icon = Util.createBitmapByName(this.data.icon)
        icon.x = 618
        icon.y = 40
        this.addChild(icon)
    }
}
