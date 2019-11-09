
/**
 * 错题分析界面
 */
class AnalysisScene extends Scene {

    private subject: Subject
    private title
    constructor(subject: Subject, title) {
        super()
        this.subject = subject
        this.title = title
    }


    public init() {
        super.setBackground()
        let y = 20
        let title: egret.Bitmap = Util.createBitmapByName('title_tmfx_png')
        title.y = y
        title.x = this.stage.stageWidth / 2
        title.anchorOffsetX = title.width / 2
        this.addChild(title)

        y += 230
        let tmfx01 = Util.createBitmapByName('tmfx01_png')
        this.addChild(tmfx01)
        tmfx01.x = 100
        tmfx01.y = y

        y += 100
        let question = new egret.TextField()
        question.text = this.subject.title
        question.lineSpacing = 10
        question.width = 550
        question.x = 100
        question.y = y
        question.size = 40
        question.textColor = 0x38ae36
        this.addChild(question)

        y += question.textHeight + 100
        let tmfx02 = Util.createBitmapByName('tmfx02_png')
        this.addChild(tmfx02)
        tmfx02.x = 100
        tmfx02.y = y

        y += 100
        let content = new egret.TextField()

        // let num
        // this.subject.options.forEach((item, i) => {
        //     if (item.flag.indexOf(this.subject.result) != -1) {
        //         num = i
        //     }
        // })
        // content.textFlow = [
        //     { text: '应选' + this.subject.result + '\n' },
        //     { text: this.subject.options[num].name }
        // ]
        content.text = '应选' + this.subject.result
        content.width = 550
        content.x = 100
        content.y = y
        content.lineSpacing = 10
        content.size = 40
        content.textColor = 0x38ae36
        this.addChild(content)

        y += content.textHeight + 100
        let back = Util.createBitmapByName('tmfx03_png')
        back.x = (this.stage.stageWidth - back.width) / 2
        back.y = this.stage.stageHeight - 300
        back.touchEnabled = true
        this.addChild(back)

        back.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            ViewManager.getInstance().back()
        }, this)
    }
}