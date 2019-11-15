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
var TrainScene = (function (_super) {
    __extends(TrainScene, _super);
    function TrainScene() {
        var _this = _super.call(this) || this;
        _this.bandge = Util.getConfig('bandge');
        Util.setTitle('训练场');
        return _this;
    }
    TrainScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        // 标题
        var title = Util.createBitmapByName('train_title_png');
        this.addChild(title);
        var group = new eui.Group();
        group.y = 250;
        group.width = this.stage.width;
        this.addChild(group);
        var userinfo = DataManager.getInstance().getUser();
        var grayFliter = Util.grayFliter();
        // 关卡
        for (var i = 0; i < this.bandge.length; i++) {
            var grade = Util.createBitmapByName("train_grade" + (i + 1) + "_png");
            grade.touchEnabled = true;
            // 未通关
            if (userinfo.lv < this.bandge[i].start) {
                grade.filters = [grayFliter];
                grade.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    Util.playMusic('model_select_mp3');
                    var alert = new AlertPanel("提示:请先通关前面的关卡后再来哦！", 900);
                    _this.addChild(alert);
                }, this);
            }
            else {
                grade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.initLevelView(this.bandge[i]), this);
            }
            grade.x = i % 2 == 0 ? this.stage.stageWidth / 2 - grade.width - 10 : this.stage.stageWidth / 2 + 10;
            grade.y = i < 2 ? 0 : grade.height;
            group.addChild(grade);
        }
        // 我的收藏
        var favor = Util.createBitmapByName("myfavor_png");
        favor.x = (this.stage.stageWidth - favor.width) / 2;
        favor.y = 1030;
        this.addChild(favor);
        favor.touchEnabled = true;
        favor.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Http.getInstance().post(Url.HTTP_FAVOR_LIST, "", function (data) {
                if (data.data && data.data.length > 0) {
                    var scene = new FavorScene(data.data);
                    ViewManager.getInstance().changeScene(scene);
                }
                else {
                    var alert_1 = new AlertPanel("提示:暂无收藏！", 900);
                    _this.addChild(alert_1);
                }
            });
        }, this);
    };
    /**
     * 关卡界面
     */
    TrainScene.prototype.initLevelView = function (bandge) {
        return function () {
            Util.playMusic('model_select_mp3');
            DataManager.getInstance().setCurrentBandge(bandge);
            var scene = new TrainLevelScene(bandge);
            ViewManager.getInstance().changeScene(scene);
        };
    };
    return TrainScene;
}(Scene));
__reflect(TrainScene.prototype, "TrainScene");
