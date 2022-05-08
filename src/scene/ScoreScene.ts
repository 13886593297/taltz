class ScoreScene extends Scene {
    constructor() {
        super()
    }

    public init() {
        super.setBackground()
        this.close_btn = 'close_yellow_png'
        this.isBackHome = true

        let shareGroup = new eui.Group()
        this.addChild(shareGroup)

        // 玩家信息
        let user = new UserInfo('score')
        shareGroup.addChild(user)

        // 保存图片和分享
        let saveButton = Util.createBitmapByName('button_small_1_png')
        saveButton.x = this.stage.stageWidth / 2 - saveButton.width - 10
        saveButton.y = 1020
        saveButton.touchEnabled = true
        this.addChild(saveButton)

        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let alert = new AlertPanel("提示:请自行截图保存图片", 1150)
            this.addChild(alert)
        }, this)

        let shareButton = Util.createBitmapByName('button_small_2_png')
        shareButton.x = this.stage.stageWidth / 2 + 10
        shareButton.y = 1020
        shareButton.touchEnabled = true
        this.addChild(shareButton)
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let tips = new SharePanel()
            this.addChild(tips)
        }, this)

        this.registerShare(shareGroup)
    }

    private registerShare(shareGroup) {
        let user = DataManager.getInstance().getUser()
        let trainResult = user.trainResult
        if (user && trainResult) {
            let rateValue = Math.round(trainResult.trainCorrectCount * 100 / trainResult.trainTotalCount)
            Util.registerShare(shareGroup, ShareType.TRAIN_RESULT, user.nickName, rateValue + '%')
        }
    }
}