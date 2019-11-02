
class PkMatchScene extends Scene {


    private matchGroup;

    private timer;


    public init() {
    //开始匹配
        setTimeout(()=>{
              SocketX.getInstance().sendMsg(NetEvent.PK_MATCH,{robot:false});
        },2000)
      

        this.addEventListener(egret.Event.REMOVED,()=>{
            this.timer.stop();
        },this);
        let group = new eui.Group();
        this.addChild(group);
        this.matchGroup = group;
        let timerNumber = 30;
        let time = new egret.TextField();
        time.text = `00:${timerNumber}`;
        time.width = 200;
        time.size = 36;
        time.textColor = Config.COLOR_YELLOW;
        time.textAlign = egret.HorizontalAlign.CENTER;
        time.anchorOffsetX = 100;
        time.x = this.stage.stageWidth / 2;
        time.y = 100;
        group.addChild(time);

        var timer: egret.Timer = new egret.Timer(1000, 60);
        this.timer = timer;
        timer.addEventListener(egret.TimerEvent.TIMER, () => {

            if(timerNumber <=0){
                SocketX.getInstance().sendMsg(NetEvent.PK_MATCH,{robot:true});
                timer.stop();
            }else{
                timerNumber--;
            }
            if (timerNumber < 10) {
                time.text = `00:0${timerNumber}`;

            } else time.text = `00:${timerNumber}`;
        }, this);

        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            time.text = "00:00";
            // let scene = new PkInviteScene(InviteStatus.MATCHEND);
            // ViewManager.getInstance().changeScene(scene);
        }, this);
        timer.start();


        let x = this.stage.stageWidth / 2;
        let y = 320;


        let icon = Util.createBitmapByName('icon_2_jpg');
        icon.width = 125;
        icon.height = 125;

        icon.x = x
        icon.y = y;
        icon.anchorOffsetX = icon.width / 2;
        icon.anchorOffsetY = icon.height / 2;
        var circle: egret.Shape = new egret.Shape();
        circle.graphics.beginFill(0x0000ff);
        circle.graphics.drawCircle(x, y, 63);
        circle.graphics.endFill();
        group.addChild(circle);
        icon.mask = circle;
        group.addChild(icon);

        let circleBg = Util.createBitmapByName('pk_circle_bg_png');
        circleBg.width = 326;
        circleBg.height = 326;
        circleBg.anchorOffsetX = circleBg.width / 2;
        circleBg.anchorOffsetY = circleBg.height / 2;
        circleBg.x = x;
        circleBg.y = y;
        group.addChild(circleBg);
   
        egret.Tween.get( circleBg, { loop:true} ) .to( {	rotation :360},3000);

        //  egret.Tween.get( circleBg, { loop:true} ) .to( {	rotation :360},3000);

        let matching = new egret.TextField();
        matching.text = "匹配中....";
        matching.width = 200;
        matching.size = 36;
        matching.textColor = Config.COLOR_YELLOW;
        matching.textAlign = egret.HorizontalAlign.CENTER;
        matching.anchorOffsetX = 100;
        matching.x = this.stage.stageWidth / 2;
        matching.y = 550;
        group.addChild(matching);

        let user = DataManager.getInstance().getUser();
        y = 650;

        // Util.setUserImg(user.avatar,icon);    

        // let imgLoader = new egret.ImageLoader();
		// imgLoader.crossOrigin = "anonymous";// 跨域请求
        // imgLoader.load(user.avatar);// 去除链接中的转义字符‘\’        
        // imgLoader.once(egret.Event.COMPLETE, (evt: egret.Event) => {
        //     if (evt.currentTarget.data) {
        //         egret.log("加载头像成功: ", evt.currentTarget.data);
        //         let texture = new egret.Texture();
        //         texture._setBitmapData(evt.currentTarget.data);
        //         icon.texture = texture;
        //     }
        // }, this);
        let userName = new LineInfo("用户名:"+user.nickName);
        userName.y = y;
        group.addChild(userName);
        y += 100;
        let userTeam = new LineInfo("来自:"+user.teamName)
        userTeam.y = y;
        group.addChild(userTeam);
        y += 100;
        let userLevel = new LineInfo(`等级:${user.lvName}${user.lvShow}`)
        userLevel.y = y;
        group.addChild(userLevel);



        let buttonY = this.stage.stageHeight - 200;
        let cancelButton = new XButton("取消匹配")
        cancelButton.width = 500;
        cancelButton.y = buttonY;
        cancelButton.anchorOffsetX = 250;
        cancelButton.x = this.stage.stageWidth / 2;
        group.addChild(cancelButton);

        cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            //TODO 通知后台取消匹配
            SocketX.getInstance().sendMsg(NetEvent.CACEL_MATCH,{});
            ViewManager.getInstance().back();
        }, this);



        //  let friendButton = new XButton("邀请好友")
        // friendButton.width = 350;
        // friendButton.y = buttonY;
        // friendButton.anchorOffsetX = 175;
        // friendButton.x = this.stage.stageWidth*0.75;
        // group.addChild(friendButton);
        // friendButton.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{

        //     // let scene = new PkInviteScene(InviteStatus.ACCEPTED);
        //     let scene = new BattleScene();
        //     ViewManager.getInstance().changeScene(scene);

        // },this)
    }

}







/**
 * 匹配成功页面
 */
class PkMatchSuccessScene extends Scene {



    public init() {

        this.width = 750;
        this.anchorOffsetX = 375;
        this.x = this.stage.stageWidth / 2;


        let userinfo = DataManager.getInstance().getUser();
        console.log(userinfo, 'useringo');
        let leftUser = new PkUser(userinfo);
        leftUser.y = 100;
        this.addChild(leftUser);

        let rightUser = new PkUser(userinfo, 'right');
        rightUser.y = 100;
        rightUser.anchorOffsetX = 243;
        rightUser.x = 750;
        this.addChild(rightUser);


        let pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.x = 375;
        pkVs.y = 240;
        this.addChild(pkVs)


        let vs = new egret.TextField();
        vs.text = "VS";
        vs.width = 100;
        vs.height = 100;
        vs.anchorOffsetX = 50;
        vs.anchorOffsetY = 50;
        vs.y = 240
        vs.x = 375;

        vs.textAlign = egret.HorizontalAlign.CENTER;
        vs.verticalAlign = egret.VerticalAlign.MIDDLE;

        vs.size = 40;
        this.addChild(vs);


        let matchText = new egret.TextField();

        matchText.width = 750;
        matchText.textAlign = egret.HorizontalAlign.CENTER;
        matchText.text = "匹配成功"
        matchText.textColor = Config.COLOR_YELLOW;
        matchText.size = 40;
        matchText.y = 600
        this.addChild(matchText);

        let alert = new LineInfo("5s后开始游戏")
        alert.y = 700;
        this.addChild(alert);
    }


}


