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
var PkModelScene = (function (_super) {
    __extends(PkModelScene, _super);
    function PkModelScene(type) {
        var _this = _super.call(this) || this;
        _this.config = {
            "1": {
                title: 'PK模式',
                items: [{
                        icon: 'pk_auto_png', title: '自动匹配', iconWidth: 98, type: PkModel.AUTO
                    }, {
                        icon: 'pk_friend_png', title: '邀请好友', iconWidth: 126, type: PkModel.FRIEND
                    }]
            },
            "2": {
                title: '对战形式',
                items: [{
                        icon: 'team_answer_png', title: '抢答赛', iconWidth: 107, type: PkModel.ANSWER
                    }, {
                        icon: 'team_know_png', title: '知识赛', iconWidth: 200, type: PkModel.KNOW
                    }]
            }
        };
        _this.type = type;
        _this.data = _this.config[type];
        return _this;
    }
    PkModelScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        var y = 100;
        this.name = "pkmodel";
        var title = new Title(this.data.title);
        this.addChild(title);
        title.y = y;
        if (this.type == PKTYPE.PERSON) {
            SocketX.getInstance().connectPersonPk();
        }
        else {
            SocketX.getInstance().connectTeamPk();
        }
        var itemY = 300;
        var _loop_1 = function (data) {
            var item = new PkItem(data);
            this_1.addChild(item);
            item.y = itemY;
            itemY += 300;
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                console.log(data.type);
                Util.playMusic('model_select_mp3');
                DataManager.getInstance().setPkModel(data.type);
                switch (data.type) {
                    case PkModel.ANSWER:
                        var matchScene = new PkRoomScene(data.type);
                        ViewManager.getInstance().changeScene(matchScene);
                        break;
                    case PkModel.KNOW:
                        // let resultScene = new TeamResultScene();
                        // let resultScene = new TeamKnowResultScene();
                        var roomScene = new PkRoomScene(data.type);
                        ViewManager.getInstance().changeScene(roomScene);
                        break;
                    case PkModel.AUTO:
                        //进入房间
                        var scene = new PkMatchScene();
                        ViewManager.getInstance().changeScene(scene);
                        break;
                    case PkModel.FRIEND:
                        var tips_1 = new SharePanel();
                        _this.addChild(tips_1);
                        var user = DataManager.getInstance().getUser();
                        //TODO  注册分享挑战
                        SocketX.getInstance().addEventListener(NetEvent.PK_INVITE, function (data) {
                            var inviteScene = new PkInviteScene(InviteStatus.INVITING);
                            ViewManager.getInstance().changeScene(inviteScene);
                        });
                        Util.registerShare(null, ShareType.PK_INVITE_FRIEND, user.nickName, null, function (code) {
                            //跳转等待对手加入界面
                            _this.removeChild(tips_1);
                            SocketX.getInstance().sendMsg(NetEvent.PK_INVITE, { pkCode: code });
                        });
                        // let code = Util.randomString(32);
                        // console.log('pkcode:'+code);
                        // SocketX.getInstance().sendMsg(NetEvent.PK_INVITE,{pkCode:code});
                        // let inviteScene = new PkInviteScene(InviteStatus.INVITING);
                        // ViewManager.getInstance().changeScene(inviteScene);
                        break;
                }
            }, this_1);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.data.items; _i < _a.length; _i++) {
            var data = _a[_i];
            _loop_1(data);
        }
        if (this.type == 1) {
            var text = new egret.TextField();
            text.text = "挑战记录";
            text.size = 40;
            text.textColor = 0xf36e23;
            text.width = this.stage.stageWidth;
            text.textAlign = egret.HorizontalAlign.CENTER;
            text.y = this.stage.stageHeight - 100;
            this.addChild(text);
            text.touchEnabled = true;
            // SocketX.getInstance().addEventListener(NetEvent.PK_RECORDS,(data)=>{
            // })
            // SocketX.getInstance().sendMsg(NetEvent.PK_RECORDS,{ page:1,pageSize:20});
            text.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var record = new PkRecordScene();
                ViewManager.getInstance().changeScene(record);
            }, this);
        }
    };
    PkModelScene.prototype.onBack = function () {
        SocketX.getInstance().close();
        ViewManager.getInstance().back();
    };
    return PkModelScene;
}(Scene));
__reflect(PkModelScene.prototype, "PkModelScene");
