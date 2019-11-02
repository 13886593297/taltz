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
var VProgress = (function (_super) {
    __extends(VProgress, _super);
    function VProgress(type, max) {
        if (type === void 0) { type = 1; }
        if (max === void 0) { max = 10; }
        var _this = _super.call(this) || this;
        _this.config = {
            "1": {
                bg: 'v_progress_bg_png',
                thumb: 'v_progress_thumb_png'
            },
            "2": {
                bg: 'v_progress_bg2_png',
                thumb: 'v_progress_thumb2_png'
            }
        };
        _this.type = type;
        _this.max = max;
        _this.init();
        return _this;
    }
    VProgress.prototype.init = function () {
        this.width = 26;
        this.height = 600;
        var bg = Util.createBitmapByName(this.config[this.type].bg);
        bg.width = this.width;
        bg.height = this.height;
        this.addChild(bg);
        var thumb = Util.createBitmapByName(this.config[this.type].thumb);
        thumb.fillMode = egret.BitmapFillMode.REPEAT;
        thumb.height = 250;
        thumb.y = bg.height - thumb.height;
        this.addChild(thumb);
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xff0000, 1);
        shape.graphics.drawRoundRect(0, 0, 26, 600, 26, 26);
        shape.graphics.endFill();
        this.addChild(shape);
        thumb.mask = shape;
        this.thumb = thumb;
    };
    VProgress.prototype.setRate = function (rate) {
        var height = this.height * rate / this.max;
        this.thumb.height = height;
        this.thumb.y = this.height - height;
    };
    return VProgress;
}(eui.Group));
__reflect(VProgress.prototype, "VProgress");
