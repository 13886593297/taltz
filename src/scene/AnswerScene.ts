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
    private topicY
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

    constructor(answers, type = 1, levelData = null) {
        super()
        this.answers = answers
        this.type = type
        this.levelData = levelData
    }

    public init() {
        this.close_btn = false
        super.setBackground()
        this.start = +new Date()
        let y = 25

        let title = this.trainTitle(this.levelData.flag, this.levelData.name)
        title.x = 170
        title.y = 25
        this.addChild(title)

        y += 145
        //进度条
        if (this.type == 1) {
            // 进度条
            let pBar = new eui.ProgressBar()
            pBar.maximum = 10//设置进度条的最大值
            pBar.minimum = 1//设置进度条的最小值
            pBar.width = 400
            pBar.height = 40
            this.addChild(pBar)
            pBar.x = 150
            pBar.y = 170
            pBar.value = this.curIdx//设置进度条的初始值
            this._progress = pBar

            y += 7
            // Q1
            let number = new egret.TextField()
            number.text = "Q" + this.curIdx
            number.textColor = 0x35af38
            number.x = 85
            number.y = 177
            this.numberText = number
            this.addChild(number)
        }

        y += 100

        let trainid = this.answers.questions[this.curIdx - 1].qid
        let subject: Subject = Util.getTrain(trainid)
        if (!subject) {
            return
        }

        this.curSubject = subject
        //选项 
        var group = new eui.Group()
        group.height = 5000
        group.y = 10
        // group.width = 600
        // this.addChild(group)
        this.topicGroup = group

        let topic = new Topic(subject)
        // topic.y = y
        this.topic = topic
        this.topicY = 277
        group.addChild(topic)


        var myScroller: eui.Scroller = new eui.Scroller()
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth
        myScroller.x = 60
        myScroller.height = 700
        myScroller.y = 277
        //设置viewport
        myScroller.viewport = group
        this.addChild(myScroller)
        this.scroller = myScroller


        if (this.type == 1) {
            let favorButton = new XButton('加入收藏')
            favorButton.x = this.stage.stageWidth / 2 - favorButton.width - 10
            favorButton.y = 1120

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
            favorButton.y = 1120
            this.addChild(favorButton)

            let favorIcon = Util.createBitmapByName('icon_err_png')
            favorIcon.width = 60
            favorIcon.height = 60
            favorIcon.x = 30
            favorIcon.y = 20
            favorButton.addChild(favorIcon)

            favorButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                //请求收藏id 
                let qid = this.answers.questions[this.curIdx - 1].qid
                Http.getInstance().post(Url.HTTP_FAVOR_SUBJECT, { qid: qid, type: 2 }, (json) => {
                    this.answers.questions.splice(this.curIdx - 1, 1)
                    if (this.answers.questions.length == 0) {
                        ViewManager.getInstance().back()
                        return
                    }

                    if (this.curIdx >= this.answers.questions.length) {//最后一项
                        this.curIdx = this.answers.questions.length - 1
                    }
                    this.next()
                })
            }, this)
        }

        let subButton = new XButton('提交', ButtonType.YELLOW)
        this.commitButton = subButton
        subButton.y = 1120
        subButton.x = this.stage.stageWidth / 2 + 10
        this.addChild(subButton)
        subButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let isEnd = false
            if (this.curIdx == this.answers.questions.length) {
                isEnd = true
            }
            if (isEnd && this.isNext) {
                if (this.type == 1) {
                    Http.getInstance().post(Url.HTTP_TRAIN_END, { lifecycleid: this.answers.lifecycleId }, (json) => {
                        DataManager.getInstance().updateUserInfo(json.data.userBase)
                        let params = {
                            result: json.data,
                            errors: this.errors,
                            levelData: this.levelData,
                            lifecycleid: this.answers.lifecycleId
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
                }
                else { //提交
                    let selectOption = this.topic.getSelect()
                    if (!selectOption) {
                        //TODO 
                        let alert = new AlertPanel("请选择答案！", 1240)
                        this.addChild(alert)
                        return
                    }

                    let qid = this.answers.questions[this.curIdx - 1].qid
                    let result = this.topic.getSelectResult()

                    let curerntTime = + new Date()
                    let useTime = (curerntTime - this.start) / 1000
                    let params = {
                        "levelid": this.levelData.levelid,
                        "lifecycleid": this.answers.lifecycleId,
                        "qid": qid,
                        "serialno": this.curIdx,
                        "qattrid": this.curSubject.qattrid,
                        "reply": selectOption,
                        "iscorrect": result ? 1 : 0,
                        "useTime": useTime
                    }
                    Http.getInstance().post(Url.HTTP_TRAIN_SUBMIT, params, (json) => {
                        this.topic.setDisableSeleced()
                        this.analysisButton.visible = true
                        if (result) {
                            //this.analysisButton.labelDisplay.text = "题目分析"
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
                    })
                }
            }

        }, this)


        y += 90
        // 题目分析
        let analysisButton = Util.createBitmapByName('icon_tmfx_png')
        analysisButton.y = 1000
        analysisButton.x = this.stage.stageWidth / 2
        analysisButton.anchorOffsetX = analysisButton.width / 2
        analysisButton.touchEnabled = true
        this.addChild(analysisButton)
        this.analysisButton = analysisButton
        analysisButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let scene = new AnalysisScene(this.curSubject, '题目分析')
            ViewManager.getInstance().changeScene(scene)
        }, this)
        if (this.type == 1) {
            analysisButton.visible = false
        }
    }

    private trainTitle(flag: string, name: string): any {
        let group = new eui.Group()

        // 名称
        let flagName = new egret.TextField()
        flagName.text = name
        flagName.verticalAlign = egret.VerticalAlign.MIDDLE
        flagName.textAlign = egret.HorizontalAlign.CENTER

        if (this.type == 1) {
            let flagBg = Util.createBitmapByName('flagBg_png')
            group.addChild(flagBg)

            // 等级
            let flagText = new egret.TextField()
            flagText.text = flag
            flagText.width = flagBg.width
            flagText.height = flagBg.height + 10
            flagText.textAlign = egret.HorizontalAlign.CENTER
            flagText.verticalAlign = egret.VerticalAlign.MIDDLE
            flagText.size = 28
            group.addChild(flagText)

            flagName.stroke = 6
            flagName.strokeColor = 0x0d793b
            flagName.size = 80
            flagName.x = flagBg.width - 20
            flagName.height = flagBg.height + 10
        } else {
            let flagBg = Util.createBitmapByName('flagBg_blank_png')
            group.addChild(flagBg)

            flagName.size = 60
            flagName.width = flagBg.width
            flagName.height = flagBg.height
        }
        group.addChild(flagName)
        return group
    }

    /**
     * 下一题
     */
    public next() {
        this.start = +new Date()
        this.commitButton.labelDisplay.text = '提交'
        this.isNext = false
        this.curIdx = this.curIdx + 1
        if (this.type == 1) {
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
        // topic.y = this.topicY
        this.topic = topic
        this.topicGroup.addChild(topic)
        if (this.type == 1) {
            this.analysisButton.visible = false
        }
        this.scroller.viewport.scrollV = 0
    }
}