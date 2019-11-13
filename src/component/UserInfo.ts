class UserInfo extends eui.Group {
    private group
	/**
	 * [type 类型]
	 */
    private type: any
    private userinfo
    private isinit = false
    private timer = null

    private setting = {
        'home': { bg: 'info_top01_png' },
        'center': { bg: 'info_top02_png' },
        'score': { bg: 'info_top03_png' }
    }

    public constructor(type) {
        super()
        this.type = type
        this.userinfo = DataManager.getInstance().getUser()
        if (!this.userinfo) {
            var timer: egret.Timer = new egret.Timer(500, 5)
            timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this)
            this.timer = timer
        } else {
            this.init()
        }
    }

    public timerFunc() {
        if (!this.isinit) {
            this.userinfo = DataManager.getInstance().getUser()
            if (this.userinfo) this.init()
        }
    }

    public refresh() {
        this.removeChildren()
        this.userinfo = DataManager.getInstance().getUser()
        this.init()
    }

	/**
	 * [init初始化页面]
	 *
	 * 底框 背景 头像 个人信息 
	 */
    public init() {
        this.isinit = true
        if (this.timer) this.timer.stop()

        let stage = ViewManager.getInstance().stage
        let setting = this.setting[this.type]

        let info_top: egret.Bitmap = Util.createBitmapByName(setting.bg)
        info_top.width = stage.stageWidth
        this.addChild(info_top)

        this.infoBg()
    }

    private infoBg() {
        let stage = ViewManager.getInstance().stage
        let group = new eui.Group()
        this.group = group
        this.addChild(group)
        let bg: egret.Bitmap
        if (this.type == 'score') {
            bg = Util.createBitmapByName('info_bg1_png')
            group.y = 140
        } else {
            bg = Util.createBitmapByName('info_bg_png')
            group.y = 110
        }
        group.x = (stage.stageWidth - bg.width) / 2
        group.width = bg.width
        group.height = bg.height
        group.addChild(bg)

        this.initRight()
        this.initLeft()

        if (this.type == 'score') {
            let trainResult = this.userinfo.trainResult
            let rateValue = Math.round(trainResult.trainCorrectCount * 100 / trainResult.trainTotalCount)
            let trainGroup = new eui.Group()
            trainGroup.x = 230
            trainGroup.y = 770
            this.addChild(trainGroup)
            let textArr = ['累积训练', '正确率']
            this.info(textArr, trainGroup, 42, 365, 60)
            let numArr = [trainResult.trainTotalCount + '题', rateValue + '%']
            this.info(numArr, trainGroup, 42, 365, 60, egret.HorizontalAlign.RIGHT)
        }
    }

    // 头像 个人排名
    private initLeft() {
        let x = 30

        let iconGroup = new eui.Group()
        iconGroup.width = 260
        iconGroup.height = 260
        iconGroup.x = x
        iconGroup.y = 10
        this.group.addChild(iconGroup)

        // 头像
        if (this.type == 'score') {
            Util.setUserImg(this.userinfo.avatar, 157, 109, 114, this.group)
        } else {
            Util.setUserImg(this.userinfo.avatar, 157, 30, 30, this.group)
        }

        // 桃子森林
        var peachWord: egret.Bitmap = Util.createBitmapByName('peachWord_png')
        peachWord.width = 240
        peachWord.x = -10
        peachWord.y = 300
        if (this.type != 'score') {
            iconGroup.addChild(peachWord)
        }
        peachWord.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // 跳转到桃子森林页面
            let scene = new PeachTree()
            ViewManager.getInstance().changeScene(scene)
        }, this)
        peachWord.touchEnabled = true

        //人名
        let name = new egret.TextField()
        name.text = this.userinfo.nickName
        name.textColor = 0xffffff
        if (this.type == 'score') {
            name.x = 410
            name.y = 130
            name.width = 160
            name.height = 40
        } else {
            name.x = 0
            name.y = 215
            name.size = 44
            name.width = 220
            name.height = 60
        }
        name.textAlign = egret.HorizontalAlign.CENTER
        name.verticalAlign = egret.VerticalAlign.MIDDLE
        iconGroup.addChild(name)

        // 等级徽章
        let iconnames = ['icon_brand1_png', 'icon_brand2_png', 'icon_brand3_png', 'icon_brand4_png']
        let vicon = Math.ceil(this.userinfo.lv / 20) - 1
        var flilter = Util.grayFliter()
        let iconx = 420
        let icony = 40
        let key = 1
        for (let icon of iconnames) {
            let levelIcon = Util.createBitmapByName(icon)
            levelIcon.x = iconx
            levelIcon.y = icony
            if (this.type != 'score') {
                this.group.addChild(levelIcon)
            }
            iconx += 47
            if (key > vicon) {
                levelIcon.filters = [flilter]
            }
            key++
        }

        // 等级
        let level = new egret.TextField()
        level.text = this.userinfo.lvShow
        level.textColor = 0xffffff
        level.size = 44

        if (this.type == 'score') {
            level.x = 300
            level.y = 210
        } else {
            level.x = 220
            level.y = 100
        }
        this.group.addChild(level)

        // 等级称号
        let levelName = new egret.TextField()
        levelName.text = this.userinfo.lvName
        levelName.textColor = 0xffffff
        levelName.size = 44

        if (this.type == 'score') {
            levelName.x = 430
            levelName.y = 210
        } else {
            levelName.x = 220
            levelName.y = 160
        }
        this.group.addChild(levelName)
    }


    private initRight() {
        let textGroup = new eui.Group()
        this.group.addChild(textGroup)

        // 标题
        let titleArr
        // 数值
        let numArr
        if (this.type == 'score') {
            titleArr = ['积分', '累积签到', '个人达标率', '团队达标率']
            textGroup.x = 230
            textGroup.y = 350
            this.info(titleArr, textGroup, 28, 365, 50)
            numArr = [this.userinfo.score + '分', this.userinfo.signTotal + '天', this.userinfo.personAchiRate + '%', this.userinfo.teamAchiRate.toFixed(2) + '%']
            this.info(numArr, textGroup, 30, 365, 50, egret.HorizontalAlign.RIGHT)
        } else {
            titleArr = ['个人积分', '个人达标率', '团队达标率', '连续达标天数']
            textGroup.x = 300
            textGroup.y = 230
            this.info(titleArr, textGroup, 24)
            numArr = [this.userinfo.score + '分', this.userinfo.personAchiRate + '%', this.userinfo.teamAchiRate.toFixed(2) + '%', this.userinfo.contSignTotal + '天']
            this.info(numArr, textGroup, 28, 300, 45, egret.HorizontalAlign.RIGHT)
        }
    }

	/**
	 * 
	 * @param arr arr
	 * @param group group
	 * @param size 文字大小
	 * @param w 宽度
	 * @param h 文字间隔高度
	 * @param textAlign 对齐方式
	 */
    private info(arr, group, size, w = 300, h = 45, textAlign = egret.HorizontalAlign.LEFT) {
        let y = 0
        arr.map(item => {
            let text = new egret.TextField()
            text.text = item
            text.textAlign = textAlign
            text.width = w
            text.y = y
            text.size = size
            group.addChild(text)
            y += h
        })
    }
}
