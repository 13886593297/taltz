class PkInviteScene extends Scene {
    private avatarGroup
    private type
    private msg
    constructor(type, msg = null) {
        super()
        this.type = type
        this.msg = msg
    }

    public init() {
        super.setBackground()
        this.close_btn = false

        let avatarGroup = new eui.Group
        avatarGroup.y = 20
        this.addChild(avatarGroup)
        this.avatarGroup = avatarGroup

        let userinfo = DataManager.getInstance().getUser()
        let leftUser = new PkUser(userinfo)
        avatarGroup.addChild(leftUser)

        let pkData = DataManager.getInstance().getPkData()
        let rightUser = new PkUser(pkData ? pkData.pkUser : null, 'right')
        rightUser.x = this.stage.stageWidth - rightUser.width
        avatarGroup.addChild(rightUser)

        let pkVs = Util.createBitmapByName('pk_vs_png')
        pkVs.x = (this.stage.stageWidth - pkVs.width) / 2
        pkVs.y = 30
        avatarGroup.addChild(pkVs)

        switch (this.type) {
            case InviteStatus.INVITING:
                this.inviting()
                break
            case InviteStatus.NOACCEPT: //未接受邀请
                this.noAccept()
                break
            case InviteStatus.WATTING:
                this.waiting()
                break
            case InviteStatus.ACCEPTED:
                this.accepted()
                break
            case InviteStatus.MATCHEND:
                this.matchEnd()
                this.avatarGroup.y = 460
                break
            case InviteStatus.OBSERVE:
                this.observe()
                break
            case InviteStatus.INVALID:
                this.invalid()
                break
            case InviteStatus.PK_ERR_MSG:
                this.errorMsg()
                break
            case InviteStatus.INVALID_ERROR:
                this.invalidError()
                this.close_btn = 'close_png'
                this.backPage = 'pkmodel'
                this.avatarGroup.y = 120
                break
            case InviteStatus.PK_END_WAIT:
                this.pkEnd()
                this.close_btn = 'close_png'
                this.backPage = 'pkmodel'
                this.avatarGroup.y = 120
                this.removeEvent = NetEvent.PK_END
                break
            case InviteStatus.PK_NO_ANSWER:
                this.pkNoAnswer()
                break
            case InviteStatus.PK_REJECT:
                this.pkReject()
                break
        }
    }

    /**
     * 邀请好友
     */
    private inviting() {
        let text = new egret.TextField()
        text.text = "00:60"
        text.width = 750
        text.textAlign = egret.HorizontalAlign.CENTER
        text.textColor = 0x989898
        text.y = 166
        this.addChild(text)

        let timerNumber = 60
        var timer: egret.Timer = new egret.Timer(1000, 60)
        timer.addEventListener(egret.TimerEvent.TIMER, () => {
            timerNumber--
            if (timerNumber < 10) {
                text.text = `00:0${timerNumber}`

            } else text.text = `00:${timerNumber}`
        }, this)

        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            text.text = "00:00"
        }, this)
        timer.start()

        SocketX.getInstance().addEventListener(NetEvent.PK_ACCEPT, (data) => {
            DataManager.getInstance().setPk(data.data)
            switch (data.data.tipsCode) {
                case 0:
                    let scene = new PkInviteScene(InviteStatus.MATCHEND)
                    ViewManager.getInstance().changeScene(scene)
                    break
                case 10: //对方拒绝邀请
                    let rejectScene = new PkInviteScene(InviteStatus.NOACCEPT)
                    ViewManager.getInstance().changeScene(rejectScene)
                    break
            }
        })

        let waitPic = Util.createBitmapByName('pk_end_wait_png')
        waitPic.x = (this.stage.stageWidth - waitPic.width) / 2
        waitPic.y = 500
        this.addChild(waitPic)

        let tip = new LineInfo(`等待好友进入挑战...`)
        this.addChild(tip)
    }

    public noAccept() {
        let text = new egret.TextField
        text.text = "您的好友正忙,请下次再邀请TA吧！"
        text.width = 440
        text.textColor = Config.COLOR_MAINCOLOR
        text.textAlign = egret.HorizontalAlign.CENTER
        text.x = (this.stage.stageWidth - text.width) / 2
        text.y = 500
        this.addChild(text)

        let seconds = 5
        let alert = new LineInfo(`${seconds}秒后进入离线答题模式！`)
        let timer = new egret.Timer(1000, 5)
        timer.addEventListener(egret.TimerEvent.TIMER, () => {
            seconds--
            alert.setText(`${seconds}秒后进入离线答题模式！`)
        }, this)
        timer.start
        this.addChild(alert)
    }

    private matchEnd() {
        //开始pk
        let pkData = DataManager.getInstance().getPkData()
        let resultBgName = 'match_title_01_png'
        if (!pkData || !pkData.pkUser) {
            resultBgName = 'match_title_02_png'
        }

        let resultBg = Util.createBitmapByName(resultBgName)
        resultBg.x = (this.stage.stageWidth - resultBg.width) / 2
        resultBg.y = 580
        this.addChild(resultBg)

        let tip = Util.createBitmapByName('pk_begin_png')
        tip.x = (this.stage.stageWidth - tip.width) / 2
        tip.y = this.stage.stageHeight - 300
        this.addChild(tip)

        let seconds = 5
        let countDown = new egret.TextField
        countDown.text = '' + seconds
        countDown.x = tip.x
        countDown.y = tip.y
        countDown.width = 100
        countDown.height = tip.height - 5
        countDown.textAlign = 'center'
        countDown.verticalAlign = 'middle'
        countDown.size = 36
        this.addChild(countDown)

        let timer = new egret.Timer(1000, 5)
        timer.addEventListener(egret.TimerEvent.TIMER, () => {
            seconds--
            countDown.text = '' + seconds
        }, this)

        timer.start()
    }

    /**
     * 旁观
     */
    public observe() {
        let alert = new LineInfo(`对局进行中`)
        this.addChild(alert)
    }

    /**
     * 无效局
     */
    public invalid() {
        let info = new LineInfo('本局无效\n友谊的小船荡啊荡，\nbut 你们却都没答题!')
        this.addChild(info)
    }
    /**
     * 无效局
     */
    public errorMsg() {
        let info = new LineInfo(this.msg)
        this.addChild(info)
    }

    /**
     * 无效局-全打错
     */
    public invalidError() {
        let info = new LineInfo('本局无效\n棋逢对手，满盘皆错！\n两位赶快去温习一下再来挑战吧！')
        this.addChild(info)
    }

    /**
     * 24小时未应答
     */
    public pkNoAnswer() {
        let info = new LineInfo('您的好友24小时内未应答\n请确认TA是否被外星人绑架了')
        this.addChild(info)
    }

    public pkReject() {
        let info = new LineInfo('您的好友拒绝了您的邀请\n并向您发送了一波爱心')
        this.addChild(info)
    }


    public pkEnd() {
        let waitPic = Util.createBitmapByName('pk_end_wait_png')
        waitPic.x = (this.stage.stageWidth - waitPic.width) / 2
        waitPic.y = 500
        this.addChild(waitPic)

        let info = new LineInfo('你的对手还在苦苦思索中\n请稍候...')
        this.addChild(info)
    }

    public onBack() {
        switch (this.type) {
            case InviteStatus.PK_ERR_MSG:
                DataManager.getInstance().removePkData()
                ViewManager.getInstance().backByName('pkmodel')
                break
            default:
                ViewManager.getInstance().jumpHome()
                break
        }
    }

    public waiting() {
        let waitPic = Util.createBitmapByName('pk_end_wait_png')
        waitPic.x = (this.stage.stageWidth - waitPic.width) / 2
        waitPic.y = 500
        this.addChild(waitPic)

        let info = new LineInfo('等待对手24小时进入挑战...')
        this.addChild(info)

        let backButton = Util.createBitmapByName('pk_back_png')
        backButton.x = (this.stage.stageWidth - backButton.width) / 2
        backButton.y = this.stage.stageHeight - 200
        backButton.touchEnabled = true
        this.addChild(backButton)
        backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            ViewManager.getInstance().backByName('pkmodel')
        }, this)
    }

    /**
     * 被邀请
     */
    public accepted() {
        let inviteButton = Util.createBitmapByName('pk_accept_png')
        inviteButton.x = this.stage.stageWidth / 2 - inviteButton.width - 30
        inviteButton.y = this.stage.stageHeight - 200
        inviteButton.touchEnabled = true
        this.addChild(inviteButton)

        let pkCode = DataManager.getInstance().getPkData().pkCode
        inviteButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            //TODO  接受邀请
            SocketX.getInstance().addEventListener(NetEvent.PK_ACCEPT, (data) => {
                let scene = new PkInviteScene(InviteStatus.MATCHEND)
                ViewManager.getInstance().changeScene(scene)
            })
            SocketX.getInstance().sendMsg(NetEvent.PK_ACCEPT, {
                pkCode: pkCode,//PK唯一码
                accept: true,//是否接受 true=是,false=否
            })
        }, this)

        let quitButton = Util.createBitmapByName('pk_refuse_png')
        quitButton.x = this.stage.stageWidth / 2 + 30
        quitButton.y = inviteButton.y
        quitButton.touchEnabled = true
        this.addChild(quitButton)

        quitButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            SocketX.getInstance().sendMsg(NetEvent.PK_ACCEPT, {
                pkCode: pkCode,//PK唯一码
                accept: false,//是否接受 true=是,false=否
            })
            let scene = new IndexScene()
            ViewManager.getInstance().changeScene(scene)
        }, this)
    }
}


