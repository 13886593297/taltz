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
        this.name = 'home' 

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
        Http.getInstance().post(Url.HTTP_PERSON_RANK_LIST, { page: 1, size: 20 }, () => {})

    }

    private createLayout() {
        // 选项按钮
        let models = [
            { bg: 'model_bg_1_png', y: 550, key: 1 },
            { bg: 'model_bg_2_png', y: 690, key: 2 },
            { bg: 'model_bg_3_png', y: 830, key: 3 },
            { bg: 'model_bg_4_png', y: 970, key: 4 },
        ]
        
        for (let model of models) {
            let bg: egret.Bitmap = Util.createBitmapByName(model.bg)
            
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
            Http.getInstance().post(Url.HTTP_SIGN)
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
                    }, this)
                    var timer: egret.Timer = new egret.Timer(5000, 1)
                    //注册事件侦听器
                    timer.addEventListener(egret.TimerEvent.TIMER, () => {
                        if (this.sign) {
                            this.removeChild(this.sign)
                        }
                    }, this)
                    // 开始计时
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
                    let pk = new PkListScene()
                    ViewManager.getInstance().changeScene(pk)
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