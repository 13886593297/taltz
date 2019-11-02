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
var PkItem = (function (_super) {
    __extends(PkItem, _super);
    function PkItem(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        _this.init();
        return _this;
    }
    PkItem.prototype.init = function () {
        var stage = ViewManager.getInstance().stage;
        this.width = 513;
        this.height = 261;
        this.anchorOffsetX = this.width / 2;
        this.x = stage.stageWidth / 2;
        var bg = Util.createBitmapByName("pk_bg_png");
        bg.width = this.width;
        bg.height = this.height;
        this.addChild(bg);
        var icon = Util.createBitmapByName(this.data.icon);
        icon.width = this.data.iconWidth;
        icon.anchorOffsetX = icon.width / 2;
        icon.anchorOffsetY = 70;
        icon.x = 100;
        icon.y = this.height / 2;
        this.addChild(icon);
        var title = new egret.TextField();
        title.text = this.data.title;
        title.width = this.width / 2;
        title.height = this.height;
        title.x = 190;
        title.y = -25;
        title.verticalAlign = egret.VerticalAlign.MIDDLE;
        title.size = 50;
        this.addChild(title);
    };
    return PkItem;
}(eui.Group));
__reflect(PkItem.prototype, "PkItem");
