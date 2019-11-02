
/**
 * 跑马灯效果 信息
 */

class Notice extends eui.Group {
    private notices
    private seleted = 0
    private text1
    private tw

    constructor(notices) {
        super()
        this.notices = notices
        this.init()
    }

    private init() {
        let stage = ViewManager.getInstance().stage
        this.mask = new egret.Rectangle(0, 0, stage.stageWidth, 60)

        let notice: egret.Bitmap = Util.createBitmapByName("notice_png")
        notice.width = 472
        notice.x = stage.stageWidth / 2
        notice.anchorOffsetX = notice.width / 2
        this.addChild(notice)

        let text = new egret.TextField()
        text.height = 62
        text.size = 22
        text.textColor = 0x7fc871
        text.width = 320
        text.x = 230
        text.verticalAlign = egret.VerticalAlign.MIDDLE
        this.addChild(text)
        this.text1 = text
        text.mask = this.mask
        if (this.notices.length > 0) {
            text.text = this.notices[0].showMsg
        }
        if (this.notices.length > 1) {
            this.startAni()
        }
    }

    private startAni() {
        this.tw = egret.Tween.get(this.text1, { loop: true })
        this.tw.to({ y: 80 }, 200, egret.Ease.backOut).call(() => {
            this.text1.text = this.notices[this.seleted].showMsg
        }).to({ y: 0 }, 100, egret.Ease.backIn).call(() => {
            ani()
        }).wait(3000)

        let ani = () => {
            this.seleted++
            if (this.seleted >= this.notices.length) {
                this.seleted = 0
            }
        }
    }

}




