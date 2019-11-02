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
var LevelView = (function (_super) {
    __extends(LevelView, _super);
    function LevelView(level) {
        var _this = _super.call(this) || this;
        _this.IMGS = ["bg_level_pass_png", "bg_level_cur_png", "bg_level_nopass_png"];
        _this.levelData = level;
        _this.init();
        return _this;
    }
    LevelView.prototype.init = function () {
        var grayFliter = Util.grayFliter();
        var group = new eui.Group();
        this.addChild(group);
        if (this.levelData.status == 2) {
            group.filters = [grayFliter];
        }
        var bg = Util.createBitmapByName(this.IMGS[this.levelData.status]);
        group.addChild(bg);
        // 每关的名称
        var text = new egret.TextField();
        text.width = bg.width;
        text.height = bg.height - 30;
        text.textFlow = [
            { text: this.levelData.flag + '\n' },
            { text: this.levelData.name }
        ];
        text.textColor = 0xffffff;
        text.lineSpacing = 15;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.size = 32;
        group.addChild(text);
    };
    return LevelView;
}(eui.Group));
__reflect(LevelView.prototype, "LevelView");
