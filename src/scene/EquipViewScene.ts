
class EquipViewScene extends Scene {

    contentId:any;
    constructor() {
        super();
    }


    public init() {
        super.setBackground();
        Util.setTitle('装备库');
        this.close_btn = "close_png";

        Http.getInstance().post(Url.HTTP_EQUIP_DETAIL,{conid:this.contentId},(data)=>{

            // Util.onStopMusic();
            // showIFrame('<div style="margin-top:50px">' + s1+'</div>', "返回列表");

            let stage = ViewManager.getInstance().stage;
            let group = new eui.Group();
            group.y = 60;
            group.width = stage.width;
            this.addChild(group);

            let title = new egret.TextField();
            title.text = data.data.title;
            title.textColor = 0xF46C22;
            title.size = 60;
            title.width = this.stage.stageWidth;
            title.textAlign = egret.HorizontalAlign.CENTER;
            title.y = 100;
            group.addChild(title);

            let base = new Base64();
            let s1 = base.decode(data.data.contentTxt);
            Util.onStopMusic();
            let content = new egret.TextField();
            content.textFlow = (new egret.HtmlTextParser).parser(s1);
            content.textColor = 0x676E79;
            content.width = this.stage.stageWidth;
            content.textAlign = egret.HorizontalAlign.CENTER;
            content.y = 180;
            group.addChild(content);

        });
    }

  
}