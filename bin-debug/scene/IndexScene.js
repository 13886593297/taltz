var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * 首页界面
 */
var IndexScene = (function (_super) {
    __extends(IndexScene, _super);
    function IndexScene() {
        return _super.call(this) || this;
    }
    IndexScene.prototype.init = function () {
        var _this = this;
        this.close_btn = false;
        _super.prototype.setBackground.call(this);
        // 获取用户信息
        Http.getInstance().post(Url.HTTP_USER_INFO, "", function (data) {
            DataManager.getInstance().setUser(data.data);
            Util.setTitle("净阶战队-" + data.data.teamName);
            var user = new UserInfo('home');
            user.touchEnabled = true;
            user.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var scene = new UserScene();
                ViewManager.getInstance().changeScene(scene);
            }, _this);
            _this.userView = user;
            _this.addChild(user);
            _this.createLayout();
        });
        //预加载排行榜
        Http.getInstance().post(Url.HTTP_PERSON_RANK_LIST, { page: 1, size: 20 }, function (json) {
        });
    };
    IndexScene.prototype.createLayout = function () {
        var _this = this;
        // 选项按钮
        var models = [
            { bg: 'model_bg_1_png', y: 550, key: 1 },
            { bg: 'model_bg_2_png', y: 690, key: 2 },
            { bg: 'model_bg_3_png', y: 830, key: 3 },
            { bg: 'model_bg_4_png', y: 970, key: 4 },
        ];
        var grayFilter = Util.grayFliter();
        for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
            var model = models_1[_i];
            var bg = Util.createBitmapByName(model.bg);
            if (model.key == 3)
                bg.filters = [grayFilter];
            bg.x = (this.stage.stageWidth - bg.width) / 2;
            bg.y = model.y;
            this.addChild(bg);
            bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch(model.key), this);
            bg.touchEnabled = true;
        }
        // 底部通知消息
        Http.getInstance().post(Url.HTTP_NOTICE, {}, function (data) {
            var notice = new Notice(data.data);
            notice.y = 1120;
            _this.addChild(notice);
            notice.touchEnabled = true;
            notice.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                //跳转规则界面
                var scene = new RuleScene();
                ViewManager.getInstance().changeScene(scene);
            }, _this);
        });
        // 初始化游戏数据
        Http.getInstance().post(Url.HTTP_GAME_INIT, "", function (json) {
            var curDate = new Date();
            var week = curDate.getDay();
            if (json.data.isNeedSign) {
                if (week == 6 || week == 0) {
                    Http.getInstance().post(Url.HTTP_SIGN, {}, function (data) { });
                }
                else {
                    _this.showSignInIcon();
                }
            }
            if (!DataManager.getInstance().hasShowSignIn) {
                Http.getInstance().post(Url.HTTP_SIGNINFO, {}, function (data) {
                    DataManager.getInstance().setSign(data.data);
                    //需要签到
                    //更新用户数据
                    Http.getInstance().post(Url.HTTP_USER_BASE_INFO, "", function (info) {
                        DataManager.getInstance().updateUserInfo(info.data);
                        _this.userView.refresh();
                    });
                    var sign = new Sign();
                    _this.addChildAt(sign, 100);
                    _this.sign = sign;
                    sign.addEventListener(eui.UIEvent.CLOSING, function () {
                        _this.sign = null;
                        if (json.data.isNeedSign) {
                            _this.showDailyTasks();
                        }
                    }, _this);
                    var timer = new egret.Timer(5000, 1);
                    //注册事件侦听器
                    timer.addEventListener(egret.TimerEvent.TIMER, function () {
                        if (_this.sign) {
                            _this.removeChild(_this.sign);
                            if (json.data.isNeedSign) {
                                _this.showDailyTasks();
                            }
                        }
                    }, _this);
                    //开始计时
                    timer.start();
                });
                DataManager.getInstance().hasShowSignIn = true;
            }
        });
        var url = window.location.href.split('#')[0];
        Http.getInstance().post(Url.HTTP_JSSDK_CONFIG, { showurl: url }, function (json) {
            configSdk(json.data);
            setTimeout(function () {
                Util.registerShare(null, ShareType.NORMAL);
            }, 1000);
        });
    };
    IndexScene.prototype.showSignInIcon = function () {
        var icon = new SignInIcon();
        icon.x = -260;
        icon.y = 530;
        this.addChild(icon);
    };
    IndexScene.prototype.showDailyTasks = function () {
        var curDate = new Date();
        var week = curDate.getDay();
        // week = 6
        var dialogContainer;
        var ctr;
        switch (week) {
            case 1:
            case 3:
                ctr = new DailyTasks13();
                dialogContainer = new DialogContainer(ctr);
                this.addChildAt(dialogContainer, 99);
                break;
            case 2:
            case 4:
                ctr = new DailyTasks24();
                dialogContainer = new DialogContainer(ctr);
                this.addChildAt(dialogContainer, 99);
                break;
            case 5:
                ctr = new DailyTasks5();
                dialogContainer = new DialogContainer(ctr);
                this.addChildAt(dialogContainer, 99);
                break;
        }
    };
    // 页面跳转
    IndexScene.prototype.onTouch = function (key) {
        var _this = this;
        return function () {
            Util.playMusic('model_select_mp3');
            switch (key) {
                case 1:
                    var scene = new TrainScene();
                    ViewManager.getInstance().changeScene(scene);
                    break;
                case 2:
                    var rankscene = new RankScene();
                    ViewManager.getInstance().changeScene(rankscene);
                    break;
                case 3:
                    var alert_1 = new AlertPanel("该功能暂未开放", 1120);
                    _this.addChild(alert_1);
                    break;
                case 4:
                    var escene = new EquipmentScene();
                    ViewManager.getInstance().changeScene(escene);
                    break;
            }
        };
    };
    /**
     * 更新页面信息
     */
    IndexScene.prototype.updateScene = function () {
        this.userView.refresh();
        Util.setTitle("净阶战队-" + DataManager.getInstance().getUser()['teamName']);
    };
    return IndexScene;
}(Scene));
__reflect(IndexScene.prototype, "IndexScene");
