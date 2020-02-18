/**
 * 首页界面
 */
class IndexScene extends Scene {
    private sign
    private userView
    public constructor() {
        super()
    }

    public init() {
        this.close_btn = false
        super.setBackground()

        // 获取用户信息
        Http.getInstance().post(Url.HTTP_USER_INFO, "", data => {
            DataManager.getInstance().setUser(data.data)
            Util.setTitle("净阶战队-" + data.data.teamName)
            let user = new UserInfo('home')
            user.touchEnabled = true
            user.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                let scene = new UserScene()
                ViewManager.getInstance().changeScene(scene)
            }, this)
            this.userView = user
            this.addChild(user)
            this.createLayout()
        })

        //预加载排行榜
        Http.getInstance().post(Url.HTTP_PERSON_RANK_LIST, { page: 1, size: 20 }, (json) => {
        })

    }

    private createLayout() {
        // 选项按钮
        let models = [
            { bg: 'model_bg_1_png', y: 550, key: 1 },
            { bg: 'model_bg_2_png', y: 690, key: 2 },
            { bg: 'model_bg_3_png', y: 830, key: 3 },
            { bg: 'model_bg_4_png', y: 970, key: 4 },
        ]
        let grayFilter = Util.grayFliter()
        for (let model of models) {
            let bg: egret.Bitmap = Util.createBitmapByName(model.bg)
            if (model.key == 3) bg.filters = [grayFilter]
            bg.x = (this.stage.stageWidth - bg.width) / 2
            bg.y = model.y
            this.addChild(bg)
            bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch(model.key), this)
            bg.touchEnabled = true
        }

        // 底部通知消息
        Http.getInstance().post(Url.HTTP_NOTICE, {}, (data) => {
            let notice = new Notice(data.data)
            notice.y = 1120
            this.addChild(notice)
            notice.touchEnabled = true
            notice.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                //跳转规则界面
                let scene = new RuleScene()
                ViewManager.getInstance().changeScene(scene)
            }, this)
        })

        // 初始化游戏数据
        Http.getInstance().post(Url.HTTP_GAME_INIT, "", json => {
            let curDate = new Date();
            let week = curDate.getDay();
            if (json.data.isNeedSign) {
                if (week == 6 || week == 0) {
                    Http.getInstance().post(Url.HTTP_SIGN, {}, (data) => { });
                } else {
                    this.showSignInIcon()
                }
            }
            if (!DataManager.getInstance().hasShowSignIn) {
                Http.getInstance().post(Url.HTTP_SIGNINFO, {}, data => {
                    DataManager.getInstance().setSign(data.data)
                    //需要签到
                    //更新用户数据
                    Http.getInstance().post(Url.HTTP_USER_BASE_INFO, "", (info) => {
                        DataManager.getInstance().updateUserInfo(info.data)
                        this.userView.refresh()
                    })
                    let sign = new Sign()
                    this.addChildAt(sign, 100)
                    this.sign = sign
                    sign.addEventListener(eui.UIEvent.CLOSING, () => {
                        this.sign = null
                        if (json.data.isNeedSign) {
                            this.showDailyTasks()
                        }
                    }, this)
                    var timer: egret.Timer = new egret.Timer(5000, 1)
                    //注册事件侦听器
                    timer.addEventListener(egret.TimerEvent.TIMER, () => {
                        if (this.sign) {
                            this.removeChild(this.sign)
                            if (json.data.isNeedSign) {
                                this.showDailyTasks()
                            }
                        }
                    }, this)
                    //开始计时
                    timer.start()
                })
                DataManager.getInstance().hasShowSignIn = true
            }
        })

        let url = window.location.href.split('#')[0]
        Http.getInstance().post(Url.HTTP_JSSDK_CONFIG, { showurl: url }, (json) => {
            configSdk(json.data)
            setTimeout(() => {
                Util.registerShare(null, ShareType.NORMAL)
            }, 1000)
        })

    }

    private showSignInIcon() {
        let icon = new SignInIcon()
        icon.x = -260
        icon.y = 530
        this.addChild(icon)
    }

    private showDailyTasks() {
        let curDate = new Date()
        let week = curDate.getDay()
        // week = 6
        let dialogContainer
        let ctr
        switch (week) {
            case 1:
            case 3:
                ctr = new DailyTasks13()
                dialogContainer = new DialogContainer(ctr)
                this.addChildAt(dialogContainer, 99)
                break
            case 2:
            case 4:
                ctr = new DailyTasks24()
                dialogContainer = new DialogContainer(ctr)
                this.addChildAt(dialogContainer, 99)
                break
            case 5:
                ctr = new DailyTasks5()
                dialogContainer = new DialogContainer(ctr)
                this.addChildAt(dialogContainer, 99)
                break
        }
    }

    // 页面跳转
    private onTouch(key) {
        return () => {
            Util.playMusic('model_select_mp3')
            switch (key) {
                case 1:
                    let scene = new TrainScene()
                    ViewManager.getInstance().changeScene(scene)
                    break
                case 2:
                    let rankscene = new RankScene()
                    ViewManager.getInstance().changeScene(rankscene)
                    break
                case 3:
                    let alert = new AlertPanel("该功能暂未开放", 1120)
                    this.addChild(alert)
                    break
                case 4:
                    let escene = new EquipmentScene()
                    ViewManager.getInstance().changeScene(escene)
                    break
            }
        }
    }

    /**
     * 更新页面信息 
     */
    public updateScene() {
        this.userView.refresh()
        Util.setTitle("净阶战队-" + DataManager.getInstance().getUser()['teamName'])
    }
}