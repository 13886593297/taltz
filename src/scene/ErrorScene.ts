
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

    constructor(errors) {
        super()
        this.errors = errors
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
        // let num
        // subject.options.forEach((item, i) => {
        //     if (item.flag.indexOf(subject.result) != -1) {
        //         num = i
        //     }
        // })
        // content.textFlow = [
        //     { text: '应选' + subject.result + '\n' },
        //     { text: subject.options[num].name }
        // ]
        content.text = '应选' + subject.result
        content.width = 550
        content.x = 100
        content.y = 780
        content.lineSpacing = 10
        content.size = 40
        content.textColor = 0x35b039
        this.addChild(content)
        this.content = content

        let next = Util.createBitmapByName('next_png')
        next.x = this.stage.stageWidth / 2 - next.width - 10
        next.y = 950
        this.addChild(next)
        next.touchEnabled = true
        next.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.next()
        }, this)
        this.nextButton = next

        let train = Util.createBitmapByName('continueTrain_png')
        train.x = this.stage.stageWidth / 2 + 10
        train.y = 950
        this.addChild(train)
        train.touchEnabled = true
        train.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            ViewManager.getInstance().back(4)
        }, this)

        if (this.curIdx >= this.errors.length) {
            this.nextButton.visible = false
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

        // let num
        // subject.options.forEach((item, i) => {
        //     if (item.flag.indexOf(subject.result) != -1) {
        //         num = i
        //     }
        // })
        // this.content.textFlow = [
        //     { text: '应选' + subject.result + '\n' },
        //     { text: subject.options[num].name }
        // ]
        this.content.text = '应选' + subject.result
        let res = ''
        for (let option of subject.options) {
            if (option.flag == subject.result) {
                res = option.name
                break
            }
        }

        if (this.curIdx >= this.errors.length) {
            this.nextButton.visible = false
        }
    }
}