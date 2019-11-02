
class LineInfo extends eui.Group{

    private text;

    private textField;
    private bottomLine;
    constructor(text){
        super();
        this.text = text;
        this.init();

    }
    public init(){
        let stage = ViewManager.getInstance().stage;
        this.width = 650;
       
        this.anchorOffsetX = 325;        
        this.x = 375;//stage.stageWidth/2;
       
        let topline = Util.createBitmapByName("result_line_top_png");
        topline.width = 450;
        this.addChild(topline);
        let textField = new egret.TextField();
        this.textField = textField;
        textField.text = this.text;
        // textField.textColor = Config.COLOR_YELLOW;
        textField.width = 420;
        textField.size = 26;

        let height = textField.numLines * 50
         this.height = height;
         textField.textAlign = egret.HorizontalAlign.CENTER;
        textField.verticalAlign = egret.VerticalAlign.MIDDLE;
        
        textField.x = 115;
        textField.lineSpacing = 10;
        textField.y= 20
        // textField.height = 60
        this.addChild(textField);
        let bottomline = Util.createBitmapByName("result_line_bottom_png");
        // bottomline.anchorOffsetX = 225;
        // bottomline.rotation = 180;
        bottomline.x = 190
        bottomline.y = height - 20;
        this.bottomLine = bottomline;
        this.addChild(bottomline);
    }
   

    public setText(text){
        if(this.textField ) this.textField.text = text; 
       
    }

    public setTextFlow(textFlow){
        if(this.textField) this.textField.textFlow = textFlow;
        this.height = this.textField.textHeight + 30;
        this.bottomLine.y =this.height -25; 
        console.log('this.height:',this.height);
    }


}