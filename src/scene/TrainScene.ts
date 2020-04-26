class TrainScene extends Scene {
    private bandge
    constructor(isBackHome = false) {
        super()
        this.isBackHome = isBackHome
        this.bandge = Util.getConfig('bandge')
        Util.setTitle('训练场')
    }

    public init() {
        super.setBackground()
        this.name = 'trainScene'
        // 标题
        let title = Util.createBitmapByName('train_title_png')
        this.addChild(title)

        let group = new eui.Group()
        group.y = 250
        group.width = this.stage.width
        this.addChild(group)

        let userinfo = DataManager.getInstance().getUser()
        let grayFliter = Util.grayFliter()

        // 关卡
        for (let i = 0; i < this.bandge.length; i++) {
            let grade = Util.createBitmapByName(`train_grade${i + 1}_png`)
            grade.touchEnabled = true
            // 未通关
            if (userinfo.lv < this.bandge[i].start) {
                grade.filters = [grayFliter]
                grade.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                    Util.playMusic('model_select_mp3')
                    let alert = new AlertPanel("提示:请先通关前面的关卡后再来哦！", 900)
                    this.addChild(alert)
                }, this)
            } else {
                grade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.initLevelView(this.bandge[i]), this)
            }
            grade.x = i % 2 == 0 ? this.stage.stageWidth / 2 - grade.width - 10 : this.stage.stageWidth / 2 + 10
            grade.y = i < 2 ? 0 : grade.height
            group.addChild(grade)
        }

        // 我的收藏
        let favor: egret.Bitmap = Util.createBitmapByName("myfavor_png")
        favor.x = (this.stage.stageWidth - favor.width) / 2
        favor.y = 1030
        this.addChild(favor)
        favor.touchEnabled = true
        favor.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            Http.getInstance().post(Url.HTTP_FAVOR_LIST, "", data => {
                if (data.data && data.data.length > 0) {
                    let scene = new FavorScene(data.data)
                    ViewManager.getInstance().changeScene(scene)
                } else {
                    let alert = new AlertPanel("提示:暂无收藏！", 900)
                    this.addChild(alert)
                }
            })
        }, this)
    }

    /**
     * 关卡界面
     */
    private initLevelView(bandge) {
        return () => {
            Util.playMusic('model_select_mp3')
            DataManager.getInstance().setCurrentBandge(bandge)
            let scene = new TrainLevelScene(bandge)
            ViewManager.getInstance().changeScene(scene)
        }
    }
}