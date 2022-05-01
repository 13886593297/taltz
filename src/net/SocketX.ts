class SocketX {

    private static instance: SocketX
    private socket
    private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJpYXQiOjE1NDgzMDU4NjEsImV4cCI6MTU0ODM5MjI2MX0.yYz1cwYudv5yMo_r90n6gYRW-wv5PJvFxrrHGYnZ2KE'

    private isconnect = false
    private lastMatch = 0


    private constructor() {}

    public callbacks = {}

    public close() {
        if (this.socket && this.socket.connect) {
            // console.log(this.socket.connect)
            this.socket.close()
            //清空之前的监听事件
            this.callbacks = []
            this.isconnect = false
            this.socket = null
        }

    }

    public connect(type = PKTYPE.PERSON) {
        // console.log('调用connect接口')
        if (this.socket && this.socket.connect) return
        ViewManager.getInstance().showLoading('数据加载中...')
        
        let host = Util.getHost()

        let url = host + '/proom'
        if (type == PKTYPE.TEAM) url = host + '/troom'

        let socket = connectSocket(url)
        // console.log('开始连接websocket:', url)
        this.socket = socket
        socket.on(NetEvent.ON_CONNENT, () => {
            this.isconnect = true
            // console.log('链接成功！')
            let token = localStorage.getItem('token')
            if (Config.DEBUG) {
                token = this.token
            }
            this.sendMsg(NetEvent.PK_OAUTH, { token: token })
        })
        //授权完成才会关闭
        // socket.on(NetEvent.PK_OAUTH, (data) => {
        //  console.log(NetEvent.PK_OAUTH, '授权用户确定')
        //     ViewManager.getInstance().hideLoading()
        // })
        this.addEventListener(NetEvent.PK_OAUTH,(data)=>{
             ViewManager.getInstance().hideLoading()
        },this,'socket')

        this.addEventListener(NetEvent.RE_CONNENT, () => {
            //    if(this.isconnect)  ViewManager.getInstance().hideLoading()
        }, this)
        this.addEventListener(NetEvent.DIS_CONNENT, () => {
            // if(this.isconnect) ViewManager.getInstance().showLoading('哦噢,断线了，正在努力恢复中！')
        }, this)


    }



    /**
     * 个人pk
     */
    public connectPersonPk() {
        this.connect(PKTYPE.PERSON)
        this.addEventListener(NetEvent.PK_MATCH, this.onMatch, this)
        this.addEventListener(NetEvent.PK_END, this.pkEnd, this)
        let lastTime = 0
        this.addEventListener(NetEvent.PK_START, (data) => {
            let cur = +new Date()
            if (cur - lastTime > 2000) {
                DataManager.getInstance().setPkstart(data.data)
                let scene = new BattleScene()
                ViewManager.getInstance().changeScene(scene)
                lastTime = cur
            }
        }, this)
    }


    /**
     * 团队pk
     */
    public connectTeamPk() {
        this.connect(PKTYPE.TEAM)
        this.socket.on(NetEvent.TEAM_JOIN_BROADCAST, (data) => {
            //TODO 更新roomlist
        })
    }


    /**
   * 结束跳转结果页面
   */
    public pkEnd(data) {
        let pkData = DataManager.getInstance().getPkData()
        if (!pkData.pkCode) {
          //  console.log("已清除不需要跳转结果页面")
            return
        }
        if (data.data.tipsCode > 0) {
            if (data.data.tipsCode == InviteStatus.WATTING) {
                let pk = new PkInviteScene(InviteStatus.WATTING)
                ViewManager.getInstance().changeScene(pk)
            } else {
                let pk = new PkInviteScene(InviteStatus.PK_ERR_MSG, data.data.tipsMsg)
                ViewManager.getInstance().changeScene(pk)
            }
        } else {
            DataManager.getInstance().setPkResult(data.data)
            let result = DataManager.getInstance().getPkResult()
            let pk = new PkResultScene(result, PkResultBackModel.BACK_PK)
            ViewManager.getInstance().changeScene(pk)
            //更新用户数据
            Http.getInstance().post(Url.HTTP_USER_BASE_INFO, "", (info) => {
                DataManager.getInstance().updateUserInfo(info.data)
            })
        }
    }

    //匹配成功！
    private onMatch(data) {
      //  console.log('onMatch', data)
        let cur = +new Date()
        if (cur - this.lastMatch > 2000) {
            DataManager.getInstance().setPk(data.data)
            let scene = new PkInviteScene(InviteStatus.MATCHEND)
            ViewManager.getInstance().changeScene(scene)
            this.lastMatch = cur
        }

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SocketX()
        }
        return this.instance
    }


    public addEventListener(event: string, fn: Function, thisObject: any = null, multFlag = null) {
        let isregister = false
        let key = event
        if (multFlag) key = multFlag + '_' + event

        if (this.callbacks[key]) {
            isregister = true
        }
        this.callbacks[event] = (data) => {
          //  console.log(event, data)
            if (data && data.code > 0) {
                // let alert = new AlertPanel(data.msg)
                // ViewManager.getInstance().getCurrentScene().addChildAt(alert,200)
                return showAlertButton(data.msg, '返回竞技场目录', () => {
                    ViewManager.getInstance().backByName('pklist')
                })
                // return
            }
            if (thisObject) fn.bind(thisObject)(data)
            else fn(data)
        }
        //只注册一次监听事件
        if (isregister) return
        // console.log('register listener event: ' + event)
        this.socket.on(event, (data) => {
            if (this.callbacks[event]) {
                this.callbacks[event](data)
            }
        })
    }


    public sendMsg(key: string, msg: any) {
      //  console.log('sendMsg', { key, msg })
        this.socket.emit(key, msg)
    }


    public removeEventListener(event: string) {
        this.callbacks[event] = null
    }
}


