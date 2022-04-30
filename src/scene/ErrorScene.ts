
/**
 * 错题分析界面
 */
class ErrorScene extends Scene {

    private errors
    private curIdx = 1

    private title
    private content
    private result
    private nextButton
    private trainButton
    private type

    constructor(errors, type?) {
        super()
        this.errors = errors
        this.type = type
    }

    public init() {
        super.setBackground()
        let title: egret.Bitmap = Util.createBitmapByName('title_error_png')
        title.y = 20
        this.addChild(title)

        let titleText = new egret.TextField()
        titleText.text = `本次共错${this.errors.length}题`
        titleText.textColor = 0x35b039
        titleText.x = (this.stage.stageWidth - titleText.width) / 2
        titleText.y = 200
        titleText.size = 40
        this.addChild(titleText)

        // 题目图片
        let tmfx01 = Util.createBitmapByName('tmfx01_png')
        this.addChild(tmfx01)
        tmfx01.x = 100
        tmfx01.y = 280

        // 题目
        let subject = Util.getTrain(this.errors[this.curIdx - 1])

        if (!subject) return
        let question = new egret.TextField()
        question.text = subject.title
        question.width = 550
        question.lineSpacing = 10
        question.x = 100
        question.y = 370
        question.size = 40
        question.textColor = 0x35b039
        this.title = question
        this.addChild(question)

        let tmfx02 = Util.createBitmapByName('tmfx02_png')
        this.addChild(tmfx02)
        tmfx02.x = 100
        tmfx02.y = 700

        let content = new egret.TextField()
        content.textFlow = [
            { text: '应选' + subject.result + '\n' },
            { text: subject.content }
        ]
        content.width = 550
        content.x = 100
        content.y = 780
        content.lineSpacing = 10
        content.textColor = 0x35b039
        this.addChild(content)
        this.content = content

        let next = Util.createBitmapByName('next_png')
        next.x = this.stage.stageWidth / 2 - next.width - 10
        next.y = 1000
        this.addChild(next)
        next.touchEnabled = true
        next.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.next()
        }, this)
        this.nextButton = next

        let train = Util.createBitmapByName(this.type == 9 ? 'dailyTasks_tryAgain1_png' : 'continueTrain_png')
        train.x = this.stage.stageWidth / 2 + 10
        train.y = 1000
        this.addChild(train)
        train.touchEnabled = true
        train.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
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
                ViewManager.getInstance().back(4)
            }
        }, this)
        this.trainButton = train

        if (this.curIdx >= this.errors.length) {
            this.nextButton.visible = false
            this.trainButton.x = (this.stage.stageWidth - this.trainButton.width) / 2
        }
    }

    // 下一题
    private next() {
        if (this.curIdx == this.errors.length) {
            return
        }
        this.curIdx = this.curIdx + 1
        let subject = Util.getTrain(this.errors[this.curIdx - 1])
        if (!subject) return
        this.title.text = subject.title
        this.content.textFlow = [
            { text: '应选' + subject.result + '\n' },
            { text: subject.content }
        ]
        let res = ''
        for (let option of subject.options) {
            if (option.flag == subject.result) {
                res = option.name
                break
            }
        }

        if (this.curIdx >= this.errors.length) {
            this.nextButton.visible = false
            this.trainButton.x = (this.stage.stageWidth - this.trainButton.width) / 2
        }
    }
}