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
    function PkUser(userinfo, type, score, time, team) {
        if (type === void 0) { type = "left"; }
        if (score === void 0) { score = null; }
        var _this = _super.call(this) || this;
        _this.userinfo = userinfo;
        _this.type = type;
        _this.score = score;
        _this.time = time;
        _this.team = team;
        _this.init();
        return _this;
    }
    PkUser.prototype.init = function () {
        var bgname = 'pk_user_bg_left_png';
        if (this.type == 'right') {
            bgname = 'pk_user_bg_right_png';
        }
        else if (this.type == 'teamLeft') {
            bgname = 'pk_know_result_left_png';
        }
        var bg = Util.createBitmapByName(bgname);
        this.width = bg.width;
        this.addChild(bg);
        // 头像
        var avatar = Util.setUserImg(this.userinfo ? this.userinfo.avatar : 'pk_default_avatar_png', 112);
        avatar.x = 170;
        avatar.y = 3;
        if (this.type == 'right') {
            avatar.x = 3;
        }
        this.addChild(avatar);
        // 昵称
        var name = new egret.TextField();
        name.text = this.userinfo ? this.userinfo.nickName : '???';
        name.width = 150;
        name.height = 24;
        name.x = 77;
        name.y = 150;
        if (this.type == 'right') {
            name.x = 70;
        }
        name.textAlign = egret.HorizontalAlign.CENTER;
        name.verticalAlign = egret.VerticalAlign.MIDDLE;
        name.size = 24;
        this.addChild(name);
        // 得分 用时
        if (this.score && !this.team) {
            var userScore = new egret.TextField;
            userScore.textFlow = [
                { text: this.score + '\n', style: { textColor: 0x35ad3d, size: 36 } },
                { text: this.time, style: { textColor: 0x959898, size: 26 } }
            ];
            userScore.width = 100;
            userScore.textAlign = 'center';
            userScore.x = 100;
            userScore.y = bg.height + 15;
            if (this.team) {
                userScore.textColor = 0xffffff;
                userScore.size = 44;
                userScore.x = 45;
                userScore.y = bg.y;
                userScore.height = 118;
                userScore.verticalAlign = 'middle';
                if (this.type == 'right') {
                    userScore.x = bg.x + 155;
                }
            }
            this.addChild(userScore);
        }
        else {
            var userScore = new egret.TextField;
            userScore.text = this.score;
            userScore.size = 44;
            userScore.x = 45;
            userScore.y = bg.y;
            userScore.height = 118;
            userScore.verticalAlign = 'middle';
            if (this.type == 'right') {
                userScore.x = bg.x + 155;
            }
            this.addChild(userScore);
        }
    };
    PkUser.prototype.setScore = function (score) {
        this.scoreText.text = score;
    };
    return PkUser;
}(eui.Group));
__reflect(PkUser.prototype, "PkUser");
var TeamUser = (function (_super) {
    __extends(TeamUser, _super);
    function TeamUser(userinfo, type) {
        if (type === void 0) { type = UserPositionType.LEFT; }
        var _this = _super.call(this) || this;
        _this.canClick = true;
        _this.userinfo = userinfo || {};
        // test begin
        // this.userinfo.nickName = '周武Zhou Wu'
        // this.userinfo.avatar = 'http://127.0.0.1:8360/uploads/avatar/13886593297_avatar.jpg'
        // test end
        _this.type = type;
        _this.init();
        return _this;
    }
    TeamUser.prototype.init = function () {
        var bgname = 'pk_yellow_list_png';
        if (this.type === UserPositionType.RIGHT) {
            bgname = 'pk_green_list_png';
        }
        var bg = Util.createBitmapByName(bgname);
        this.width = bg.width;
        this.height = bg.height;
        this.addChild(bg);
        // 头像
        var avatar = new egret.Bitmap();
        avatar.width = avatar.height = 112;
        avatar.x = this.type == UserPositionType.LEFT ? 170 : 3;
        avatar.y = 3;
        this.addChild(avatar);
        this.avatar = avatar;
        if (this.userinfo) {
            Util.setUserImg0(this.userinfo.avatar, avatar);
        }
        var shape = new egret.Shape();
        this.addChild(shape);
        var graphics = shape.graphics;
        graphics.beginFill(0xffffff);
        graphics.drawCircle(avatar.x + avatar.width / 2, avatar.y + avatar.height / 2, avatar.width / 2);
        graphics.endFill();
        avatar.mask = shape;
        // 人名
        var name = new egret.TextField();
        name.width = 150;
        name.size = 26;
        name.text = this.userinfo.nickName ? Util.getStrByWith(this.userinfo.nickName, name.width - 20, name.size) : '';
        name.x = this.type == UserPositionType.LEFT ? 0 : 130;
        name.height = bg.height - 10;
        name.wordWrap = false;
        name.multiline = false;
        name.textAlign = this.type == UserPositionType.LEFT ? 'right' : 'left';
        name.verticalAlign = 'middle';
        this.addChild(name);
        this.nameText = name;
        // 准备图标
        var readyImg = Util.createBitmapByName('pk_icon_ready_png');
        if (this.type == UserPositionType.LEFT) {
            readyImg.x = 140;
        }
        else {
            readyImg.x = 115;
        }
        readyImg.y = 80;
        this.readyImg = readyImg;
        this.addChild(readyImg);
        this.readyImg.visible = false;
    };
    TeamUser.prototype.addUserEventListener = function (callback, obj) {
        var _this = this;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.canClick)
                return;
            var current = new Date().getTime();
            if (_this.clickTime && current - _this.clickTime < 1000)
                return;
            _this.clickTime = current;
            // this.canClick = false
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
        var texture = new egret.Texture();
        this.avatar.texture = texture;
        if (userinfo == null) {
            this.nameText.text = '';
            this.readyImg.visible = false;
            this.resetClick();
        }
        else {
            this.nameText.text = Util.getStrByWith(this.userinfo.nickName, 150 - 20, 26);
            Util.setUserImg0(userinfo.avatar, this.avatar);
        }
    };
    /**
     * 准备好
     */
    TeamUser.prototype.setReady = function () {
        this.readyImg.visible = true;
    };
    /**
     * 设置用户结果状态
     */
    TeamUser.prototype.setWinnerStatus = function (status) {
        if (this.status == status)
            return;
        this.status = status;
        if (this.resultText) {
            this.resultText.parent.removeChild(this.resultText);
            this.resultText = null;
        }
        var textObj = {
            1: '成功',
            2: '平局',
            3: 'MVP',
            4: '失败'
        };
        var text = new egret.TextField;
        text.text = textObj[status];
        text.textColor = this.type == UserPositionType.LEFT ? 0x4b4c03 : 0xffffff;
        text.size = 20;
        text.x = this.type == UserPositionType.LEFT ? 100 : 130;
        text.y = 80;
        this.resultText = text;
        this.addChild(text);
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
        _this.userinfo = userinfo || {};
        // test begin
        // this.userinfo.nickName = '周武'
        // this.userinfo.avatar = 'http://127.0.0.1:8360/uploads/avatar/13886593297_avatar.jpg'
        // test end
        _this.type = type;
        _this.init();
        return _this;
    }
    LiteTeamUser.prototype.init = function () {
        var bgname = 'pk_yellow_list_lite_png';
        if (this.type === UserPositionType.RIGHT) {
            bgname = 'pk_green_list_lite_png';
        }
        var bg = Util.createBitmapByName(bgname);
        this.width = bg.width;
        this.height = bg.height;
        this.addChild(bg);
        // 头像
        if (this.userinfo && this.userinfo.avatar) {
            var avatar = Util.setUserImg(this.userinfo.avatar, 112);
            avatar.x = this.type == UserPositionType.LEFT ? 54 : 3;
            avatar.y = 3;
            this.addChild(avatar);
        }
        // 人名
        if (this.userinfo && this.userinfo.nickName) {
            var name_1 = new egret.TextField();
            name_1.text = this.userinfo.nickName;
            name_1.x = this.type == UserPositionType.LEFT ? 0 : 110;
            name_1.width = 60;
            name_1.height = bg.height - 20;
            name_1.wordWrap = false;
            name_1.multiline = false;
            name_1.textAlign = this.type == UserPositionType.LEFT ? 'right' : 'left';
            name_1.verticalAlign = 'bottom';
            name_1.size = 18;
            this.addChild(name_1);
        }
    };
    return LiteTeamUser;
}(eui.Group));
__reflect(LiteTeamUser.prototype, "LiteTeamUser");
