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
/**
 * 用户中心
 */
var UserScene = (function (_super) {
    __extends(UserScene, _super);
    function UserScene() {
        return _super.call(this) || this;
    }
    UserScene.prototype.init = function () {
        _super.prototype.setBackground.call(this);
        Util.setTitle('个人中心');
        var shareGroup = new eui.Group();
        this.addChild(shareGroup);
        // 玩家信息
        var user = new UserInfo('center');
        shareGroup.addChild(user);
        // 保存图片和分享
        var radarPanel = new RadarPanel(this);
        radarPanel.x = (this.stage.stageWidth - 660) / 2;
        radarPanel.y = 530;
        this.addChild(radarPanel);
        // 玩家数据
        var userData = DataManager.getInstance().getUser();
        var radar = new Radar(userData.attrInfo, userData.attrName, 450, 450);
        radar.x = (this.stage.stageWidth - 450) / 2;
        radar.y = 550;
        shareGroup.addChild(radar);
        // 注册微信分享
        Util.registerShare(shareGroup, ShareType.USER_INFO, userData.nickName, userData.lvName);
    };
    return UserScene;
}(Scene));
__reflect(UserScene.prototype, "UserScene");
