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
        _this.TIMER = 30;
        _this.groupWidth = 456;
        return _this;
    }
    BattleScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        this.close_btn = false;
        this.initData();
        var userinfo = DataManager.getInstance().getUser();
        this.userInfo = userinfo;
        var leftUser = new PkUser(userinfo);
        leftUser.y = 100;
        this.addChild(leftUser);
        var pkData = DataManager.getInstance().getPkData();
        // test begin
        // pkData = {
        //     pkCode: "6d8bcc2061b311eaaab4c72eb1651d0c",
        //     pkType: 3,
        //     pkUser: { userId: "3", teamId: 1002, nickName: "希博士", avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/cKqXyr3j6icxg…AbrzulVqj6eulmZGRianMKqIlL8hWGAAToc8PkcTOGtgA/132", robot: 1 },
        //     questions: [
        //         { id: 2858 },
        //         { id: 2805 },
        //         { id: 2793 },
        //         { id: 2822 },
        //         { id: 2803 },
        //         { id: 2906 },
        //         { id: 2774 },
        //         { id: 2821 },
        //         { id: 2901 },
        //         { id: 2777 }
        //     ],
        //     status: 1,
        //     type: 3
        // }
        // test end
        this.pkData = pkData;
        var rightUser = new PkUser(pkData.pkUser, 'right');
        rightUser.x = this.stage.stageWidth - rightUser.width;
        rightUser.y = 100;
        this.addChild(rightUser);
        var pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.x = (this.stage.stageWidth - pkVs.width) / 2;
        pkVs.y = 130;
        this.addChild(pkVs);
        var processY = 500;
        var progress = new VProgress(this.pkData.questions.length);
        progress.x = 40;
        progress.y = processY;
        this.addChild(progress);
        progress.setRate(1);
        this.selfProgress = progress;
        var progress2 = new VProgress(this.pkData.questions.length);
        progress2.x = this.stage.stageWidth - progress2.width - 40;
        progress2.y = processY;
        this.addChild(progress2);
        progress2.setRate(1);
        this.otherProgress = progress2;
        if (pkData.type == 4 && pkData.pkUser) {
            this.otherProgress.setRate(this.pkData.questions.length);
        }
        // 倒计时
        var count_down_time = new egret.TextField();
        count_down_time.text = "-" + this.TIMER + "-";
        count_down_time.width = 100;
        count_down_time.height = 100;
        count_down_time.y = 180;
        count_down_time.x = (this.stage.stageWidth - count_down_time.width) / 2;
        count_down_time.textAlign = egret.HorizontalAlign.CENTER;
        count_down_time.verticalAlign = egret.VerticalAlign.MIDDLE;
        count_down_time.size = 40;
        count_down_time.textColor = Config.COLOR_MAINCOLOR;
        this.addChild(count_down_time);
        this.timeText = count_down_time;
        var trainid = this.pkData.questions[this.index]['id'];
        var subject = Util.getTrain(trainid);
        //选项 
        if (!subject)
            return;
        var group = new eui.Group();
        group.width = this.groupWidth;
        var number = new egret.TextField();
        number.width = this.groupWidth;
        number.text = "Q" + (this.index + 1);
        number.textColor = Config.COLOR_MAINCOLOR;
        number.textAlign = egret.HorizontalAlign.CENTER;
        group.addChild(number);
        this.numberText = number;
        var topic = new Topic(subject, this.groupWidth);
        this.topic = topic;
        topic.y = 50;
        group.addChild(topic);
        this.topicGroup = group;
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.groupWidth;
        myScroller.height = this.stage.stageHeight - 650;
        myScroller.y = 400;
        myScroller.x = (this.stage.stageWidth - myScroller.width) / 2;
        //设置viewport
        myScroller.viewport = group;
        this.scroller = myScroller;
        this.addChild(myScroller);
        this.canSubmit = true;
        var submit = Util.createBitmapByName('pk_submit_png');
        submit.x = (this.stage.stageWidth - submit.width) / 2;
        submit.y = this.stage.stageHeight - 200;
        this.submitButton = submit;
        this.addChild(submit);
        submit.touchEnabled = true;
        submit.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.canSubmit)
                return;
            var selectOption = _this.topic.getSelect();
            if (!selectOption) {
                //TODO 
                var alert_1 = new AlertPanel("请选择答案！", _this.stage.stageHeight - 80);
                _this.addChild(alert_1);
                return;
            }
            var result = _this.topic.getSelectResult();
            _this.submitResult(result, selectOption);
            _this.topic.setDisableSeleced();
        }, this);
    };
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
            _this.timeText.text = "-" + _this.timeNumber + "-";
            if (_this.timeNumber == 0) {
                timer.stop();
                if (!_this.canSubmit)
                    return;
                _this.submitNull();
            }
        }, this);
        timer.start();
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
        //如果有下一題，直接进入下一题
        if (this.index < this.pkData.questions.length - 1) {
            setTimeout(function () {
                _this.next();
                _this.selfProgress.setRate(_this.index + 1);
            }, 500);
        }
        else {
            // test begin
            // 跳转等待页面
            // let pk = new PkInviteScene(InviteStatus.PK_END_WAIT)
            // ViewManager.getInstance().changeScene(pk)
            // test end
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
        this.selfProgress.setRate(this.index + 2);
        //如果有下一題，直接进入下一题
        if (this.index < this.pkData.questions.length - 1) {
            this.next();
        }
        else {
            // test begin
            // 跳转等待页面
            // let pk = new PkInviteScene(InviteStatus.PK_END_WAIT)
            // ViewManager.getInstance().changeScene(pk)
            // test end
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
        this.timeText.text = "-" + this.timeNumber + "-";
        this.timer.start();
        this.topicGroup.removeChild(this.topic);
        var trainid = this.pkData.questions[this.index].id;
        var subject = Util.getTrain(trainid);
        if (!subject)
            return;
        //选项 
        var topic = new Topic(subject, this.groupWidth);
        topic.y = 50;
        this.topic = topic;
        this.topicGroup.addChild(topic);
        this.scroller.viewport.scrollV = 0;
    };
    /**
     * 更新进度条
     */
    BattleScene.prototype.updateProgress = function (data) {
        this.otherProgress.setRate(data.data.seriaNo + 1);
    };
    return BattleScene;
}(Scene));
__reflect(BattleScene.prototype, "BattleScene");
