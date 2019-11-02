var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SocketX = (function () {
    function SocketX() {
        // let socket = io(Config.HOST + ':' + Config.PORT);
        // this.socket = socket;
        // this.addEventListener(NetEvent.ON_CONNENT,this.onConnect,this);
        // this.addEventListener('name', (data) => {
        //     console.log('name event lister', data);
        // })
        this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJpYXQiOjE1NDgzMDU4NjEsImV4cCI6MTU0ODM5MjI2MX0.yYz1cwYudv5yMo_r90n6gYRW-wv5PJvFxrrHGYnZ2KE';
        this.isconnect = false;
        this.lastMatch = 0;
        this.callbacks = {};
    }
    SocketX.prototype.close = function () {
        if (this.socket && this.socket.connect) {
            console.log(this.socket.connect);
            this.socket.close();
            //清空值钱的监听事件
            this.callbacks = [];
            this.isconnect = false;
            this.socket = null;
        }
    };
    SocketX.prototype.connect = function (type) {
        var _this = this;
        if (type === void 0) { type = PKTYPE.PERSON; }
        console.log('调用connect接口');
        if (this.socket && this.socket.connect)
            return;
        ViewManager.getInstance().showLoading('数据加载中...');
        //
        var host = Config.DEBUG ? 'http://xujiagui.vicp.cc:12631' : Util.getHost(); //Util.getConfig('host');//
        var url = host + '/proom';
        if (type == PKTYPE.TEAM)
            url = host + '/troom';
        var socket = connectSocket(url); //Url.HTTP_PK_SOCKET  
        console.log('开始连接websocket:', url);
        this.socket = socket;
        socket.on(NetEvent.ON_CONNENT, function () {
            _this.isconnect = true;
            console.log('链接成功！');
            var token = localStorage.getItem('token');
            if (Config.DEBUG) {
                token = _this.token;
            }
            _this.sendMsg(NetEvent.PK_OAUTH, { token: token });
        });
        //授权完成才会关闭
        // socket.on(NetEvent.PK_OAUTH, (data) => {
        //     console.log(NetEvent.PK_OAUTH, '授权用户确定');
        //     ViewManager.getInstance().hideLoading();
        // });
        this.addEventListener(NetEvent.PK_OAUTH, function (data) {
            ViewManager.getInstance().hideLoading();
        }, this, 'socket');
        this.addEventListener(NetEvent.RE_CONNENT, function () {
            //    if(this.isconnect)  ViewManager.getInstance().hideLoading();
        }, this);
        this.addEventListener(NetEvent.DIS_CONNENT, function () {
            // if(this.isconnect) ViewManager.getInstance().showLoading('哦噢,断线了，正在努力恢复中！');
        }, this);
    };
    /**
     * 个人pk
     */
    SocketX.prototype.connectPersonPk = function () {
        this.connect(PKTYPE.PERSON);
        this.addEventListener(NetEvent.PK_MATCH, this.onMatch, this);
        this.addEventListener(NetEvent.PK_END, this.pkEnd, this);
        var lastTime = 0;
        this.addEventListener(NetEvent.PK_START, function (data) {
            var cur = +new Date();
            if (cur - lastTime > 2000) {
                DataManager.getInstance().setPkstart(data.data);
                var scene = new BattleScene();
                ViewManager.getInstance().changeScene(scene);
                lastTime = cur;
            }
        }, this);
    };
    /**
     * 团队pk
     */
    SocketX.prototype.connectTeamPk = function () {
        this.connect(PKTYPE.TEAM);
        this.socket.on(NetEvent.TEAM_JOIN_BROADCAST, function (data) {
            //TODO 更新roomlist
        });
    };
    /**
   * 结束跳转结果页面
   */
    SocketX.prototype.pkEnd = function (data) {
        var pkData = DataManager.getInstance().getPkData();
        if (!pkData.pkCode) {
            console.log("已清除不需要跳转结果页面");
            return;
        }
        if (data.data.tipsCode > 0) {
            if (data.data.tipsCode == InviteStatus.WATTING) {
                var pk = new PkInviteScene(InviteStatus.WATTING);
                ViewManager.getInstance().changeScene(pk);
            }
            else {
                var pk = new PkInviteScene(InviteStatus.PK_ERR_MSG, data.data.tipsMsg);
                ViewManager.getInstance().changeScene(pk);
            }
        }
        else {
            DataManager.getInstance().setPkResult(data.data);
            var result = DataManager.getInstance().getPkResult();
            var pk = new PkResultScene(result, PkResultBackModel.BACK_PK);
            ViewManager.getInstance().changeScene(pk);
            //更新用户数据
            Http.getInstance().post(Url.HTTP_USER_BASE_INFO, "", function (info) {
                DataManager.getInstance().updateUserInfo(info.data);
            });
        }
    };
    //匹配成功！
    SocketX.prototype.onMatch = function (data) {
        console.log('onMatch', data);
        var cur = +new Date();
        if (cur - this.lastMatch > 2000) {
            DataManager.getInstance().setPk(data.data);
            var scene = new PkInviteScene(InviteStatus.MATCHEND);
            ViewManager.getInstance().changeScene(scene);
            this.lastMatch = cur;
        }
    };
    SocketX.getInstance = function () {
        if (!this.instance) {
            this.instance = new SocketX();
        }
        return this.instance;
    };
    SocketX.prototype.addEventListener = function (event, fn, thisObject, multFlag) {
        var _this = this;
        if (thisObject === void 0) { thisObject = null; }
        if (multFlag === void 0) { multFlag = null; }
        // if (thisObject == null) {
        //     this.socket.on(event, fn)
        //     // this.socket.addEventListener(event, fn);
        // } else {
        //     this.socket.on(event, fn.bind(thisObject))
        //     // this.socket.addEventListener(event, fn.bind(thisObject));
        // }
        var isregister = false;
        var key = event;
        if (multFlag)
            key = multFlag + '_' + event;
        if (this.callbacks[key]) {
            isregister = true;
        }
        this.callbacks[event] = function (data) {
            console.log(event, data);
            if (data && data.code > 0) {
                // let alert = new AlertPanel(data.msg)
                // ViewManager.getInstance().getCurrentScene().addChildAt(alert,200);
                return showAlertButton(data.msg, '返回竞技场目录', function () {
                    ViewManager.getInstance().backByName('pklist');
                });
                // return;
            }
            if (thisObject)
                fn.bind(thisObject)(data);
            else
                fn(data);
        };
        //只注册一次监听事件
        if (isregister)
            return;
        console.log('register listener event: ' + event);
        this.socket.on(event, function (data) {
            if (_this.callbacks[event]) {
                _this.callbacks[event](data);
            }
        });
    };
    SocketX.prototype.sendMsg = function (key, msg) {
        console.log('sendMsg', { key: key, msg: msg });
        this.socket.emit(key, msg);
    };
    SocketX.prototype.removeEventListener = function (event) {
        this.callbacks[event] = null;
    };
    return SocketX;
}());
__reflect(SocketX.prototype, "SocketX");
