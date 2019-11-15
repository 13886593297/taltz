class FavorScene extends Scene {
    private favors
    constructor(favors, isBackHome = false) {
        super()
        this.favors = favors
        this.isBackHome = isBackHome
    }

    public init() {
        super.setBackground()
        Util.setTitle('我的收藏')

        let y = 10
        let title = Util.createBitmapByName('favor_title_png')
        this.addChild(title)
        title.y = y

        y += 190
        for (let item of this.favors) {
            let bg: egret.Bitmap
            switch (item.attrVal) {
                case '产品信息':
                    bg = Util.createBitmapByName("favor_title_cpxx_png")
                    break
                case '竞品分析':
                    bg = Util.createBitmapByName("favor_title_jpfx_png")
                    break
                case '市场策略':
                    bg = Util.createBitmapByName("favor_title_sccl_png")
                    break
                case '疾病信息':
                    bg = Util.createBitmapByName("favor_title_jbxx_png")
                    break
                case '作用机制':
                    bg = Util.createBitmapByName("favor_title_zyjz_png")
                    break
                default:
                    bg = Util.createBitmapByName("favor_title_lcyj_png")
                    break
            }
            bg.x = (this.stage.width - bg.width) / 2
            bg.y = y
            this.addChild(bg)
            y += 150
            bg.touchEnabled = true
            bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.train(item), true)
        }
    }

    private train(item) {
        return () => {
            Http.getInstance().post(Url.HTTP_TRAIN_START, { type: 2, tid: item.qattrId }, (data) => {
                if (data.data.length > 0) {
                    let answer = new Answers()
                    answer.lifecycleId = item.qattrId
                    answer.questions = data.data
                    let levelData = item
                    levelData.name = item.attrVal
                    levelData.flag = ""
                    let scene = new AnswerScene(answer, 2, levelData)
                    ViewManager.getInstance().changeScene(scene)
                } else {
                    let alert = new AlertPanel("提示:暂无收藏！", 1200)
                    this.addChild(alert)
                }
            })
        }
    }
}