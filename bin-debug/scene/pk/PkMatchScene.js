var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var PkMatchScene = (function (_super) {
    __extends(PkMatchScene, _super);
    function PkMatchScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PkMatchScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        this.close_btn = false;
        //开始匹配
        setTimeout(function () {
            SocketX.getInstance().sendMsg(NetEvent.PK_MATCH, { robot: false });
        }, 2000);
        this.addEventListener(egret.Event.REMOVED, function () {
            _this.timer.stop();
        }, this);
        var person_info_bg = Util.createBitmapByName('person_info_bg_png');
        person_info_bg.y = 50;
        var infoGroup = new eui.Group;
        infoGroup.width = person_info_bg.width;
        infoGroup.height = person_info_bg.height;
        infoGroup.x = (this.stage.stageWidth - infoGroup.width) / 2;
        infoGroup.y = 250;
        this.addChild(infoGroup);
        infoGroup.addChild(person_info_bg);
        var timerNumber = 30;
        // test begin
        // timerNumber = 5
        // test end
        var time = new egret.TextField();
        time.text = "00:" + timerNumber;
        time.textColor = Config.COLOR_MAINCOLOR;
        time.x = infoGroup.width - time.width - 30;
        infoGroup.addChild(time);
        var timer = new egret.Timer(1000, 60);
        this.timer = timer;
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            if (timerNumber <= 0) {
                SocketX.getInstance().sendMsg(NetEvent.PK_MATCH, { robot: true });
                // test begin
                // let scene = new PkInviteScene(InviteStatus.MATCHEND);
                // ViewManager.getInstance().changeScene(scene);
                // test end
                timer.stop();
            }
            else {
                timerNumber--;
            }
            if (timerNumber < 10) {
                time.text = "00:0" + timerNumber;
            }
            else
                time.text = "00:" + timerNumber;
        }, this);
        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            time.text = "00:00";
        }, this);
        timer.start();
        var user = DataManager.getInstance().getUser();
        var avatar = Util.setUserImg(user.avatar, 145);
        avatar.x = 28;
        avatar.y = 138;
        infoGroup.addChild(avatar);
        var label = new egret.TextField;
        label.textFlow = [
            { text: '用 户\n' },
            { text: '来 自\n' },
            { text: '等 级' }
        ];
        label.size = 40;
        label.lineSpacing = 25;
        label.x = 240;
        label.y = 140;
        infoGroup.addChild(label);
        var info = new egret.TextField;
        info.textFlow = [
            { text: Util.getStrByWith(user.nickName, 200, 28) + "\n" },
            { text: user.teamName + "\n" },
            { text: "" + user.lvName + user.lvShow }
        ];
        info.textAlign = 'right';
        info.size = 28;
        info.lineSpacing = 35;
        info.x = 400;
        info.y = 150;
        infoGroup.addChild(info);
        var cancelButton = Util.createBitmapByName('pk_cancel_png');
        cancelButton.x = (this.stage.stageWidth - cancelButton.width) / 2;
        cancelButton.y = this.stage.stageHeight - 300;
        this.addChild(cancelButton);
        cancelButton.touchEnabled = true;
        cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // TODO 通知后台取消匹配
            SocketX.getInstance().sendMsg(NetEvent.CACEL_MATCH, {});
            ViewManager.getInstance().back();
        }, this);
    };
    return PkMatchScene;
}(Scene));
__reflect(PkMatchScene.prototype, "PkMatchScene");
