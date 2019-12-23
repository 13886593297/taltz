/**
 * 页面控制器
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ViewManager = (function () {
    function ViewManager() {
        this.views = [];
        /**
         * 正在加载页面
         */
        this.isLoading = false;
    }
    ;
    ViewManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new ViewManager();
        }
        return this.instance;
    };
    /**
     * 获取当前的页面
     */
    ViewManager.prototype.getCurrentScene = function () {
        var length = this.views.length;
        if (length === 0)
            return null;
        return this.views[length - 1];
    };
    //连续切换场景
    ViewManager.prototype.changeScene = function (newScene) {
        var _this = this;
        if (!newScene) {
            //TODO 
            console.error("场景不能为空！");
            return;
        }
        if (this.isLoading) {
            return;
        }
        var oldScene = this.getCurrentScene();
        //加载动画,
        if (oldScene) {
            this.isLoading = true;
            // TODO 
            var tw = egret.Tween.get(oldScene);
            tw.to({ "alpha": 1 }, 10);
            tw.wait(10);
            tw.to({ "alpha": 0 }, 100);
            tw.call(function () {
                //加载完动画remove
                oldScene.parent.removeChild(oldScene);
                //添加场景
                _this.stage.addChild(newScene);
                _this.views.push(newScene);
                _this.isLoading = false;
            }, this);
        }
        else {
            this.stage.addChild(newScene);
            this.views.push(newScene);
            this.isLoading = false;
        }
    };
    /**
     * 跳转首页
     */
    ViewManager.prototype.jumpHome = function () {
        var oldScene = this.getCurrentScene();
        oldScene.parent.removeChild(oldScene);
        var home = this.views[0];
        if (home.name == 'home') {
            home.updateScene();
            this.views = [home];
            this.stage.addChild(home);
            var tw = egret.Tween.get(home);
            tw.to({ "alpha": 1 }, 100);
        }
        else {
            this.views = [];
            home = new IndexScene();
            this.stage.addChild(home);
            this.views.push(home);
        }
    };
    ViewManager.prototype.back = function (len) {
        var _this = this;
        if (len === void 0) { len = 1; }
        var length = this.views.length;
        if (length > len) {
            var oldScene_1 = this.views[length - 1];
            var newScene_1 = this.views[length - len - 1];
            var tw = egret.Tween.get(oldScene_1);
            tw.to({ "alpha": 0 }, 100);
            tw.wait(50);
            // tw.to({ "alpha": 0 }, 100);
            tw.call(function () {
                //加载完动画remove
                oldScene_1.parent.removeChild(oldScene_1);
                //添加场景
                _this.stage.addChild(newScene_1);
                newScene_1.updateScene();
                var tw = egret.Tween.get(newScene_1);
                tw.to({ "alpha": 1 }, 100);
                for (var k = 0; k < len; k++) {
                    _this.views.pop();
                }
            }, this);
        }
    };
    /**
     * 返回特定界面
     */
    ViewManager.prototype.backByName = function (name) {
        var index = -1;
        for (var key in this.views) {
            var scene = this.views[key];
            if (scene.name == name) {
                index = key;
                break;
            }
        }
        var length = this.views.length;
        var oldScene = this.views[length - 1];
        oldScene.parent.removeChild(oldScene);
        if (index > -1) {
            var newScene = this.views[index];
            var tw = egret.Tween.get(newScene);
            tw.to({ "alpha": 1 }, 100);
            this.stage.addChild(newScene);
            newScene.updateScene();
            this.views = this.views.slice(0, index);
            this.views.push(newScene);
        }
        else {
            this.views = [];
            var newScene = void 0;
            switch (name) {
                case 'pkmodel':
                    var type = 1;
                    var curModel = DataManager.getInstance().getPkModel();
                    if (curModel == PkModel.KNOW || curModel == PkModel.ANSWER)
                        type = 2;
                    newScene = new PkModelScene(type);
                    break;
                default:
                    newScene = new PkListScene();
                    break;
            }
            this.stage.addChild(newScene);
            this.views.push(newScene);
        }
    };
    ViewManager.prototype.showLoading = function (text) {
        if (this.loadingView) {
            this.loadingView.setText(text);
        }
        else {
            var loading = new AlertLoading(text);
            this.loadingView = loading;
            this.stage.addChild(loading);
        }
    };
    ViewManager.prototype.hideLoading = function () {
        if (this.loadingView) {
            this.stage.removeChild(this.loadingView);
            this.loadingView = null;
        }
    };
    return ViewManager;
}());
__reflect(ViewManager.prototype, "ViewManager");
