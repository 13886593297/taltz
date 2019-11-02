class TrainScene extends Scene {
    /**
     * 徽章配置信息
     */
    private bandge
    /**
     * 选中标签
     */
    private selected
    constructor() {
        super()
        this.bandge = Util.getConfig('bandge')
        this.btn_bg = 'close_png'
        Util.setTitle('训练场')
    }

    public init() {
        super.setBackground()
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
        let gradeArr = ['train_grade1_png', 'train_grade2_png', 'train_grade3_png', 'train_grade4_png']
        gradeArr.forEach((item, key) => {
            let grade = Util.createBitmapByName(item)
            grade.touchEnabled = true
            if (Math.floor(userinfo.lv / 20) < key) {
                grade.filters = [grayFliter]
                grade.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                    Util.playMusic('model_select_mp3')
                    let alert = new AlertPanel("提示:请先通关前面的关卡后再来哦！", 900)
                    this.addChild(alert)
                }, this)
            } else {
                grade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.initLevelView(this.bandge[key]), this)
            }
            if (key % 2 == 0) {
                grade.x = this.stage.stageWidth / 2 - grade.width - 10
            } else {
                grade.x = this.stage.stageWidth / 2 + 10
            }
            if (key < 2) {
                grade.y = 0
            } else {
                grade.y = grade.height
            }
            group.addChild(grade)
        })

        // 我的收藏
        let favor: egret.Bitmap = Util.createBitmapByName("myfavor_png")
        favor.y = 1030
        favor.x = this.stage.stageWidth / 2
        favor.anchorOffsetX = favor.width / 2
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
        this.selected = bandge
        return () => {
            Util.playMusic('model_select_mp3')
            DataManager.getInstance().setCurrentBandge(bandge)
            let scene = new TrainLevelScene(bandge)
            ViewManager.getInstance().changeScene(scene)
        }
    }
}