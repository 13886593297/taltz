
class PkItem extends eui.Group {

    private data;

    constructor(data) {
        super();
        this.data = data;
        this.init();
    }

    private init() {

        let stage = ViewManager.getInstance().stage;
        this.width = 513;
        this.height = 261;
        this.anchorOffsetX = this.width / 2;
        this.x = stage.stageWidth / 2;

        let bg: egret.Bitmap = Util.createBitmapByName("pk_bg_png")
        bg.width = this.width;
        bg.height = this.height;
        this.addChild(bg);

        let icon: egret.Bitmap = Util.createBitmapByName(this.data.icon)
        icon.width = this.data.iconWidth;
        icon.anchorOffsetX = icon.width / 2;
        icon.anchorOffsetY = 70;

        icon.x = 100;
        icon.y = this.height / 2
        this.addChild(icon);

        let title = new egret.TextField();
        title.text = this.data.title;
        title.width = this.width / 2;
        title.height = this.height;
        title.x = 190;
        title.y = -25;
        title.verticalAlign = egret.VerticalAlign.MIDDLE;
        title.size = 50;
        this.addChild(title);

    }


}