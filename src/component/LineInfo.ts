class LineInfo extends eui.Group{
    private text
    private tip
    constructor(text){
        super()
        this.text = text
        this.init()
    }

    private init() {
        let stageW = ViewManager.getInstance().stage.stageWidth
        let tip = new egret.TextField
        tip.text = this.text
        tip.width = 440
        tip.x = (stageW - tip.width) / 2
        tip.y = 680
        tip.textColor = Config.COLOR_MAINCOLOR
        tip.size = 40
        tip.textAlign = 'center'
        this.tip = tip
        this.addChild(tip)
    }

    public setText(text){
        this.tip.text = text 
    }
}