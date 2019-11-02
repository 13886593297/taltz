class PeachTree extends Scene {
    private userInfo  // 玩家信息
    private scoreContent  // 积分数值是否已经创建
    private _myRotation = 5  // 旋转角度
    private count = 0  // 显示几个桃子
    private info  // 桃子信息
    private curPeachIndex  // 签到5天新长出来的桃子index
    constructor() {
        super()
    }

    public init() {
        super.setBackground('taltz_bg_png')
        this.btn_bg = 'close_white_png'
        Util.setTitle('桃子森林')
        this.initTitle()

        // 获取用户信息
        let userInfo = DataManager.getInstance().getUser()
        this.userInfo = userInfo
        this.initAvatar()

        // 获取桃子信息
        let info = RES.getRes('instruction_json')
        this.info = info

        this.getKattle()
    }

    /**
     * 初始化标题
     */
    private initTitle() {
        // 桃子森林group
        let titleGroup = new eui.Group()
        titleGroup.x = 50
        titleGroup.y = 30
        this.addChild(titleGroup)
        // 桃子森林title
        let title = Util.createBitmapByName('title_png')
        titleGroup.addChild(title)
        // 战队月排名
        let rank = Util.createBitmapByName('title_rank_png')
        rank.y = 150
        rank.touchEnabled = true
        // 跳转到战队月排名
        rank.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let rankscene = new RankScene()
            ViewManager.getInstance().changeScene(rankscene)
        }, this)
        titleGroup.addChild(rank)
        // 签到回顾
        let signRecord = Util.createBitmapByName('title_signRecord_png')
        signRecord.y = 250
        signRecord.touchEnabled = true
        // 跳转到签到页面
        signRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let sign = new Sign()
            this.addChildAt(sign, 100)
        }, this)
        titleGroup.addChild(signRecord)
    }

    /**
     * 初始化头像积分
     */
    private initAvatar() {
        let avatarGroup = new eui.Group()
        this.addChild(avatarGroup)
        avatarGroup.touchEnabled = true
        avatarGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let scene = new UserScene()
            ViewManager.getInstance().changeScene(scene)
        }, this)

        // 背景
        let avatar_bg = Util.createBitmapByName('avatar_bg_png')
        avatar_bg.x = this.stage.stageWidth - avatar_bg.width
        avatar_bg.y = 200
        avatarGroup.addChild(avatar_bg)

        // 头像
        Util.setUserImg(this.userInfo.avatar, 108, 476, 205, avatarGroup)

        // 积分文字
        let scoreText = new egret.TextField()
        scoreText.text = '积分'
        scoreText.x = 610
        scoreText.y = 220
        scoreText.size = 40
        avatarGroup.addChild(scoreText)

        // 积分数值
        this.showScore(this.userInfo.score)
    }

    /**
     * 领取水壶动画
     */
    private getKattle() {
        // 每天领取水壶
        if (!this.info.isGetKattle) {
            let group = new eui.Group()
            this.addChild(group)
            // 领取水壶
            let emptyKattle = Util.createBitmapByName('kettle_empty_png')
            emptyKattle.scaleX = 0
            emptyKattle.scaleY = 0
            emptyKattle.x = 350
            emptyKattle.y = 700
            // 设置水壶缩放点为中心
            emptyKattle.anchorOffsetX = emptyKattle.width / 2
            emptyKattle.anchorOffsetY = emptyKattle.height / 2
            egret.Tween.get(emptyKattle)
                .to({ scaleX: 1, scaleY: 1 }, 1000).wait(1000)
                .call(() => {
                    // 水壶晃动动画
                    egret.Tween.get(emptyKattle, { loop: true })
                        .to({ rotation: 10 }, 150)
                        .to({ rotation: -10 }, 150)
                        .to({ rotation: 10 }, 150)
                        .to({ rotation: -10 }, 150)
                        .wait(1000)
                    // 领取水壶提示背景
                    this.showTip(420, 720, '恭喜你获得水壶×1', group)
                })
            emptyKattle.touchEnabled = true
            group.addChild(emptyKattle)

            // 点击领取水壶，提交后台记录信息，浇水天数+1
            emptyKattle.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.removeChild(group) // 删除空水壶

                this.info.isGetKattle = true
                this.info.waterDays++
                // 如果到了5天的整数倍，新长出一颗桃子
                if (this.info.waterDays % 5 == 0) {
                    for (let i = 0; i < this.info.peach.length; i++) {
                        if (!this.info.peach[i].isGrowUp) {
                            this.info.peach[i].isGrowUp = true
                            this.curPeachIndex = i
                            break
                        }
                    }
                }
                this.drawTree()  // 开始画树
                this.kettleAni()  // 开始浇水动画
            }, this)
        } else {
            this.drawTree()
            this.drawPeach()
        }
    }

    /**
     * 画树
     */
    private drawTree() {
        // 树下阴影
        let treeShadow = Util.createBitmapByName('shadow_png')
        treeShadow.y = 1190
        this.addChildAt(treeShadow, 1)

        // 叶子
        let leafArr = [
            { bg: 'peachTree1_png', zIndex: 2 },
            { bg: 'peachTree2_png', zIndex: 5 },
            { bg: 'peachTree3_png', zIndex: 7 },
        ]

        leafArr.forEach(item => {
            let leaf = Util.createBitmapByName(item.bg)
            leaf.x = 0
            leaf.y = 517
            this.addChildAt(leaf, item.zIndex)
        })
    }

    /**
     * 浇水动画
     */
    private kettleAni() {
        let kettleGroup = new eui.Group()
        kettleGroup.alpha = 0
        this.addChild(kettleGroup)
        // 水壶
        let kettle = new MyMovieClip('kettleMovie')
        kettle.x = 380
        kettle.y = 450
        kettleGroup.addChild(kettle)

        // 左上角提示
        let left_tip_bg = Util.createBitmapByName('water_success_png')
        left_tip_bg.x = 70
        left_tip_bg.y = 410
        kettleGroup.addChild(left_tip_bg)
        let left_tip_text = new egret.TextField()
        left_tip_text.text = '提示：浇水成功'
        left_tip_text.width = 200
        left_tip_text.height = left_tip_bg.height
        left_tip_text.x = 140
        left_tip_text.y = 410
        left_tip_text.textAlign = egret.HorizontalAlign.CENTER
        left_tip_text.verticalAlign = egret.VerticalAlign.MIDDLE
        left_tip_text.size = 20
        left_tip_text.textColor = 0x7fc871
        kettleGroup.addChild(left_tip_text)

        // 右下角提示
        let right_tip = new eui.Group()
        kettleGroup.addChild(right_tip)
        this.showTip(390, 1160, '为你的桃树浇水吧', right_tip)

        egret.Tween.get(kettleGroup)
            .to({ alpha: 1 }, 500).wait(2000)
            .to({ alpha: 0 }, 500).call(() => {
                this.drawPeach()
            })
    }

    /**
     * 画桃子
     */
    private drawPeach() {
        let peachArr = [
            { bg: 'peach1_png', x: 580, y: 810, zIndex: 3 },
            { bg: 'peach2_png', x: 245, y: 870, zIndex: 4 },
            { bg: 'peach3_png', x: 360, y: 730, zIndex: 8 },
        ]

        peachArr.forEach((item, i) => {
            let peach = Util.createBitmapByName(item.bg)
            peach.x = item.x
            peach.y = item.y
            this.addChildAt(peach, item.zIndex)

            // 桃子是否显示
            peach.visible = this.info.peach[i].isGrowUp
            if (this.info.peach[i].isGrowUp) {
                this.count++
            }
            // 刚长出来的桃子
            if (this.curPeachIndex == i) {
                peach.scaleX = 0
                peach.scaleY = 0
                egret.Tween.get(peach).to({ scaleX: 1, scaleY: 1 }, 1000)
            }

            peach.touchEnabled = true
            peach.anchorOffsetX = peach.width / 2
            // 桃子晃动动画
            peach.rotation = -this._myRotation
            egret.Tween.get(peach, { loop: true })
                .to({ rotation: this._myRotation }, 1000, egret.Ease.quadInOut)
                .to({ rotation: -this._myRotation }, 1000, egret.Ease.quadInOut)
            // 摘取桃子
            peach.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.Event) => {
                egret.Tween.get(evt.target)
                    .to({ x: 640, y: 310, scaleX: 0.2, scaleY: 0.2, visible: false }, 1500)
                    .call(() => {
                        this.userInfo.score += 15
                        this.showScore(this.userInfo.score)
                        this.showScoreAni()
                        this.count--
                        if (this.count <= 0) {
                            peachText.visible = false
                        }
                    })
            }, this)
        })

        // 摘取你的功夫桃子文字
        let peachText = new eui.Group()
        this.addChild(peachText)
        this.showTip(390, 1160, '摘取你的功夫桃子', peachText)
        if (this.count <= 0) {
            peachText.visible = false
        }
    }

    // 积分
    private showScore(num) {
        if (this.scoreContent) {
            this.removeChild(this.scoreContent)
        }
        this.scoreContent = new egret.TextField()
        this.scoreContent.text = num
        this.scoreContent.x = 610
        this.scoreContent.y = 266
        this.scoreContent.size = 40
        this.addChild(this.scoreContent)
    }

    // 积分增加的动画
    private showScoreAni() {
        let scoreAni = new egret.TextField()
        scoreAni.text = '+15'
        scoreAni.size = 50
        scoreAni.x = 660
        scoreAni.y = 280
        this.addChild(scoreAni)
        let tw = egret.Tween.get(scoreAni)
        tw.to({ y: 240, alpha: 0 }, 500)
    }

    // 显示提示
    private showTip(x, y, text, group) {
        let tipBg = Util.createBitmapByName('tip_bg_png')
        tipBg.x = x
        tipBg.y = y
        group.addChild(tipBg)
        // 文字
        let tipText = new egret.TextField()
        tipText.text = text
        tipText.width = tipBg.width
        tipText.height = tipBg.height
        tipText.textAlign = egret.HorizontalAlign.CENTER
        tipText.verticalAlign = egret.VerticalAlign.MIDDLE
        tipText.x = x
        tipText.y = y
        tipText.size = 26
        group.addChild(tipText)
    }
}
