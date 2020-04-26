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
var Title = (function (_super) {
    __extends(Title, _super);
    function Title(img) {
        var _this = _super.call(this) || this;
        _this.img = img;
        _this.init();
        return _this;
    }
    Title.prototype.init = function () {
        var bg = new egret.Bitmap();
        var texture = RES.getRes(this.img);
        bg.texture = texture;
        this.bg = bg;
        this.width = bg.width;
        this.addChild(bg);
    };
    Title.prototype.updateTitle = function (newImg) {
        this.bg.texture = RES.getRes(newImg);
    };
    return Title;
}(eui.Group));
__reflect(Title.prototype, "Title");
