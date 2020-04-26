class DialogContainer extends eui.Group {

    public constructor(ctr) {
        super()
        this.init()

        var panel = new eui.Panel()
        ctr.horizontalCenter = 0
        ctr.verticalCenter = 0
        this.addChild(panel)

        let stage = ViewManager.getInstance().stage
        panel.height = 1000
        panel.width = 700
        panel.y = stage.stageHeight / 2
        panel.x = (stage.stageWidth) / 2

        panel.anchorOffsetX = panel.width / 2
        panel.anchorOffsetY = panel.height / 2
        panel.scaleX = 0
        panel.scaleY = 0
        egret.Tween.get(panel).to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.backInOut)

        panel.addChild(ctr)
    }

    private init() {
        let stage = ViewManager.getInstance().stage
        let mask: egret.Bitmap = Util.createBitmapByName('bg_png')
        mask.y = 0
        mask.x = 0
        mask.width = stage.stageWidth
        mask.height = stage.stageHeight
        this.addChild(mask)
    }
}
