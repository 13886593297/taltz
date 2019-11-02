/**
 * 按钮组件
 */
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
var ButtonType;
(function (ButtonType) {
    ButtonType[ButtonType["NOMAL"] = 1] = "NOMAL";
    ButtonType[ButtonType["YELLOW"] = 2] = "YELLOW";
})(ButtonType || (ButtonType = {}));
var XButton = (function (_super) {
    __extends(XButton, _super);
    function XButton(name, type) {
        if (type === void 0) { type = ButtonType.NOMAL; }
        var _this = _super.call(this) || this;
        _this.yellowSkin = "<e:Skin class=\"skins.ButtonSkin\"  states=\"up,down,disabled\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" height=\"79\">\n    <e:Image width=\"310\" height=\"108\" alpha.disabled=\"0.5\" fillMode=\"scale\" source=\"button_submit_bg_png\"/>\n    <e:Label id=\"labelDisplay\" x=\"110\" size=\"42\" textColor=\"0xFFFFFF\" verticalAlign=\"middle\" textAlign=\"center\" width=\"200\" height=\"100\" fontFamily=\"SimHei\" anchorOffsetX=\"0\" anchorOffsetY=\"0\"/>\n    <e:Image id=\"iconDisplay\" horizontalCenter=\"-124\" verticalCenter=\"-11.5\" width=\"24\" height=\"24\"/>\n</e:Skin>";
        switch (type) {
            case ButtonType.NOMAL:
                _this.skinName = "resource/eui_skins/Button.exml";
                break;
            case ButtonType.YELLOW:
                _this.skinName = _this.yellowSkin;
                break;
        }
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, function () {
            var glowFilter = Util.getLightFliter(0xff0000);
            _this.iconDisplay.filters = [glowFilter];
        }, _this);
        _this.labelDisplay.text = name;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Util.playMusic('model_select_mp3');
        }, _this);
        return _this;
    }
    XButton.prototype.setType = function (type) {
        switch (type) {
            case ButtonType.NOMAL:
                this.skinName = "resource/eui_skins/Button.exml";
                break;
            case ButtonType.YELLOW:
                this.skinName = this.yellowSkin;
                break;
        }
    };
    return XButton;
}(eui.Button));
__reflect(XButton.prototype, "XButton");
