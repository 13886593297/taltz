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
var LineInfo = (function (_super) {
    __extends(LineInfo, _super);
    function LineInfo(text) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.init();
        return _this;
    }
    LineInfo.prototype.init = function () {
        var stage = ViewManager.getInstance().stage;
        this.width = 650;
        this.anchorOffsetX = 325;
        this.x = 375; //stage.stageWidth/2;
        var topline = Util.createBitmapByName("result_line_top_png");
        topline.width = 450;
        this.addChild(topline);
        var textField = new egret.TextField();
        this.textField = textField;
        textField.text = this.text;
        // textField.textColor = Config.COLOR_YELLOW;
        textField.width = 420;
        textField.size = 26;
        var height = textField.numLines * 50;
        this.height = height;
        textField.textAlign = egret.HorizontalAlign.CENTER;
        textField.verticalAlign = egret.VerticalAlign.MIDDLE;
        textField.x = 115;
        textField.lineSpacing = 10;
        textField.y = 20;
        // textField.height = 60
        this.addChild(textField);
        var bottomline = Util.createBitmapByName("result_line_bottom_png");
        // bottomline.anchorOffsetX = 225;
        // bottomline.rotation = 180;
        bottomline.x = 190;
        bottomline.y = height - 20;
        this.bottomLine = bottomline;
        this.addChild(bottomline);
    };
    LineInfo.prototype.setText = function (text) {
        if (this.textField)
            this.textField.text = text;
    };
    LineInfo.prototype.setTextFlow = function (textFlow) {
        if (this.textField)
            this.textField.textFlow = textFlow;
        this.height = this.textField.textHeight + 30;
        this.bottomLine.y = this.height - 25;
        console.log('this.height:', this.height);
    };
    return LineInfo;
}(eui.Group));
__reflect(LineInfo.prototype, "LineInfo");
