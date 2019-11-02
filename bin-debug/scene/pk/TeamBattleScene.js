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
var TeamBattleScene = (function (_super) {
    __extends(TeamBattleScene, _super);
    function TeamBattleScene(waitting) {
        if (waitting === void 0) { waitting = false; }
        var _this = _super.call(this) || this;
        /**当前答题次序 */
        _this.index = 0;
        _this.users = {};
        _this.team = {};
        _this.waitting = waitting;
        return _this;
    }
    TeamBattleScene.prototype.init = function () {
        this.roomData = DataManager.getInstance().getRoomData();
        this.initEvent();
        this.initHead();
        this.initUserList();
        //等待同步
        if (this.waitting) {
            ViewManager.getInstance().showLoading("等待数据同步中...");
        }
        else {
            this.initTopic();
            this.timer = new Date().getTime();
            this.updateTimer();
        }
    };
    TeamBattleScene.prototype.onBack = function () {
        if (this.roomData.joinType === JoinType.OBSEVER) {
            ViewManager.getInstance().hideLoading();
            ViewManager.getInstance().backByName('room');
        }
    };
    TeamBattleScene.prototype.updateTimer = function () {
        var _this = this;
        this.timeNumber = 30;
        this.timeText.text = this.timeNumber;
        if (!this.cutTimer) {
            var timer_1 = new egret.Timer(1000, this.timeNumber + 10);
            this.cutTimer = timer_1;
            timer_1.addEventListener(egret.TimerEvent.TIMER, function () {
                _this.timeNumber--;
                _this.timeText.text = _this.timeNumber;
                if (_this.timeNumber == 0) {
                    timer_1.stop();
                }
            }, this);
            timer_1.start();
        }
        else {
            this.cutTimer.reset();
            this.cutTimer.start();
        }
    };
    TeamBattleScene.prototype.initEvent = function () {
        var _this = this;
        // 1.提交答题 2.离开房间 
        //监听提交答题
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_SUBMIT, function (data) {
            if (data.data.isOver)
                return;
        }, this);
        //倒计时
        SocketX.getInstance().addEventListener(NetEvent.TEAM_COUNT_DOWN_BROADCAST, function (data) {
            if (data.data.type == 0) {
                if (_this.cutTimer)
                    _this.cutTimer.stop();
            }
        }, this);
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_SUBMIT_BROADCAST, function (data) {
            var result = data.data;
            if (_this.waitting) {
                _this.index = result.seriaNo - 1;
                _this.initTopic();
                ViewManager.getInstance().hideLoading();
                _this.waitting = false;
            }
            if (result.errCode > 0) {
                //双方不得分
                var alertPanel = new NoScoreAlert(result.errMsg);
                _this.addChild(alertPanel);
            }
            else {
                var roomData = DataManager.getInstance().getRoomData();
                var number = 5;
                if (roomData.roomNumber == RoomNumber.SIX)
                    number = 3;
                if (roomData.self) {
                    if (result.userTeam == roomData.self['team']) {
                        _this.submitButton.visible = false;
                    }
                    else if (result.replyIsCorrect) {
                        _this.submitButton.visible = false;
                    }
                }
                var postionFlag = UserPositionType.LEFT;
                var x = 0;
                var anix = 105;
                if (result.userIndex > number) {
                    postionFlag = UserPositionType.RIGHT;
                    x = _this.stage.stageWidth;
                    anix = _this.stage.stageWidth - 345;
                }
                var alert_1 = new ResultAlert(postionFlag, result.replyIsCorrect, result.answerIndex, result.addScore);
                alert_1.x = x;
                alert_1.y = _this.users[result.userIndex].y + 450;
                _this.alertGroup.addChild(alert_1);
                egret.Tween.get(alert_1).to({ x: anix }, 300, egret.Ease.sineIn);
                //更新队伍总分
                _this.team[UserPositionType.LEFT].setScore(result.teamScore[UserPositionType.LEFT] + '分');
                _this.team[UserPositionType.RIGHT].setScore(result.teamScore[UserPositionType.RIGHT] + '分');
                //setScore
            }
        }, this);
        //下一题
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_NEXT_BROADCAST, function (data) {
            _this.index = data.data.seriaNo - 1;
            _this.updateTopic();
            _this.updateTimer();
        }, this);
        //结束pk
        SocketX.getInstance().addEventListener(NetEvent.TEAM_END_PK, function (data) {
            DataManager.getInstance().updateTeamPkResult(data.data);
            _this.clearEventListeners();
            var scene = new TeamResultScene();
            ViewManager.getInstance().changeScene(scene);
        }, this);
    };
    /**
     * 清除监听事件
     */
    TeamBattleScene.prototype.clearEventListeners = function () {
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_NEXT_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_END_PK);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_SUBMIT_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_COUNT_DOWN_BROADCAST);
    };
    TeamBattleScene.prototype.initHead = function () {
        //旁观模式
        if (this.roomData.joinType === JoinType.OBSEVER) {
            // this.nav = "离开";
            var obseverText = new egret.TextField();
            obseverText.text = "观战模式";
            obseverText.width = 200;
            obseverText.textAlign = egret.HorizontalAlign.CENTER;
            obseverText.x = this.stage.stageWidth / 2 - 100;
            obseverText.y = 50;
            this.addChild(obseverText);
        }
        var userinfo = DataManager.getInstance().getUser();
        this.userInfo = userinfo;
        var leftUser = new PkUser({ nickName: '绿队' }, 'left', '0分');
        leftUser.y = 85;
        this.addChild(leftUser);
        this.team[UserPositionType.LEFT] = leftUser;
        // let pkData ={questions:[{id:962},{id:960}]}
        var rightUser = new PkUser({ nickName: '蓝队' }, 'right', '0分');
        rightUser.y = 85;
        rightUser.anchorOffsetX = 243;
        rightUser.x = this.stage.stageWidth;
        this.addChild(rightUser);
        this.team[UserPositionType.RIGHT] = rightUser;
        var pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.x = this.stage.stageWidth / 2;
        pkVs.y = 240;
        this.addChild(pkVs);
        var vsText = new egret.TextField();
        vsText.text = 'VS';
        vsText.width = 300;
        vsText.height = 100;
        vsText.anchorOffsetX = 150;
        vsText.anchorOffsetY = 50;
        vsText.y = 240;
        vsText.size = 35;
        vsText.x = this.stage.stageWidth / 2;
        vsText.textAlign = egret.HorizontalAlign.CENTER;
        vsText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(vsText);
        this.timeText = vsText;
    };
    /**
     * 初始化PK用户列表
     */
    TeamBattleScene.prototype.initUserList = function () {
        var userGroup = new eui.Group();
        userGroup.y = 450;
        this.addChildAt(userGroup, 110);
        this.userGroup = userGroup;
        userGroup.touchEnabled = false;
        var roomData = DataManager.getInstance().getRoomData();
        var pkUser = roomData.users;
        var number = 5;
        if (roomData.roomNumber == RoomNumber.SIX)
            number = 3;
        for (var key in pkUser) {
            var user = pkUser[key];
            //屏蔽多余用户
            if (user.position > roomData.roomNumber || user.position < 1)
                continue;
            var postionY = 140 * (user.position - 1);
            var postionFlag = UserPositionType.LEFT;
            if (user.position > number) {
                postionY = 140 * (user.position - number - 1);
                postionFlag = UserPositionType.RIGHT;
            }
            var teamUser = new LiteTeamUser(user.userInfo, postionFlag);
            teamUser.y = postionY;
            userGroup.addChild(teamUser);
            if (postionFlag == UserPositionType.RIGHT) {
                teamUser.anchorOffsetX = 105;
                teamUser.x = this.stage.stageWidth;
            }
            this.users[user.position] = teamUser;
        }
    };
    /**
     * 题目
     */
    TeamBattleScene.prototype.initTopic = function () {
        var _this = this;
        var pkData = DataManager.getInstance().getTeamPkData();
        console.log(pkData, 'pkData');
        if (!pkData) {
            console.error('没有团队pk数据');
            return;
        }
        var trainid = pkData.questions[this.index]['id'];
        var width = this.stage.stageWidth - 115 * 2;
        if (width > 700)
            width = 700;
        var subject = Util.getTrain(trainid);
        if (!subject)
            return;
        console.log('subject-' + trainid, subject);
        var group = new eui.Group();
        group.width = width;
        var number = new egret.TextField();
        number.width = width;
        number.text = "Q" + (this.index + 1);
        number.textColor = Config.COLOR_YELLOW;
        number.textAlign = egret.HorizontalAlign.CENTER;
        group.addChild(number);
        this.numberText = number;
        var topic = new Topic(subject, group.width);
        this.topic = topic;
        topic.y = 50;
        group.addChild(topic);
        this.topicGroup = group;
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = width;
        myScroller.height = this.stage.stageHeight - 500;
        myScroller.y = 400;
        myScroller.x = (this.stage.stageWidth - width) / 2;
        //设置viewport
        myScroller.viewport = group;
        this.scroller = myScroller;
        this.addChildAt(myScroller, -1);
        this.canSubmit = true;
        var submit = new XButton("提交");
        submit.width = 450;
        submit.x = (this.stage.stageWidth - submit.width) / 2;
        this.submitButton = submit;
        submit.y = this.stage.stageHeight - 100;
        this.addChild(submit);
        submit.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.canSubmit)
                return;
            var selectOption = _this.topic.getSelect();
            if (!selectOption) {
                //TODO 
                var alert_2 = new AlertPanel("请选择答案！", 900);
                _this.addChild(alert_2);
                return;
            }
            var result = _this.topic.getSelectResult();
            _this.submitResult(result, selectOption);
            _this.topic.setDisableSeleced();
        }, this);
        //update TODO 
        if (this.roomData.joinType === JoinType.OBSEVER) {
            submit.visible = false;
            this.topic.setCorrectItem();
        }
        var alertGroup = new eui.Group();
        alertGroup.touchEnabled = false;
        this.alertGroup = alertGroup;
        this.addChildAt(alertGroup, 100);
    };
    TeamBattleScene.prototype.submitResult = function (result, selectOption) {
        var roomData = DataManager.getInstance().getRoomData();
        var pkData = DataManager.getInstance().getTeamPkData();
        var trainid = pkData.questions[this.index]['id'];
        var subject = Util.getTrain(trainid);
        if (!subject)
            return;
        var useTime = new Date().getTime() - this.timer;
        SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_SUBMIT, {
            tableNo: roomData.tableNo,
            qid: subject.id,
            qattrId: subject.qattrid,
            reply: selectOption,
            isCorrect: result,
            useTime: useTime //答题时间(秒)
        });
    };
    /**
     * 切换题目
     */
    TeamBattleScene.prototype.updateTopic = function () {
        this.canSubmit = true;
        if (this.topic) {
            this.topicGroup.removeChild(this.topic);
            this.topic = null;
        }
        var pkData = DataManager.getInstance().getTeamPkData();
        if (!pkData) {
            console.error('没有团队pk数据');
            return;
        }
        this.submitButton.visible = true;
        if (this.alertGroup)
            this.alertGroup.removeChildren();
        this.numberText.text = "Q" + (this.index + 1);
        var trainid = pkData.questions[this.index]['id'];
        this.timer = new Date().getTime();
        var subject = Util.getTrain(trainid);
        if (!subject)
            return;
        //选项 
        var topic = new Topic(subject, this.topicGroup.width);
        topic.y = 50;
        this.topic = topic;
        this.topicGroup.touchEnabled = true;
        this.topicGroup.addChild(topic);
        this.scroller.viewport.scrollV = 0;
        if (this.roomData.joinType === JoinType.OBSEVER) {
            this.submitButton.visible = false;
            this.topic.setCorrectItem();
        }
    };
    return TeamBattleScene;
}(Scene));
__reflect(TeamBattleScene.prototype, "TeamBattleScene");
var TeamKnowBattleScene = (function (_super) {
    __extends(TeamKnowBattleScene, _super);
    function TeamKnowBattleScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.index = 0;
        _this.progress = {};
        _this.TIMER = 15;
        return _this;
    }
    TeamKnowBattleScene.prototype.initData = function () {
        var _this = this;
        this.timeNumber = this.TIMER;
        //注册答题结束事件
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_SUBMIT_BROADCAST, this.updateProgress, this);
        //自己答题进度
        //知识赛返回Body,返回答题结果信息
        /*{
          "code": 0,
          "data": {
            "seriaNo": 1,//当前答题序号
            "userId": 34,//用户Id
            "userTeam": 1,//用户战队
            "userIndex": 2,//用户座位号
            "isEnd": false,//是否结束
            "addScore": 10//增加积分
          }
        }*/
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_SUBMIT, function (data) {
            var res = data.data;
            _this.progress[res.userTeam].setRate(res.seriaNo);
            if (res.seriaNo >= 10) {
                if (!res.isEnd) {
                    _this.showWait();
                }
            }
            else {
                _this.next();
            }
        }, this);
        //结果页
        SocketX.getInstance().addEventListener(NetEvent.PK_END, function (data) {
            DataManager.getInstance().updateTeamPersonPkResult(data.data);
            _this.clearEventListener();
            var scene = new TeamKnowPkResultScene();
            ViewManager.getInstance().changeScene(scene);
        }, this);
        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, function (data) {
            DataManager.getInstance().updateTeamKonwResult(data.data);
            _this.clearEventListener();
            var scene = new TeamKnowResultScene();
            ViewManager.getInstance().changeScene(scene);
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
                _this.submitResult(false, null);
            }
        }, this);
        timer.start();
    };
    /**
     * 清除监听*/
    TeamKnowBattleScene.prototype.clearEventListener = function () {
        SocketX.getInstance().removeEventListener(NetEvent.PK_END);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_SUBMIT_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_KNOW_RESULT);
    };
    TeamKnowBattleScene.prototype.init = function () {
        var _this = this;
        this.startTime = new Date().getTime();
        this.width = 750;
        this.anchorOffsetX = 375;
        this.x = this.stage.stageWidth / 2;
        this.initData();
        var roomData = DataManager.getInstance().getRoomData();
        this.roomData = roomData;
        var pkData = roomData.pkData;
        this.pkData = pkData;
        var users = pkData.users;
        var leftUser = new PkUser(users[TeamType.GREEN]);
        leftUser.y = 100;
        this.addChild(leftUser);
        var rightUser = new PkUser(users[TeamType.BLUE], 'right');
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
        var bottomGroup = new eui.Group;
        bottomGroup.y = 450;
        this.bottomGroup = bottomGroup;
        this.addChild(bottomGroup);
        var progress = new VProgress(1, this.pkData.questions.length);
        progress.x = 30;
        progress.y = 50;
        this.bottomGroup.addChild(progress);
        progress.setRate(0);
        this.progress[UserPositionType.LEFT] = progress;
        var progress2 = new VProgress(2, this.pkData.questions.length);
        progress2.x = 690;
        progress2.y = 50;
        this.bottomGroup.addChild(progress2);
        progress2.setRate(0);
        this.progress[UserPositionType.RIGHT] = progress2;
        var trainid = this.pkData.questions[this.index]['id'];
        var subject = Util.getTrain(trainid);
        if (!subject)
            return;
        //选项 
        var group = new eui.Group();
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
        // myScroller.y = 450;
        myScroller.x = 75;
        //设置viewport
        myScroller.viewport = group;
        this.scroller = myScroller;
        this.bottomGroup.addChild(myScroller);
        this.canSubmit = true;
        var submit = new XButton("提交");
        submit.width = 450;
        submit.x = this.stage.stageWidth / 2 - 225;
        this.submitButton = submit;
        submit.y = this.stage.stageHeight - 600;
        this.bottomGroup.addChild(submit);
        submit.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.canSubmit)
                return;
            var selectOption = _this.topic.getSelect();
            if (!selectOption) {
                //TODO 
                var alert_3 = new AlertPanel("请选择答案！", 900);
                _this.addChild(alert_3);
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
    TeamKnowBattleScene.prototype.submitResult = function (result, reply) {
        this.canSubmit = false;
        var qattrId = this.topic.getQAttrId();
        var current = new Date().getTime();
        var useTime = current - this.startTime;
        var params = {
            tableNo: this.roomData.tableNo,
            groupId: this.pkData.groupId,
            qid: this.pkData.questions[this.index].id,
            qattrId: qattrId,
            reply: reply,
            isCorrect: result ? 1 : 0,
            useTime: useTime //答题时间
        };
        SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_SUBMIT, params);
        if (reply) {
            if (result) {
                Util.playMusic('answer_ok_mp3');
                this.topic.setSelectedStatus(TopicItem.STATUS_OK);
            }
            else {
                this.topic.setSelectedStatus(TopicItem.STATUS_ERROR);
                Util.playMusic('answer_err3_mp3');
            }
        }
        this.submitButton.visible = false;
        //如果有下一題，直接进入下一题
        // if (this.index < this.pkData.questions.length - 1) {
        //     setTimeout(() => { this.next(); }, 3000)
        // }
    };
    //进入下一题
    TeamKnowBattleScene.prototype.next = function () {
        this.startTime = new Date().getTime();
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
    TeamKnowBattleScene.prototype.updateProgress = function (data) {
        var res = data.data;
        this.progress[res.userTeam].setRate(data.data.seriaNo);
    };
    /**
     * 显示等待界面
     */
    TeamKnowBattleScene.prototype.showWait = function () {
        this.bottomGroup.removeChildren();
        var roomData = DataManager.getInstance().getRoomData();
        var waitTextField = new egret.TextField();
        if (this.timer)
            this.timer.stop();
        this.timeText.text = 'VS';
        waitTextField.size = 35;
        waitTextField.text = "请稍后\n对手还在努力答辩中。";
        waitTextField.width = 500;
        waitTextField.lineSpacing = 10;
        waitTextField.textAlign = egret.HorizontalAlign.CENTER;
        waitTextField.y = 200;
        waitTextField.x = this.stage.stageWidth / 2 - 250;
        this.bottomGroup.addChild(waitTextField);
        var seeResultBtn = new XButton("查看比赛结果");
        seeResultBtn.width = 450;
        seeResultBtn.x = this.stage.stageWidth / 2 - 225;
        seeResultBtn.y = this.stage.stageHeight - 600;
        this.bottomGroup.addChild(seeResultBtn);
        //倒计时 15 秒进入 结果页
        // let timer = new egret.Timer(1000, 15);
        // timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
        //    SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId })
        // }, this);
        seeResultBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            //进入结果页面
            // timer.stop();
            SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId });
        }, this);
    };
    return TeamKnowBattleScene;
}(Scene));
__reflect(TeamKnowBattleScene.prototype, "TeamKnowBattleScene");
