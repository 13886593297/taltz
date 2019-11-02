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
var FavorScene = (function (_super) {
    __extends(FavorScene, _super);
    function FavorScene(favors) {
        var _this = _super.call(this) || this;
        _this.favors = favors;
        return _this;
    }
    FavorScene.prototype.init = function () {
        _super.prototype.setBackground.call(this);
        Util.setTitle('我的收藏');
        this.btn_bg = 'close_png';
        var y = 10;
        var title = Util.createBitmapByName('favor_title_png');
        this.addChild(title);
        title.y = y;
        y += 190;
        for (var _i = 0, _a = this.favors; _i < _a.length; _i++) {
            var item = _a[_i];
            var bg = void 0;
            switch (item.attrVal) {
                case '产品信息':
                    bg = Util.createBitmapByName("favor_title_cpxx_png");
                    break;
                case '竞品分析':
                    bg = Util.createBitmapByName("favor_title_jpfx_png");
                    break;
                case '市场策略':
                    bg = Util.createBitmapByName("favor_title_sccl_png");
                    break;
                case '疾病信息':
                    bg = Util.createBitmapByName("favor_title_jbxx_png");
                    break;
                case '作用机制':
                    bg = Util.createBitmapByName("favor_title_zyjz_png");
                    break;
                default:
                    bg = Util.createBitmapByName("favor_title_lcyj_png");
                    break;
            }
            bg.x = (this.stage.width - bg.width) / 2;
            bg.y = y;
            this.addChild(bg);
            y += 150;
            bg.touchEnabled = true;
            bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.train(item), true);
        }
    };
    FavorScene.prototype.train = function (item) {
        var _this = this;
        return function () {
            Http.getInstance().post(Url.HTTP_TRAIN_START, { type: 2, tid: item.qattrId }, function (data) {
                if (data.data.length > 0) {
                    var answer = new Answers();
                    answer.lifecycleId = item.qattrId;
                    answer.questions = data.data;
                    var levelData = item;
                    levelData.name = item.attrVal;
                    levelData.flag = "";
                    var scene = new AnswerScene(answer, 2, levelData);
                    ViewManager.getInstance().changeScene(scene);
                }
                else {
                    var alert_1 = new AlertPanel("提示:暂无收藏！", 1200);
                    _this.addChild(alert_1);
                }
            });
        };
    };
    return FavorScene;
}(Scene));
__reflect(FavorScene.prototype, "FavorScene");
