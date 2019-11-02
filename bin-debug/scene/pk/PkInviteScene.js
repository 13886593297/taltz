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
var PkInviteScene = (function (_super) {
    __extends(PkInviteScene, _super);
    function PkInviteScene(type, msg) {
        if (msg === void 0) { msg = null; }
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.msg = msg;
        return _this;
    }
    PkInviteScene.prototype.init = function () {
        this.width = 750;
        this.anchorOffsetX = 375;
        this.x = this.stage.stageWidth / 2;
        var userinfo = DataManager.getInstance().getUser();
        console.log(userinfo, 'useringo');
        var leftUser = new PkUser(userinfo);
        leftUser.y = 100;
        this.addChild(leftUser);
        var pkData = DataManager.getInstance().getPkData();
        var rightUser = new PkUser(pkData ? pkData.pkUser : null, 'right');
        rightUser.y = 100;
        rightUser.anchorOffsetX = 243;
        rightUser.x = 750;
        this.addChild(rightUser);
        var pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.width = 255;
        pkVs.height = 172;
        pkVs.x = 375;
        pkVs.y = 240;
        this.addChild(pkVs);
        var vs = new egret.TextField();
        switch (this.type) {
            case InviteStatus.INVITING:
            case InviteStatus.NOACCEPT:
                vs.text = "等待对手加入";
                break;
            default:
                vs.text = "VS";
                break;
        }
        vs.width = 300;
        vs.height = 100;
        vs.anchorOffsetX = 150;
        vs.anchorOffsetY = 50;
        vs.y = 240;
        vs.x = 375;
        vs.textAlign = egret.HorizontalAlign.CENTER;
        vs.verticalAlign = egret.VerticalAlign.MIDDLE;
        vs.size = 34;
        this.addChild(vs);
        var buttonGroup = new eui.Group();
        this.width = 750;
        buttonGroup.y = 600;
        this.buttonGroup = buttonGroup;
        this.addChild(buttonGroup);
        switch (this.type) {
            case InviteStatus.INVITING:
                this.inviting();
                break;
            case InviteStatus.NOACCEPT://未接受邀请
                this.noAccept();
                break;
            case InviteStatus.WATTING:
                this.waiting();
                break;
            case InviteStatus.ACCEPTED:
                this.accepted();
                break;
            case InviteStatus.MATCHEND:
                this.matchEnd();
                break;
            case InviteStatus.OBSERVE:
                this.observe();
                break;
            case InviteStatus.INVALID:
                this.invalid();
                break;
            case InviteStatus.PK_ERR_MSG:
                this.errorMsg();
                break;
            case InviteStatus.INVALID_ERROR:
                this.invalidError();
                break;
            case InviteStatus.PK_END_WAIT:
                this.pkEnd();
                break;
            case InviteStatus.PK_NO_ANSWER:
                this.pkNoAnswer();
                break;
            case InviteStatus.PK_REJECT:
                this.pkReject();
                break;
        }
    };
    /**
     * 邀请好友
     */
    PkInviteScene.prototype.inviting = function () {
        var text = new egret.TextField();
        text.text = "00:60";
        text.width = 750;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.y = 400;
        this.addChild(text);
        var timerNumber = 60;
        var timer = new egret.Timer(1000, 60);
        this.timer = timer;
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            timerNumber--;
            if (timerNumber == 10) {
                // SocketX.getInstance().sendMsg(NetEvent.PK_MATCH,{robot:true});
            }
            if (timerNumber < 10) {
                text.text = "00:0" + timerNumber;
            }
            else
                text.text = "00:" + timerNumber;
        }, this);
        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            text.text = "00:00";
        }, this);
        timer.start();
        SocketX.getInstance().addEventListener(NetEvent.PK_ACCEPT, function (data) {
            DataManager.getInstance().setPk(data.data);
            switch (data.data.tipsCode) {
                case 0:
                    var scene = new PkInviteScene(InviteStatus.MATCHEND);
                    ViewManager.getInstance().changeScene(scene);
                    break;
                case 10://对方拒绝邀请
                    var rejectScene = new PkInviteScene(InviteStatus.NOACCEPT);
                    ViewManager.getInstance().changeScene(rejectScene);
                    break;
            }
        });
        var info = new LineInfo('等待好友60s进入');
        info.y = 50;
        this.buttonGroup.addChild(info);
        // let backButton = new XButton('返回竞技场目录');
        // backButton.width = 450;
        // backButton.x = 150;
        // backButton.y = 200
        // backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        //     ViewManager.getInstance().back(2);
        // }, this);
        // this.buttonGroup.addChild(backButton);
    };
    PkInviteScene.prototype.noAccept = function () {
        // let text = new egret.TextField();
        // text.text = "您的好友正忙,请下次再邀请TA吧！"
        // text.width = 350;
        // text.x = 200;
        // text.y = -100;
        // this.buttonGroup.addChild(text);
        var text = new egret.TextField();
        text.text = "您的好友正忙,请下次再邀请TA吧！";
        text.width = 350;
        text.textColor = Config.COLOR_YELLOW;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.x = 200;
        text.y = -50;
        this.buttonGroup.addChild(text);
        var seconds = 5;
        var alert = new LineInfo(seconds + "\u79D2\u540E\u8FDB\u5165\u79BB\u7EBF\u7B54\u9898\u6A21\u5F0F\uFF01");
        alert.y = 50;
        this.buttonGroup.addChild(alert);
        // let backButton = new XButton('返回竞技场目录');
        // backButton.width = 450;
        // backButton.x = 150;
        // backButton.y = 150
        // backButton.filters = [Util.grayFliter()];
        // this.buttonGroup.addChild(backButton);
    };
    PkInviteScene.prototype.matchEnd = function () {
        //开始pk
        var pkData = DataManager.getInstance().getPkData();
        var textValue = "匹配成功";
        if (!pkData || !pkData.pkUser) {
            textValue = "离线PK";
        }
        var text = new egret.TextField();
        text.text = textValue;
        text.width = 350;
        text.textColor = Config.COLOR_YELLOW;
        text.size = 40;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.x = 200;
        text.y = -50;
        this.buttonGroup.addChild(text);
        var seconds = 5;
        var alert = new LineInfo(seconds + "\u79D2\u540E\u8FDB\u5165\u6E38\u620F");
        alert.y = 50;
        this.buttonGroup.addChild(alert);
        // let timer = new egret.Timer(1000,5);
        // timer.addEventListener(egret.TimerEvent.TIMER,()=>{
        //     seconds--;
        //     alert.setText(`${seconds}秒后进入游戏`)
        // },this);
        // timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,()=>{
        //     let scene = new BattleScene();
        //     ViewManager.getInstance().changeScene(scene);
        // },this);
        // timer.start();
    };
    /**
     * 旁观
     */
    PkInviteScene.prototype.observe = function () {
        var alert = new LineInfo("\u5BF9\u5C40\u8FDB\u884C\u4E2D");
        alert.y = 50;
        this.buttonGroup.addChild(alert);
    };
    /**
     * 无效局
     */
    PkInviteScene.prototype.invalid = function () {
        var info = new LineInfo('本局无效\n友谊的小船荡啊荡，\nbut 你们却都没答题!');
        info.y = 50;
        this.buttonGroup.addChild(info);
    };
    /**
     * 无效局
     */
    PkInviteScene.prototype.errorMsg = function () {
        var info = new LineInfo(this.msg);
        info.y = 50;
        this.buttonGroup.addChild(info);
    };
    /**
     * 无效局-全打错
     */
    PkInviteScene.prototype.invalidError = function () {
        var info = new LineInfo('本局无效\n棋逢对手，满盘皆错！\n两位赶快去温习一下再来挑战吧！');
        info.y = 50;
        this.buttonGroup.addChild(info);
    };
    /**
     * 24小时未应答
     */
    PkInviteScene.prototype.pkNoAnswer = function () {
        var info = new LineInfo('您的好友24小时内未应答\n请确认TA是否被外星人绑架了');
        info.y = 50;
        this.buttonGroup.addChild(info);
    };
    PkInviteScene.prototype.pkReject = function () {
        var info = new LineInfo('您的好友拒绝了您的邀请\n并向您发送了一波爱心');
        info.y = 50;
        this.buttonGroup.addChild(info);
    };
    PkInviteScene.prototype.pkEnd = function () {
        var info = new LineInfo('Skr! \n你的对手还在苦思答题中~\n请稍候。');
        info.y = 50;
        this.buttonGroup.addChild(info);
    };
    PkInviteScene.prototype.onBack = function () {
        switch (this.type) {
            case InviteStatus.PK_ERR_MSG:
                DataManager.getInstance().removePkData();
                ViewManager.getInstance().backByName('pkmodel');
                break;
            default:
                ViewManager.getInstance().jumpHome();
                break;
        }
    };
    PkInviteScene.prototype.waiting = function () {
        var text = new egret.TextField();
        text.text = "等待对手24小时进入PK";
        text.width = 750;
        text.size = 40;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.y = -100;
        this.buttonGroup.addChild(text);
        var backButton = new XButton('返回PK模式目录');
        backButton.width = 450;
        backButton.x = 150;
        backButton.y = 150;
        this.buttonGroup.addChild(backButton);
        backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            ViewManager.getInstance().backByName('pkmodel');
        }, this);
    };
    /**
     * 被邀请
     */
    PkInviteScene.prototype.accepted = function () {
        var _this = this;
        var y = 0;
        var inviteButton = new XButton('接受邀请');
        inviteButton.width = 450;
        inviteButton.x = 150;
        this.buttonGroup.addChild(inviteButton);
        var pkCode = DataManager.getInstance().getPkData().pkCode;
        inviteButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            //TODO  接受邀请
            SocketX.getInstance().addEventListener(NetEvent.PK_ACCEPT, function (data) {
                var scene = new PkInviteScene(InviteStatus.MATCHEND);
                ViewManager.getInstance().changeScene(scene);
            });
            SocketX.getInstance().sendMsg(NetEvent.PK_ACCEPT, {
                pkCode: pkCode,
                accept: true,
            });
        }, this);
        y += 130;
        var quitButton = new XButton('拒绝对战');
        quitButton.width = 450;
        quitButton.x = 150;
        quitButton.y = y;
        this.buttonGroup.addChild(quitButton);
        //
        quitButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log('quit ');
            //TODO 拒绝邀请
            var confirm = new Confirm('您确定拒绝对战吗？');
            _this.addChild(confirm);
            confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_YES, function () {
                SocketX.getInstance().sendMsg(NetEvent.PK_ACCEPT, {
                    pkCode: pkCode,
                    accept: false,
                });
                var scene = new IndexScene();
                ViewManager.getInstance().changeScene(scene);
            }, _this);
        }, this);
    };
    return PkInviteScene;
}(Scene));
__reflect(PkInviteScene.prototype, "PkInviteScene");
