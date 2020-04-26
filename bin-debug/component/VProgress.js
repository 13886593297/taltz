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
    function VProgress(max) {
        if (max === void 0) { max = 10; }
        var _this = _super.call(this) || this;
        _this.max = max;
        _this.init();
        return _this;
    }
    VProgress.prototype.init = function () {
        this.width = 40;
        this.height = 430;
        var bg = Util.createBitmapByName('pk_progress_bg_png');
        bg.width = this.width;
        bg.height = this.height;
        this.addChild(bg);
        var thumb = Util.createBitmapByName('pk_thumb_pb_png');
        thumb.fillMode = egret.BitmapFillMode.REPEAT;
        thumb.height = 43;
        thumb.y = bg.height - thumb.height;
        this.addChild(thumb);
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xff0000, 1);
        shape.graphics.drawRoundRect(0, 0, this.width, this.height, 26, 26);
        shape.graphics.endFill();
        this.addChild(shape);
        thumb.mask = shape;
        this.thumb = thumb;
        var process_text = new egret.TextField;
        process_text.text = '1/' + this.max;
        process_text.x = 6;
        process_text.y = this.height + 40;
        process_text.width = 100;
        process_text.height = 50;
        process_text.anchorOffsetX = 50;
        process_text.anchorOffsetY = 25;
        process_text.rotation = 90;
        process_text.textColor = 0x36b134;
        this.addChild(process_text);
        this.process_text = process_text;
    };
    VProgress.prototype.setRate = function (rate) {
        if (rate > 10)
            return;
        var height = this.height * rate / this.max;
        this.thumb.height = height;
        this.thumb.y = this.height - height;
        this.process_text.text = rate + '/' + this.max;
    };
    return VProgress;
}(eui.Group));
__reflect(VProgress.prototype, "VProgress");
