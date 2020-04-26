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
        var stageW = ViewManager.getInstance().stage.stageWidth;
        var icon = Util.createBitmapByName(this.data.icon);
        icon.x = (stageW - icon.width) / 2;
        this.addChild(icon);
        if (this.data.title) {
            var titleBg = Util.createBitmapByName('pk_list_text_bg_png');
            titleBg.x = (stageW - titleBg.width) / 2;
            titleBg.y = icon.height + 20;
            this.addChild(titleBg);
            var title = new egret.TextField();
            title.text = this.data.title;
            title.width = titleBg.width;
            title.height = titleBg.height;
            title.x = titleBg.x;
            title.y = titleBg.y - 5;
            title.verticalAlign = egret.VerticalAlign.MIDDLE;
            title.textAlign = 'center';
            title.size = 30;
            this.addChild(title);
        }
    };
    return PkItem;
}(eui.Group));
__reflect(PkItem.prototype, "PkItem");
