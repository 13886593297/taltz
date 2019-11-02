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
var Confirm = (function (_super) {
    __extends(Confirm, _super);
    function Confirm(text, leftButtonText, rightButtonText) {
        if (leftButtonText === void 0) { leftButtonText = "确认"; }
        if (rightButtonText === void 0) { rightButtonText = "取消"; }
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.leftButtonText = leftButtonText;
        _this.rightButtonText = rightButtonText;
        _this.init();
        return _this;
    }
    Confirm.prototype.init = function () {
        var _this = this;
        var stage = ViewManager.getInstance().stage;
        //背景
        var mask = Util.createBitmapByName('mask_png');
        mask.y = 0;
        mask.x = 0;
        mask.alpha = 0.5;
        mask.width = stage.stageWidth;
        mask.height = stage.stageHeight;
        this.addChild(mask);
        // 文字
        var text = new egret.TextField();
        this.addChild(text);
        text.width = 700;
        text.x = stage.stageWidth / 2 - 350;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.size = 32;
        text.bold = true;
        text.text = this.text;
        text.lineSpacing = 20;
        text.y = stage.stageHeight / 2 - 100;
        var buttonY = stage.stageHeight / 2 + text.textHeight;
        var ConfirmButton = new XButton(this.leftButtonText);
        ConfirmButton.width = 330;
        ConfirmButton.x = stage.stageWidth / 2 - 345;
        ConfirmButton.y = buttonY;
        this.addChild(ConfirmButton);
        ConfirmButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var event = new ConfirmEvent(ConfirmEvent.CONFIRM_BUTTON_YES);
            _this.dispatchEvent(event);
            _this.parent.removeChild(_this);
        }, this);
        var CancelButton = new XButton(this.rightButtonText);
        CancelButton.width = 330;
        CancelButton.x = stage.stageWidth / 2 + 15;
        CancelButton.y = buttonY;
        this.addChild(CancelButton);
        CancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var event = new ConfirmEvent(ConfirmEvent.CONFIRM_BUTTON_NO);
            _this.dispatchEvent(event);
            _this.parent.removeChild(_this);
        }, this);
    };
    return Confirm;
}(eui.Group));
__reflect(Confirm.prototype, "Confirm");
var ConfirmEvent = (function (_super) {
    __extends(ConfirmEvent, _super);
    function ConfirmEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        return _super.call(this, type, bubbles, cancelable) || this;
    }
    ConfirmEvent.CONFIRM_BUTTON_YES = "CONFIRM_BUTTON_YES";
    ConfirmEvent.CONFIRM_BUTTON_NO = "CONFIRM_BUTTON_NO";
    return ConfirmEvent;
}(egret.Event));
__reflect(ConfirmEvent.prototype, "ConfirmEvent");
