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
        _this.timeNumber = 30;
        _this.users = {};
        _this.team = {};
        _this.waitting = waitting;
        return _this;
    }
    TeamBattleScene.prototype.init = function () {
        _super.prototype.setBackground.call(this);
        this.close_btn = false;
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
                if (_this.timeNumber < 10) {
                    _this.timeText.text = '0' + _this.timeNumber;
                }
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
        // 提交答案广播
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
                var number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5;
                if (roomData.self) {
                    if (result.userTeam == roomData.self['team']) {
                        _this.submitButton.visible = false;
                        // this.topic.setDisableSeleced()
                    }
                    else if (result.replyIsCorrect) {
                        _this.submitButton.visible = false;
                    }
                }
                var alert_1 = new ResultAlert(result.replyIsCorrect, result.addScore);
                alert_1.x = result.userIndex > number ? _this.stage.stageWidth - 130 - alert_1.width : 130;
                alert_1.y = _this.users[result.userIndex].y + 270;
                _this.alertGroup.addChild(alert_1);
                //更新队伍总分
                _this.team[UserPositionType.LEFT].text = result.teamScore[UserPositionType.LEFT];
                _this.team[UserPositionType.RIGHT].text = result.teamScore[UserPositionType.RIGHT];
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
        var title = Util.createBitmapByName('pk_answer_title_png');
        title.x = (this.stage.stageWidth - title.width) / 2;
        title.y = 45;
        this.addChild(title);
        var userinfo = DataManager.getInstance().getUser();
        this.userInfo = userinfo;
        // vs图标
        var pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.x = (this.stage.stageWidth - pkVs.width) / 2;
        pkVs.y = 200;
        this.addChild(pkVs);
        // 倒计时背景
        var timeDownBg = Util.createBitmapByName('pk_time_down_png');
        timeDownBg.x = (this.stage.stageWidth - timeDownBg.width) / 2;
        timeDownBg.y = 280;
        this.addChild(timeDownBg);
        // 倒计时时间
        var timeText = new egret.TextField();
        timeText.text = '';
        timeText.width = timeDownBg.width;
        timeText.height = timeDownBg.height + 5;
        timeText.x = timeDownBg.x;
        timeText.y = timeDownBg.y;
        timeText.size = 50;
        timeText.bold = true;
        timeText.textColor = Config.COLOR_MAINCOLOR;
        timeText.textAlign = egret.HorizontalAlign.CENTER;
        timeText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(timeText);
        this.timeText = timeText;
        // 分数
        var y = 205;
        var size = 28;
        var leftScoreBg = Util.createBitmapByName('pk_time_bg_png');
        leftScoreBg.x = this.stage.stageWidth / 2 - leftScoreBg.width - 90;
        leftScoreBg.y = y;
        this.addChild(leftScoreBg);
        var leftScore = new egret.TextField;
        leftScore.text = '0';
        leftScore.x = leftScoreBg.x;
        leftScore.y = leftScoreBg.y;
        leftScore.size = size;
        leftScore.width = leftScoreBg.width;
        leftScore.height = leftScoreBg.height - 10;
        leftScore.textAlign = 'center';
        leftScore.verticalAlign = 'middle';
        this.addChild(leftScore);
        this.team[UserPositionType.LEFT] = leftScore;
        var rightScoreBg = Util.createBitmapByName('pk_right_score_png');
        rightScoreBg.x = this.stage.stageWidth / 2 + 90;
        rightScoreBg.y = y;
        this.addChild(rightScoreBg);
        var rightScore = new egret.TextField;
        rightScore.text = '0';
        rightScore.x = rightScoreBg.x;
        rightScore.y = rightScoreBg.y;
        rightScore.size = size;
        rightScore.width = rightScoreBg.width;
        rightScore.height = rightScoreBg.height - 10;
        rightScore.textAlign = 'center';
        rightScore.verticalAlign = 'middle';
        this.addChild(rightScore);
        this.team[UserPositionType.RIGHT] = rightScore;
        var leftFlag = Util.createBitmapByName('pk_yellow_group_little_png');
        leftFlag.x = 50;
        leftFlag.y = y;
        this.addChild(leftFlag);
        var rightFlag = Util.createBitmapByName('pk_green_group_little_png');
        rightFlag.x = this.stage.stageWidth - rightFlag.width - 50;
        rightFlag.y = y;
        this.addChild(rightFlag);
    };
    /**
     * 初始化PK用户列表
     */
    TeamBattleScene.prototype.initUserList = function () {
        var userGroup = new eui.Group();
        userGroup.y = 280;
        this.addChildAt(userGroup, 110);
        this.userGroup = userGroup;
        var roomData = DataManager.getInstance().getRoomData();
        var pkUser = roomData.users;
        var number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5;
        for (var key in pkUser) {
            var user = pkUser[key];
            //屏蔽多余用户
            if (user.position > roomData.roomNumber || user.position < 1)
                continue;
            var postionY = 160 * (user.position - 1);
            var postionFlag = UserPositionType.LEFT;
            if (user.position > number) {
                postionY = 160 * (user.position - number - 1);
                postionFlag = UserPositionType.RIGHT;
            }
            var teamUser = new LiteTeamUser(user.userInfo, postionFlag);
            teamUser.x = postionFlag == UserPositionType.LEFT ? 0 : this.stage.stageWidth - teamUser.width;
            teamUser.y = postionY;
            userGroup.addChild(teamUser);
            this.users[user.position] = teamUser;
        }
    };
    /**
     * 题目
     */
    TeamBattleScene.prototype.initTopic = function () {
        var _this = this;
        var pkData = DataManager.getInstance().getTeamPkData();
        // test begin
        // pkData = {
        //     pkCode: "6d8bcc2061b311eaaab4c72eb1651d0c",
        //     pkType: 3,
        //     questions: [
        //         { id: 2915 },
        //         { id: 2773 },
        //         { id: 2774 },
        //         { id: 2775 },
        //         { id: 2776 },
        //         { id: 2777 },
        //         { id: 2778 },
        //         { id: 2779 },
        //         { id: 2782 },
        //         { id: 2783 }
        //     ],
        //     status: 1,
        //     type: 3
        // }
        // test end
        console.log(pkData, 'pkData');
        if (!pkData) {
            console.error('没有团队pk数据');
            return;
        }
        var trainid = pkData.questions[this.index]['id'];
        var width = 345;
        var subject = Util.getTrain(trainid);
        if (!subject)
            return;
        console.log('subject-' + trainid, subject);
        var group = new eui.Group();
        group.width = width;
        var number = new egret.TextField();
        number.width = width;
        number.text = "Q" + (this.index + 1);
        number.size = 26;
        number.textColor = Config.COLOR_MAINCOLOR;
        number.textAlign = egret.HorizontalAlign.CENTER;
        group.addChild(number);
        this.numberText = number;
        var topic = new Topic(subject, group.width, true);
        this.topic = topic;
        topic.y = 35;
        group.addChild(topic);
        this.topicGroup = group;
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = width;
        myScroller.height = this.stage.stageHeight - 630;
        myScroller.y = 400;
        myScroller.x = (this.stage.stageWidth - width) / 2;
        //设置viewport
        myScroller.viewport = group;
        this.scroller = myScroller;
        this.addChildAt(myScroller, -1);
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
                var alert_2 = new AlertPanel("请选择答案！", _this.stage.stageHeight - 80);
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
            var leaveButton = Util.createBitmapByName('pk_leave_png');
            leaveButton.x = (this.stage.stageWidth - leaveButton.width) / 2;
            leaveButton.y = this.stage.stageHeight - 150;
            leaveButton.touchEnabled = true;
            this.addChild(leaveButton);
            leaveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var roomData = DataManager.getInstance().getRoomData();
                SocketX.getInstance().sendMsg(NetEvent.TEAM_LEAVE_ROOM, { tableNo: roomData.tableNo, joinType: roomData.joinType });
                ViewManager.getInstance().backByName('room');
            }, this);
            this.topic.setCorrectItem();
            this.topic.setDisableSeleced();
        }
        var alertGroup = new eui.Group();
        alertGroup.touchEnabled = false;
        this.alertGroup = alertGroup;
        this.addChildAt(alertGroup, 100);
    };
    TeamBattleScene.prototype.submitResult = function (result, selectOption) {
        // test begin
        // let resultMatch = new TeamResultScene()
        // ViewManager.getInstance().changeScene(resultMatch)
        // return
        // test end
        var roomData = DataManager.getInstance().getRoomData();
        var pkData = DataManager.getInstance().getTeamPkData();
        // test begin
        // pkData = {
        //     pkCode: "6d8bcc2061b311eaaab4c72eb1651d0c",
        //     pkType: 3,
        //     questions: [
        //         { id: 2790 },
        //         { id: 2773 },
        //         { id: 2774 },
        //         { id: 2775 },
        //         { id: 2776 },
        //         { id: 2777 },
        //         { id: 2778 },
        //         { id: 2779 },
        //         { id: 2782 },
        //         { id: 2783 }
        //     ],
        //     status: 1,
        //     type: 3
        // }
        // test end
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
        if (selectOption) {
            if (result) {
                Util.playMusic('answer_ok_mp3');
                this.topic.setSelectedStatus(TopicItem.STATUS_OK);
            }
            else {
                this.topic.setSelectedStatus(TopicItem.STATUS_ERROR);
                Util.playMusic('answer_err3_mp3');
            }
        }
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
            var leaveButton = Util.createBitmapByName('pk_leave_png');
            leaveButton.x = (this.stage.stageWidth - leaveButton.width) / 2;
            leaveButton.y = this.stage.stageHeight - 150;
            leaveButton.touchEnabled = true;
            this.addChild(leaveButton);
            leaveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var roomData = DataManager.getInstance().getRoomData();
                SocketX.getInstance().sendMsg(NetEvent.TEAM_LEAVE_ROOM, { tableNo: roomData.tableNo, joinType: roomData.joinType });
                ViewManager.getInstance().backByName('room');
            }, this);
            this.topic.setCorrectItem();
            this.topic.setDisableSeleced();
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
        _this.groupWidth = 456;
        return _this;
    }
    TeamKnowBattleScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        this.close_btn = false;
        this.startTime = new Date().getTime();
        this.initData();
        var roomData = DataManager.getInstance().getRoomData();
        this.roomData = roomData;
        var pkData = roomData.pkData;
        // test begin
        // pkData = {
        //     pkCode: "6d8bcc2061b311eaaab4c72eb1651d0c",
        //     pkType: 3,
        //     users: {
        //         '1': {
        //             nickName: "周武", 
        //             avatar: "http://127.0.0.1:8360/uploads/avatar/13886593297_avatar.jpg"
        //         },
        //         '2': {
        //             nickName: "周武", 
        //             avatar: "http://127.0.0.1:8360/uploads/avatar/13886593297_avatar.jpg"
        //         }
        //     },
        //     questions: [
        //         { id: 2915 },
        //         { id: 2773 },
        //         { id: 2774 },
        //         { id: 2775 },
        //         { id: 2776 },
        //         { id: 2777 },
        //         { id: 2778 },
        //         { id: 2779 },
        //         { id: 2782 },
        //         { id: 2783 }
        //     ],
        //     status: 1,
        //     type: 3
        // }
        // test end
        this.pkData = pkData;
        var users = pkData.users;
        var leftUser = new TeamUser(users[TeamType.GREEN]);
        leftUser.y = 100;
        this.addChild(leftUser);
        var rightUser = new TeamUser(users[TeamType.BLUE], UserPositionType.RIGHT);
        rightUser.x = this.stage.stageWidth - rightUser.width;
        rightUser.y = 100;
        this.addChild(rightUser);
        var pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.x = (this.stage.stageWidth - pkVs.width) / 2;
        pkVs.y = 130;
        this.addChild(pkVs);
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
        var contentGroup = new eui.Group;
        contentGroup.y = 400;
        contentGroup.width = this.stage.stageWidth;
        contentGroup.height = this.stage.stageHeight - 400;
        this.contentGroup = contentGroup;
        this.addChild(contentGroup);
        var progress = new VProgress(this.pkData.questions.length);
        progress.x = 40;
        progress.y = 100;
        this.contentGroup.addChild(progress);
        progress.setRate(1);
        this.progress[UserPositionType.LEFT] = progress;
        var progress2 = new VProgress(this.pkData.questions.length);
        progress2.x = this.stage.stageWidth - progress2.width - 40;
        progress2.y = 100;
        this.contentGroup.addChild(progress2);
        progress2.setRate(1);
        this.progress[UserPositionType.RIGHT] = progress2;
        var trainid = this.pkData.questions[this.index]['id'];
        var subject = Util.getTrain(trainid);
        if (!subject)
            return;
        //选项 
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
        myScroller.x = (this.stage.stageWidth - myScroller.width) / 2;
        //设置viewport
        myScroller.viewport = group;
        this.scroller = myScroller;
        this.contentGroup.addChild(myScroller);
        this.canSubmit = true;
        var submit = Util.createBitmapByName('pk_submit_png');
        submit.x = (this.stage.stageWidth - submit.width) / 2;
        submit.y = this.contentGroup.height - 200;
        submit.touchEnabled = true;
        this.submitButton = submit;
        this.contentGroup.addChild(submit);
        submit.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.canSubmit)
                return;
            var selectOption = _this.topic.getSelect();
            if (!selectOption) {
                //TODO 
                var alert_3 = new AlertPanel("请选择答案！", _this.stage.stageHeight - 80);
                _this.addChild(alert_3);
                return;
            }
            var result = _this.topic.getSelectResult();
            _this.submitResult(result, selectOption);
            _this.topic.setDisableSeleced();
        }, this);
    };
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
            _this.timeText.text = "-" + _this.timeNumber + "-";
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
     * 清除监听
     */
    TeamKnowBattleScene.prototype.clearEventListener = function () {
        SocketX.getInstance().removeEventListener(NetEvent.PK_END);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_SUBMIT_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_KNOW_RESULT);
    };
    /**
     * 提交答案
     *  1.正常提交
     *  2.超时提交答案
     */
    TeamKnowBattleScene.prototype.submitResult = function (result, reply) {
        // test begin
        // let resultMatch = new TeamKnowResultScene()
        // ViewManager.getInstance().changeScene(resultMatch)
        // let scene = new TeamKnowPkResultScene()
        // ViewManager.getInstance().changeScene(scene)
        // return
        // test end
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
        // test begin
        // if (this.index < this.pkData.questions.length - 1) {
        //     setTimeout(() => { this.next() }, 1000)
        // }
        // test end
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
    TeamKnowBattleScene.prototype.updateProgress = function (data) {
        var res = data.data;
        this.progress[res.userTeam].setRate(data.data.seriaNo + 1);
    };
    /**
     * 显示等待界面
     */
    TeamKnowBattleScene.prototype.showWait = function () {
        this.contentGroup.removeChildren();
        this.topicGroup.removeChildren();
        var roomData = DataManager.getInstance().getRoomData();
        if (this.timer)
            this.timer.stop();
        this.timeText.visible = false;
        var waitPic = Util.createBitmapByName('pk_end_wait_png');
        waitPic.x = (this.stage.stageWidth - waitPic.width) / 2;
        waitPic.y = 500;
        this.addChild(waitPic);
        var info = new LineInfo('你的对手还在苦苦思索中\n请稍候...');
        this.addChild(info);
        var seeResultBtn = Util.createBitmapByName('pk_result_btn_png');
        seeResultBtn.x = (this.stage.stageWidth - seeResultBtn.width) / 2;
        seeResultBtn.y = this.stage.stageHeight - 150;
        seeResultBtn.touchEnabled = true;
        this.addChild(seeResultBtn);
        seeResultBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // 进入结果页面
            SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId });
        }, this);
    };
    return TeamKnowBattleScene;
}(Scene));
__reflect(TeamKnowBattleScene.prototype, "TeamKnowBattleScene");
