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
 * 错题分析界面
 */
var ErrorScene = (function (_super) {
    __extends(ErrorScene, _super);
    function ErrorScene(errors, type) {
        var _this = _super.call(this) || this;
        _this.curIdx = 1;
        _this.errors = errors;
        _this.type = type;
        return _this;
    }
    ErrorScene.prototype.init = function () {
        var _this = this;
        if (this.type == 9) {
            this.close_btn = false;
        }
        _super.prototype.setBackground.call(this);
        var title = Util.createBitmapByName('title_error_png');
        title.y = 20;
        this.addChild(title);
        var titleText = new egret.TextField();
        titleText.text = "\u672C\u6B21\u5171\u9519" + this.errors.length + "\u9898";
        titleText.textColor = 0x35b039;
        titleText.x = (this.stage.stageWidth - titleText.width) / 2;
        titleText.y = 200;
        titleText.size = 40;
        this.addChild(titleText);
        // 题目图片
        var tmfx01 = Util.createBitmapByName('tmfx01_png');
        this.addChild(tmfx01);
        tmfx01.x = 100;
        tmfx01.y = 280;
        // 题目
        var subject = Util.getTrain(this.errors[this.curIdx - 1]);
        if (!subject)
            return;
        var question = new egret.TextField();
        question.text = subject.title;
        question.width = 550;
        question.lineSpacing = 10;
        question.x = 100;
        question.y = 370;
        question.size = 40;
        question.textColor = 0x35b039;
        this.title = question;
        this.addChild(question);
        var tmfx02 = Util.createBitmapByName('tmfx02_png');
        this.addChild(tmfx02);
        tmfx02.x = 100;
        tmfx02.y = 700;
        var content = new egret.TextField();
        content.textFlow = [
            { text: '应选' + subject.result + '\n' },
            { text: subject.content }
        ];
        content.width = 550;
        content.x = 100;
        content.y = 780;
        content.lineSpacing = 10;
        content.textColor = 0x35b039;
        this.addChild(content);
        this.content = content;
        var next = Util.createBitmapByName('next_png');
        next.x = this.stage.stageWidth / 2 - next.width - 10;
        next.y = 1000;
        this.addChild(next);
        next.touchEnabled = true;
        next.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.next();
        }, this);
        this.nextButton = next;
        var train = Util.createBitmapByName(this.type == 9 ? 'dailyTasks_tryAgain1_png' : 'continueTrain_png');
        train.x = this.stage.stageWidth / 2 + 10;
        train.y = 1000;
        this.addChild(train);
        train.touchEnabled = true;
        train.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.type == 9) {
                var i = Util.getDailyTaskID();
                Http.getInstance().post(Url.HTTP_DAILYTASKS_START, { questionAttrIds: EquipmentConfigs[i].qaids }, function (data) {
                    var answer = new Answers();
                    answer.lifecycleId = data.data.lifecycleId;
                    answer.questions = data.data.questions.slice(0, 5);
                    var scene = new AnswerScene(answer, _this.type);
                    ViewManager.getInstance().changeScene(scene);
                });
            }
            else {
                ViewManager.getInstance().back(4);
            }
        }, this);
        this.trainButton = train;
        if (this.curIdx >= this.errors.length) {
            this.nextButton.visible = false;
            this.trainButton.x = (this.stage.stageWidth - this.trainButton.width) / 2;
        }
    };
    // 下一题
    ErrorScene.prototype.next = function () {
        if (this.curIdx == this.errors.length) {
            return;
        }
        this.curIdx = this.curIdx + 1;
        var subject = Util.getTrain(this.errors[this.curIdx - 1]);
        if (!subject)
            return;
        this.title.text = subject.title;
        this.content.textFlow = [
            { text: '应选' + subject.result + '\n' },
            { text: subject.content }
        ];
        var res = '';
        for (var _i = 0, _a = subject.options; _i < _a.length; _i++) {
            var option = _a[_i];
            if (option.flag == subject.result) {
                res = option.name;
                break;
            }
        }
        if (this.curIdx >= this.errors.length) {
            this.nextButton.visible = false;
            this.trainButton.x = (this.stage.stageWidth - this.trainButton.width) / 2;
        }
    };
    return ErrorScene;
}(Scene));
__reflect(ErrorScene.prototype, "ErrorScene");
