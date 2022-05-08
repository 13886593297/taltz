class PkResultScene extends Scene {
    private result
    private shareGroup
    private back
    constructor(result, back = PkResultBackModel.BACK) {
        super()
        this.result = result
        this.back = back
    }

    public init() {
        super.setBackground()

        let shareGroup = new eui.Group()
        this.addChild(shareGroup)
        this.shareGroup = shareGroup
        shareGroup.width = this.stage.stageWidth

        let pkResult = this.result
        console.log('pkResult', pkResult)

        // 玩家自己
        let self = pkResult.sender
        let selfScore = 0
        let selfTime
        let selfPkUser = null
        if (self && self.pkResult && self.pkUser) {
            selfPkUser = self.pkUser
            selfScore = self.pkResult.userAddScore
            selfTime = Util.converTimer(self.pkResult.userAnswerUseTimeTotal)
        }

        let leftUser = new PkUser(selfPkUser, "left", selfScore + '分', selfTime)
        leftUser.y = 120
        shareGroup.addChild(leftUser)

        // 对手
        let opponent = pkResult.receiver
        let opponentScore = 0
        let opponentTime
        let opponentPkUser = null
        if (opponent && opponent.pkResult && opponent.pkUser) {
            opponentPkUser = opponent.pkUser
            opponentScore = opponent.pkResult.userAddScore
            opponentTime = Util.converTimer(opponent.pkResult.userAnswerUseTimeTotal)
        }

        let rightUser = new PkUser(opponentPkUser, 'right', opponentScore + '分', opponentTime)
        rightUser.x = this.stage.stageWidth - rightUser.width
        rightUser.y = 120
        shareGroup.addChild(rightUser)

        let pkVs = Util.createBitmapByName('pk_vs_png')
        pkVs.x = (this.stage.stageWidth - pkVs.width) / 2
        pkVs.y = 150
        shareGroup.addChild(pkVs)

        // 无效局
        if (pkResult.status == PkResult.INVALID) {
            let tip = new LineInfo(pkResult.tipsMsg)
            shareGroup.addChild(tip)
            return
        }

        // 结果背景和音乐
        let result_bg = 'pk_success_png'
        let music = "pass_mp3"
        switch (pkResult.status) {
            case PkResult.SUCCESS:
                break
            case PkResult.DRAW:
                result_bg = "pk_draw_png"
                break
            case PkResult.FAIL:
                result_bg = "pk_fail_png"
                music = "nopass_mp3"
                break
        }
        let bg = Util.createBitmapByName(result_bg)
        bg.x = (this.stage.stageWidth - bg.width) / 2
        bg.y = 450
        shareGroup.addChild(bg)
        Util.playMusic(music)

        let selfScoreDescription = this.scoreItem(self.pkUser.nickName, self.pkResult.userAddScore, self.pkResult.scoretips)
        selfScoreDescription.y = 830
        shareGroup.addChild(selfScoreDescription)

        let opponentScoreDescription = this.scoreItem(
            opponent ? opponent.pkUser.nickName : '???', 
            opponent ? opponent.pkResult.userAddScore : 0, 
            opponent ? opponent.pkResult.scoretips : null
        )
        opponentScoreDescription.y = 910
        shareGroup.addChild(opponentScoreDescription)

        let saveButton = Util.createBitmapByName('button_small_1_png')
        saveButton.x = this.stage.stageWidth / 2 - saveButton.width - 30
        saveButton.y = this.stage.stageHeight - 200
        saveButton.touchEnabled = true
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let alert = new AlertPanel("提示:请自行截图保存图片", this.stage.stageHeight - 80)
            this.addChild(alert)
        }, this) 
        this.addChild(saveButton)

        let shareButton = Util.createBitmapByName('button_small_2_png')
        shareButton.x = this.stage.stageWidth / 2 + 30
        shareButton.y = saveButton.y
        shareButton.touchEnabled = true
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let tips = new SharePanel()
            this.addChild(tips)
        }, this)
        this.addChild(shareButton)

        Util.registerShare(this.shareGroup, ShareType.PK_BATTLE, self.pkUser.nickName, opponent ? opponent.pkUser.nickName : '')
    }

    private scoreItem(name, score, scoretips) {
        let group = new eui.Group
        let bg = Util.drawRoundRect(3, Config.COLOR_MAINCOLOR, 0xffffff, 274, 60, 30)
        group.width = bg.width
        group.x = (this.stage.stageWidth - group.width) / 2
        group.addChild(bg)
        let nickName = new egret.TextField
        nickName.text = name + ':'
        nickName.width = 160
        nickName.height = 24
        nickName.x = 20
        nickName.y = 20
        nickName.size = 24
        nickName.textColor = Config.COLOR_MAINCOLOR
        group.addChild(nickName)

        if (scoretips) {
            nickName.y = 10
            let tips = new egret.TextField
            tips.text = '(' + scoretips + ')'
            tips.width = bg.width
            tips.y = 35
            tips.textAlign = 'center'
            tips.size = 20
            tips.textColor = Config.COLOR_MAINCOLOR
            group.addChild(tips)
        }

        let addScore = new egret.TextField
        addScore.text = '+' + score + '分'
        addScore.width = 70
        addScore.height = nickName.height
        addScore.x = 190
        addScore.y = nickName.y
        addScore.size = nickName.size
        addScore.textAlign = 'right'
        addScore.textColor = Config.COLOR_MAINCOLOR
        group.addChild(addScore)
        return group
    }

    public onBack() {
        DataManager.getInstance().removePkData()
        switch (this.back) {
            case PkResultBackModel.BACK:
                ViewManager.getInstance().back()
                break
            case PkResultBackModel.BACK_HOME:
                ViewManager.getInstance().jumpHome()
                break
            case PkResultBackModel.BACK_PK:
                ViewManager.getInstance().backByName('pkmodel')
                break
        }
    }
}

/**
 * 单人PK结果
 */
class TeamKnowPkResultScene extends Scene {
    private pkData
    constructor() {
        super()
    }

    public init() {
        super.setBackground()
        this.close_btn = false

        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, (data) => {
            DataManager.getInstance().updateTeamKonwResult(data.data)
            let scene = new TeamKnowResultScene()
            ViewManager.getInstance().changeScene(scene)
        }, this)

        let roomData = DataManager.getInstance().getRoomData()
        this.pkData = roomData.pkData

        let pkResult = this.pkData.result


        let leftUser = new PkUser(this.pkData.users[TeamType.GREEN], "teamLeft", pkResult.score[TeamType.GREEN] + '分', null, true)
        leftUser.y = 100
        this.addChild(leftUser)

        let rightUser = new PkUser(this.pkData.users[TeamType.BLUE], 'right', pkResult.score[TeamType.BLUE] + '分', null, true)
        rightUser.x = this.stage.stageWidth - rightUser.width
        rightUser.y = 100
        this.addChild(rightUser)

        let pkVs = Util.createBitmapByName('pk_vs_png')
        pkVs.x = (this.stage.stageWidth - pkVs.width) / 2
        pkVs.y = 130
        this.addChild(pkVs)

        //倒计时 15 秒进入 结果页
        let timer = new egret.Timer(1000, 15)
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId })
        }, this)
        timer.start()

        let seeTeamResult = Util.createBitmapByName('pk_result_btn_png')
        seeTeamResult.x = (this.stage.stageWidth - seeTeamResult.width) / 2
        seeTeamResult.y = this.stage.stageHeight - 150
        seeTeamResult.touchEnabled = true
        seeTeamResult.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            timer.stop()
            SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId })
        }, this)
        this.addChild(seeTeamResult)

        if (pkResult.status == PkResult.INVALID) {
            let info = new LineInfo(pkResult.tipsMsg)
            this.addChild(info)
            return
        }

        // 获胜背景
        let resultBgArr = ['pk_winner_draw2_png', 'pk_winner_left2_png', 'pk_winner_right2_png']
        let resultBg = Util.createBitmapByName(resultBgArr[pkResult.winner])
        resultBg.x = (this.stage.stageWidth - resultBg.width) / 2
        resultBg.y = 450
        this.addChild(resultBg)

        let music = "pass_mp3"
        Util.playMusic(music)

        let selfScoreDescription = this.scoreItem(this.pkData.users[1].nickName, pkResult.score[1], pkResult.winner)
        selfScoreDescription.y = 830
        this.addChild(selfScoreDescription)

        let opponentScoreDescription = this.scoreItem(this.pkData.users[2].nickName, pkResult.score[2], pkResult.winner)
        opponentScoreDescription.y = 910
        this.addChild(opponentScoreDescription)
    }

    private scoreItem(name, score, winner: 0 | 1 | 2) {
        let group = new eui.Group
        let bg = Util.drawRoundRect(3, winner == 2 ? 0x36AF38 : Config.COLOR_MAINCOLOR, 0xffffff, 274, 60, 30)
        group.width = bg.width
        group.x = (this.stage.stageWidth - group.width) / 2
        group.addChild(bg)
        let nickName = new egret.TextField
        nickName.text = name + ':'
        nickName.width = 160
        nickName.height = 24
        nickName.x = 20
        nickName.y = 20
        nickName.size = 24
        nickName.textColor = winner == 2 ? 0x36AF38 : Config.COLOR_MAINCOLOR
        group.addChild(nickName)

        let addScore = new egret.TextField
        addScore.text = score > 0 ? `+${score}分` : `${score}分`
        addScore.width = 70
        addScore.height = nickName.height
        addScore.x = 190
        addScore.y = nickName.y
        addScore.size = nickName.size
        addScore.textAlign = 'right'
        addScore.textColor = winner == 2 ? 0x36AF38 : Config.COLOR_MAINCOLOR
        group.addChild(addScore)
        return group
    }

    public onBack() {
        DataManager.getInstance().removePkData()
        ViewManager.getInstance().jumpHome()
    }
}


