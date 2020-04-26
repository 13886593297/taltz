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
var LineInfo = (function (_super) {
    __extends(LineInfo, _super);
    function LineInfo(text) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.init();
        return _this;
    }
    LineInfo.prototype.init = function () {
        var stageW = ViewManager.getInstance().stage.stageWidth;
        var tip = new egret.TextField;
        tip.text = this.text;
        tip.width = 440;
        tip.x = (stageW - tip.width) / 2;
        tip.y = 680;
        tip.textColor = Config.COLOR_MAINCOLOR;
        tip.size = 40;
        tip.textAlign = 'center';
        this.tip = tip;
        this.addChild(tip);
    };
    LineInfo.prototype.setText = function (text) {
        this.tip.text = text;
    };
    return LineInfo;
}(eui.Group));
__reflect(LineInfo.prototype, "LineInfo");
