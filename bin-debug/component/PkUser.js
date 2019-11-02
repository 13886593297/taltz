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
var PkUser = (function (_super) {
    __extends(PkUser, _super);
    function PkUser(userinfo, type, score) {
        if (type === void 0) { type = "left"; }
        if (score === void 0) { score = null; }
        var _this = _super.call(this) || this;
        _this.userinfo = userinfo;
        _this.type = type;
        _this.score = score;
        _this.init();
        return _this;
    }
    PkUser.prototype.init = function () {
        var bgname = 'pk_user_bg_left_png';
        var color = 0xabbf11;
        if (this.type == 'right') {
            bgname = 'pk_user_bg_right_png';
            color = 0x1670c1;
        }
        this.color = color;
        var bg = Util.createBitmapByName(bgname);
        var width = 240;
        var height = 283;
        if (this.score) {
            height = 340;
        }
        this.height = height;
        this.width = width;
        bg.width = width;
        bg.height = height;
        this.addChild(bg);
        var border = Util.createBitmapByName('icon_border_png');
        border.width = 164;
        border.height = 164;
        border.x = 38;
        border.y = 30;
        this.addChild(border);
        var iconPath = this.userinfo ? 'icon_2_jpg' : 'user_unknow_jpg';
        var icon = Util.createBitmapByName(iconPath);
        icon.width = 150;
        icon.height = 140;
        icon.x = border.x + 7;
        icon.y = border.y + 12;
        this.addChild(icon);
        if (this.userinfo) {
            // Util.setUserImg(this.userinfo.avatar, icon);
        }
        var shape = new egret.Shape();
        this.addChild(shape);
        var graphics = shape.graphics;
        graphics.beginFill(0xff0000);
        graphics.moveTo(icon.x, icon.y + 15); /// 设定显示区域
        graphics.lineTo(icon.x, icon.y + icon.height); /// 设定显示区域
        graphics.lineTo(icon.x + icon.width, icon.y + icon.height); /// 设定显示区域
        graphics.lineTo(icon.x + icon.width, icon.y); /// 设定显示区域
        graphics.lineTo(icon.x + 15, icon.y); /// 设定显示区域
        graphics.lineTo(icon.x, icon.y + 15); /// 设定显示区域
        graphics.endFill();
        icon.mask = shape;
        //人名
        var name = new egret.TextField();
        name.text = this.userinfo ? this.userinfo.nickName : '???';
        name.width = 200;
        name.wordWrap = false;
        name.multiline = false;
        name.x = 20;
        name.textAlign = egret.HorizontalAlign.CENTER;
        name.y = icon.y + 180;
        name.size = 28;
        this.addChild(name);
        if (this.score) {
            var line = Util.createBitmapByName('user_line_png');
            line.width = bg.width;
            line.y = name.y + 60;
            this.addChild(line);
            var shape_1 = new egret.Shape();
            shape_1.graphics.beginFill(color);
            shape_1.graphics.moveTo(0, line.y - 10);
            shape_1.graphics.lineTo(0, line.y + 10);
            shape_1.graphics.lineTo(80, line.y + 10);
            shape_1.graphics.lineTo(80, line.y - 10);
            shape_1.graphics.lineTo(0, line.y - 10);
            shape_1.graphics.moveTo(160, line.y - 10);
            shape_1.graphics.lineTo(160, line.y + 10);
            shape_1.graphics.lineTo(240, line.y + 10);
            shape_1.graphics.lineTo(240, line.y - 10);
            shape_1.graphics.lineTo(160, line.y - 10);
            shape_1.graphics.endFill();
            this.addChild(shape_1);
            line.mask = shape_1;
            // shape.blendMode = egret.BlendMode.ERASE;
            var score = new egret.TextField();
            score.text = this.score;
            score.textColor = 0x000000;
            score.width = bg.width;
            score.height = 50;
            score.anchorOffsetY = 25;
            score.y = line.y;
            score.textAlign = egret.HorizontalAlign.CENTER;
            score.verticalAlign = egret.VerticalAlign.MIDDLE;
            score.size = 30;
            this.addChild(score);
            this.scoreText = score;
        }
    };
    PkUser.prototype.addPkTime = function (time) {
        var letfTime = new egret.TextField();
        letfTime.text = time;
        letfTime.textColor = this.color;
        letfTime.width = this.width;
        letfTime.size = 40;
        letfTime.bold = true;
        letfTime.textAlign = egret.HorizontalAlign.CENTER;
        letfTime.y = this.height + 10;
        this.addChild(letfTime);
    };
    PkUser.prototype.setScore = function (score) {
        this.scoreText.text = score;
    };
    return PkUser;
}(eui.Group));
__reflect(PkUser.prototype, "PkUser");
var TeamUser = (function (_super) {
    __extends(TeamUser, _super);
    function TeamUser(userinfo, type, rect) {
        if (type === void 0) { type = UserPositionType.LEFT; }
        if (rect === void 0) { rect = { width: 250, height: 185 }; }
        var _this = _super.call(this) || this;
        _this.canClick = true;
        _this.userinfo = userinfo || {};
        _this.type = type;
        _this.rect = rect;
        _this.init();
        return _this;
    }
    TeamUser.prototype.init = function () {
        var bgname = 'pk_user_bg_left_png';
        var color = 0xabbf11;
        if (this.type === UserPositionType.RIGHT) {
            bgname = 'pk_user_bg_right_png';
            color = 0x1670c1;
        }
        this.color = color;
        var bg = Util.createBitmapByName(bgname);
        var width = this.rect.width;
        var height = this.rect.height;
        this.height = height;
        this.width = width;
        bg.width = width;
        bg.height = height;
        this.addChild(bg);
        var border = Util.createBitmapByName('icon_border_png');
        border.width = 115;
        border.height = 115;
        border.x = (this.width - border.width) / 2;
        border.y = 10;
        this.addChild(border);
        var iconPath = 'icon_1_jpg';
        if (this.userinfo.nickName)
            iconPath = 'icon_2_jpg';
        var icon = Util.createBitmapByName(iconPath);
        icon.width = 100;
        icon.height = 100;
        icon.x = border.x + 7;
        icon.y = border.y + 7;
        this.addChild(icon);
        // Util.setUserImg(this.userinfo.avatar, icon);
        this.icon = icon;
        icon.touchEnabled = true;
        var shape = new egret.Shape();
        this.addChild(shape);
        var graphics = shape.graphics;
        graphics.beginFill(0xff0000);
        graphics.moveTo(icon.x, icon.y + 10); /// 设定显示区域
        graphics.lineTo(icon.x, icon.y + icon.height); /// 设定显示区域
        graphics.lineTo(icon.x + icon.width, icon.y + icon.height); /// 设定显示区域
        graphics.lineTo(icon.x + icon.width, icon.y); /// 设定显示区域
        graphics.lineTo(icon.x + 10, icon.y); /// 设定显示区域
        graphics.lineTo(icon.x, icon.y + 10); /// 设定显示区域
        graphics.endFill();
        icon.mask = shape;
        //人名
        var name = new egret.TextField();
        name.text = this.userinfo.nickName;
        name.width = 200;
        name.wordWrap = false;
        name.multiline = false;
        name.x = (this.width - name.width) / 2;
        name.textAlign = egret.HorizontalAlign.CENTER;
        name.y = icon.y + border.height;
        name.size = 26;
        this.addChild(name);
        this.nameText = name;
        var readyImg = Util.createBitmapByName('ready_png');
        readyImg.width = 35;
        readyImg.height = 35;
        if (this.type == UserPositionType.LEFT) {
            readyImg.x = 210;
        }
        else {
            readyImg.x = 20;
        }
        readyImg.y = 77;
        this.readyImg = readyImg;
        this.addChild(readyImg);
        this.readyImg.visible = false;
    };
    TeamUser.prototype.addUserEventListener = function (callback, obj) {
        var _this = this;
        this.icon.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.canClick)
                return;
            var current = new Date().getTime();
            if (_this.clickTime && current - _this.clickTime < 1000)
                return;
            _this.clickTime = current;
            // this.canClick = false;
            callback.bind(obj)(_this.userinfo);
        }, this);
    };
    TeamUser.prototype.resetClick = function () {
        this.canClick = true;
        this.clickTime = 0;
    };
    TeamUser.prototype.setDisableClick = function () {
        this.canClick = false;
    };
    /**
     * 更新用户信息
     */
    TeamUser.prototype.updateUser = function (userinfo) {
        this.userinfo = userinfo;
        //清空头像
        var texture = RES.getRes('icon_1_jpg');
        this.icon.texture = texture;
        if (userinfo == null) {
            this.nameText.text = '';
            this.readyImg.visible = false;
            this.resetClick();
        }
        else {
            this.nameText.text = userinfo.nickName;
            // Util.setUserImg(userinfo.avatar, this.icon);
        }
    };
    /**
     * 准备好
     */
    TeamUser.prototype.setReady = function () {
        this.readyImg.visible = true;
        ;
    };
    /**
     * 设置用户结果状态
     */
    TeamUser.prototype.setWinnerStatus = function (status) {
        if (this.status == status)
            return;
        this.status = status;
        if (this.resultImg) {
            this.resultImg.parent.removeChild(this.resultImg);
            this.resultImg = null;
        }
        var statusImgs = {
            1: "result_win_png", 2: "result_draw_png", 3: "result_mvp_png"
        };
        var imgName = statusImgs[status];
        if (imgName) {
            var resultImg = Util.createBitmapByName(imgName);
            resultImg.width = 100;
            resultImg.height = 100;
            resultImg.anchorOffsetX = 100;
            resultImg.x = this.width;
            this.addChild(resultImg);
            this.resultImg = resultImg;
        }
        if (status === WinnerStatus.LOSE) {
            var grayFilter = Util.grayFliter();
            this.filters = [grayFilter];
        }
    };
    return TeamUser;
}(eui.Group));
__reflect(TeamUser.prototype, "TeamUser");
var LiteTeamUser = (function (_super) {
    __extends(LiteTeamUser, _super);
    function LiteTeamUser(userinfo, type) {
        if (type === void 0) { type = UserPositionType.LEFT; }
        var _this = _super.call(this) || this;
        _this.userinfo = userinfo;
        _this.type = type;
        _this.init();
        return _this;
    }
    LiteTeamUser.prototype.init = function () {
        var bgname = 'pk_user_bg_left_png';
        var color = 0xabbf11;
        if (this.type === UserPositionType.RIGHT) {
            bgname = 'pk_user_bg_right_png';
            color = 0x1670c1;
        }
        this.color = color;
        var bg = Util.createBitmapByName(bgname);
        var width = 105;
        var height = 133;
        this.height = height;
        this.width = width;
        bg.width = width;
        bg.height = height;
        this.addChild(bg);
        var border = Util.createBitmapByName('icon_border_png');
        border.width = 85;
        border.height = 85;
        border.x = 10;
        border.y = 10;
        this.addChild(border);
        var icon = Util.createBitmapByName('icon_2_jpg');
        icon.width = 75;
        icon.height = 75;
        icon.x = border.x + 5;
        icon.y = border.y + 5;
        this.addChild(icon);
        if (this.userinfo && this.userinfo.avatar) {
            // Util.setUserImg(this.userinfo.avatar, icon);
        }
        var shape = new egret.Shape();
        this.addChild(shape);
        var graphics = shape.graphics;
        graphics.beginFill(0xff0000);
        graphics.moveTo(icon.x, icon.y + 5); /// 设定显示区域
        graphics.lineTo(icon.x, icon.y + icon.height); /// 设定显示区域
        graphics.lineTo(icon.x + icon.width, icon.y + icon.height); /// 设定显示区域
        graphics.lineTo(icon.x + icon.width, icon.y); /// 设定显示区域
        graphics.lineTo(icon.x + 5, icon.y); /// 设定显示区域
        graphics.lineTo(icon.x, icon.y + 5); /// 设定显示区域
        graphics.endFill();
        icon.mask = shape;
        //人名
        var name = new egret.TextField();
        name.width = 105;
        name.wordWrap = false;
        name.multiline = false;
        name.textAlign = egret.HorizontalAlign.CENTER;
        name.y = icon.y + 80;
        name.size = 22;
        if (this.userinfo && this.userinfo.nickName)
            name.text = this.userinfo.nickName;
        this.addChild(name);
    };
    return LiteTeamUser;
}(eui.Group));
__reflect(LiteTeamUser.prototype, "LiteTeamUser");
