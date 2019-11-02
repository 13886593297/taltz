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
/**
 * 错题分析界面
 */
var AnalysisScene = (function (_super) {
    __extends(AnalysisScene, _super);
    function AnalysisScene(subject, title) {
        var _this = _super.call(this) || this;
        _this.subject = subject;
        _this.title = title;
        return _this;
    }
    AnalysisScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        var y = 20;
        var title = Util.createBitmapByName('title_tmfx_png');
        title.y = y;
        title.x = this.stage.stageWidth / 2;
        title.anchorOffsetX = title.width / 2;
        this.addChild(title);
        y += 230;
        var tmfx01 = Util.createBitmapByName('tmfx01_png');
        this.addChild(tmfx01);
        tmfx01.x = 100;
        tmfx01.y = y;
        y += 100;
        var question = new egret.TextField();
        question.text = this.subject.title;
        question.lineSpacing = 10;
        question.width = 550;
        question.x = 100;
        question.y = y;
        question.size = 40;
        question.textColor = 0x38ae36;
        this.addChild(question);
        y += question.textHeight + 100;
        var tmfx02 = Util.createBitmapByName('tmfx02_png');
        this.addChild(tmfx02);
        tmfx02.x = 100;
        tmfx02.y = y;
        y += 100;
        var content = new egret.TextField();
        var num;
        this.subject.options.forEach(function (item, i) {
            if (item.flag.indexOf(_this.subject.result) != -1) {
                num = i;
            }
        });
        content.textFlow = [
            { text: '应选' + this.subject.result + '\n' },
            { text: this.subject.options[num].name }
        ];
        content.width = 550;
        content.x = 100;
        content.y = y;
        content.lineSpacing = 10;
        content.size = 40;
        content.textColor = 0x38ae36;
        this.addChild(content);
        y += content.textHeight + 100;
        var back = Util.createBitmapByName('tmfx03_png');
        back.x = (this.stage.stageWidth - back.width) / 2;
        back.y = this.stage.stageHeight - 300;
        back.touchEnabled = true;
        this.addChild(back);
        back.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            ViewManager.getInstance().back();
        }, this);
    };
    return AnalysisScene;
}(Scene));
__reflect(AnalysisScene.prototype, "AnalysisScene");
