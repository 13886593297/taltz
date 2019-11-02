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
        Http.getInstance().post(Url.HTTP_USER_INFO, "", function (data) {
            DataManager.getInstance().setUser(data.data);
            Util.setTitle("艾乐明-" + data.data.teamName);
            var user = new UserInfo('home');
            user.touchEnabled = true;
            user.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var scene = new UserScene();
                ViewManager.getInstance().changeScene(scene);
            }, _this);
            user.y = 20;
            _this.userView = user;
            _this.addChild(user);
            _this.createLayout();
        });
    };
    IndexScene.prototype.createLayout = function () {
        var _this = this;
        // 选项按钮
        var models = [
            { bg: 'model_bg_1_png', y: 580, key: 1 },
            { bg: 'model_bg_2_png', y: 730, key: 2 },
            { bg: 'model_bg_3_png', y: 880, key: 3 },
            { bg: 'model_bg_4_png', y: 1030, key: 4 },
        ];
        var grayFilter = Util.grayFliter();
        for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
            var model = models_1[_i];
            var bg = Util.createBitmapByName(model.bg);
            if (model.key == 3)
                bg.filters = [grayFilter];
            bg.x = this.stage.stageWidth / 2;
            bg.anchorOffsetX = bg.width / 2;
            bg.y = model.y;
            this.addChild(bg);
            bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch(model.key), this);
            bg.touchEnabled = true;
        }
        // 底部通知消息
        Http.getInstance().post(Url.HTTP_NOTICE, {}, function (data) {
            var notice = new Notice(data.data);
            notice.y = 1200;
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
            Http.getInstance().post(Url.HTTP_SIGN, {}, function (data) {
                DataManager.getInstance().setSign(data.data);
                //需要签到
                if (json.data.isNeedSign) {
                    _this.signFalg = false;
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
                        if (!_this.signFalg) {
                            var scene = new PeachTree();
                            ViewManager.getInstance().changeScene(scene);
                        }
                    }, _this);
                    var timer = new egret.Timer(5000, 1);
                    //注册事件侦听器
                    timer.addEventListener(egret.TimerEvent.TIMER, function () {
                        _this.signFalg = true;
                        if (_this.sign) {
                            _this.removeChild(_this.sign);
                            var scene = new PeachTree();
                            ViewManager.getInstance().changeScene(scene);
                        }
                    }, _this);
                    //开始计时
                    timer.start();
                }
            });
        });
        var url = window.location.href.split('#')[0];
        Http.getInstance().post(Url.HTTP_JSSDK_CONFIG, { showurl: url }, function (json) {
            configSdk(json.data);
            setTimeout(function () {
                Util.registerShare(null, ShareType.NORMAL);
            }, 1000);
        });
    };
    // 页面跳转
    IndexScene.prototype.onTouch = function (key) {
        var _this = this;
        return function (e) {
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
                    var alert_1 = new AlertPanel("该功能暂未开放", 1200);
                    _this.addChild(alert_1);
                    // let pk = new PkListScene()
                    // ViewManager.getInstance().changeScene(pk)
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
        Util.setTitle("艾乐明-" + DataManager.getInstance().getUser()['teamName']);
    };
    IndexScene.prototype.onLoadComplete = function (font) {
        this._bitmapText = new egret.BitmapText();
        this._bitmapText.font = font;
        /*** 本示例关键代码段结束 ***/
        this._bitmapText.x = 50;
        this._bitmapText.y = 200;
        this._bitmapText.text = "每日战队排行表彰 训练场";
        this.addChild(this._bitmapText);
    };
    return IndexScene;
}(Scene));
__reflect(IndexScene.prototype, "IndexScene");