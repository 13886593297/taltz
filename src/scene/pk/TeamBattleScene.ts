
class TeamBattleScene extends Scene {

    /**当前答题次序 */
    private index = 0;
    private topic: Topic;
    private userInfo;
    private timer;

    private timeNumber;
    private timeText;
    private cutTimer;

    private topicGroup;
    private scroller;
    private numberText;

    private submitButton;
    private canSubmit;

    private userGroup;
    private alertGroup;

    private roomData: Room;
    private users = {};


    private team = {};

    private waitting;

    constructor(waitting = false) {
        super();
        this.waitting = waitting;
    }


    public init() {
        this.roomData = DataManager.getInstance().getRoomData();
        this.initEvent();
        this.initHead();
        this.initUserList()
        //等待同步
        if (this.waitting) {
            ViewManager.getInstance().showLoading("等待数据同步中...")
        } else {
            this.initTopic();
            this.timer = new Date().getTime();
            this.updateTimer();
        }

    }



    public onBack() {
        if (this.roomData.joinType === JoinType.OBSEVER) {
             ViewManager.getInstance().hideLoading();
            ViewManager.getInstance().backByName('room');
        }
    }

    private updateTimer() {
        this.timeNumber = 30
        this.timeText.text = this.timeNumber;
        if (!this.cutTimer) {
            let timer = new egret.Timer(1000, this.timeNumber + 10);
            this.cutTimer = timer
            timer.addEventListener(egret.TimerEvent.TIMER, () => {
                this.timeNumber--;
                this.timeText.text = this.timeNumber;
                if (this.timeNumber == 0) {
                    timer.stop();
                }
            }, this);
            timer.start();
        } else {
            this.cutTimer.reset();
            this.cutTimer.start();
        }
    }



    public initEvent() {
        // 1.提交答题 2.离开房间 
        //监听提交答题
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_SUBMIT, (data) => {
            if (data.data.isOver) return;

        }, this);

        //倒计时
        SocketX.getInstance().addEventListener(NetEvent.TEAM_COUNT_DOWN_BROADCAST, (data) => {
            if (data.data.type == 0) {
                if (this.cutTimer) this.cutTimer.stop();
            }
        }, this);
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_SUBMIT_BROADCAST, (data) => {
            let result = data.data
            if (this.waitting) {
                this.index = result.seriaNo - 1;
                this.initTopic();
                ViewManager.getInstance().hideLoading();
                this.waitting = false;
            }

            if (result.errCode > 0) {
                //双方不得分
                let alertPanel = new NoScoreAlert(result.errMsg);
                this.addChild(alertPanel);
            } else {

                let roomData = DataManager.getInstance().getRoomData();
                let number = 5;
                if (roomData.roomNumber == RoomNumber.SIX) number = 3;

                if (roomData.self) {//本人同队答题

                    if (result.userTeam == roomData.self['team']) {
                        this.submitButton.visible = false;
                    } else if (result.replyIsCorrect) { //对方答对
                        this.submitButton.visible = false;
                    }
                }

                let postionFlag = UserPositionType.LEFT;
                let x = 0;
                let anix = 105
                if (result.userIndex > number) { //蓝队用户
                    postionFlag = UserPositionType.RIGHT;
                    x = this.stage.stageWidth
                    anix = this.stage.stageWidth - 345;
                }
                let alert = new ResultAlert(postionFlag, result.replyIsCorrect, result.answerIndex, result.addScore);
                alert.x = x;
                alert.y = this.users[result.userIndex].y + 450;
                this.alertGroup.addChild(alert);
                egret.Tween.get(alert).to({ x: anix }, 300, egret.Ease.sineIn);

                //更新队伍总分
                this.team[UserPositionType.LEFT].setScore(result.teamScore[UserPositionType.LEFT] + '分')
                this.team[UserPositionType.RIGHT].setScore(result.teamScore[UserPositionType.RIGHT] + '分')
                //setScore

            }
        }, this);

        //下一题
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_NEXT_BROADCAST, (data) => {
            this.index = data.data.seriaNo - 1;
            this.updateTopic()
            this.updateTimer();
        }, this)

        //结束pk
        SocketX.getInstance().addEventListener(NetEvent.TEAM_END_PK, (data) => {
            DataManager.getInstance().updateTeamPkResult(data.data);
            this.clearEventListeners();
            let scene = new TeamResultScene();
            ViewManager.getInstance().changeScene(scene);
        }, this)

    }

    /**
     * 清除监听事件
     */
    private clearEventListeners() {
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_NEXT_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_END_PK);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_SUBMIT_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_COUNT_DOWN_BROADCAST);
    }

    public initHead() {
        //旁观模式
        if (this.roomData.joinType === JoinType.OBSEVER) {
            // this.nav = "离开";
            let obseverText = new egret.TextField();
            obseverText.text = "观战模式"
            obseverText.width = 200;
            obseverText.textAlign = egret.HorizontalAlign.CENTER;
            obseverText.x = this.stage.stageWidth / 2 - 100;
            obseverText.y = 50;
            this.addChild(obseverText);
        }


        let userinfo = DataManager.getInstance().getUser();
        this.userInfo = userinfo;
        let leftUser = new PkUser({ nickName: '绿队' }, 'left', '0分');
        leftUser.y = 85;
        this.addChild(leftUser);
        this.team[UserPositionType.LEFT] = leftUser;
        // let pkData ={questions:[{id:962},{id:960}]}
        let rightUser = new PkUser({ nickName: '蓝队' }, 'right', '0分');
        rightUser.y = 85;
        rightUser.anchorOffsetX = 243;
        rightUser.x = this.stage.stageWidth;
        this.addChild(rightUser);
        this.team[UserPositionType.RIGHT] = rightUser;

        let pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.x = this.stage.stageWidth / 2;
        pkVs.y = 240;
        this.addChild(pkVs)

        let vsText = new egret.TextField();
        vsText.text = 'VS'
        vsText.width = 300;
        vsText.height = 100;
        vsText.anchorOffsetX = 150;
        vsText.anchorOffsetY = 50;
        vsText.y = 240
        vsText.size = 35;
        vsText.x = this.stage.stageWidth / 2;
        vsText.textAlign = egret.HorizontalAlign.CENTER;
        vsText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(vsText);
        this.timeText = vsText;


    }





    /**
     * 初始化PK用户列表
     */
    public initUserList() {

        let userGroup = new eui.Group();
        userGroup.y = 450
        this.addChildAt(userGroup, 110);
        this.userGroup = userGroup;

        userGroup.touchEnabled = false

        let roomData = DataManager.getInstance().getRoomData();
        let pkUser = roomData.users;
        let number = 5;
        if (roomData.roomNumber == RoomNumber.SIX) number = 3;
        for (let key in pkUser) {
            let user = pkUser[key];
            //屏蔽多余用户
            if (user.position > roomData.roomNumber || user.position < 1) continue;
            let postionY = 140 * (user.position - 1);
            let postionFlag = UserPositionType.LEFT;
            if (user.position > number) { //蓝队用户
                postionY = 140 * (user.position - number - 1);
                postionFlag = UserPositionType.RIGHT;
            }
            let teamUser = new LiteTeamUser(user.userInfo, postionFlag);
            teamUser.y = postionY;
            userGroup.addChild(teamUser);
            if (postionFlag == UserPositionType.RIGHT) {
                teamUser.anchorOffsetX = 105;
                teamUser.x = this.stage.stageWidth;
            }
            this.users[user.position] = teamUser;
        }

    }



    /**
     * 题目
     */
    public initTopic() {

        let pkData = DataManager.getInstance().getTeamPkData();
        console.log(pkData, 'pkData');
        if (!pkData) {
            console.error('没有团队pk数据');
            return;
        }
        let trainid = pkData.questions[this.index]['id'];

        let width = this.stage.stageWidth - 115 * 2;
        if (width > 700) width = 700;

        let subject: Subject = Util.getTrain(trainid);
         if(!subject)return;
        console.log('subject-' + trainid, subject);
        let group = new eui.Group();
        group.width = width;
        let number = new egret.TextField();
        number.width = width;
        number.text = "Q" + (this.index + 1);
        number.textColor = Config.COLOR_YELLOW;
        number.textAlign = egret.HorizontalAlign.CENTER;
        group.addChild(number);
        this.numberText = number;
        let topic = new Topic(subject, group.width);
        this.topic = topic;
        topic.y = 50;
        group.addChild(topic);
        this.topicGroup = group;
        var myScroller: eui.Scroller = new eui.Scroller();
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


        let submit = new XButton("提交");
        submit.width = 450;
        submit.x = (this.stage.stageWidth - submit.width) / 2;
        this.submitButton = submit;
        submit.y = this.stage.stageHeight - 100;
        this.addChild(submit);
        submit.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

            if (!this.canSubmit) return;
            let selectOption = this.topic.getSelect();
            if (!selectOption) {
                //TODO 
                let alert = new AlertPanel("请选择答案！", 900)
                this.addChild(alert);
                return;
            }
            let result = this.topic.getSelectResult();
            this.submitResult(result, selectOption);
            this.topic.setDisableSeleced();
        }, this)
        //update TODO 
        if (this.roomData.joinType === JoinType.OBSEVER) {
            submit.visible = false;
            this.topic.setCorrectItem();
        }
        let alertGroup = new eui.Group();
        alertGroup.touchEnabled = false
        this.alertGroup = alertGroup;
        this.addChildAt(alertGroup, 100)
    }

    private submitResult(result, selectOption) {
        let roomData = DataManager.getInstance().getRoomData();
        let pkData = DataManager.getInstance().getTeamPkData();
        let trainid = pkData.questions[this.index]['id'];
        let subject: Subject = Util.getTrain(trainid);
         if(!subject)return;
        let useTime = new Date().getTime() - this.timer;
        SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_SUBMIT, {
            tableNo: roomData.tableNo,//桌位号
            qid: subject.id,//问题ID
            qattrId: subject.qattrid,//问题属性ID
            reply: selectOption,//用户答案
            isCorrect: result,//result,//回答是否正确1=正确,0=错误
            useTime: useTime//答题时间(秒)
        });
    }


    /**
     * 切换题目
     */
    private updateTopic() {
        this.canSubmit = true;
        if (this.topic) {
            this.topicGroup.removeChild(this.topic);
            this.topic = null;
        }

        let pkData = DataManager.getInstance().getTeamPkData();
        if (!pkData) {
            console.error('没有团队pk数据');
            return;
        }
        this.submitButton.visible = true;
        if (this.alertGroup)
            this.alertGroup.removeChildren();
        this.numberText.text = "Q" + (this.index + 1);
        let trainid = pkData.questions[this.index]['id'];
        this.timer = new Date().getTime();
        let subject: Subject = Util.getTrain(trainid);
         if(!subject)return;
        //选项 
        let topic = new Topic(subject, this.topicGroup.width);
        topic.y = 50;
        this.topic = topic;
        this.topicGroup.touchEnabled = true;
        this.topicGroup.addChild(topic);
        this.scroller.viewport.scrollV = 0;
        if (this.roomData.joinType === JoinType.OBSEVER) {
            this.submitButton.visible = false;
            this.topic.setCorrectItem();
        }
    }



}




class TeamKnowBattleScene extends Scene {

    private index = 0;
    private pkData;
    private topic;
    private timer;
    private timeNumber;
    private timeText;
    private topicGroup;
    private scroller;

    private progress = {};
    private submitButton;

    private canSubmit;
    private readonly TIMER = 15;
    private numberText;
    private roomData: Room;
    private bottomGroup;

    private startTime;




    private initData() {
        this.timeNumber = this.TIMER;
        //注册答题结束事件
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_SUBMIT_BROADCAST, this.updateProgress, this)
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
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_SUBMIT, (data) => {
            let res = data.data;
            this.progress[res.userTeam].setRate(res.seriaNo);
            if (res.seriaNo >= 10) { //已经答完题
                if (!res.isEnd) { //进入等待界面
                    this.showWait();
                }
            } else {
                this.next();
            }

        }, this)
        //结果页
        SocketX.getInstance().addEventListener(NetEvent.PK_END, (data) => {
            DataManager.getInstance().updateTeamPersonPkResult(data.data);
            this.clearEventListener();
            let scene = new TeamKnowPkResultScene();
            ViewManager.getInstance().changeScene(scene);
        }, this)

        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, (data) => {
            DataManager.getInstance().updateTeamKonwResult(data.data);
            this.clearEventListener();
            let scene = new TeamKnowResultScene();
            ViewManager.getInstance().changeScene(scene);
        }, this)


        //十秒倒计时
        let timer = new egret.Timer(1000, this.TIMER + 10);
        this.timer = timer;
        timer.addEventListener(egret.TimerEvent.TIMER, () => {
            this.timeNumber--;
            this.timeText.text = this.timeNumber;
            if (this.timeNumber == 0) {
                timer.stop();
                if (!this.canSubmit) return;
                this.submitResult(false, null);
            }
        }, this);
        timer.start();
    }

    /**
     * 清除监听*/

    public clearEventListener() {

        SocketX.getInstance().removeEventListener(NetEvent.PK_END);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_SUBMIT_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_KNOW_RESULT);
    }




    public init() {
        this.startTime = new Date().getTime();
        this.width = 750;
        this.anchorOffsetX = 375;
        this.x = this.stage.stageWidth / 2;
        this.initData();

        let roomData = DataManager.getInstance().getRoomData();
        this.roomData = roomData;
        let pkData = roomData.pkData
        this.pkData = pkData;
        let users = pkData.users;
        let leftUser = new PkUser(users[TeamType.GREEN]);
        leftUser.y = 100;
        this.addChild(leftUser);

        let rightUser = new PkUser(users[TeamType.BLUE], 'right');
        rightUser.y = 100;
        rightUser.anchorOffsetX = 243;
        rightUser.x = this.stage.stageWidth;
        this.addChild(rightUser);

        let pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.x = 375;
        pkVs.y = 240;
        this.addChild(pkVs)

        let vs = new egret.TextField();
        vs.text = `${this.TIMER}`;
        vs.width = 100;
        vs.height = 100;
        vs.anchorOffsetX = 50;
        vs.anchorOffsetY = 50;
        vs.y = 240
        vs.x = 375;
        vs.textAlign = egret.HorizontalAlign.CENTER;
        vs.verticalAlign = egret.VerticalAlign.MIDDLE;
        vs.size = 40;
        this.addChild(vs);
        this.timeText = vs;

        let bottomGroup = new eui.Group;
        bottomGroup.y = 450;
        this.bottomGroup = bottomGroup;
        this.addChild(bottomGroup);



        let progress = new VProgress(1, this.pkData.questions.length);
        progress.x = 30
        progress.y = 50;
        this.bottomGroup.addChild(progress);
        progress.setRate(0);

        this.progress[UserPositionType.LEFT] = progress;


        let progress2 = new VProgress(2, this.pkData.questions.length);
        progress2.x = 690
        progress2.y = 50;
        this.bottomGroup.addChild(progress2);
        progress2.setRate(0);
        this.progress[UserPositionType.RIGHT] = progress2;




        let trainid = this.pkData.questions[this.index]['id']

        let subject: Subject = Util.getTrain(trainid);
         if(!subject)return;
        //选项 
        let group = new eui.Group();
        group.width = 600;
        let number = new egret.TextField();
        number.width = 600;
        number.text = "Q" + (this.index + 1);
        number.textColor = Config.COLOR_YELLOW;
        number.textAlign = egret.HorizontalAlign.CENTER;
        group.addChild(number);
        this.numberText = number;
        let topic = new Topic(subject);
        this.topic = topic;
        topic.y = 50;
        group.addChild(topic);
        this.topicGroup = group;
        var myScroller: eui.Scroller = new eui.Scroller();
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
        let submit = new XButton("提交");
        submit.width = 450;
        submit.x = this.stage.stageWidth / 2 - 225;
        this.submitButton = submit;
        submit.y = this.stage.stageHeight - 600;
        this.bottomGroup.addChild(submit);
        submit.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

            if (!this.canSubmit) return;
            let selectOption = this.topic.getSelect();
            if (!selectOption) {
                //TODO 
                let alert = new AlertPanel("请选择答案！", 900)
                this.addChild(alert);
                return;
            }
            let result = this.topic.getSelectResult();
            this.submitResult(result, selectOption);
            this.topic.setDisableSeleced();
        }, this)

    }


    /**
     * 提交答案
     *  1.正常提交
     *  2.超时提交答案
     */
    public submitResult(result, reply) {


        this.canSubmit = false;
        let qattrId = this.topic.getQAttrId();
        let current = new Date().getTime();
        let useTime = current - this.startTime;

        let params = {
            tableNo: this.roomData.tableNo,//桌位号
            groupId: this.pkData.groupId,//分组Id
            qid: this.pkData.questions[this.index].id,//问题ID
            qattrId: qattrId,//问题属性ID
            reply: reply,//用户答案
            isCorrect: result ? 1 : 0,//回答是否正确1=正确,0=错误
            useTime: useTime//答题时间
        };
        SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_SUBMIT, params)

        if (reply) {
            if (result) {
                Util.playMusic('answer_ok_mp3')
                this.topic.setSelectedStatus(TopicItem.STATUS_OK);
            }
            else {
                this.topic.setSelectedStatus(TopicItem.STATUS_ERROR);
                Util.playMusic('answer_err3_mp3')
            }
        }

        this.submitButton.visible = false;
        //如果有下一題，直接进入下一题
        // if (this.index < this.pkData.questions.length - 1) {
        //     setTimeout(() => { this.next(); }, 3000)
        // }
    }




    //进入下一题
    public next() {
        this.startTime = new Date().getTime();
        this.canSubmit = true;
        this.submitButton.visible = true;
        this.index++;
        this.numberText.text = `Q${this.index + 1}`;
        this.timeNumber = this.TIMER;
        this.timer.reset();
        this.timeText.text = this.timeNumber;
        this.timer.start();
        this.topicGroup.removeChild(this.topic);
        let trainid = this.pkData.questions[this.index].id;
        let subject: Subject = Util.getTrain(trainid);
         if(!subject)return;
        //选项 
        let topic = new Topic(subject);
        topic.y = 50;
        this.topic = topic;
        this.topicGroup.addChild(topic);
        this.scroller.viewport.scrollV = 0;
    }

    /**
     * 更新进度条
     */
    public updateProgress(data) {
        let res = data.data
        this.progress[res.userTeam].setRate(data.data.seriaNo);
    }

    /**
     * 显示等待界面
     */
    private showWait() {
        this.bottomGroup.removeChildren();
        let roomData = DataManager.getInstance().getRoomData();
        let waitTextField = new egret.TextField();

        if (this.timer) this.timer.stop();
        this.timeText.text = 'VS';
        waitTextField.size = 35;
        waitTextField.text = "请稍后\n对手还在努力答辩中。"
        waitTextField.width = 500;
        waitTextField.lineSpacing = 10;
        waitTextField.textAlign = egret.HorizontalAlign.CENTER;
        waitTextField.y = 200;
        waitTextField.x = this.stage.stageWidth / 2 - 250;
        this.bottomGroup.addChild(waitTextField);
        let seeResultBtn = new XButton("查看比赛结果");
        seeResultBtn.width = 450;
        seeResultBtn.x = this.stage.stageWidth / 2 - 225;
        seeResultBtn.y = this.stage.stageHeight - 600;
        this.bottomGroup.addChild(seeResultBtn);

        //倒计时 15 秒进入 结果页
        // let timer = new egret.Timer(1000, 15);
        // timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
        //    SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId })
        // }, this);

        seeResultBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            //进入结果页面
            // timer.stop();
            SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId })
        }, this)


    }
}