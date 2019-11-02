
class VProgress extends eui.Group{


    private thumb;
    private type;
    private max;

    private readonly config = {
        "1":{
            bg:'v_progress_bg_png',
            thumb:'v_progress_thumb_png'
        },
        "2":{
            bg:'v_progress_bg2_png',
            thumb:'v_progress_thumb2_png'
        }
    }

    constructor(type=1,max=10){
        super();
        this.type = type;
        this.max = max;
        this.init();
    }

    public init(){

        this.width = 26
        this.height = 600;

        let bg = Util.createBitmapByName(this.config[this.type].bg)
        bg.width = this.width;
        bg.height = this.height;
        this.addChild(bg);

        let thumb = Util.createBitmapByName(this.config[this.type].thumb)
        thumb.fillMode = egret.BitmapFillMode.REPEAT;
        thumb.height = 250;
        thumb.y = bg.height - thumb.height;
        this.addChild(thumb);
        var shape:egret.Shape = new egret.Shape();
        shape.graphics.beginFill( 0xff0000, 1);
        shape.graphics.drawRoundRect(0 ,0,26,600 ,26 ,26)
        shape.graphics.endFill();
        this.addChild(shape);
        thumb.mask = shape;
        this.thumb = thumb;
    } 



    public setRate(rate){
        let height = this.height*rate/this.max;
        this.thumb.height = height;
        this.thumb.y = this.height - height;
    }


}