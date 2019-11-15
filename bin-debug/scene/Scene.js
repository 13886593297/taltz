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
var Scene = (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        var _this = _super.call(this) || this;
        _this.isRemove = true;
        _this.close_btn = 'close_png'; // 关闭按钮
        _this.isnSpecialReturn = false;
        _this.isBackHome = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.initScene, _this);
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.release, _this);
        return _this;
    }
    Scene.prototype.initScene = function () {
        if (this.isRemove) {
            this.init();
            this.isRemove = false;
            if (this.close_btn != false) {
                this.crteateNavButton(this.close_btn);
            }
        }
    };
    Scene.prototype.crteateNavButton = function (bg) {
        var _this = this;
        var nav_bg = Util.createBitmapByName(bg);
        nav_bg.x = this.stage.stageWidth - 90;
        nav_bg.y = 40;
        this.addChild(nav_bg);
        nav_bg.touchEnabled = true;
        nav_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            hideIFrame();
            if (_this.isBackHome) {
                ViewManager.getInstance().jumpHome();
            }
            else {
                _this.onBack();
            }
        }, this);
    };
    Scene.prototype.setBackground = function (bg) {
        if (bg === void 0) { bg = "bg_png"; }
        var sky = Util.createBitmapByName(bg);
        this.addChildAt(sky, -2);
        sky.width = this.stage.stageWidth;
        sky.height = this.stage.stageHeight;
    };
    /**
     * 更新页面信息
     */
    Scene.prototype.updateScene = function () {
    };
    /**
     * 初始化界面
     */
    Scene.prototype.init = function () {
    };
    Scene.prototype.onBack = function () {
        ViewManager.getInstance().back();
    };
    /**
     * 释放界面
     */
    Scene.prototype.release = function () {
    };
    /**
     * 退出页面，需要加载动画
     */
    Scene.prototype.remove = function () {
        // 切换动画
        this.removeChildren();
        this.parent.removeChild(this);
        this.isRemove = true;
    };
    return Scene;
}(eui.UILayer));
__reflect(Scene.prototype, "Scene");
