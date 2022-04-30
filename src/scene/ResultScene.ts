
/**
 * 答题结果页
 */
class ResultScene extends Scene {

    private result
    private errors
    private levelData
    private lifecycleid
    private winnerText
    private type

    constructor(params) {
        super()
        this.result = params.result
        this.errors = params.errors
        this.levelData = params.levelData
        this.lifecycleid = params.lifecycleid
        this.type = params.type
    }

    public init() {
        super.setBackground()
        this.isBackHome = true

        if (this.type != 9) {
            let group = new eui.Group()
            group.x = 170
            group.y = 25
            this.addChild(group)

            let flagBg = Util.createBitmapByName('flagBg_png')
            group.addChild(flagBg)

            // 等级
            let flagText = new egret.TextField()
            flagText.text = this.levelData.flag
            flagText.width = flagBg.width
            flagText.height = flagBg.height + 10
            flagText.textAlign = egret.HorizontalAlign.CENTER
            flagText.verticalAlign = egret.VerticalAlign.MIDDLE
            flagText.size = 28
            group.addChild(flagText)

            // 名称
            let flagName = new egret.TextField()
            flagName.text = this.levelData.name
            flagName.verticalAlign = egret.VerticalAlign.MIDDLE
            flagName.textAlign = egret.HorizontalAlign.CENTER
            flagName.stroke = 6
            flagName.strokeColor = 0x0d793b
            flagName.size = 80
            flagName.x = flagBg.width - 20
            flagName.height = flagBg.height + 10
            group.addChild(flagName)
        }

        let bg
        let music
        if (!this.result.isPass) {
            bg = this.type == 9 ? Util.createBitmapByName('dailyTasks_result_fail_png') : Util.createBitmapByName('train_fail_png')
            music = "nopass_mp3"
        } else {
            bg = this.type == 9 ? Util.createBitmapByName('dailyTasks_result_success_png') : Util.createBitmapByName('train_success_png')
            music = "pass_mp3"
        }

        bg.y = 200
        this.addChild(bg)
        Util.playMusic(music)

        Http.getInstance().post(Url.HTTP_USER_BASE_INFO, "", (info) => {
            DataManager.getInstance().updateUserInfo(info.data)
        })

        let ratevalue = Math.round(this.result.correct * 100 / (this.result.correct + this.result.error))
        let rate

        if (this.result.isPass) {
            rate = this.createScoreView([
                { text: '正确率\n', style: { size: 20 } },
                { text: ratevalue + '%' }
            ])
            if (this.type == 9) {
                rate.x = 550
                rate.y = 460
            } else {
                rate.x = 160
                rate.y = 640
                let score = this.createScoreView([
                    { text: '积分\n', style: { size: 20 } },
                    { text: '+' + this.result.addScore }
                ])
                score.x = 508
                score.y = 288
                this.addChild(score)
            }
        } else {
            rate = this.createScoreView([
                { text: '正确率\n', style: { size: 20 } },
                { text: ratevalue + '%' }
            ])
            rate.x = this.type == 9 ? 112 : 560
            rate.y = this.type == 9 ? 535 : 424
        }
        this.addChild(rate)

        if (this.type == 9 && ratevalue == 100) {
            //签到
            Http.getInstance().post(Url.HTTP_SIGN, {}, (data) => { })
            DataManager.getInstance().hasShowSignIn = true
        }

        // 继续训练
        if (this.type != 9 || !this.result.isPass) {
            let restartButton = Util.createBitmapByName(this.type == 9 ? 'dailyTasks_tryAgain_png' : 'continueTrain_png')
            restartButton.y = 1025
            restartButton.x = this.stage.stageWidth / 2 - restartButton.width - 10
            this.addChild(restartButton)

            restartButton.touchEnabled = true
            restartButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                if (this.type == 9) {
                    let week = DataManager.getInstance().getTime()
                    let i
                    if (week == 2) {
                        i = Util.getDailyTaskID()
                        Http.getInstance().post(Url.HTTP_DAILYTASKS_START, { questionAttrIds: EquipmentConfigs[i].qaids }, (data) => {
                            let answer = new Answers()
                            answer.lifecycleId = data.data.lifecycleId
                            answer.questions = data.data.questions.slice(0, 5)
                            let scene = new AnswerScene(answer, this.type)
                            ViewManager.getInstance().changeScene(scene)
                        })
                    } else {
                        Http.getInstance().post(Url.HTTP_DAILYTASKS_CONTENT, {}, (json) => {
                            i = json.data[0].typeid
                            Http.getInstance().post(Url.HTTP_DAILYTASKS_START, { questionAttrIds: EquipmentConfigs[i].qaids }, (data) => {
                                let answer = new Answers()
                                answer.lifecycleId = data.data.lifecycleId
                                answer.questions = data.data.questions
                                let scene = new AnswerScene(answer, this.type)
                                ViewManager.getInstance().changeScene(scene)
                            })
                        })
                    }
                } else {
                    let bandge = DataManager.getInstance().getCurrentBandge()
                    let scene = new TrainLevelScene(bandge)
                    ViewManager.getInstance().changeScene(scene)
                }
            }, this)
        }

        // 炫耀成绩
        if (this.type != 9) {
            let saveButton = Util.createBitmapByName('flaunt_png')
            saveButton.y = 1025
            saveButton.x = this.stage.stageWidth / 2 + 10
            this.addChild(saveButton)

            saveButton.touchEnabled = true
            saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                Http.getInstance().post(Url.HTTP_TRAIN_REPORT, { lifecircle: this.lifecycleid }, (json) => {
                    //TODO 
                    DataManager.getInstance().updateUserInfo(json.data.userBase)
                    DataManager.getInstance().updateUser('trainResult', json.data.trainResult)
                    let scene = new ScoreScene()
                    ViewManager.getInstance().changeScene(scene)
                })
            }, this)
        }

        // 错题分析
        if (this.result.error > 0) { //通关失败  TODO
            let errorButton = Util.createBitmapByName(this.type == 9 ? 'dailyTasks_errorAnalyze_png' : 'errorParse_png')
            errorButton.y = this.type == 9 ? 1025 : 900
            errorButton.x = this.type == 9 ? this.stage.stageWidth / 2 + 10 : (this.stage.stageWidth - errorButton.width) / 2
            this.addChild(errorButton)

            errorButton.touchEnabled = true
            errorButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                let scene = new ErrorScene(this.errors, this.type)
                ViewManager.getInstance().changeScene(scene)
            }, this)
        }
    }

    private createScoreView(text) {
        let w = 90
        let group = new eui.Group()
        group.width = w
        group.height = w

        let textField = new egret.TextField()
        textField.textFlow = text
        textField.textColor = 0xFFFFFF
        textField.width = w
        textField.height = w
        textField.textAlign = egret.HorizontalAlign.CENTER
        textField.verticalAlign = egret.VerticalAlign.MIDDLE
        group.addChild(textField)
        return group
    }
}