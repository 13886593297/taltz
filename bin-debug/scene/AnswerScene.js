/**
 * 答题界面
 */
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
var AnswerScene = (function (_super) {
    __extends(AnswerScene, _super);
    function AnswerScene(answers, type, levelData) {
        if (type === void 0) { type = 1; }
        if (levelData === void 0) { levelData = null; }
        var _this = _super.call(this) || this;
        _this.curIdx = 1;
        _this.errorStatus = false;
        _this.isNext = false;
        _this.errors = [];
        _this.answers = answers;
        _this.type = type;
        _this.levelData = levelData;
        return _this;
    }
    AnswerScene.prototype.init = function () {
        var _this = this;
        this.close_btn = false;
        _super.prototype.setBackground.call(this);
        this.start = +new Date();
        var title = this.trainTitle(this.levelData.flag, this.levelData.name);
        title.x = 180;
        title.y = 25;
        this.addChild(title);
        //进度条
        if (this.type == 1) {
            // 进度条
            var pBar = new eui.ProgressBar();
            pBar.maximum = 10; //设置进度条的最大值
            pBar.minimum = 1; //设置进度条的最小值
            pBar.width = 430;
            pBar.height = 40;
            this.addChild(pBar);
            pBar.x = 150;
            pBar.y = 170;
            pBar.value = this.curIdx; //设置进度条的初始值
            this._progress = pBar;
            // Q1
            var number = new egret.TextField();
            number.text = "Q" + this.curIdx;
            number.textColor = 0x35af38;
            number.x = 85;
            number.y = 177;
            this.numberText = number;
            this.addChild(number);
        }
        var trainid = this.answers.questions[this.curIdx - 1].qid;
        var subject = Util.getTrain(trainid);
        if (!subject) {
            return;
        }
        this.curSubject = subject;
        //选项 
        var group = new eui.Group();
        group.height = 5000;
        this.topicGroup = group;
        var topic = new Topic(subject);
        topic.x = (this.stage.stageWidth - topic.width) / 2;
        this.topic = topic;
        group.addChild(topic);
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth;
        myScroller.height = 650;
        myScroller.y = 250;
        //设置viewport
        myScroller.viewport = group;
        this.addChild(myScroller);
        this.scroller = myScroller;
        if (this.type == 1) {
            var favorButton = new XButton('加入收藏');
            favorButton.x = this.stage.stageWidth / 2 - favorButton.width - 10;
            favorButton.y = 1040;
            var isFavor = this.answers.questions[this.curIdx - 1].isCollect;
            var resource_1 = 'favor_png';
            if (isFavor)
                resource_1 = 'favor_fill_png';
            var favorIcon_1 = Util.createBitmapByName(resource_1);
            favorIcon_1.width = 60;
            favorIcon_1.height = 60;
            favorIcon_1.x = 30;
            favorIcon_1.y = 15;
            this.favorIcon = favorIcon_1;
            favorButton.addChild(favorIcon_1);
            favorButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                //请求收藏id 
                var isFavor = _this.answers.questions[_this.curIdx - 1].isCollect;
                if (!isFavor) {
                    var qid = _this.answers.questions[_this.curIdx - 1].qid;
                    Http.getInstance().post(Url.HTTP_FAVOR_SUBJECT, { qid: qid, type: 1 }, function (json) {
                        resource_1 = 'favor_fill_png';
                        favorIcon_1.texture = RES.getRes(resource_1);
                        _this.answers.questions[_this.curIdx - 1].isCollect = true;
                    });
                }
                else {
                    var qid = _this.answers.questions[_this.curIdx - 1].qid;
                    Http.getInstance().post(Url.HTTP_FAVOR_SUBJECT, { qid: qid, type: 2 }, function (json) {
                        resource_1 = 'favor_png';
                        favorIcon_1.texture = RES.getRes(resource_1);
                        _this.answers.questions[_this.curIdx - 1].isCollect = false;
                    });
                }
            }, this);
            this.addChild(favorButton);
        }
        else {
            var favorButton = new XButton('删除');
            favorButton.x = this.stage.stageWidth / 2 - favorButton.width - 10;
            favorButton.y = 1040;
            this.addChild(favorButton);
            var favorIcon = Util.createBitmapByName('icon_err_png');
            favorIcon.width = 60;
            favorIcon.height = 60;
            favorIcon.x = 30;
            favorIcon.y = 20;
            favorButton.addChild(favorIcon);
            favorButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                //请求收藏id 
                var qid = _this.answers.questions[_this.curIdx - 1].qid;
                Http.getInstance().post(Url.HTTP_FAVOR_SUBJECT, { qid: qid, type: 2 }, function (json) {
                    _this.answers.questions.splice(_this.curIdx - 1, 1);
                    if (_this.answers.questions.length == 0) {
                        // ViewManager.getInstance().back()
                        Http.getInstance().post(Url.HTTP_FAVOR_LIST, "", function (data) {
                            if (data.data && data.data.length > 0) {
                                var scene = new FavorScene(data.data, true);
                                ViewManager.getInstance().changeScene(scene);
                            }
                            else {
                                var scene = new TrainScene(true);
                                ViewManager.getInstance().changeScene(scene);
                            }
                        });
                        return;
                    }
                    if (_this.curIdx >= _this.answers.questions.length) {
                        _this.curIdx = _this.answers.questions.length - 1;
                    }
                    _this.next();
                });
            }, this);
        }
        var subButton = new XButton('提交', ButtonType.YELLOW);
        this.commitButton = subButton;
        subButton.y = 1040;
        subButton.x = this.stage.stageWidth / 2 + 10;
        this.addChild(subButton);
        subButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var isEnd = false;
            if (_this.curIdx == _this.answers.questions.length) {
                isEnd = true;
            }
            if (isEnd && _this.isNext) {
                if (_this.type == 1) {
                    Http.getInstance().post(Url.HTTP_TRAIN_END, { lifecycleid: _this.answers.lifecycleId }, function (json) {
                        DataManager.getInstance().updateUserInfo(json.data.userBase);
                        var params = {
                            result: json.data,
                            errors: _this.errors,
                            levelData: _this.levelData,
                            lifecycleid: _this.answers.lifecycleId
                        };
                        var result = new ResultScene(params);
                        ViewManager.getInstance().changeScene(result);
                    });
                }
                else {
                    ViewManager.getInstance().back();
                }
            }
            else {
                if (_this.isNext) {
                    _this.next();
                }
                else {
                    var selectOption = _this.topic.getSelect();
                    if (!selectOption) {
                        //TODO 
                        var alert_1 = new AlertPanel("提示：请先选择答案！", 160);
                        alert_1.x = 80;
                        alert_1.scaleX = 1.2;
                        alert_1.scaleY = 1.1;
                        _this.addChild(alert_1);
                        return;
                    }
                    var qid_1 = _this.answers.questions[_this.curIdx - 1].qid;
                    var result_1 = _this.topic.getSelectResult();
                    var curerntTime = +new Date();
                    var useTime = (curerntTime - _this.start) / 1000;
                    var params = {
                        "levelid": _this.levelData.levelid,
                        "lifecycleid": _this.answers.lifecycleId,
                        "qid": qid_1,
                        "serialno": _this.curIdx,
                        "qattrid": _this.curSubject.qattrid,
                        "reply": selectOption,
                        "iscorrect": result_1 ? 1 : 0,
                        "useTime": useTime
                    };
                    Http.getInstance().post(Url.HTTP_TRAIN_SUBMIT, params, function (json) {
                        _this.topic.setDisableSeleced();
                        _this.analysisButton.visible = true;
                        if (result_1) {
                            Util.playMusic('answer_ok_mp3');
                            _this.topic.setSelectedStatus(TopicItem.STATUS_OK);
                        }
                        else {
                            _this.topic.setSelectedStatus(TopicItem.STATUS_ERROR);
                            Util.playMusic('answer_err3_mp3');
                            _this.errors.push(qid_1);
                        }
                        var buttonText = "下一题";
                        if (isEnd) {
                            buttonText = "结束";
                        }
                        subButton.labelDisplay.text = buttonText;
                        _this.isNext = true;
                    });
                }
            }
        }, this);
        // 题目分析
        var analysisButton = Util.createBitmapByName('icon_tmfx_png');
        analysisButton.y = 920;
        analysisButton.x = this.stage.stageWidth / 2;
        analysisButton.anchorOffsetX = analysisButton.width / 2;
        analysisButton.touchEnabled = true;
        this.addChild(analysisButton);
        this.analysisButton = analysisButton;
        analysisButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var scene = new AnalysisScene(_this.curSubject, '题目分析');
            ViewManager.getInstance().changeScene(scene);
        }, this);
        if (this.type == 1) {
            analysisButton.visible = false;
        }
    };
    AnswerScene.prototype.trainTitle = function (flag, name) {
        var group = new eui.Group();
        // 名称
        var flagName = new egret.TextField();
        flagName.text = name;
        flagName.verticalAlign = egret.VerticalAlign.MIDDLE;
        flagName.textAlign = egret.HorizontalAlign.CENTER;
        if (this.type == 1) {
            var flagBg = Util.createBitmapByName('flagBg_png');
            group.addChild(flagBg);
            // 等级
            var flagText = new egret.TextField();
            flagText.text = flag;
            flagText.width = flagBg.width;
            flagText.height = flagBg.height + 10;
            flagText.textAlign = egret.HorizontalAlign.CENTER;
            flagText.verticalAlign = egret.VerticalAlign.MIDDLE;
            flagText.size = 28;
            group.addChild(flagText);
            flagName.stroke = 6;
            flagName.strokeColor = 0x0d793b;
            flagName.size = 80;
            flagName.x = flagBg.width - 20;
            flagName.height = flagBg.height + 10;
        }
        else {
            var flagBg = Util.createBitmapByName('flagBg_blank_png');
            group.addChild(flagBg);
            flagName.size = 60;
            flagName.width = flagBg.width;
            flagName.height = flagBg.height;
        }
        group.addChild(flagName);
        return group;
    };
    /**
     * 下一题
     */
    AnswerScene.prototype.next = function () {
        this.start = +new Date();
        this.commitButton.labelDisplay.text = '提交';
        this.isNext = false;
        this.curIdx = this.curIdx + 1;
        if (this.type == 1) {
            this.numberText.text = "Q" + this.curIdx;
        }
        if (this._progress)
            this._progress.value = this.curIdx;
        var trainid = this.answers.questions[this.curIdx - 1].qid;
        var subject = Util.getTrain(trainid);
        if (!subject)
            return;
        this.curSubject = subject;
        if (this.favorIcon) {
            var isFavor = this.answers.questions[this.curIdx - 1].isCollect;
            var resource = 'favor_png';
            if (isFavor)
                resource = 'favor_fill_png';
            this.favorIcon.texture = RES.getRes(resource);
        }
        this.topicGroup.removeChild(this.topic);
        //选项 
        var topic = new Topic(subject);
        topic.x = (this.stage.stageWidth - topic.width) / 2;
        this.topic = topic;
        this.topicGroup.addChild(topic);
        if (this.type == 1) {
            this.analysisButton.visible = false;
        }
        this.scroller.viewport.scrollV = 0;
    };
    return AnswerScene;
}(Scene));
__reflect(AnswerScene.prototype, "AnswerScene");
