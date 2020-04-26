class TeamBattleScene extends Scene {

    /**当前答题次序 */
    private index = 0
    private topic: Topic
    private userInfo
    private timer

    private timeNumber = 30
    private timeText
    private cutTimer

    private topicGroup
    private scroller
    private numberText

    private submitButton
    private canSubmit

    private userGroup
    private alertGroup

    private roomData: Room
    private users = {}


    private team = {}

    private waitting

    constructor(waitting = false) {
        super()
        this.waitting = waitting
    }


    public init() {
        super.setBackground()
        this.close_btn = false

        this.roomData = DataManager.getInstance().getRoomData()
        this.initEvent()
        this.initHead()
        this.initUserList()
        //等待同步
        if (this.waitting) {
            ViewManager.getInstance().showLoading("等待数据同步中...")
        } else {
            this.initTopic()
            this.timer = new Date().getTime()
            this.updateTimer()
        }
    }

    private updateTimer() {
        this.timeNumber = 30
        this.timeText.text = this.timeNumber
        if (!this.cutTimer) {
            let timer = new egret.Timer(1000, this.timeNumber + 10)
            this.cutTimer = timer
            timer.addEventListener(egret.TimerEvent.TIMER, () => {
                this.timeNumber--
                this.timeText.text = this.timeNumber
                if (this.timeNumber < 10) {
                    this.timeText.text = '0' + this.timeNumber
                }
                if (this.timeNumber == 0) {
                    timer.stop()
                }
            }, this)
            timer.start()
        } else {
            this.cutTimer.reset()
            this.cutTimer.start()
        }
    }

    public initEvent() {
        // 1.提交答题 2.离开房间 
        //监听提交答题
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_SUBMIT, (data) => {
            if (data.data.isOver) return

        }, this)

        //倒计时
        SocketX.getInstance().addEventListener(NetEvent.TEAM_COUNT_DOWN_BROADCAST, (data) => {
            if (data.data.type == 0) {
                if (this.cutTimer) this.cutTimer.stop()
            }
        }, this)

        // 提交答案广播
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_SUBMIT_BROADCAST, (data) => {
            let result = data.data
            if (this.waitting) {
                this.index = result.seriaNo - 1
                this.initTopic()
                ViewManager.getInstance().hideLoading()
                this.waitting = false
            }

            if (result.errCode > 0) {
                //双方不得分
                let alertPanel = new NoScoreAlert(result.errMsg)
                this.addChild(alertPanel)
            } else {
                let roomData = DataManager.getInstance().getRoomData()
                let number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5

                if (roomData.self) {//本人同队答题
                    if (result.userTeam == roomData.self['team']) {
                        this.submitButton.visible = false
                        // this.topic.setDisableSeleced()
                    } else if (result.replyIsCorrect) { //对方答对
                        this.submitButton.visible = false
                    }
                }

                let alert = new ResultAlert(result.replyIsCorrect, result.addScore)
                alert.x = result.userIndex > number ? this.stage.stageWidth - 130 - alert.width : 130
                alert.y = this.users[result.userIndex].y + 270
                this.alertGroup.addChild(alert)

                //更新队伍总分
                this.team[UserPositionType.LEFT].text = result.teamScore[UserPositionType.LEFT]
                this.team[UserPositionType.RIGHT].text = result.teamScore[UserPositionType.RIGHT]
                //setScore

            }
        }, this)

        //下一题
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_NEXT_BROADCAST, (data) => {
            this.index = data.data.seriaNo - 1
            this.updateTopic()
            this.updateTimer()
        }, this)

        //结束pk
        SocketX.getInstance().addEventListener(NetEvent.TEAM_END_PK, (data) => {
            DataManager.getInstance().updateTeamPkResult(data.data)
            this.clearEventListeners()
            let scene = new TeamResultScene()
            ViewManager.getInstance().changeScene(scene)
        }, this)

    }

    /**
     * 清除监听事件
     */
    private clearEventListeners() {
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_NEXT_BROADCAST)
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_END_PK)
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_SUBMIT_BROADCAST)
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_COUNT_DOWN_BROADCAST)
    }

    public initHead() {
        let title = Util.createBitmapByName('pk_answer_title_png')
        title.x = (this.stage.stageWidth - title.width) / 2
        title.y = 45
        this.addChild(title)

        let userinfo = DataManager.getInstance().getUser()
        this.userInfo = userinfo

        // vs图标
        let pkVs = Util.createBitmapByName('pk_vs_png')
        pkVs.x = (this.stage.stageWidth - pkVs.width) / 2
        pkVs.y = 200
        this.addChild(pkVs)

        // 倒计时背景
        let timeDownBg = Util.createBitmapByName('pk_time_down_png')
        timeDownBg.x = (this.stage.stageWidth - timeDownBg.width) / 2
        timeDownBg.y = 280
        this.addChild(timeDownBg)

        // 倒计时时间
        let timeText = new egret.TextField()
        timeText.text = ''
        timeText.width = timeDownBg.width
        timeText.height = timeDownBg.height + 5
        timeText.x = timeDownBg.x
        timeText.y = timeDownBg.y
        timeText.size = 50
        timeText.bold = true
        timeText.textColor = Config.COLOR_MAINCOLOR
        timeText.textAlign = egret.HorizontalAlign.CENTER
        timeText.verticalAlign = egret.VerticalAlign.MIDDLE
        this.addChild(timeText)
        this.timeText = timeText

        // 分数
        let y = 205
        let size = 28
        let leftScoreBg = Util.createBitmapByName('pk_time_bg_png')
        leftScoreBg.x = this.stage.stageWidth / 2 - leftScoreBg.width - 90
        leftScoreBg.y = y
        this.addChild(leftScoreBg)

        let leftScore = new egret.TextField
        leftScore.text = '0'
        leftScore.x = leftScoreBg.x
        leftScore.y = leftScoreBg.y
        leftScore.size = size
        leftScore.width = leftScoreBg.width
        leftScore.height = leftScoreBg.height - 10
        leftScore.textAlign = 'center'
        leftScore.verticalAlign = 'middle'
        this.addChild(leftScore)
        this.team[UserPositionType.LEFT] = leftScore

        let rightScoreBg = Util.createBitmapByName('pk_right_score_png')
        rightScoreBg.x = this.stage.stageWidth / 2 + 90
        rightScoreBg.y = y
        this.addChild(rightScoreBg)
        
        let rightScore = new egret.TextField
        rightScore.text = '0'
        rightScore.x = rightScoreBg.x
        rightScore.y = rightScoreBg.y
        rightScore.size = size
        rightScore.width = rightScoreBg.width
        rightScore.height = rightScoreBg.height - 10
        rightScore.textAlign = 'center'
        rightScore.verticalAlign = 'middle'
        this.addChild(rightScore)
        this.team[UserPositionType.RIGHT] = rightScore

        let leftFlag = Util.createBitmapByName('pk_yellow_group_little_png')
        leftFlag.x = 50
        leftFlag.y = y
        this.addChild(leftFlag)

        let rightFlag = Util.createBitmapByName('pk_green_group_little_png')
        rightFlag.x = this.stage.stageWidth - rightFlag.width - 50
        rightFlag.y = y
        this.addChild(rightFlag)
    }

    /**
     * 初始化PK用户列表
     */
    public initUserList() {

        let userGroup = new eui.Group()
        userGroup.y = 280
        this.addChildAt(userGroup, 110)
        this.userGroup = userGroup

        let roomData = DataManager.getInstance().getRoomData()
        let pkUser = roomData.users
        let number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5
        for (let key in pkUser) {
            let user = pkUser[key]
            //屏蔽多余用户
            if (user.position > roomData.roomNumber || user.position < 1) continue
            let postionY = 160 * (user.position - 1)
            let postionFlag = UserPositionType.LEFT
            if (user.position > number) { //蓝队用户
                postionY = 160 * (user.position - number - 1)
                postionFlag = UserPositionType.RIGHT
            }
            let teamUser = new LiteTeamUser(user.userInfo, postionFlag)
            teamUser.x = postionFlag == UserPositionType.LEFT ? 0 : this.stage.stageWidth - teamUser.width
            teamUser.y = postionY
            userGroup.addChild(teamUser)
            this.users[user.position] = teamUser
        }
    }

    /**
     * 题目
     */
    public initTopic() {
        let pkData = DataManager.getInstance().getTeamPkData()

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

        console.log(pkData, 'pkData')
        if (!pkData) {
            console.error('没有团队pk数据')
            return
        }
        let trainid = pkData.questions[this.index]['id']

        let width = 345

        let subject: Subject = Util.getTrain(trainid)
        if (!subject) return
        console.log('subject-' + trainid, subject)

        let group = new eui.Group()
        group.width = width

        let number = new egret.TextField()
        number.width = width
        number.text = "Q" + (this.index + 1)
        number.size = 26
        number.textColor = Config.COLOR_MAINCOLOR
        number.textAlign = egret.HorizontalAlign.CENTER
        group.addChild(number)
        this.numberText = number

        let topic = new Topic(subject, group.width, true)
        this.topic = topic
        topic.y = 35
        group.addChild(topic)
        this.topicGroup = group

        var myScroller: eui.Scroller = new eui.Scroller()
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = width
        myScroller.height = this.stage.stageHeight - 630
        myScroller.y = 400
        myScroller.x = (this.stage.stageWidth - width) / 2
        //设置viewport
        myScroller.viewport = group
        this.scroller = myScroller
        this.addChildAt(myScroller, -1)

        this.canSubmit = true


        let submit = Util.createBitmapByName('pk_submit_png')
        submit.x = (this.stage.stageWidth - submit.width) / 2
        submit.y = this.stage.stageHeight - 200
        this.submitButton = submit
        this.addChild(submit)
        submit.touchEnabled = true
        submit.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (!this.canSubmit) return
            let selectOption = this.topic.getSelect()
            if (!selectOption) {
                //TODO 
                let alert = new AlertPanel("请选择答案！", this.stage.stageHeight - 80)
                this.addChild(alert)
                return
            }
            let result = this.topic.getSelectResult()
            this.submitResult(result, selectOption)
            this.topic.setDisableSeleced()
        }, this)

        //update TODO 
        if (this.roomData.joinType === JoinType.OBSEVER) {
            submit.visible = false
            let leaveButton = Util.createBitmapByName('pk_leave_png')
            leaveButton.x = (this.stage.stageWidth - leaveButton.width) / 2
            leaveButton.y = this.stage.stageHeight - 150
            leaveButton.touchEnabled = true
            this.addChild(leaveButton)
            leaveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                let roomData = DataManager.getInstance().getRoomData()
                SocketX.getInstance().sendMsg(NetEvent.TEAM_LEAVE_ROOM, { tableNo: roomData.tableNo, joinType: roomData.joinType })
                ViewManager.getInstance().backByName('room')
            }, this)
            this.topic.setCorrectItem()
            this.topic.setDisableSeleced()
        }
        let alertGroup = new eui.Group()
        alertGroup.touchEnabled = false
        this.alertGroup = alertGroup
        this.addChildAt(alertGroup, 100)
    }

    private submitResult(result, selectOption) {
        // test begin
        // let resultMatch = new TeamResultScene()
        // ViewManager.getInstance().changeScene(resultMatch)
        // return
        // test end


        let roomData = DataManager.getInstance().getRoomData()
        let pkData = DataManager.getInstance().getTeamPkData()
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
        let trainid = pkData.questions[this.index]['id']
        let subject: Subject = Util.getTrain(trainid)
        if (!subject) return
        let useTime = new Date().getTime() - this.timer
        SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_SUBMIT, {
            tableNo: roomData.tableNo,//桌位号
            qid: subject.id,//问题ID
            qattrId: subject.qattrid,//问题属性ID
            reply: selectOption,//用户答案
            isCorrect: result,//result,//回答是否正确1=正确,0=错误
            useTime: useTime//答题时间(秒)
        })

        if (selectOption) {
            if (result) {
                Util.playMusic('answer_ok_mp3')
                this.topic.setSelectedStatus(TopicItem.STATUS_OK)
            }
            else {
                this.topic.setSelectedStatus(TopicItem.STATUS_ERROR)
                Util.playMusic('answer_err3_mp3')
            }
        }
    }


    /**
     * 切换题目
     */
    private updateTopic() {
        this.canSubmit = true
        if (this.topic) {
            this.topicGroup.removeChild(this.topic)
            this.topic = null
        }

        let pkData = DataManager.getInstance().getTeamPkData()
        if (!pkData) {
            console.error('没有团队pk数据')
            return
        }
        this.submitButton.visible = true
        if (this.alertGroup)
            this.alertGroup.removeChildren()
        this.numberText.text = "Q" + (this.index + 1)
        let trainid = pkData.questions[this.index]['id']
        this.timer = new Date().getTime()
        let subject: Subject = Util.getTrain(trainid)
        if (!subject) return
        //选项 
        let topic = new Topic(subject, this.topicGroup.width)
        topic.y = 50
        this.topic = topic
        this.topicGroup.touchEnabled = true
        this.topicGroup.addChild(topic)
        this.scroller.viewport.scrollV = 0
        if (this.roomData.joinType === JoinType.OBSEVER) {
            this.submitButton.visible = false
            let leaveButton = Util.createBitmapByName('pk_leave_png')
            leaveButton.x = (this.stage.stageWidth - leaveButton.width) / 2
            leaveButton.y = this.stage.stageHeight - 150
            leaveButton.touchEnabled = true
            this.addChild(leaveButton)
            leaveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                let roomData = DataManager.getInstance().getRoomData()
                SocketX.getInstance().sendMsg(NetEvent.TEAM_LEAVE_ROOM, { tableNo: roomData.tableNo, joinType: roomData.joinType })
                ViewManager.getInstance().backByName('room')
            }, this)
            this.topic.setCorrectItem()
            this.topic.setDisableSeleced()
        }
    }
}

class TeamKnowBattleScene extends Scene {

    private index = 0
    private pkData
    private topic
    private timer
    private timeNumber
    private timeText
    private topicGroup
    private scroller

    private progress = {}
    private submitButton

    private canSubmit
    private readonly TIMER = 15
    private numberText
    private roomData: Room
    private contentGroup
    private startTime
    private readonly groupWidth = 456

    public init() {
        super.setBackground()
        this.close_btn = false

        this.startTime = new Date().getTime()
        this.initData()

        let roomData = DataManager.getInstance().getRoomData()
        this.roomData = roomData
        let pkData = roomData.pkData

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

        this.pkData = pkData

        let users = pkData.users
        let leftUser = new TeamUser(users[TeamType.GREEN])
        leftUser.y = 100
        this.addChild(leftUser)

        let rightUser = new TeamUser(users[TeamType.BLUE], UserPositionType.RIGHT)
        rightUser.x = this.stage.stageWidth - rightUser.width
        rightUser.y = 100
        this.addChild(rightUser)

        let pkVs = Util.createBitmapByName('pk_vs_png')
        pkVs.x = (this.stage.stageWidth - pkVs.width) / 2
        pkVs.y = 130
        this.addChild(pkVs)

        // 倒计时
        let count_down_time = new egret.TextField()
        count_down_time.text = `-${this.TIMER}-`
        count_down_time.width = 100
        count_down_time.height = 100
        count_down_time.y = 180
        count_down_time.x = (this.stage.stageWidth - count_down_time.width) / 2
        count_down_time.textAlign = egret.HorizontalAlign.CENTER
        count_down_time.verticalAlign = egret.VerticalAlign.MIDDLE
        count_down_time.size = 40
        count_down_time.textColor = Config.COLOR_MAINCOLOR
        this.addChild(count_down_time)
        this.timeText = count_down_time


        let contentGroup = new eui.Group
        contentGroup.y = 400
        contentGroup.width = this.stage.stageWidth
        contentGroup.height = this.stage.stageHeight - 400
        this.contentGroup = contentGroup
        this.addChild(contentGroup)

        let progress = new VProgress(this.pkData.questions.length)
        progress.x = 40
        progress.y = 100
        this.contentGroup.addChild(progress)
        progress.setRate(1)
        this.progress[UserPositionType.LEFT] = progress


        let progress2 = new VProgress(this.pkData.questions.length)
        progress2.x = this.stage.stageWidth - progress2.width - 40
        progress2.y = 100
        this.contentGroup.addChild(progress2)
        progress2.setRate(1)
        this.progress[UserPositionType.RIGHT] = progress2


        let trainid = this.pkData.questions[this.index]['id']

        let subject: Subject = Util.getTrain(trainid)
        if (!subject) return

        //选项 
        let group = new eui.Group()
        group.width = this.groupWidth

        let number = new egret.TextField()
        number.width = this.groupWidth
        number.text = "Q" + (this.index + 1)
        number.textColor = Config.COLOR_MAINCOLOR
        number.textAlign = egret.HorizontalAlign.CENTER
        group.addChild(number)
        this.numberText = number

        let topic = new Topic(subject, this.groupWidth)
        this.topic = topic
        topic.y = 50
        group.addChild(topic)
        this.topicGroup = group

        var myScroller: eui.Scroller = new eui.Scroller()
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.groupWidth
        myScroller.height = this.stage.stageHeight - 650
        myScroller.x = (this.stage.stageWidth - myScroller.width) / 2
        //设置viewport
        myScroller.viewport = group
        this.scroller = myScroller
        this.contentGroup.addChild(myScroller)

        this.canSubmit = true
        let submit = Util.createBitmapByName('pk_submit_png')
        submit.x = (this.stage.stageWidth - submit.width) / 2
        submit.y = this.contentGroup.height - 200
        submit.touchEnabled = true
        this.submitButton = submit
        this.contentGroup.addChild(submit)
        submit.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (!this.canSubmit) return
            let selectOption = this.topic.getSelect()
            if (!selectOption) {
                //TODO 
                let alert = new AlertPanel("请选择答案！", this.stage.stageHeight - 80)
                this.addChild(alert)
                return
            }
            let result = this.topic.getSelectResult()
            this.submitResult(result, selectOption)
            this.topic.setDisableSeleced()
        }, this)

    }

    private initData() {
        this.timeNumber = this.TIMER
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
            let res = data.data
            this.progress[res.userTeam].setRate(res.seriaNo)
            if (res.seriaNo >= 10) { //已经答完题
                if (!res.isEnd) { //进入等待界面
                    this.showWait()
                }
            } else {
                this.next()
            }

        }, this)

        //结果页
        SocketX.getInstance().addEventListener(NetEvent.PK_END, (data) => {
            DataManager.getInstance().updateTeamPersonPkResult(data.data)
            this.clearEventListener()
            let scene = new TeamKnowPkResultScene()
            ViewManager.getInstance().changeScene(scene)
        }, this)

        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, (data) => {
            DataManager.getInstance().updateTeamKonwResult(data.data)
            this.clearEventListener()
            let scene = new TeamKnowResultScene()
            ViewManager.getInstance().changeScene(scene)
        }, this)


        //十秒倒计时
        let timer = new egret.Timer(1000, this.TIMER + 10)
        this.timer = timer
        timer.addEventListener(egret.TimerEvent.TIMER, () => {
            this.timeNumber--
            this.timeText.text = `-${this.timeNumber}-`
            if (this.timeNumber == 0) {
                timer.stop()
                if (!this.canSubmit) return
                this.submitResult(false, null)
            }
        }, this)
        timer.start()
    }

    /**
     * 清除监听
     */
    public clearEventListener() {
        SocketX.getInstance().removeEventListener(NetEvent.PK_END)
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_SUBMIT_BROADCAST)
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_PK_KNOW_RESULT)
    }

    /**
     * 提交答案
     *  1.正常提交
     *  2.超时提交答案
     */
    public submitResult(result, reply) {
        // test begin
        // let resultMatch = new TeamKnowResultScene()
        // ViewManager.getInstance().changeScene(resultMatch)
        // let scene = new TeamKnowPkResultScene()
        // ViewManager.getInstance().changeScene(scene)
        // return
        // test end


        this.canSubmit = false
        let qattrId = this.topic.getQAttrId()
        let current = new Date().getTime()
        let useTime = current - this.startTime

        let params = {
            tableNo: this.roomData.tableNo,//桌位号
            groupId: this.pkData.groupId,//分组Id
            qid: this.pkData.questions[this.index].id,//问题ID
            qattrId: qattrId,//问题属性ID
            reply: reply,//用户答案
            isCorrect: result ? 1 : 0,//回答是否正确1=正确,0=错误
            useTime: useTime//答题时间
        }
        SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_SUBMIT, params)

        if (reply) {
            if (result) {
                Util.playMusic('answer_ok_mp3')
                this.topic.setSelectedStatus(TopicItem.STATUS_OK)
            }
            else {
                this.topic.setSelectedStatus(TopicItem.STATUS_ERROR)
                Util.playMusic('answer_err3_mp3')
            }
        }

        this.submitButton.visible = false
        //如果有下一題，直接进入下一题
        // test begin
        // if (this.index < this.pkData.questions.length - 1) {
        //     setTimeout(() => { this.next() }, 1000)
        // }
        // test end
    }

    //进入下一题
    public next() {
        this.startTime = new Date().getTime()
        this.canSubmit = true
        this.submitButton.visible = true
        this.index++
        this.numberText.text = `Q${this.index + 1}`
        this.timeNumber = this.TIMER

        this.timer.reset()
        this.timeText.text = `-${this.timeNumber}-`
        this.timer.start()
        this.topicGroup.removeChild(this.topic)
        let trainid = this.pkData.questions[this.index].id
        let subject: Subject = Util.getTrain(trainid)
        if (!subject) return

        //选项 
        let topic = new Topic(subject, this.groupWidth)
        topic.y = 50
        this.topic = topic
        this.topicGroup.addChild(topic)
        this.scroller.viewport.scrollV = 0
    }

    /**
     * 更新进度条
     */
    public updateProgress(data) {
        let res = data.data
        this.progress[res.userTeam].setRate(data.data.seriaNo + 1)
    }

    /**
     * 显示等待界面
     */
    private showWait() {
        this.contentGroup.removeChildren()
        this.topicGroup.removeChildren()

        let roomData = DataManager.getInstance().getRoomData()
        if (this.timer) this.timer.stop()
        this.timeText.visible = false
        
        let waitPic = Util.createBitmapByName('pk_end_wait_png')
        waitPic.x = (this.stage.stageWidth - waitPic.width) / 2
        waitPic.y = 500
        this.addChild(waitPic)

        let info = new LineInfo('你的对手还在苦苦思索中\n请稍候...')
        this.addChild(info)
        
        let seeResultBtn = Util.createBitmapByName('pk_result_btn_png')
        seeResultBtn.x = (this.stage.stageWidth - seeResultBtn.width) / 2
        seeResultBtn.y = this.stage.stageHeight - 150
        seeResultBtn.touchEnabled = true
        this.addChild(seeResultBtn)

        seeResultBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // 进入结果页面
            SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId })
        }, this)
    }
}