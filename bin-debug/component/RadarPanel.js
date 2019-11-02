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
var RadarPanel = (function (_super) {
    __extends(RadarPanel, _super);
    function RadarPanel(p) {
        var _this = _super.call(this) || this;
        _this.pp = p;
        return _this;
    }
    RadarPanel.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    RadarPanel.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        // 分享
        this.share.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var tips = new SharePanel();
            _this.pp.addChild(tips);
        }, this);
        this.savePic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSaveImg, this);
    };
    // 保存图片
    RadarPanel.prototype.onSaveImg = function () {
        var alert = new AlertPanel("提示:请自行截图保存图片", 1220);
        this.pp.addChild(alert);
    };
    return RadarPanel;
}(eui.Component));
__reflect(RadarPanel.prototype, "RadarPanel", ["eui.UIComponent", "egret.DisplayObject"]);
