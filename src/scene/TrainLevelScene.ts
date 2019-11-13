class TrainLevelScene extends Scene {
    private bandge
    constructor(bandge) {
        super()
        this.bandge = bandge
    }

    init() {
        super.setBackground()
        // 标题
        let title = Util.createBitmapByName('train_title_png')
        this.addChild(title)

        let currentLevel = DataManager.getInstance().getUser().lv
        //创建一个容器，里面包含一张图片
        var group = new eui.Group()
        group.height = 5000
        group.width = 570
        this.addChild(group)

        let lineGroup = new eui.Group()
        lineGroup.height = 4100
        group.addChild(lineGroup)
        let y = 70
        for (let i = 0; i < 20; i++) {
            // 每关的信息
            let data = this.bandge.levels[i]
            // 判断是否通关
            if (currentLevel < data.key) {
                // 未解锁
                data.status = 2
            } else if (currentLevel == data.key) {
                // 当前关卡
                data.status = 1
            } else {
                // 已通关
                data.status = 0
            }

            let level = new LevelView(data)
            if (i % 2 == 0) {
                level.x = 0
            } else {
                level.x = group.width - level.width
            }
            level.y = y
            group.addChild(level)

            level.touchEnabled = true
            level.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                //请求数据
                Util.playMusic('model_select_mp3')
                if (currentLevel >= data.key) {
                    Http.getInstance().post(Url.HTTP_TRAIN_START, { type: 1, tid: level.levelData.levelid }, data => {
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

            // 关卡之间的连接线条
            let linePic: egret.Bitmap
            if (i < 19) {
                if (i % 2 == 1) {
                    linePic = Util.createBitmapByName("train_line_left_png")
                    linePic.y = y + 90
                } else {
                    linePic = Util.createBitmapByName("train_line_right_png")
                    linePic.y = y + 100
                }
                linePic.x = -100
                group.addChild(linePic)
            }
            y += 200
        }

        //创建一个Scroller
        var myScroller: eui.Scroller = new eui.Scroller()
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = group.width
        myScroller.height = this.stage.stageHeight - 200
        myScroller.x = (this.stage.stageWidth - group.width) / 2
        myScroller.y = 150
        //设置viewport
        myScroller.viewport = group
        this.addChild(myScroller)
    }
}