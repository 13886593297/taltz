
class PkListScene extends Scene{


    private readonly config =[{
        icon:'person_pk_png',title:'个人挑战赛',iconWidth:69,type:1
    },{
        icon:'team_pk_png',title:'团队PK赛',iconWidth:83,type:2
    }]

    public onBack(){
        ViewManager.getInstance().jumpHome();
    }

    public init(){
        super.setBackground();
        this.name ="pklist";
        let y = 300;
        for(let data of this.config){
            let item = new PkItem(data);
            this.addChild(item);
            item.y = y;
            y+=300;
            item.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
                 Util.playMusic('model_select_mp3')
                //  if(data.type == 2){
                //     let alert = new AlertPanel("功能还未开放哦！")
                //     this.addChild(alert);
                //     return;
                //  }
                let modelScene = new PkModelScene(data.type);
                ViewManager.getInstance().changeScene(modelScene);
            },this);
        }
    }

}   