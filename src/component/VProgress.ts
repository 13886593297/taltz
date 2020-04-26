class VProgress extends eui.Group {
    private thumb
    private max
    private process_text

    constructor(max = 10) {
        super()
        this.max = max
        this.init()
    }

    public init() {
        this.width = 40
        this.height = 430

        let bg = Util.createBitmapByName('pk_progress_bg_png')
        bg.width = this.width
        bg.height = this.height
        this.addChild(bg)

        let thumb = Util.createBitmapByName('pk_thumb_pb_png')
        thumb.fillMode = egret.BitmapFillMode.REPEAT
        thumb.height = 43
        thumb.y = bg.height - thumb.height
        this.addChild(thumb)

        let shape: egret.Shape = new egret.Shape()
        shape.graphics.beginFill(0xff0000, 1)
        shape.graphics.drawRoundRect(0, 0, this.width, this.height, 26, 26)
        shape.graphics.endFill()
        this.addChild(shape)
        thumb.mask = shape
        this.thumb = thumb

        let process_text = new egret.TextField
        process_text.text = '1/' + this.max
        process_text.x = 6
        process_text.y = this.height + 40
        process_text.width = 100
        process_text.height = 50
        process_text.anchorOffsetX = 50
        process_text.anchorOffsetY = 25
        process_text.rotation = 90
        process_text.textColor = 0x36b134
        this.addChild(process_text)
        this.process_text = process_text
    }

    public setRate(rate) {
        if (rate > 10) return
        let height = this.height * rate / this.max
        this.thumb.height = height
        this.thumb.y = this.height - height
        this.process_text.text = rate + '/' + this.max
    }
}