class ResultAlert extends eui.Group {
    private corret
    private score
    /**
     * @param corret 是否错误
     * @param score 分数
     */
    constructor(corret, score) {
        super()
        this.corret = corret
        this.score = score
        this.init()
    }

    public init() {
        // 边框背景
        let border = new egret.Shape
        border.graphics.lineStyle(3, Config.COLOR_MAINCOLOR)
        border.graphics.beginFill(this.corret ? 0xb5d100 : 0xffffff, 1)
        border.graphics.drawCircle(23, 23, 23)
        border.graphics.endFill()
        this.addChild(border)
        this.width = border.width
        this.height = border.height

        // 内容
        let text = new egret.TextField
        text.text = this.corret ? `正确\n+${this.score}` : `错误\n-${this.score}`
        text.textColor = this.corret ? 0xffffff : 0x7fc871
        text.width = border.width - 6
        text.height = border.height
        text.textAlign = 'center'
        text.verticalAlign = 'middle'
        text.size = 16
        this.addChild(text)
    }
}

/**
 * 双方不得分
 */
class NoScoreAlert extends eui.Group {
    private text
    constructor(text) {
        super()
        this.text = text
        this.init()
    }

    private init() {
        this.width = 345
        this.height = 139
        this.x = (ViewManager.getInstance().stage.stageWidth - this.width) / 2
        this.y = ViewManager.getInstance().stage.stageHeight / 2 + 200
        let bg = Util.createBitmapByName('alert_team_error_png')
        bg.width = this.width
        bg.height = this.height
        this.addChild(bg)

        let textField = new egret.TextField()
        textField.width = this.width - 40
        textField.height = this.height - 20
        textField.x = 20
        textField.y = 10
        textField.textAlign = egret.HorizontalAlign.CENTER
        textField.verticalAlign = egret.VerticalAlign.MIDDLE
        this.addChild(textField)
        textField.text = this.text

    }
}