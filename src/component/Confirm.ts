class Confirm extends eui.Group {
    private text
    private leftButtonText
    private rightButtonText
    constructor(text, leftButtonText = "确认", rightButtonText = "取消") {
        super()
        this.text = text
        this.leftButtonText = leftButtonText
        this.rightButtonText = rightButtonText
        this.init()
    }

    public init() {
        let stage = ViewManager.getInstance().stage
        //背景
        let mask: egret.Bitmap = Util.createBitmapByName('mask_png')
        mask.y = 0
        mask.x = 0
        mask.alpha = 0.5
        mask.width = stage.stageWidth
        mask.height = stage.stageHeight
        this.addChild(mask)

        // 文字
        let text = new egret.TextField()
        text.text = this.text
        text.width = stage.stageWidth
        text.textAlign = 'center'
        text.lineSpacing = 10
        text.y = 50
        text.size = 40
        this.addChild(text)

        // 确认按钮
        let confirmButton = new CustomButton('pk_list_text_bg_png', this.leftButtonText, () => {
            let event = new ConfirmEvent(ConfirmEvent.CONFIRM_BUTTON_YES)
            this.dispatchEvent(event)
            this.parent.removeChild(this)
        })
        confirmButton.x = stage.stageWidth / 2 - confirmButton.width - 10
        confirmButton.y = 200
        this.addChild(confirmButton)

        // 取消按钮
        let cancelButton = new CustomButton('pk_list_text_bg_png', this.rightButtonText, () => {
            let event = new ConfirmEvent(ConfirmEvent.CONFIRM_BUTTON_NO)
            this.dispatchEvent(event)
            this.parent.removeChild(this)
        })
        cancelButton.x = stage.stageWidth / 2 + 10
        cancelButton.y = confirmButton.y
        this.addChild(cancelButton)
    }
}

class CustomButton extends eui.Group {
    constructor(bg, text, fn) {
        super()
        let btn_bg = Util.createBitmapByName(bg)
        this.width = btn_bg.width
        this.height = btn_bg.height
        this.addChild(btn_bg)

        let content = new egret.TextField
        content.text = text
        content.width = btn_bg.width
        content.height = btn_bg.height - 10
        content.textAlign = 'center'
        content.verticalAlign = 'middle'
        this.addChild(content)
        this.touchEnabled = true
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, fn, this)
    }
}

class ConfirmEvent extends egret.Event {
    public static readonly CONFIRM_BUTTON_YES = "CONFIRM_BUTTON_YES"
    public static readonly CONFIRM_BUTTON_NO = "CONFIRM_BUTTON_NO"
    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable)
    }
}
