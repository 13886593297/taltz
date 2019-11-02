class TrainLevelScene extends Scene {
    /**
        * 选中标签
        */
    private currentLevel
    private levelViews = []
    /**
     * 配置关卡位置，中心点
     */
    private readonly POINTS = [
        { x: 100, y: 70 },
        { x: 460, y: 270 },
        { x: 100, y: 470 },
        { x: 460, y: 670 },

        { x: 100, y: 870 },
        { x: 460, y: 1070 },
        { x: 100, y: 1270 },
        { x: 460, y: 1470 },

        { x: 100, y: 1670 },
        { x: 460, y: 1870 },
        { x: 100, y: 2070 },
        { x: 460, y: 2270 },

        { x: 100, y: 2470 },
        { x: 460, y: 2670 },
        { x: 100, y: 2870 },
        { x: 460, y: 3070 },

        { x: 100, y: 3270 },
        { x: 460, y: 3470 },
        { x: 100, y: 3670 },
        { x: 460, y: 3870 }
    ]

    private bandge
    constructor(bandge) {
        super()
        this.bandge = bandge
    }

    init() {
        super.setBackground()
        this.btn_bg = 'close_png'
        // 标题
        let title = Util.createBitmapByName('train_title_png')
        this.addChild(title)

        this.currentLevel = DataManager.getInstance().getUser().lv
        //创建一个容器，里面包含一张图片
        var group = new eui.Group()
        group.height = 5000
        group.width = this.stage.stageWidth
        this.addChild(group)

        let lineGroup = new eui.Group()
        lineGroup.height = 4100
        group.addChild(lineGroup)
        let i = 0
        for (let k in this.POINTS) {
            let point = this.POINTS[k]
            let data = this.bandge.levels[k]

            if (this.currentLevel < data.key) {
                data.status = LevelStatus.No
            } else if (this.currentLevel == data.key) {
                data.status = LevelStatus.Cur
            } else {
                data.status = LevelStatus.Pass
            }

            let level = new LevelView(data)
            level.x = point.x
            level.y = point.y
            this.levelViews[k] = level
            group.addChild(level)

            level.touchEnabled = true
            level.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                //请求数据
                Util.playMusic('model_select_mp3')
                if (this.currentLevel >= data.key) {
                    Http.getInstance().post(Url.HTTP_TRAIN_START, { type: 1, tid: level.levelData.levelid }, (data) => {
                        if (data.data.questions.length > 0) {
                            let answer = new Answers()
                            answer.lifecycleId = data.data.lifecycleId
                            answer.questions = data.data.questions
                            let scene = new AnswerScene(answer, 1, level.levelData)
                            ViewManager.getInstance().changeScene(scene)
                        }
                        else {
                            let alert = new AlertPanel("提示:请先通关前面的关卡后再来哦", 150)
                            this.addChild(alert)
                        }
                    })
                }
                else {
                    let alert = new AlertPanel("提示:请先通关前面的关卡后再来哦", 150)
                    this.addChild(alert)
                }
            }, this)

            let linePic: egret.Bitmap
            if (i < 19) {
                if (i % 2 == 1) {
                    linePic = Util.createBitmapByName("train_line_left_png")
                    linePic.y = point.y + 90
                }
                else {
                    linePic = Util.createBitmapByName("train_line_right_png")
                    linePic.y = point.y + 100
                }
                group.addChild(linePic)
            }
            i++
        }

        //创建一个Scroller
        var myScroller: eui.Scroller = new eui.Scroller()
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth
        myScroller.height = this.stage.stageHeight - 200
        myScroller.y = 150
        //设置viewport
        myScroller.viewport = group
        this.addChild(myScroller)
    }

    /**
     * 更新页面信息
     */
    public updateScene() {
        this.removeChildren()
        this.init()
        this.crteateNavButton("返回")
    }
}