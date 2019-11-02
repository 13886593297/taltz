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
var BattleScene = (function (_super) {
    __extends(BattleScene, _super);
    function BattleScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.index = 0;
        _this.TIMER = 15;
        return _this;
    }
    BattleScene.prototype.initData = function () {
        var _this = this;
        this.timeNumber = this.TIMER;
        //注册答题结束事件
        SocketX.getInstance().addEventListener(NetEvent.PK_PROGRESS, this.updateProgress, this);
        SocketX.getInstance().addEventListener(NetEvent.PK_ANSWER, function (data) {
            if (data.data.tipsCode == InviteStatus.PK_END_WAIT) {
                var pk = new PkInviteScene(InviteStatus.PK_END_WAIT);
                ViewManager.getInstance().changeScene(pk);
            }
        }, this);
        //十秒倒计时
        var timer = new egret.Timer(1000, this.TIMER + 10);
        this.timer = timer;
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            _this.timeNumber--;
            _this.timeText.text = _this.timeNumber;
            if (_this.timeNumber == 0) {
                timer.stop();
                if (!_this.canSubmit)
                    return;
                _this.submitNull();
            }
        }, this);
        timer.start();
    };
    BattleScene.prototype.init = function () {
        var _this = this;
        this.width = 750;
        this.anchorOffsetX = 375;
        this.x = this.stage.stageWidth / 2;
        this.initData();
        var userinfo = DataManager.getInstance().getUser();
        this.userInfo = userinfo;
        var leftUser = new PkUser(userinfo);
        leftUser.y = 100;
        this.addChild(leftUser);
        // let pkData ={questions:[{id:962},{id:960}]}
        var pkData = DataManager.getInstance().getPkData();
        this.pkData = pkData;
        var rightUser = new PkUser(pkData.pkUser, 'right');
        rightUser.y = 100;
        rightUser.anchorOffsetX = 243;
        rightUser.x = this.stage.stageWidth;
        this.addChild(rightUser);
        var pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.x = 375;
        pkVs.y = 240;
        this.addChild(pkVs);
        var progress = new VProgress(1, this.pkData.questions.length);
        progress.x = 30;
        progress.y = 500;
        this.addChild(progress);
        progress.setRate(0);
        this.selfProgress = progress;
        var progress2 = new VProgress(2, this.pkData.questions.length);
        progress2.x = 690;
        progress2.y = 500;
        this.addChild(progress2);
        progress2.setRate(0);
        this.otherProgress = progress2;
        if (pkData.type == 4 && pkData.pkUser) {
            this.otherProgress.setRate(this.pkData.questions.length);
        }
        var vs = new egret.TextField();
        vs.text = "" + this.TIMER;
        vs.width = 100;
        vs.height = 100;
        vs.anchorOffsetX = 50;
        vs.anchorOffsetY = 50;
        vs.y = 240;
        vs.x = 375;
        vs.textAlign = egret.HorizontalAlign.CENTER;
        vs.verticalAlign = egret.VerticalAlign.MIDDLE;
        vs.size = 40;
        this.addChild(vs);
        this.timeText = vs;
        var trainid = this.pkData.questions[this.index]['id'];
        var subject = Util.getTrain(trainid);
        //选项 
        if (!subject)
            return;
        var group = new eui.Group();
        // this.addChild(group);
        group.width = 600;
        var number = new egret.TextField();
        number.width = 600;
        number.text = "Q" + (this.index + 1);
        number.textColor = Config.COLOR_YELLOW;
        number.textAlign = egret.HorizontalAlign.CENTER;
        group.addChild(number);
        this.numberText = number;
        var topic = new Topic(subject);
        this.topic = topic;
        topic.y = 50;
        group.addChild(topic);
        this.topicGroup = group;
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = 600;
        myScroller.height = this.stage.stageHeight - 650;
        myScroller.y = 450;
        myScroller.x = 75;
        //设置viewport
        myScroller.viewport = group;
        this.scroller = myScroller;
        this.addChild(myScroller);
        this.canSubmit = true;
        var submit = new XButton("提交");
        submit.width = 450;
        submit.x = 150;
        this.submitButton = submit;
        submit.y = this.stage.stageHeight - 150;
        this.addChild(submit);
        submit.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.canSubmit)
                return;
            var selectOption = _this.topic.getSelect();
            if (!selectOption) {
                //TODO 
                var alert_1 = new AlertPanel("请选择答案！", 900);
                _this.addChild(alert_1);
                return;
            }
            var result = _this.topic.getSelectResult();
            _this.submitResult(result, selectOption);
            _this.topic.setDisableSeleced();
        }, this);
    };
    /**
     * 提交答案
     *  1.正常提交
     *  2.超时提交答案
     */
    BattleScene.prototype.submitResult = function (result, reply) {
        var _this = this;
        this.canSubmit = false;
        var qattrId = this.topic.getQAttrId();
        var useTime = this.TIMER - this.timeNumber;
        var params = {
            userId: this.userInfo.userId,
            pkCode: this.pkData.pkCode,
            type: this.pkData.pkType,
            qid: this.pkData.questions[this.index].id,
            qattrId: qattrId,
            reply: reply,
            isCorrect: result ? 1 : 0,
            useTime: useTime //答题时间
        };
        SocketX.getInstance().sendMsg(NetEvent.PK_ANSWER, params);
        if (result) {
            Util.playMusic('answer_ok_mp3');
            this.topic.setSelectedStatus(TopicItem.STATUS_OK);
        }
        else {
            this.topic.setSelectedStatus(TopicItem.STATUS_ERROR);
            Util.playMusic('answer_err3_mp3');
        }
        this.submitButton.visible = false;
        this.selfProgress.setRate(this.index + 1);
        //如果有下一題，直接进入下一题
        if (this.index < this.pkData.questions.length - 1) {
            setTimeout(function () { _this.next(); }, 3000);
        }
    };
    BattleScene.prototype.submitNull = function () {
        this.canSubmit = false;
        var qattrId = this.topic.getQAttrId();
        var useTime = this.TIMER - this.timeNumber;
        var params = {
            userId: this.userInfo.userId,
            pkCode: this.pkData.pkCode,
            type: this.pkData.pkType,
            qid: this.pkData.questions[this.index].id,
            qattrId: qattrId,
            reply: 'null',
            isCorrect: 0,
            useTime: useTime //答题时间
        };
        SocketX.getInstance().sendMsg(NetEvent.PK_ANSWER, params);
        Util.playMusic('answer_err3_mp3');
        this.selfProgress.setRate(this.index + 1);
        //如果有下一題，直接进入下一题
        if (this.index < this.pkData.questions.length - 1) {
            this.next();
        }
        else {
            // 跳转等待页面
            // let pk = new PkInviteScene(InviteStatus.PK_END_WAIT);
            // ViewManager.getInstance().changeScene(pk);
        }
    };
    //进入下一题
    BattleScene.prototype.next = function () {
        this.canSubmit = true;
        this.submitButton.visible = true;
        this.index++;
        this.numberText.text = "Q" + (this.index + 1);
        this.timeNumber = this.TIMER;
        this.timer.reset();
        this.timeText.text = this.timeNumber;
        this.timer.start();
        this.topicGroup.removeChild(this.topic);
        var trainid = this.pkData.questions[this.index].id;
        var subject = Util.getTrain(trainid);
        if (!subject)
            return;
        //选项 
        var topic = new Topic(subject);
        topic.y = 50;
        this.topic = topic;
        this.topicGroup.addChild(topic);
        this.scroller.viewport.scrollV = 0;
    };
    /**
     * 更新进度条
     */
    BattleScene.prototype.updateProgress = function (data) {
        this.otherProgress.setRate(data.data.seriaNo);
    };
    return BattleScene;
}(Scene));
__reflect(BattleScene.prototype, "BattleScene");
