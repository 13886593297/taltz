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
var ResultAlert = (function (_super) {
    __extends(ResultAlert, _super);
    /**
     * @param corret 是否错误
     * @param score 分数
     */
    function ResultAlert(corret, score) {
        var _this = _super.call(this) || this;
        _this.corret = corret;
        _this.score = score;
        _this.init();
        return _this;
    }
    ResultAlert.prototype.init = function () {
        // 边框背景
        var border = new egret.Shape;
        border.graphics.lineStyle(3, Config.COLOR_MAINCOLOR);
        border.graphics.beginFill(this.corret ? 0xb5d100 : 0xffffff, 1);
        border.graphics.drawCircle(23, 23, 23);
        border.graphics.endFill();
        this.addChild(border);
        this.width = border.width;
        this.height = border.height;
        // 内容
        var text = new egret.TextField;
        text.text = this.corret ? "\u6B63\u786E\n+" + this.score : "\u9519\u8BEF\n-" + this.score;
        text.textColor = this.corret ? 0xffffff : 0x7fc871;
        text.width = border.width - 6;
        text.height = border.height;
        text.textAlign = 'center';
        text.verticalAlign = 'middle';
        text.size = 16;
        this.addChild(text);
    };
    return ResultAlert;
}(eui.Group));
__reflect(ResultAlert.prototype, "ResultAlert");
/**
 * 双方不得分
 */
var NoScoreAlert = (function (_super) {
    __extends(NoScoreAlert, _super);
    function NoScoreAlert(text) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.init();
        return _this;
    }
    NoScoreAlert.prototype.init = function () {
        this.width = 345;
        this.height = 139;
        this.x = (ViewManager.getInstance().stage.stageWidth - this.width) / 2;
        this.y = ViewManager.getInstance().stage.stageHeight / 2 + 200;
        var bg = Util.createBitmapByName('alert_team_error_png');
        bg.width = this.width;
        bg.height = this.height;
        this.addChild(bg);
        var textField = new egret.TextField();
        textField.width = this.width - 40;
        textField.height = this.height - 20;
        textField.x = 20;
        textField.y = 10;
        textField.textAlign = egret.HorizontalAlign.CENTER;
        textField.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(textField);
        textField.text = this.text;
    };
    return NoScoreAlert;
}(eui.Group));
__reflect(NoScoreAlert.prototype, "NoScoreAlert");
