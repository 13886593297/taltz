class TeamResultScene extends Scene {
    private shareGroup
    private roomData: Room
    private users = {}

    constructor() {
        super()
    }

    public init() {
        super.setBackground()

        this.shareGroup = new eui.Group()
        this.addChild(this.shareGroup)

        this.roomData = DataManager.getInstance().getRoomData()
        this.initHead()
        this.initUserList()
        this.initResult()
    }

    public onBack() {
        DataManager.getInstance().clearRoomData()
        ViewManager.getInstance().backByName('pklist')
    }

    private initHead() {
        let result = this.roomData.pkResult

        // 分数
        let leftScoreBg = Util.createBitmapByName('pk_result_score_left_png')
        leftScoreBg.x = 50
        leftScoreBg.y = 135
        this.shareGroup.addChild(leftScoreBg)

        let leftScore = new egret.TextField
        leftScore.text = result.score[UserPositionType.LEFT]
        leftScore.x = leftScoreBg.x
        leftScore.y = leftScoreBg.y
        leftScore.size = 60
        leftScore.width = leftScoreBg.width
        leftScore.height = leftScoreBg.height - 10
        leftScore.textAlign = 'center'
        leftScore.verticalAlign = 'middle'
        this.shareGroup.addChild(leftScore)

        let rightScoreBg = Util.createBitmapByName('pk_result_score_right_png')
        rightScoreBg.x = this.stage.stageWidth - rightScoreBg.width - 50
        rightScoreBg.y = 135
        this.shareGroup.addChild(rightScoreBg)

        let rightScore = new egret.TextField
        rightScore.text = result.score[UserPositionType.RIGHT]
        rightScore.x = rightScoreBg.x
        rightScore.y = rightScoreBg.y
        rightScore.size = 60
        rightScore.width = rightScoreBg.width
        rightScore.height = rightScoreBg.height - 10
        rightScore.textAlign = 'center'
        rightScore.verticalAlign = 'middle'
        this.shareGroup.addChild(rightScore)

        let leftFlag = Util.createBitmapByName('pk_yellow_group_little_png')
        leftFlag.x = 50
        leftFlag.y = 270
        this.shareGroup.addChild(leftFlag)

        let rightFlag = Util.createBitmapByName('pk_green_group_little_png')
        rightFlag.x = this.stage.stageWidth - rightFlag.width - 50
        rightFlag.y = 270
        this.shareGroup.addChild(rightFlag)
    }

    private initUserList() {
        let userGroup = new eui.Group()
        userGroup.y = 340
        this.shareGroup.addChildAt(userGroup, 100)

        let roomData = DataManager.getInstance().getRoomData()
        let pkUser = roomData.users
        let number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5
        for (let key in pkUser) {
            let user = pkUser[key]
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

        if (this.roomData.pkResult && this.roomData.pkResult.mvps) {
            for (let mvp of this.roomData.pkResult.mvps) {
                let text = new egret.TextField
                text.text = 'MVP'
                text.textColor = 0x6b6a6a
                text.stroke = 2
                text.strokeColor = 0xffffff
                text.x = mvp.index > number ? 606 : 80
                text.y = this.users[mvp.index].y + 80
                userGroup.addChildAt(text, -1)
            }
        }
    }

    private initResult() {
        let result = this.roomData.pkResult

        // 标题
        let title = ''
        if (result.winner == 1) {
            title = 'pk_winner_left_png'
        } else if (result.winner == 2) {
            title = 'pk_winner_right_png'
        }
        let resultTitle = Util.createBitmapByName(title)
        resultTitle.x = (this.stage.stageWidth - resultTitle.width) / 2
        resultTitle.y = 400
        this.shareGroup.addChild(resultTitle)

        // 奖杯
        let resultBg = Util.createBitmapByName(result.winner == 0 ? 'pk_winner_draw_png' : 'pk_winner_cup_png')
        resultBg.x = (this.stage.stageWidth - resultBg.width) / 2
        resultBg.y = result.winner == 0 ? 450 : 520
        this.shareGroup.addChild(resultBg)

        let saveButton = Util.createBitmapByName('button_small_1_png')
        saveButton.x = this.stage.stageWidth / 2 - saveButton.width - 10
        saveButton.y = this.stage.stageHeight - 200
        saveButton.touchEnabled = true
        this.addChild(saveButton)
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let alert = new AlertPanel("提示:请自行截图保存图片", this.stage.stageHeight - 80)
            this.addChild(alert)
        }, this)

        let shareButton = Util.createBitmapByName('button_small_2_png')
        shareButton.x = this.stage.stageWidth / 2 + 10
        shareButton.y = this.stage.stageHeight - 200
        shareButton.touchEnabled = true
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let tips = new SharePanel()
            this.addChild(tips)
        }, this)
        this.addChild(shareButton)
        Util.registerShare(this.shareGroup, ShareType.PK_ANSWER)
    }
}

/**
 * 知识赛结果页
 */
class TeamKnowResultScene extends Scene {
    private shareGroup
    private userViews = {}
    private scoresText = {}
    private pkingStatus
    private winView


    init() {
        super.setBackground()

        this.shareGroup = new eui.Group()
        this.addChild(this.shareGroup)
        this.initEvent()
        this.initTop()
        this.initUser()
        this.initBottomButton()
    }

    private initEvent() {
        SocketX.getInstance().addEventListener(NetEvent.TEAM_END_PK, (data) => {
            //更新数据
            DataManager.getInstance().updateTeamKonwResult(data.data)
            this.update()
        }, this)
    }

    public onBack() {
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_END_PK)
        DataManager.getInstance().clearRoomData()
        ViewManager.getInstance().backByName('pklist')

    }

    private initBottomButton() {
        let saveButton = Util.createBitmapByName('button_small_1_png')
        saveButton.x = this.stage.stageWidth / 2 - saveButton.width - 10
        saveButton.y = this.stage.stageHeight - 200
        saveButton.touchEnabled = true
        this.addChild(saveButton)
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let alert = new AlertPanel("提示:请自行截图保存图片", this.stage.stageHeight - 80)
            this.addChild(alert)
        }, this)

        let shareButton = Util.createBitmapByName('button_small_2_png')
        shareButton.x = this.stage.stageWidth / 2 + 10
        shareButton.y = this.stage.stageHeight - 200
        shareButton.touchEnabled = true
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let tips = new SharePanel()
            this.addChild(tips)
        }, this)
        this.addChild(shareButton)
        Util.registerShare(this.shareGroup, ShareType.PK_KNOW)
    }


    private initUser() {
        let userGroup = new eui.Group()
        userGroup.y = 320
        this.shareGroup.addChildAt(userGroup, 100)

        let roomData = DataManager.getInstance().getRoomData()
        let pkResult = roomData.pkResult
        let pkUser = roomData.users
        let number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5
        for (let key in pkUser) {
            let user = pkUser[key]
            if (user.position > roomData.roomNumber || user.position < 1) {
                continue
            }
            let postionY = 160 * (user.position - 1)
            let postionFlag = UserPositionType.LEFT

            if (user.position > number) { //蓝队用户
                postionY = 160 * (user.position - number - 1)
                postionFlag = UserPositionType.RIGHT
            }

            let teamUser = new TeamUser(user.userInfo, postionFlag)

            this.userViews[user.position] = teamUser
            let status = pkResult.result[user.position]
            if (status && status !== WinnerStatus.PKING) {
                teamUser.setWinnerStatus(status)
            }
            teamUser.y = postionY
            userGroup.addChild(teamUser)
            if (postionFlag == UserPositionType.RIGHT) {
                teamUser.x = this.stage.stageWidth - teamUser.width
            }
        }

        for (let i = 0; i < number; i++) {
            let pkVs = Util.createBitmapByName('pk_vs_png')
            pkVs.x = (this.stage.stageWidth - pkVs.width) / 2
            pkVs.y = 160 * i + pkVs.height / 2
            userGroup.addChild(pkVs)
        }
    }

    private update() {
        let pkResult = DataManager.getInstance().getRoomData().pkResult
        if (pkResult.end) {
            this.pkingStatus.visible = false
            if (!this.winView) this.initWinView()
        }
        this.scoresText[TeamType.GREEN].text = `总分 ${pkResult.score[TeamType.GREEN]}`
        this.scoresText[TeamType.BLUE].text = `总分 ${pkResult.score[TeamType.BLUE]}`

        for (let key in pkResult.result) {
            let status = pkResult.result[key]
            if (status && status !== WinnerStatus.PKING) {
                this.userViews[key].setWinnerStatus(status)
            }
        }
    }

    private initTop() {
        let roomData = DataManager.getInstance().getRoomData()
        let pkResult = roomData.pkResult
        let leftScoreBg = Util.createBitmapByName('pk_result_left_bg_png')
        leftScoreBg.x = 50
        leftScoreBg.y = 240
        this.shareGroup.addChild(leftScoreBg)

        let leftScore = new egret.TextField
        leftScore.text = `总分 ${pkResult.score[TeamType.GREEN]}`
        leftScore.height = leftScoreBg.height - 10
        leftScore.x = leftScoreBg.x + 120
        leftScore.y = leftScoreBg.y
        leftScore.verticalAlign = 'middle'
        leftScore.size = 24
        this.shareGroup.addChild(leftScore)
        this.scoresText[TeamType.GREEN] = leftScore

        let rightScoreBg = Util.createBitmapByName('pk_result_right_bg_png')
        rightScoreBg.x = this.stage.stageWidth - rightScoreBg.width - 50
        rightScoreBg.y = 240
        this.shareGroup.addChild(rightScoreBg)

        let rightScore = new egret.TextField
        rightScore.text = `总分 ${pkResult.score[TeamType.BLUE]}`
        rightScore.height = rightScoreBg.height - 10
        rightScore.x = rightScoreBg.x + 30
        rightScore.y = rightScoreBg.y
        rightScore.verticalAlign = 'middle'
        rightScore.size = 24
        this.shareGroup.addChild(rightScore)
        this.scoresText[TeamType.BLUE] = rightScore

        let resultGroup = new eui.Group()
        this.shareGroup.addChild(resultGroup)

        if (!pkResult.end) {
            let pkingStatus = new egret.Bitmap
            pkingStatus.texture = RES.getRes('pk_tip_waiting_png')
            pkingStatus.x = (this.stage.stageWidth - pkingStatus.width) / 2
            pkingStatus.y = 80
            resultGroup.addChild(pkingStatus)
            this.pkingStatus = pkingStatus
        } else {
            this.initWinView()
        }
    }

    private initWinView() {
        let roomData = DataManager.getInstance().getRoomData()
        let pkResult = roomData.pkResult
        let winView = new eui.Group()
        this.shareGroup.addChild(winView)

        let bgNames = { 1: "pk_winner_left_png", 2: "pk_winner_right_png", 0: "pk_tip_draw_png" }

        let bgImg = Util.createBitmapByName(bgNames[pkResult.winner])
        if (pkResult.winner != 0) {
            bgImg.width = 444
            bgImg.height = 104
        }
        bgImg.x = (this.stage.stageWidth - bgImg.width) / 2
        bgImg.y = 80
        winView.addChild(bgImg)
        this.winView = winView
    }
}