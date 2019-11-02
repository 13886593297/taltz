

class Confirm extends eui.Group{

    private text;
    private leftButtonText;
    private rightButtonText;
    constructor(text,leftButtonText="确认",rightButtonText="取消"){
        super();
        this.text = text;
        this.leftButtonText = leftButtonText;
        this.rightButtonText = rightButtonText;
        this.init();
    }


    public init(){
        let stage = ViewManager.getInstance().stage;
        //背景
        let mask: egret.Bitmap = Util.createBitmapByName('mask_png')
        mask.y = 0;
        mask.x = 0;
        mask.alpha = 0.5
        mask.width = stage.stageWidth;
        mask.height = stage.stageHeight;
        this.addChild(mask);
        
        // 文字

        let text = new egret.TextField();
        this.addChild(text);

        text.width= 700;
        text.x = stage.stageWidth/2-350;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.size= 32;
        text.bold = true;
        text.text = this.text;
        text.lineSpacing = 20;
        text.y = stage.stageHeight/2 - 100;


        let buttonY = stage.stageHeight/2+text.textHeight;
       
        let ConfirmButton = new XButton(this.leftButtonText);
        ConfirmButton.width = 330;
        ConfirmButton.x = stage.stageWidth/2-345;
        ConfirmButton.y = buttonY
        this.addChild(ConfirmButton);
        ConfirmButton.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            let event = new ConfirmEvent(ConfirmEvent.CONFIRM_BUTTON_YES);
            this.dispatchEvent(event)
            this.parent.removeChild(this);
        },this);



        let CancelButton = new XButton(this.rightButtonText);
        CancelButton.width = 330;
        CancelButton.x = stage.stageWidth/2+15;
        CancelButton.y = buttonY
        this.addChild(CancelButton);
        CancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            let event = new ConfirmEvent(ConfirmEvent.CONFIRM_BUTTON_NO);
            this.dispatchEvent(event)
            this.parent.removeChild(this);
        },this);
    }






}


class ConfirmEvent extends  egret.Event{

    public static readonly CONFIRM_BUTTON_YES = "CONFIRM_BUTTON_YES"

    public static readonly CONFIRM_BUTTON_NO = "CONFIRM_BUTTON_NO"

    public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false)
    {
        super(type,bubbles,cancelable);
    }
}
