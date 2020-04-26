class Title extends eui.Group {
    private img: string
    private bg
    public constructor(img) {
        super()
        this.img = img
        this.init()
    }

    public init() {
        let bg = new egret.Bitmap()
        let texture = RES.getRes(this.img)
        bg.texture = texture;
        this.bg = bg
        this.width = bg.width
        this.addChild(bg)
    }

    public updateTitle(newImg) {
        this.bg.texture = RES.getRes(newImg)
    }
}