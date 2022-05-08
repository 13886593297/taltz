/**
 * 答题界面
 */

class AnswerScene extends Scene {

    private _progress
    private type
    private curIdx = 1
    private errorStatus = false
    private isNext = false

    private commitButton
    private topic
    private numberText

    private answers: Answers
    private curSubject
    private errors = []

    /**错题分析按钮 */
    private analysisButton
    private levelData
    private favorIcon

    private topicGroup
    private scroller

    private start
    private persent

    constructor(answers, type = TrainType.TRAIN, levelData = null) {
        super()
        this.answers = answers
        this.type = type
        this.levelData = levelData
    }

    public init() {
        if (this.type == TrainType.TRAIN) {
            this.close_btn = false
        }
        super.setBackground()
        this.start = +new Date()

        let title = new TrainTitleClass(this.levelData.flag, this.levelData.name, this.type)
        title.x = 180
        title.y = 25
        this.addChild(title)

        if (this.type == TrainType.TRAIN) {
            // Q1
            let number = new egret.TextField()
            number.text = "Q" + this.curIdx
            number.textColor = Config.COLOR_MAINCOLOR
            number.x = 150
            number.y = 172
            this.numberText = number
            this.addChild(number)

            // 进度条
            let pBar = new eui.ProgressBar()
            pBar.maximum = this.answers.questions.length < 10 ? this.answers.questions.length : 10//设置进度条的最大值
            pBar.minimum = 1//设置进度条的最小值
            pBar.width = 310
            pBar.height = 27
            this.addChild(pBar)
            pBar.x = 220
            pBar.y = 170
            pBar.value = this.curIdx//设置进度条的初始值
            this._progress = pBar
        }

        let trainid = this.answers.questions[this.curIdx - 1].qid
        let subject: Subject = Util.getTrain(trainid)
        if (!subject) {
            return
        }

        this.curSubject = subject
        //选项 
        var group = new eui.Group()
        group.height = 5000
        this.topicGroup = group

        let topic = new Topic(subject)
        topic.x = (this.stage.stageWidth - topic.width) / 2
        this.topic = topic
        group.addChild(topic)


        var myScroller: eui.Scroller = new eui.Scroller()
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth
        myScroller.height = 650
        myScroller.y = 250
        //设置viewport
        myScroller.viewport = group
        this.addChild(myScroller)
        this.scroller = myScroller

        if (this.type == TrainType.TRAIN) {
            let favorButton = new XButton('加入收藏')
            favorButton.x = this.stage.stageWidth / 2 - favorButton.width - 10
            favorButton.y = 1040

            let isFavor = this.answers.questions[this.curIdx - 1].isCollect
            let resource = 'favor_png'
            if (isFavor) resource = 'favor_fill_png'
            let favorIcon = Util.createBitmapByName(resource)
            favorIcon.width = 60
            favorIcon.height = 60
            favorIcon.x = 30
            favorIcon.y = 15
            this.favorIcon = favorIcon
            favorButton.addChild(favorIcon)

            favorButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                //请求收藏id 
                let isFavor = this.answers.questions[this.curIdx - 1].isCollect
                if (!isFavor) {
                    let qid = this.answers.questions[this.curIdx - 1].qid
                    Http.getInstance().post(Url.HTTP_FAVOR_SUBJECT, { qid: qid, type: 1 }, (json) => {
                        resource = 'favor_fill_png'
                        favorIcon.texture = RES.getRes(resource)
                        this.answers.questions[this.curIdx - 1].isCollect = true
                    })
                } else {
                    let qid = this.answers.questions[this.curIdx - 1].qid
                    Http.getInstance().post(Url.HTTP_FAVOR_SUBJECT, { qid: qid, type: 2 }, (json) => {
                        resource = 'favor_png'
                        favorIcon.texture = RES.getRes(resource)
                        this.answers.questions[this.curIdx - 1].isCollect = false
                    })
                }

            }, this)
            this.addChild(favorButton)
        } else {
            let favorButton = new XButton('删除')
            favorButton.x = this.stage.stageWidth / 2 - favorButton.width - 10
            favorButton.y = 1040
            this.addChild(favorButton)

            let favorIcon = Util.createBitmapByName('icon_err_png')
            favorIcon.width = 60
            favorIcon.height = 60
            favorIcon.x = 30
            favorIcon.y = 20
            favorButton.addChild(favorIcon)

            favorButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                //请求收藏id 
                if (!this.answers.questions[this.curIdx - 1]) return
                let qid = this.answers.questions[this.curIdx - 1].qid
                Http.getInstance().post(Url.HTTP_FAVOR_SUBJECT, { qid: qid, type: 2 }, (json) => {
                    this.answers.questions.splice(this.curIdx - 1, 1)
                    if (this.answers.questions.length == 0) {
                        // ViewManager.getInstance().back()


                        Http.getInstance().post(Url.HTTP_FAVOR_LIST, "", data => {
                            if (data.data && data.data.length > 0) {
                                let scene = new FavorScene(data.data, true)
                                ViewManager.getInstance().changeScene(scene)
                            } else {
                                let scene = new TrainScene(true)
                                ViewManager.getInstance().changeScene(scene)
                            }
                        })
                        return
                    }

                    if (this.curIdx >= this.answers.questions.length) {//最后一项
                        this.curIdx = this.answers.questions.length - 1
                    }
                    this.next()
                })
            }, this)
        }
        let flag = true

        let subButton = new XButton('提交', ButtonType.YELLOW)
        this.commitButton = subButton
        subButton.y = 1040
        subButton.x = this.stage.stageWidth / 2 + 10
        this.addChild(subButton)
        subButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let isEnd = false
            if (this.curIdx == this.answers.questions.length) {
                isEnd = true
            }
            if (isEnd && this.isNext) {
                if (this.type == TrainType.TRAIN) {
                    Http.getInstance().post(Url.HTTP_TRAIN_END, { lifecycleid: this.answers.lifecycleId }, (json) => {
                        DataManager.getInstance().updateUserInfo(json.data.userBase)
                        let params = {
                            result: json.data,
                            errors: this.errors,
                            levelData: this.levelData,
                            lifecycleid: this.answers.lifecycleId,
                            type: this.type
                        }
                        let result = new ResultScene(params)
                        ViewManager.getInstance().changeScene(result)
                    })
                } else {
                    ViewManager.getInstance().back()
                }
            } else {
                if (this.isNext) { //下一题
                    this.next()
                } else { //提交
                    let selectOption = this.topic.getSelect()
                    if (!selectOption) {
                        //TODO 
                        let alert = new AlertPanel("提示：请先选择答案！", 160)
                        alert.x = 80
                        alert.scaleX = 1.2
                        alert.scaleY = 1.1
                        this.addChild(alert)
                        return
                    }

                    if (!flag) return
                    flag = false

                    let qid = this.answers.questions[this.curIdx - 1].qid
                    let result = this.topic.getSelectResult()

                    let curerntTime = + new Date()
                    let useTime = (curerntTime - this.start) / 1000
                    let params = {
                        levelid: this.levelData.levelid,
                        lifecycleid: this.answers.lifecycleId,
                        qid: qid,
                        serialno: this.curIdx,
                        qattrid: this.curSubject.qattrid,
                        reply: selectOption,
                        iscorrect: result ? 1 : 0,
                        useTime: useTime,
                    }
                    Http.getInstance().post(Url.HTTP_TRAIN_SUBMIT, params, (json) => {
                        this.topic.setDisableSeleced()
                        this.analysisButton.visible = true
                        if (result) {
                            Util.playMusic('answer_ok_mp3')
                            this.topic.setSelectedStatus(TopicItem.STATUS_OK)
                        }
                        else {
                            this.topic.setSelectedStatus(TopicItem.STATUS_ERROR)
                            Util.playMusic('answer_err3_mp3')
                            this.errors.push(qid)
                        }
                        let buttonText = "下一题"
                        if (isEnd) {
                            buttonText = "结束"
                        }
                        subButton.labelDisplay.text = buttonText
                        this.isNext = true
                        flag = true
                    })
                }
            }

        }, this)


        // 题目分析
        let analysisButton = Util.createBitmapByName('icon_tmfx_png')
        analysisButton.y = 920
        analysisButton.x = this.stage.stageWidth / 2
        analysisButton.anchorOffsetX = analysisButton.width / 2
        analysisButton.touchEnabled = true
        this.addChild(analysisButton)
        this.analysisButton = analysisButton
        analysisButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let scene = new AnalysisScene(this.curSubject, '题目分析')
            ViewManager.getInstance().changeScene(scene)
        }, this)
        if (this.type == TrainType.TRAIN) {
            analysisButton.visible = false
        }
    }

    /**
     * 下一题
     */
    public next() {
        this.start = +new Date()
        this.commitButton.labelDisplay.text = '提交'
        this.isNext = false
        this.curIdx = this.curIdx + 1
        if (this.type == TrainType.TRAIN) {
            this.numberText.text = `Q${this.curIdx}`
        }
        if (this._progress) this._progress.value = this.curIdx

        let trainid = this.answers.questions[this.curIdx - 1].qid
        let subject: Subject = Util.getTrain(trainid)
        if (!subject) return
        this.curSubject = subject

        if (this.favorIcon) {
            let isFavor = this.answers.questions[this.curIdx - 1].isCollect
            let resource = 'favor_png'
            if (isFavor) resource = 'favor_fill_png'
            this.favorIcon.texture = RES.getRes(resource)
        }
        this.topicGroup.removeChild(this.topic)
        //选项 
        let topic = new Topic(subject)
        topic.x = (this.stage.stageWidth - topic.width) / 2
        this.topic = topic
        this.topicGroup.addChild(topic)
        if (this.type == TrainType.TRAIN) {
            this.analysisButton.visible = false
        }
        this.scroller.viewport.scrollV = 0
    }
}

class TrainTitleClass extends eui.Group {
    constructor(private flag: string, private levelName: string, private type: TrainType) {
        super()
        this.flag = flag
        this.levelName = levelName
        this.type = type
        this.init()
    }
    private init() {
        console.warn('this.levelName', this.levelName)
        // 名称
        let levelName = new egret.TextField()
        levelName.text = this.levelName
        levelName.verticalAlign = egret.VerticalAlign.MIDDLE
        levelName.textAlign = egret.HorizontalAlign.CENTER

        if (this.type == TrainType.TRAIN) {
            let flagBg = Util.createBitmapByName('flagBg_png')
            this.addChild(flagBg)
    
            // 等级
            let flagText = new egret.TextField()
            flagText.text = this.flag
            flagText.width = flagBg.width
            flagText.height = flagBg.height + 10
            flagText.textAlign = egret.HorizontalAlign.CENTER
            flagText.verticalAlign = egret.VerticalAlign.MIDDLE
            flagText.size = 28
            this.addChild(flagText)
    
            levelName.stroke = 6
            levelName.strokeColor = Config.COLOR_MAINCOLOR
            levelName.size = 80
            levelName.x = flagBg.width + 20
            levelName.height = flagBg.height + 10
        } else {
            let flagBg = Util.createBitmapByName('flagBg_blank_png')
            this.addChild(flagBg)
    
            levelName.size = 60
            levelName.width = flagBg.width
            levelName.height = flagBg.height - 10
        }
        this.addChild(levelName)
    }
}