class PkUser extends eui.Group {
    private userinfo
    private type
    private score
    private scoreText
    private time
    private team

    constructor(userinfo, type = "left", score = null, time?, team?) {
        super()
        this.userinfo = userinfo
        this.type = type
        this.score = score
        this.time = time
        this.team = team
        this.init()
    }

    public init() {
        let bgname = 'pk_user_bg_left_png'
        if (this.type == 'right') {
            bgname = 'pk_user_bg_right_png'
        } else if (this.type == 'teamLeft') {
            bgname = 'pk_know_result_left_png'
        }
        let bg = Util.createBitmapByName(bgname)
        this.width = bg.width
        this.addChild(bg)

        // 头像
        let avatar = Util.setUserImg(this.userinfo ? this.userinfo.avatar : 'pk_default_avatar_png', 112)
        avatar.x = 170
        avatar.y = 3
        if (this.type == 'right') {
            avatar.x = 3
        }
        this.addChild(avatar)

        // 昵称
        let name = new egret.TextField()
        name.text = this.userinfo ? this.userinfo.nickName : '???'
        name.width = 150
        name.height = 24
        name.x = 77
        name.y = 150
        if (this.type == 'right') {
            name.x = 70
        }
        name.textAlign = egret.HorizontalAlign.CENTER
        name.verticalAlign = egret.VerticalAlign.MIDDLE
        name.size = 24
        this.addChild(name)

        // 得分 用时
        if (this.score && !this.team) {
            let userScore = new egret.TextField
            userScore.textFlow = [
                { text: this.score + '\n', style: { textColor: 0x35ad3d, size: 36 } },
                { text: this.time, style: { textColor: 0x959898, size: 26 } }
            ]
            userScore.width = 100
            userScore.textAlign = 'center'
            userScore.x = 100
            userScore.y = bg.height + 15
            if (this.team) {
                userScore.textColor = 0xffffff
                userScore.size = 44
                userScore.x = 45
                userScore.y = bg.y
                userScore.height = 118
                userScore.verticalAlign = 'middle'
                if (this.type == 'right') {
                    userScore.x = bg.x + 155
                }
            }
            this.addChild(userScore)
        } else {
            let userScore = new egret.TextField
            userScore.text = this.score
            userScore.size = 44
            userScore.x = 45
            userScore.y = bg.y
            userScore.height = 118
            userScore.verticalAlign = 'middle'
            if (this.type == 'right') {
                userScore.x = bg.x + 155
            }
            this.addChild(userScore)
        }
    }

    public setScore(score) {
        this.scoreText.text = score
    }

}

class TeamUser extends eui.Group {
    private userinfo
    private type: UserPositionType

    private icon
    private avatar
    private nameText
    private readyImg
    private status

    private clickTime
    private canClick = true

    private resultText


    constructor(userinfo, type = UserPositionType.LEFT) {
        super()
        this.userinfo = userinfo || {}
        // test begin
        // this.userinfo.nickName = '周武Zhou Wu'
        // this.userinfo.avatar = 'http://127.0.0.1:8360/uploads/avatar/13886593297_avatar.jpg'
        // test end
        this.type = type
        this.init()
    }

    public init() {
        let bgname = 'pk_yellow_list_png'
        if (this.type === UserPositionType.RIGHT) {
            bgname = 'pk_green_list_png'
        }

        let bg = Util.createBitmapByName(bgname)
        this.width = bg.width
        this.height = bg.height
        this.addChild(bg)

        // 头像
        let avatar = new egret.Bitmap()
        avatar.width = avatar.height = 112
        avatar.x = this.type == UserPositionType.LEFT ? 170 : 3
        avatar.y = 3
        this.addChild(avatar)
        this.avatar = avatar
        if (this.userinfo) {
            Util.setUserImg0(this.userinfo.avatar, avatar)
        }

        let shape = new egret.Shape()
        this.addChild(shape)
        let graphics = shape.graphics
        graphics.beginFill(0xffffff)
        graphics.drawCircle(avatar.x + avatar.width / 2, avatar.y + avatar.height / 2, avatar.width / 2)
        graphics.endFill()
        avatar.mask = shape

        // 人名
        let name = new egret.TextField()
        name.width = 150
        name.size = 26
        name.text = this.userinfo.nickName ? Util.getStrByWith(this.userinfo.nickName, name.width - 20, name.size) : ''
        name.x = this.type == UserPositionType.LEFT ? 0 : 130
        name.height = bg.height - 10
        name.wordWrap = false
        name.multiline = false
        name.textAlign = this.type == UserPositionType.LEFT ? 'right' : 'left'
        name.verticalAlign = 'middle'
        this.addChild(name)
        this.nameText = name

        // 准备图标
        let readyImg = Util.createBitmapByName('pk_icon_ready_png')
        if (this.type == UserPositionType.LEFT) {
            readyImg.x = 140
        } else {
            readyImg.x = 115
        }
        readyImg.y = 80
        this.readyImg = readyImg
        this.addChild(readyImg)
        this.readyImg.visible = false
    }

    public addUserEventListener(callback, obj) {

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (!this.canClick) return
            let current = new Date().getTime()
            if (this.clickTime && current - this.clickTime < 1000) return
            this.clickTime = current
            // this.canClick = false
            callback.bind(obj)(this.userinfo)
        }, this)
    }

    public resetClick() {
        this.canClick = true
        this.clickTime = 0
    }

    public setDisableClick() {
        this.canClick = false
    }

    /**
     * 更新用户信息
     */
    public updateUser(userinfo) {
        this.userinfo = userinfo
        //清空头像
        let texture = new egret.Texture()
        this.avatar.texture = texture
        if (userinfo == null) {
            this.nameText.text = ''
            this.readyImg.visible = false
            this.resetClick()
        } else {
            this.nameText.text = Util.getStrByWith(this.userinfo.nickName, 150 - 20, 26)
            Util.setUserImg0(userinfo.avatar, this.avatar)
        }
    }

    /**
     * 准备好
     */
    public setReady() {
        this.readyImg.visible = true
    }


    /**
     * 设置用户结果状态
     */
    public setWinnerStatus(status) {
        if (this.status == status) return
        this.status = status
        if (this.resultText) {
            this.resultText.parent.removeChild(this.resultText)
            this.resultText = null
        }
        let textObj = {
            1: '成功',
            2: '平局',
            3: 'MVP',
            4: '失败'
        }

        let text = new egret.TextField
        text.text = textObj[status]
        text.textColor = this.type == UserPositionType.LEFT ? 0x4b4c03 : 0xffffff
        text.size = 20
        text.x = this.type == UserPositionType.LEFT ? 100 : 130
        text.y = 80
        this.resultText = text
        this.addChild(text)

        if (status === WinnerStatus.LOSE) {
            let grayFilter = Util.grayFliter()
            this.filters = [grayFilter]
        }
    }
}


class LiteTeamUser extends eui.Group {
    private userinfo
    private type: UserPositionType

    constructor(userinfo, type = UserPositionType.LEFT) {
        super()
        this.userinfo = userinfo || {}
        // test begin
        // this.userinfo.nickName = '周武'
        // this.userinfo.avatar = 'http://127.0.0.1:8360/uploads/avatar/13886593297_avatar.jpg'
        // test end
        this.type = type
        this.init()
    }


    public init() {
        let bgname = 'pk_yellow_list_lite_png'
        if (this.type === UserPositionType.RIGHT) {
            bgname = 'pk_green_list_lite_png'
        }

        let bg = Util.createBitmapByName(bgname)
        this.width = bg.width
        this.height = bg.height
        this.addChild(bg)

        // 头像
        if (this.userinfo && this.userinfo.avatar) {
            let avatar = Util.setUserImg(this.userinfo.avatar, 112)
            avatar.x = this.type == UserPositionType.LEFT ? 54 : 3
            avatar.y = 3
            this.addChild(avatar)
        }

        // 人名
        if (this.userinfo && this.userinfo.nickName) {
            let name = new egret.TextField()
            name.text = this.userinfo.nickName
            name.x = this.type == UserPositionType.LEFT ? 0 : 110
            name.width = 60
            name.height = bg.height - 20
            name.wordWrap = false
            name.multiline = false
            name.textAlign = this.type == UserPositionType.LEFT ? 'right' : 'left'
            name.verticalAlign = 'bottom'
            name.size = 18
            this.addChild(name)
        }
    }
}