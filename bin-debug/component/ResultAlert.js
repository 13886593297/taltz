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
     * @param type UserPositionType左右
     * @param corret 是否错误
     * @param order 次序
     * @param score 分数
     */
    function ResultAlert(type, corret, order, score) {
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.error = corret;
        _this.order = order;
        _this.score = score;
        _this.init();
        return _this;
    }
    ResultAlert.prototype.init = function () {
        this.width = 240;
        this.height = 120;
        var bgName = 'left_bg_png';
        var flagName = 'green_flag_png';
        var xs = [10, 80, 145];
        var flagIdx = 0;
        var scoreIdx = 2;
        if (this.type == UserPositionType.RIGHT) {
            bgName = 'right_bg_png';
            flagName = 'blue_flag_png';
            flagIdx = 2;
            scoreIdx = 0;
        }
        var bg = Util.createBitmapByName(bgName);
        bg.width = this.width;
        bg.height = this.height;
        bg.alpha = 0.5;
        this.addChild(bg);
        //标记 对错 分数
        var flag = Util.createBitmapByName(flagName);
        flag.x = xs[flagIdx];
        flag.y = 25;
        this.addChild(flag);
        var order = new egret.TextField();
        order.text = this.order;
        order.size = 24;
        order.height = 54;
        order.verticalAlign = egret.VerticalAlign.MIDDLE;
        order.textAlign = egret.HorizontalAlign.CENTER;
        order.width = 70;
        order.x = flag.x;
        order.y = flag.y;
        this.addChild(order);
        // correct
        var errorName = 'answer_error_png';
        if (this.error)
            errorName = 'answer_ok_png';
        var error = Util.createBitmapByName(errorName);
        error.x = xs[1];
        error.y = 35;
        this.addChild(error);
        var score = new egret.TextField();
        score.text = this.score;
        score.size = 35;
        score.height = this.height;
        score.verticalAlign = egret.VerticalAlign.MIDDLE;
        // score.textAlign = egret.HorizontalAlign.CENTER;
        score.width = 70;
        score.x = xs[scoreIdx];
        if (scoreIdx == 0)
            score.x = xs[scoreIdx] + 20;
        this.addChild(score);
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
var MvpAlert = (function (_super) {
    __extends(MvpAlert, _super);
    function MvpAlert(type) {
        if (type === void 0) { type = TeamType.GREEN; }
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.init();
        return _this;
    }
    MvpAlert.prototype.init = function () {
        this.width = 120;
        this.height = 125;
        var bgName = 'green_mvp_bg_png';
        var left = 0;
        if (this.type == TeamType.BLUE) {
            bgName = 'blue_mvp_bg_png';
            left = 13;
        }
        var bg = Util.createBitmapByName(bgName);
        bg.width = this.width;
        bg.height = this.height;
        this.addChild(bg);
        var mvp = Util.createBitmapByName('result_mvp_png');
        mvp.x = left;
        mvp.y = 10;
        mvp.width = 98;
        mvp.height = 98;
        this.addChild(mvp);
    };
    return MvpAlert;
}(eui.Group));
__reflect(MvpAlert.prototype, "MvpAlert");
