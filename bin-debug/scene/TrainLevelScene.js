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
var TrainLevelScene = (function (_super) {
    __extends(TrainLevelScene, _super);
    function TrainLevelScene(bandge) {
        var _this = _super.call(this) || this;
        /**
         * 配置关卡位置
         */
        _this.POINTS = [
            { x: 100, y: 70 },
            { x: 460, y: 270 },
            { x: 100, y: 470 },
            { x: 460, y: 670 },
            { x: 100, y: 870 },
            { x: 460, y: 1070 },
            { x: 100, y: 1270 },
            { x: 460, y: 1470 },
            { x: 100, y: 1670 },
            { x: 460, y: 1870 },
            { x: 100, y: 2070 },
            { x: 460, y: 2270 },
            { x: 100, y: 2470 },
            { x: 460, y: 2670 },
            { x: 100, y: 2870 },
            { x: 460, y: 3070 },
            { x: 100, y: 3270 },
            { x: 460, y: 3470 },
            { x: 100, y: 3670 },
            { x: 460, y: 3870 }
        ];
        _this.bandge = bandge;
        return _this;
    }
    TrainLevelScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        // 标题
        var title = Util.createBitmapByName('train_title_png');
        this.addChild(title);
        var currentLevel = DataManager.getInstance().getUser().lv;
        //创建一个容器，里面包含一张图片
        var group = new eui.Group();
        group.height = 5000;
        group.width = this.stage.stageWidth;
        this.addChild(group);
        var lineGroup = new eui.Group();
        lineGroup.height = 4100;
        group.addChild(lineGroup);
        var _loop_1 = function (i) {
            // 每个关卡的位置
            var point = this_1.POINTS[i];
            // 每关的信息
            var data = this_1.bandge.levels[i];
            // 判断是否通关
            if (currentLevel < data.key) {
                // 未解锁
                data.status = 2;
            }
            else if (currentLevel == data.key) {
                // 当前关卡
                data.status = 1;
            }
            else {
                // 已通关
                data.status = 0;
            }
            var level = new LevelView(data);
            level.x = point.x;
            level.y = point.y;
            group.addChild(level);
            level.touchEnabled = true;
            level.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                //请求数据
                Util.playMusic('model_select_mp3');
                if (currentLevel >= data.key) {
                    Http.getInstance().post(Url.HTTP_TRAIN_START, { type: 1, tid: level.levelData.levelid }, function (data) {
                        console.log(level.levelData.levelid, data.data);
                        if (data.data.questions.length > 0) {
                            var answer = new Answers();
                            answer.lifecycleId = data.data.lifecycleId;
                            answer.questions = data.data.questions;
                            var scene = new AnswerScene(answer, 1, level.levelData);
                            ViewManager.getInstance().changeScene(scene);
                        }
                        else {
                            var alert_1 = new AlertPanel("提示:请先通关前面的关卡后再来哦", 150);
                            _this.addChild(alert_1);
                        }
                    });
                }
                else {
                    var alert_2 = new AlertPanel("提示:请先通关前面的关卡后再来哦", 150);
                    _this.addChild(alert_2);
                }
            }, this_1);
            // 关卡之间的连接线条
            var linePic = void 0;
            if (i < 19) {
                if (i % 2 == 1) {
                    linePic = Util.createBitmapByName("train_line_left_png");
                    linePic.y = point.y + 90;
                }
                else {
                    linePic = Util.createBitmapByName("train_line_right_png");
                    linePic.y = point.y + 100;
                }
                group.addChild(linePic);
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.POINTS.length; i++) {
            _loop_1(i);
        }
        //创建一个Scroller
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth;
        myScroller.height = this.stage.stageHeight - 200;
        myScroller.y = 150;
        //设置viewport
        myScroller.viewport = group;
        this.addChild(myScroller);
    };
    return TrainLevelScene;
}(Scene));
__reflect(TrainLevelScene.prototype, "TrainLevelScene");
