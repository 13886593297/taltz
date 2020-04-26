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
                title: 'pk_modal_title_person_png',
                items: [
                    { icon: 'pk_auto_png', type: PkModel.AUTO },
                    { icon: 'pk_friend_png', type: PkModel.FRIEND }
                ]
            },
            "2": {
                title: 'pk_modal_title_team_png',
                items: [
                    { icon: 'pk_answer_png', type: PkModel.ANSWER },
                    { icon: 'pk_knowledge_png', type: PkModel.KNOW }
                ]
            }
        };
        _this.type = type;
        _this.data = _this.config[type];
        return _this;
    }
    PkModelScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        this.name = "pkmodel";
        var stageW = ViewManager.getInstance().stage.stageWidth;
        var title = Util.createBitmapByName(this.data.title);
        title.x = (stageW - title.width) / 2;
        title.y = 45;
        this.addChild(title);
        if (this.type == PKTYPE.PERSON) {
            SocketX.getInstance().connectPersonPk();
        }
        else {
            SocketX.getInstance().connectTeamPk();
        }
        var itemY = 400;
        var _loop_1 = function (data) {
            var item = new PkItem(data);
            this_1.addChild(item);
            item.y = itemY;
            itemY += 200;
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                Util.playMusic('model_select_mp3');
                DataManager.getInstance().setPkModel(data.type);
                switch (data.type) {
                    case PkModel.ANSWER:
                        var matchScene = new PkRoomScene(data.type);
                        ViewManager.getInstance().changeScene(matchScene);
                        break;
                    case PkModel.KNOW:
                        // let resultScene = new TeamResultScene()
                        // let resultScene = new TeamKnowResultScene()
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
                        // test begin
                        // let code = Util.randomString(32)
                        // console.log('pkcode:'+code)
                        // SocketX.getInstance().sendMsg(NetEvent.PK_INVITE,{pkCode:code})
                        // let inviteScene = new PkInviteScene(InviteStatus.INVITING)
                        // ViewManager.getInstance().changeScene(inviteScene)
                        // test end
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
            var record = Util.createBitmapByName('pk_record_png');
            record.x = (stageW - record.width) / 2;
            record.y = this.stage.stageHeight - 300;
            record.touchEnabled = true;
            this.addChild(record);
            // SocketX.getInstance().addEventListener(NetEvent.PK_RECORDS,(data)=>{})
            // SocketX.getInstance().sendMsg(NetEvent.PK_RECORDS,{ page:1,pageSize:20})
            record.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
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
