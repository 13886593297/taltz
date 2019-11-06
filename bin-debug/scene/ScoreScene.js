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
var ScoreScene = (function (_super) {
    __extends(ScoreScene, _super);
    function ScoreScene() {
        return _super.call(this) || this;
    }
    ScoreScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        var user = new UserInfo('score');
        user.y = 20;
        this.addChild(user);
        var saveButton = Util.createBitmapByName('button_small_1_png');
        saveButton.x = this.stage.stageWidth / 2 - saveButton.width - 10;
        saveButton.y = 1020;
        saveButton.touchEnabled = true;
        this.addChild(saveButton);
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var alert = new AlertPanel("提示:请自行截图保存图片", 1150);
            _this.addChild(alert);
        }, this);
        var shareButton = Util.createBitmapByName('button_small_2_png');
        shareButton.x = this.stage.stageWidth / 2 + 10;
        shareButton.y = 1020;
        shareButton.touchEnabled = true;
        this.addChild(shareButton);
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var tips = new SharePanel();
            _this.addChild(tips);
        }, this);
        this.registerShare();
    };
    ScoreScene.prototype.registerShare = function () {
        var user = DataManager.getInstance().getUser();
        var trainResult = user.trainResult;
        var rateValue = Math.round(trainResult.trainCorrectCount * 100 / trainResult.trainTotalCount);
        Util.registerShare(this.shareGroup, ShareType.TRAIN_RESULT, user.nickName, rateValue + '%');
    };
    ScoreScene.prototype.onBack = function () {
        ViewManager.getInstance().jumpHome();
    };
    return ScoreScene;
}(Scene));
__reflect(ScoreScene.prototype, "ScoreScene");
