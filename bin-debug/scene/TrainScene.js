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
        _this.btn_bg = 'close_png';
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
        var gradeArr = ['train_grade1_png', 'train_grade2_png', 'train_grade3_png', 'train_grade4_png'];
        gradeArr.forEach(function (item, key) {
            var grade = Util.createBitmapByName(item);
            grade.touchEnabled = true;
            if (Math.floor(userinfo.lv / 20) < key) {
                grade.filters = [grayFliter];
                grade.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    Util.playMusic('model_select_mp3');
                    var alert = new AlertPanel("提示:请先通关前面的关卡后再来哦！", 900);
                    _this.addChild(alert);
                }, _this);
            }
            else {
                grade.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.initLevelView(_this.bandge[key]), _this);
            }
            if (key % 2 == 0) {
                grade.x = _this.stage.stageWidth / 2 - grade.width - 10;
            }
            else {
                grade.x = _this.stage.stageWidth / 2 + 10;
            }
            if (key < 2) {
                grade.y = 0;
            }
            else {
                grade.y = grade.height;
            }
            group.addChild(grade);
        });
        // 我的收藏
        var favor = Util.createBitmapByName("myfavor_png");
        favor.y = 1030;
        favor.x = this.stage.stageWidth / 2;
        favor.anchorOffsetX = favor.width / 2;
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
        this.selected = bandge;
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
