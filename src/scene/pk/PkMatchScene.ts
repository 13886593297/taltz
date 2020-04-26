class PkMatchScene extends Scene {
    private timer
    public init() {
        super.setBackground()
        this.close_btn = false
        //开始匹配
        setTimeout(() => {
            SocketX.getInstance().sendMsg(NetEvent.PK_MATCH, { robot: false })
        }, 2000)

        this.addEventListener(egret.Event.REMOVED, () => {
            this.timer.stop()
        }, this)

        let person_info_bg = Util.createBitmapByName('person_info_bg_png')
        person_info_bg.y = 50
        
        let infoGroup = new eui.Group
        infoGroup.width = person_info_bg.width
        infoGroup.height = person_info_bg.height
        infoGroup.x = (this.stage.stageWidth - infoGroup.width) / 2
        infoGroup.y = 250
        this.addChild(infoGroup)

        infoGroup.addChild(person_info_bg)

        let timerNumber = 30
        // test begin
        // timerNumber = 5
        // test end
        let time = new egret.TextField()
        time.text = `00:${timerNumber}`
        time.textColor = Config.COLOR_MAINCOLOR
        time.x = infoGroup.width - time.width - 30
        infoGroup.addChild(time)

        var timer: egret.Timer = new egret.Timer(1000, 60)
        this.timer = timer
        timer.addEventListener(egret.TimerEvent.TIMER, () => {
            if (timerNumber <= 0) {
                SocketX.getInstance().sendMsg(NetEvent.PK_MATCH, { robot: true })
                // test begin
                // let scene = new PkInviteScene(InviteStatus.MATCHEND);
                // ViewManager.getInstance().changeScene(scene);
                // test end
                timer.stop()
            } else {
                timerNumber--
            }
            if (timerNumber < 10) {
                time.text = `00:0${timerNumber}`

            } else time.text = `00:${timerNumber}`
        }, this)

        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            time.text = "00:00"
        }, this)
        timer.start()

        let user = DataManager.getInstance().getUser()

        let avatar = Util.setUserImg(user.avatar, 145)
        avatar.x = 28
        avatar.y = 138
        infoGroup.addChild(avatar)

        let label = new egret.TextField
        label.textFlow = [
            {text: '用 户\n'},
            {text: '来 自\n'},
            {text: '等 级'}
        ]
        label.size = 40
        label.lineSpacing = 25
        label.x = 240
        label.y = 140
        infoGroup.addChild(label)

        let info = new egret.TextField
        info.textFlow = [
            {text: `${Util.getStrByWith(user.nickName, 200, 28)}\n`},
            {text: `${user.teamName}\n`},
            {text: `${user.lvName}${user.lvShow}`}
        ]
        info.textAlign = 'right'
        info.size = 28
        info.lineSpacing = 35
        info.x = 400
        info.y = 150
        infoGroup.addChild(info)

        let cancelButton = Util.createBitmapByName('pk_cancel_png')
        cancelButton.x = (this.stage.stageWidth - cancelButton.width) / 2
        cancelButton.y = this.stage.stageHeight - 300
        this.addChild(cancelButton)
        cancelButton.touchEnabled = true
        cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // TODO 通知后台取消匹配
            SocketX.getInstance().sendMsg(NetEvent.CACEL_MATCH, {})
            ViewManager.getInstance().back()
        }, this)
    }
}