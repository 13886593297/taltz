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
 * 答题结果页
 */
var ResultScene = (function (_super) {
    __extends(ResultScene, _super);
    function ResultScene(params) {
        var _this = _super.call(this) || this;
        _this.result = params.result;
        _this.errors = params.errors;
        _this.levelData = params.levelData;
        _this.lifecycleid = params.lifecycleid;
        return _this;
    }
    ResultScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        var group = new eui.Group();
        group.x = 170;
        group.y = 25;
        this.addChild(group);
        var flagBg = Util.createBitmapByName('flagBg_png');
        group.addChild(flagBg);
        // 等级
        var flagText = new egret.TextField();
        flagText.text = this.levelData.flag;
        flagText.width = flagBg.width;
        flagText.height = flagBg.height + 10;
        flagText.textAlign = egret.HorizontalAlign.CENTER;
        flagText.verticalAlign = egret.VerticalAlign.MIDDLE;
        flagText.size = 28;
        group.addChild(flagText);
        // 名称
        var flagName = new egret.TextField();
        flagName.text = this.levelData.name;
        flagName.verticalAlign = egret.VerticalAlign.MIDDLE;
        flagName.textAlign = egret.HorizontalAlign.CENTER;
        flagName.stroke = 6;
        flagName.strokeColor = 0x0d793b;
        flagName.size = 80;
        flagName.x = flagBg.width - 20;
        flagName.height = flagBg.height + 10;
        group.addChild(flagName);
        var bg;
        var music;
        if (!this.result.isPass) {
            bg = Util.createBitmapByName('train_fail_png');
            music = "nopass_mp3";
        }
        else {
            bg = Util.createBitmapByName('train_success_png');
            music = "pass_mp3";
        }
        bg.y = 200;
        this.addChild(bg);
        Util.playMusic(music);
        Http.getInstance().post(Url.HTTP_USER_BASE_INFO, "", function (info) {
            DataManager.getInstance().updateUserInfo(info.data);
        });
        var ratevalue = Math.round(this.result.correct * 100 / (this.result.correct + this.result.error));
        var rate;
        if (this.result.isPass) {
            rate = this.createScoreView([
                { text: '正确率\n', style: { size: 20 } },
                { text: ratevalue + '%' }
            ]);
            rate.x = 160;
            rate.y = 640;
            var score = this.createScoreView([
                { text: '积分\n', style: { size: 20 } },
                { text: '+' + this.result.addScore }
            ]);
            score.x = 508;
            score.y = 288;
            this.addChild(score);
        }
        else {
            rate = this.createScoreView([
                { text: '正确率\n', style: { size: 20 } },
                { text: ratevalue + '%' }
            ]);
            rate.x = 560;
            rate.y = 424;
        }
        this.addChild(rate);
        // 继续训练
        var restartButton = Util.createBitmapByName('continueTrain_png');
        restartButton.y = 1025;
        restartButton.x = this.stage.stageWidth / 2 - restartButton.width - 10;
        this.addChild(restartButton);
        restartButton.touchEnabled = true;
        restartButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var bandge = DataManager.getInstance().getCurrentBandge();
            var scene = new TrainLevelScene(bandge);
            ViewManager.getInstance().changeScene(scene);
        }, this);
        // 炫耀成绩
        var saveButton = Util.createBitmapByName('flaunt_png');
        saveButton.y = 1025;
        saveButton.x = this.stage.stageWidth / 2 + 10;
        this.addChild(saveButton);
        saveButton.touchEnabled = true;
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Http.getInstance().post(Url.HTTP_TRAIN_REPORT, { lifecircle: _this.lifecycleid }, function (json) {
                //TODO 
                DataManager.getInstance().updateUserInfo(json.data.userBase);
                DataManager.getInstance().updateUser('trainResult', json.data.trainResult);
                var scene = new ScoreScene();
                ViewManager.getInstance().changeScene(scene);
            });
        }, this);
        // 错题分析
        if (this.result.error > 0) {
            var errorButton = Util.createBitmapByName('errorParse_png');
            errorButton.y = 900;
            errorButton.x = (this.stage.stageWidth - errorButton.width) / 2;
            this.addChild(errorButton);
            errorButton.touchEnabled = true;
            errorButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var scene = new ErrorScene(_this.errors);
                ViewManager.getInstance().changeScene(scene);
            }, this);
        }
    };
    ResultScene.prototype.createScoreView = function (text) {
        var w = 90;
        var group = new eui.Group();
        group.width = w;
        group.height = w;
        var textField = new egret.TextField();
        textField.textFlow = text;
        textField.textColor = 0xFFFFFF;
        textField.width = w;
        textField.height = w;
        textField.textAlign = egret.HorizontalAlign.CENTER;
        textField.verticalAlign = egret.VerticalAlign.MIDDLE;
        group.addChild(textField);
        return group;
    };
    ResultScene.prototype.onBack = function () {
        ViewManager.getInstance().jumpHome();
    };
    return ResultScene;
}(Scene));
__reflect(ResultScene.prototype, "ResultScene");
