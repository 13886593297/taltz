class SharePanel extends eui.Group {
    public constructor() {
        super()
        this.init()
    }

    public init() {
        let stage = ViewManager.getInstance().stage
        let mask: egret.Bitmap = Util.createBitmapByName('mask_png')
        mask.y = 0
        mask.x = 0
        mask.width = stage.stageWidth
        mask.height = stage.stageHeight
        this.addChild(mask)

        let share_arrow = Util.createBitmapByName('share_arrow_png')
        share_arrow.x = 580
        this.addChild(share_arrow)

        let share_tips
        if (egret.Capabilities.os == 'Android') {
            share_tips = Util.createBitmapByName('share_tips_android_jpg')
            share_tips.width = stage.stageWidth
            share_tips.height = stage.stageWidth * 0.634
        } else {
            share_tips = Util.createBitmapByName('share_tips_jpg')
            share_tips.width = stage.stageWidth
            share_tips.height = stage.stageWidth * 0.876
        }
        share_tips.y = stage.stageHeight - share_tips.height
        this.addChild(share_tips)


        this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            Util.playMusic('model_select_mp3')
            this.parent.removeChild(this)
        }, this)
    }
}

class AlertLoading extends eui.Group {

    private text
    private loadingText
    private maskView

    public constructor(text = '') {
        super()

        this.text = text
        this.init()
    }
    public init() {
        this.height = 150
        this.width = 400
        let stage = ViewManager.getInstance().stage
        let mask: egret.Bitmap = Util.createBitmapByName('mask_png')
        this.maskView = mask
        mask.alpha = 0.5
        mask.width = this.width

        mask.x = stage.stageWidth / 2
        mask.y = stage.stageHeight / 2
        mask.anchorOffsetX = this.width / 2
        mask.anchorOffsetY = this.height / 2
        this.addChildAt(mask, 100)


        let loading = Util.createBitmapByName('loading_png')
        this.addChildAt(loading, 101)
        loading.width = 64
        loading.height = 64
        loading.x = stage.stageWidth / 2
        loading.y = stage.stageHeight / 2 - 20
        loading.anchorOffsetX = 32
        loading.anchorOffsetY = 32
        egret.Tween.get(loading, { loop: true }).to({ rotation: 360 }, 2500)

        let loadingText = new egret.TextField()
        this.loadingText = loadingText
        loadingText.text = this.text
        loadingText.size = 28
        // loadingText.textColor = Config.COLOR_YELLOW
        loadingText.x = stage.stageWidth / 2
        loadingText.y = stage.stageHeight / 2 + 30
        loadingText.anchorOffsetX = this.width / 2 - 10
        loadingText.width = this.width - 20
        loadingText.verticalAlign = egret.VerticalAlign.MIDDLE
        loadingText.textAlign = egret.HorizontalAlign.CENTER
        loadingText.lineSpacing = 10
        this.height = loadingText.textHeight + 150
        mask.height = this.height
        var shape: egret.Shape = new egret.Shape()
        shape.graphics.beginFill(0xff0000, 1)
        shape.graphics.drawRoundRect(stage.stageWidth / 2 - 200, stage.stageHeight / 2 - 75, this.width, this.height, 10, 10)
        shape.graphics.endFill()
        this.addChild(shape)
        this.mask = shape
        this.addChild(loadingText)

    }
    public setText(text) {
        this.text = text
        this.loadingText.text = this.text
    }

}