
class Title extends  eui.Group{

    private title:string;
    private titleText:egret.TextField;
    public constructor(title){
        super();
        this.title = title;
        this.height = 80;
        this.init();
    }


    public init(){
        let stage = ViewManager.getInstance().stage;
        let bg:egret.Bitmap = Util.createBitmapByName('pk_title_bg_png');
        bg.width = 367;
        bg.height = 95;
        bg.x = stage.stageWidth / 2;
        bg.anchorOffsetX = bg.width /2;
        this.addChild(bg);

        let textfield = new egret.TextField();
        this.addChild(textfield);
        this.titleText = textfield;
        textfield.text = this.title;
        textfield.width = stage.stageWidth;
        textfield.height = this.height;
        textfield.textColor = 0xF36C21;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.verticalAlign = egret.VerticalAlign.MIDDLE;
        textfield.anchorOffsetX = 30;
        textfield.size = 40;
        textfield.y = 10;
    }

    public updateTitle(textFlow){
        this.titleText.textFlow = textFlow;
    }
}