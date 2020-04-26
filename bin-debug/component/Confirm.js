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
        text.text = this.text;
        text.width = stage.stageWidth;
        text.textAlign = 'center';
        text.lineSpacing = 10;
        text.y = 50;
        text.size = 40;
        this.addChild(text);
        // 确认按钮
        var confirmButton = new CustomButton('pk_list_text_bg_png', this.leftButtonText, function () {
            var event = new ConfirmEvent(ConfirmEvent.CONFIRM_BUTTON_YES);
            _this.dispatchEvent(event);
            _this.parent.removeChild(_this);
        });
        confirmButton.x = stage.stageWidth / 2 - confirmButton.width - 10;
        confirmButton.y = 200;
        this.addChild(confirmButton);
        // 取消按钮
        var cancelButton = new CustomButton('pk_list_text_bg_png', this.rightButtonText, function () {
            var event = new ConfirmEvent(ConfirmEvent.CONFIRM_BUTTON_NO);
            _this.dispatchEvent(event);
            _this.parent.removeChild(_this);
        });
        cancelButton.x = stage.stageWidth / 2 + 10;
        cancelButton.y = confirmButton.y;
        this.addChild(cancelButton);
    };
    return Confirm;
}(eui.Group));
__reflect(Confirm.prototype, "Confirm");
var CustomButton = (function (_super) {
    __extends(CustomButton, _super);
    function CustomButton(bg, text, fn) {
        var _this = _super.call(this) || this;
        var btn_bg = Util.createBitmapByName(bg);
        _this.width = btn_bg.width;
        _this.height = btn_bg.height;
        _this.addChild(btn_bg);
        var content = new egret.TextField;
        content.text = text;
        content.width = btn_bg.width;
        content.height = btn_bg.height - 10;
        content.textAlign = 'center';
        content.verticalAlign = 'middle';
        _this.addChild(content);
        _this.touchEnabled = true;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, fn, _this);
        return _this;
    }
    return CustomButton;
}(eui.Group));
__reflect(CustomButton.prototype, "CustomButton");
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
