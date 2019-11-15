/**
 * 跑马灯效果 信息
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
var Notice = (function (_super) {
    __extends(Notice, _super);
    function Notice(notices) {
        var _this = _super.call(this) || this;
        _this.seleted = 0;
        _this.notices = notices;
        _this.init();
        return _this;
    }
    Notice.prototype.init = function () {
        var stage = ViewManager.getInstance().stage;
        this.mask = new egret.Rectangle(0, 0, stage.stageWidth, 60);
        var notice = Util.createBitmapByName("notice_png");
        notice.width = 472;
        notice.x = stage.stageWidth / 2;
        notice.anchorOffsetX = notice.width / 2;
        this.addChild(notice);
        var text = new egret.TextField();
        text.height = 60;
        text.size = 20;
        text.textColor = 0x7fc871;
        text.width = 300;
        text.x = 260;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(text);
        this.text1 = text;
        text.mask = this.mask;
        if (this.notices.length > 0) {
            text.text = this.notices[0].showMsg;
        }
        if (this.notices.length > 1) {
            this.startAni();
        }
    };
    Notice.prototype.startAni = function () {
        var _this = this;
        this.tw = egret.Tween.get(this.text1, { loop: true });
        this.tw.to({ y: 80 }, 200, egret.Ease.backOut).call(function () {
            _this.text1.text = _this.notices[_this.seleted].showMsg;
        }).to({ y: 0 }, 100, egret.Ease.backIn).call(function () {
            ani();
        }).wait(3000);
        var ani = function () {
            _this.seleted++;
            if (_this.seleted >= _this.notices.length) {
                _this.seleted = 0;
            }
        };
    };
    return Notice;
}(eui.Group));
__reflect(Notice.prototype, "Notice");
