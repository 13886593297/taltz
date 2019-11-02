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
    function Title(title) {
        var _this = _super.call(this) || this;
        _this.title = title;
        _this.height = 80;
        _this.init();
        return _this;
    }
    Title.prototype.init = function () {
        var stage = ViewManager.getInstance().stage;
        var bg = Util.createBitmapByName('pk_title_bg_png');
        bg.width = 367;
        bg.height = 95;
        bg.x = stage.stageWidth / 2;
        bg.anchorOffsetX = bg.width / 2;
        this.addChild(bg);
        var textfield = new egret.TextField();
        this.addChild(textfield);
        this.titleText = textfield;
        textfield.text = this.title;
        textfield.width = stage.stageWidth;
        textfield.height = this.height;
        textfield.textColor = 0xF36C21;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.verticalAlign = egret.VerticalAlign.MIDDLE;
        textfield.anchorOffsetX = 30;
        textfield.size = 40;
        textfield.y = 10;
    };
    Title.prototype.updateTitle = function (textFlow) {
        this.titleText.textFlow = textFlow;
    };
    return Title;
}(eui.Group));
__reflect(Title.prototype, "Title");
