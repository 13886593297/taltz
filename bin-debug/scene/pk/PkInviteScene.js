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
        _super.prototype.setBackground.call(this);
        this.close_btn = false;
        var avatarGroup = new eui.Group;
        avatarGroup.y = 20;
        this.addChild(avatarGroup);
        this.avatarGroup = avatarGroup;
        var userinfo = DataManager.getInstance().getUser();
        var leftUser = new PkUser(userinfo);
        avatarGroup.addChild(leftUser);
        var pkData = DataManager.getInstance().getPkData();
        var rightUser = new PkUser(pkData ? pkData.pkUser : null, 'right');
        rightUser.x = this.stage.stageWidth - rightUser.width;
        avatarGroup.addChild(rightUser);
        var pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.x = (this.stage.stageWidth - pkVs.width) / 2;
        pkVs.y = 30;
        avatarGroup.addChild(pkVs);
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
                this.avatarGroup.y = 460;
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
                this.close_btn = 'close_png';
                this.backPage = 'pkmodel';
                this.avatarGroup.y = 120;
                break;
            case InviteStatus.PK_END_WAIT:
                this.pkEnd();
                this.close_btn = 'close_png';
                this.backPage = 'pkmodel';
                this.avatarGroup.y = 120;
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
        text.textColor = 0x989898;
        text.y = 166;
        this.addChild(text);
        var timerNumber = 60;
        var timer = new egret.Timer(1000, 60);
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            timerNumber--;
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
        var waitPic = Util.createBitmapByName('pk_end_wait_png');
        waitPic.x = (this.stage.stageWidth - waitPic.width) / 2;
        waitPic.y = 500;
        this.addChild(waitPic);
        var tip = new LineInfo("\u7B49\u5F85\u597D\u53CB\u8FDB\u5165\u6311\u6218");
        this.addChild(tip);
    };
    PkInviteScene.prototype.noAccept = function () {
        var text = new egret.TextField;
        text.text = "您的好友正忙,请下次再邀请TA吧！";
        text.width = 440;
        text.textColor = Config.COLOR_MAINCOLOR;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.x = (this.stage.stageWidth - text.width) / 2;
        text.y = 500;
        this.addChild(text);
        var seconds = 5;
        var alert = new LineInfo(seconds + "\u79D2\u540E\u8FDB\u5165\u79BB\u7EBF\u7B54\u9898\u6A21\u5F0F\uFF01");
        var timer = new egret.Timer(1000, 5);
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            seconds--;
            alert.setText(seconds + "\u79D2\u540E\u8FDB\u5165\u79BB\u7EBF\u7B54\u9898\u6A21\u5F0F\uFF01");
        }, this);
        timer.start;
        this.addChild(alert);
    };
    PkInviteScene.prototype.matchEnd = function () {
        //开始pk
        var pkData = DataManager.getInstance().getPkData();
        var resultBgName = 'match_title_01_png';
        if (!pkData || !pkData.pkUser) {
            resultBgName = 'match_title_02_png';
        }
        var resultBg = Util.createBitmapByName(resultBgName);
        resultBg.x = (this.stage.stageWidth - resultBg.width) / 2;
        resultBg.y = 580;
        this.addChild(resultBg);
        var tip = Util.createBitmapByName('pk_begin_png');
        tip.x = (this.stage.stageWidth - tip.width) / 2;
        tip.y = this.stage.stageHeight - 300;
        this.addChild(tip);
        var seconds = 5;
        var countDown = new egret.TextField;
        countDown.text = '' + seconds;
        countDown.x = tip.x;
        countDown.y = tip.y;
        countDown.width = 100;
        countDown.height = tip.height - 5;
        countDown.textAlign = 'center';
        countDown.verticalAlign = 'middle';
        countDown.size = 36;
        this.addChild(countDown);
        var timer = new egret.Timer(1000, 5);
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            seconds--;
            countDown.text = '' + seconds;
        }, this);
        // test begin
        // timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
        //     let scene = new BattleScene()
        //     ViewManager.getInstance().changeScene(scene)
        // }, this)
        // test end
        timer.start();
    };
    /**
     * 旁观
     */
    PkInviteScene.prototype.observe = function () {
        var alert = new LineInfo("\u5BF9\u5C40\u8FDB\u884C\u4E2D");
        this.addChild(alert);
    };
    /**
     * 无效局
     */
    PkInviteScene.prototype.invalid = function () {
        var info = new LineInfo('本局无效\n友谊的小船荡啊荡，\nbut 你们却都没答题!');
        this.addChild(info);
    };
    /**
     * 无效局
     */
    PkInviteScene.prototype.errorMsg = function () {
        var info = new LineInfo(this.msg);
        this.addChild(info);
    };
    /**
     * 无效局-全打错
     */
    PkInviteScene.prototype.invalidError = function () {
        var info = new LineInfo('本局无效\n棋逢对手，满盘皆错！\n两位赶快去温习一下再来挑战吧！');
        this.addChild(info);
    };
    /**
     * 24小时未应答
     */
    PkInviteScene.prototype.pkNoAnswer = function () {
        var info = new LineInfo('您的好友24小时内未应答\n请确认TA是否被外星人绑架了');
        this.addChild(info);
    };
    PkInviteScene.prototype.pkReject = function () {
        var info = new LineInfo('您的好友拒绝了您的邀请\n并向您发送了一波爱心');
        this.addChild(info);
    };
    PkInviteScene.prototype.pkEnd = function () {
        var waitPic = Util.createBitmapByName('pk_end_wait_png');
        waitPic.x = (this.stage.stageWidth - waitPic.width) / 2;
        waitPic.y = 500;
        this.addChild(waitPic);
        var info = new LineInfo('你的对手还在苦苦思索中\n请稍候...');
        this.addChild(info);
        // test begin
        // let timer = new egret.Timer(3000, 1)
        // timer.addEventListener(egret.TimerEvent.TIMER, () => {
        //     let pk = new PkResultScene(1)
        //     ViewManager.getInstance().changeScene(pk)
        // }, this)
        // timer.start()
        // test end
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
        var waitPic = Util.createBitmapByName('pk_end_wait_png');
        waitPic.x = (this.stage.stageWidth - waitPic.width) / 2;
        waitPic.y = 500;
        this.addChild(waitPic);
        var info = new LineInfo('等待对手24小时进入挑战');
        this.addChild(info);
        var backButton = Util.createBitmapByName('pk_back_png');
        backButton.x = (this.stage.stageWidth - backButton.width) / 2;
        backButton.y = this.stage.stageHeight - 200;
        backButton.touchEnabled = true;
        this.addChild(backButton);
        backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            ViewManager.getInstance().backByName('pkmodel');
        }, this);
    };
    /**
     * 被邀请
     */
    PkInviteScene.prototype.accepted = function () {
        var inviteButton = Util.createBitmapByName('pk_accept_png');
        inviteButton.x = this.stage.stageWidth / 2 - inviteButton.width - 30;
        inviteButton.y = this.stage.stageHeight - 200;
        inviteButton.touchEnabled = true;
        this.addChild(inviteButton);
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
        var quitButton = Util.createBitmapByName('pk_refuse_png');
        quitButton.x = this.stage.stageWidth / 2 + 30;
        quitButton.y = inviteButton.y;
        quitButton.touchEnabled = true;
        this.addChild(quitButton);
        quitButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            SocketX.getInstance().sendMsg(NetEvent.PK_ACCEPT, {
                pkCode: pkCode,
                accept: false,
            });
            var scene = new IndexScene();
            ViewManager.getInstance().changeScene(scene);
        }, this);
    };
    return PkInviteScene;
}(Scene));
__reflect(PkInviteScene.prototype, "PkInviteScene");
