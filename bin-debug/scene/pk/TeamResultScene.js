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
var TeamResultScene = (function (_super) {
    __extends(TeamResultScene, _super);
    function TeamResultScene() {
        var _this = _super.call(this) || this;
        _this.users = {};
        return _this;
    }
    TeamResultScene.prototype.init = function () {
        _super.prototype.setBackground.call(this);
        this.shareGroup = new eui.Group();
        this.addChild(this.shareGroup);
        this.roomData = DataManager.getInstance().getRoomData();
        this.initHead();
        this.initUserList();
        this.initResult();
    };
    TeamResultScene.prototype.onBack = function () {
        DataManager.getInstance().clearRoomData();
        ViewManager.getInstance().backByName('pklist');
    };
    TeamResultScene.prototype.initHead = function () {
        var result = this.roomData.pkResult;
        // 分数
        var leftScoreBg = Util.createBitmapByName('pk_result_score_left_png');
        leftScoreBg.x = 50;
        leftScoreBg.y = 135;
        this.shareGroup.addChild(leftScoreBg);
        var leftScore = new egret.TextField;
        leftScore.text = result.score[UserPositionType.LEFT];
        leftScore.x = leftScoreBg.x;
        leftScore.y = leftScoreBg.y;
        leftScore.size = 60;
        leftScore.width = leftScoreBg.width;
        leftScore.height = leftScoreBg.height - 10;
        leftScore.textAlign = 'center';
        leftScore.verticalAlign = 'middle';
        this.shareGroup.addChild(leftScore);
        var rightScoreBg = Util.createBitmapByName('pk_result_score_right_png');
        rightScoreBg.x = this.stage.stageWidth - rightScoreBg.width - 50;
        rightScoreBg.y = 135;
        this.shareGroup.addChild(rightScoreBg);
        var rightScore = new egret.TextField;
        rightScore.text = result.score[UserPositionType.RIGHT];
        rightScore.x = rightScoreBg.x;
        rightScore.y = rightScoreBg.y;
        rightScore.size = 60;
        rightScore.width = rightScoreBg.width;
        rightScore.height = rightScoreBg.height - 10;
        rightScore.textAlign = 'center';
        rightScore.verticalAlign = 'middle';
        this.shareGroup.addChild(rightScore);
        var leftFlag = Util.createBitmapByName('pk_yellow_group_little_png');
        leftFlag.x = 50;
        leftFlag.y = 270;
        this.shareGroup.addChild(leftFlag);
        var rightFlag = Util.createBitmapByName('pk_green_group_little_png');
        rightFlag.x = this.stage.stageWidth - rightFlag.width - 50;
        rightFlag.y = 270;
        this.shareGroup.addChild(rightFlag);
    };
    TeamResultScene.prototype.initUserList = function () {
        var userGroup = new eui.Group();
        userGroup.y = 340;
        this.shareGroup.addChildAt(userGroup, 100);
        var roomData = DataManager.getInstance().getRoomData();
        var pkUser = roomData.users;
        var number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5;
        for (var key in pkUser) {
            var user = pkUser[key];
            if (user.position > roomData.roomNumber || user.position < 1)
                continue;
            var postionY = 160 * (user.position - 1);
            var postionFlag = UserPositionType.LEFT;
            if (user.position > number) {
                postionY = 160 * (user.position - number - 1);
                postionFlag = UserPositionType.RIGHT;
            }
            var teamUser = new LiteTeamUser(user.userInfo, postionFlag);
            teamUser.x = postionFlag == UserPositionType.LEFT ? 0 : this.stage.stageWidth - teamUser.width;
            teamUser.y = postionY;
            userGroup.addChild(teamUser);
            this.users[user.position] = teamUser;
        }
        if (this.roomData.pkResult && this.roomData.pkResult.mvps) {
            for (var _i = 0, _a = this.roomData.pkResult.mvps; _i < _a.length; _i++) {
                var mvp = _a[_i];
                var text = new egret.TextField;
                text.text = 'MVP';
                text.textColor = 0x6b6a6a;
                text.stroke = 2;
                text.strokeColor = 0xffffff;
                text.x = mvp.index > number ? 606 : 80;
                text.y = this.users[mvp.index].y + 80;
                userGroup.addChildAt(text, -1);
            }
        }
    };
    TeamResultScene.prototype.initResult = function () {
        var _this = this;
        var result = this.roomData.pkResult;
        // 标题
        var title = '';
        if (result.winner == 1) {
            title = 'pk_winner_left_png';
        }
        else if (result.winner == 2) {
            title = 'pk_winner_right_png';
        }
        var resultTitle = Util.createBitmapByName(title);
        resultTitle.x = (this.stage.stageWidth - resultTitle.width) / 2;
        resultTitle.y = 400;
        this.shareGroup.addChild(resultTitle);
        // 奖杯
        var resultBg = Util.createBitmapByName(result.winner == 0 ? 'pk_winner_draw_png' : 'pk_winner_cup_png');
        resultBg.x = (this.stage.stageWidth - resultBg.width) / 2;
        resultBg.y = result.winner == 0 ? 450 : 520;
        this.shareGroup.addChild(resultBg);
        var saveButton = Util.createBitmapByName('button_small_1_png');
        saveButton.x = this.stage.stageWidth / 2 - saveButton.width - 10;
        saveButton.y = this.stage.stageHeight - 200;
        saveButton.touchEnabled = true;
        this.addChild(saveButton);
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var alert = new AlertPanel("提示:请自行截图保存图片", _this.stage.stageHeight - 80);
            _this.addChild(alert);
        }, this);
        var shareButton = Util.createBitmapByName('button_small_2_png');
        shareButton.x = this.stage.stageWidth / 2 + 10;
        shareButton.y = this.stage.stageHeight - 200;
        shareButton.touchEnabled = true;
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var tips = new SharePanel();
            _this.addChild(tips);
        }, this);
        this.addChild(shareButton);
        Util.registerShare(this.shareGroup, ShareType.PK_ANSWER);
    };
    return TeamResultScene;
}(Scene));
__reflect(TeamResultScene.prototype, "TeamResultScene");
/**
 * 知识赛结果页
 */
var TeamKnowResultScene = (function (_super) {
    __extends(TeamKnowResultScene, _super);
    function TeamKnowResultScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.userViews = {};
        _this.scoresText = {};
        return _this;
    }
    TeamKnowResultScene.prototype.init = function () {
        _super.prototype.setBackground.call(this);
        this.shareGroup = new eui.Group();
        this.addChild(this.shareGroup);
        this.initEvent();
        this.initTop();
        this.initUser();
        this.initBottomButton();
    };
    TeamKnowResultScene.prototype.initEvent = function () {
        var _this = this;
        SocketX.getInstance().addEventListener(NetEvent.TEAM_END_PK, function (data) {
            //更新数据
            DataManager.getInstance().updateTeamKonwResult(data.data);
            _this.update();
        }, this);
    };
    TeamKnowResultScene.prototype.onBack = function () {
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_END_PK);
        DataManager.getInstance().clearRoomData();
        ViewManager.getInstance().backByName('pklist');
    };
    TeamKnowResultScene.prototype.initBottomButton = function () {
        var _this = this;
        var saveButton = Util.createBitmapByName('button_small_1_png');
        saveButton.x = this.stage.stageWidth / 2 - saveButton.width - 10;
        saveButton.y = this.stage.stageHeight - 200;
        saveButton.touchEnabled = true;
        this.addChild(saveButton);
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var alert = new AlertPanel("提示:请自行截图保存图片", _this.stage.stageHeight - 80);
            _this.addChild(alert);
        }, this);
        var shareButton = Util.createBitmapByName('button_small_2_png');
        shareButton.x = this.stage.stageWidth / 2 + 10;
        shareButton.y = this.stage.stageHeight - 200;
        shareButton.touchEnabled = true;
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var tips = new SharePanel();
            _this.addChild(tips);
        }, this);
        this.addChild(shareButton);
        Util.registerShare(this.shareGroup, ShareType.PK_KNOW);
    };
    TeamKnowResultScene.prototype.initUser = function () {
        var userGroup = new eui.Group();
        userGroup.y = 320;
        this.shareGroup.addChildAt(userGroup, 100);
        var roomData = DataManager.getInstance().getRoomData();
        var pkResult = roomData.pkResult;
        var pkUser = roomData.users;
        var number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5;
        for (var key in pkUser) {
            var user = pkUser[key];
            if (user.position > roomData.roomNumber || user.position < 1) {
                continue;
            }
            var postionY = 160 * (user.position - 1);
            var postionFlag = UserPositionType.LEFT;
            if (user.position > number) {
                postionY = 160 * (user.position - number - 1);
                postionFlag = UserPositionType.RIGHT;
            }
            var teamUser = new TeamUser(user.userInfo, postionFlag);
            this.userViews[user.position] = teamUser;
            var status_1 = pkResult.result[user.position];
            if (status_1 && status_1 !== WinnerStatus.PKING) {
                teamUser.setWinnerStatus(status_1);
            }
            teamUser.y = postionY;
            userGroup.addChild(teamUser);
            if (postionFlag == UserPositionType.RIGHT) {
                teamUser.x = this.stage.stageWidth - teamUser.width;
            }
        }
        for (var i = 0; i < number; i++) {
            var pkVs = Util.createBitmapByName('pk_vs_png');
            pkVs.x = (this.stage.stageWidth - pkVs.width) / 2;
            pkVs.y = 160 * i + pkVs.height / 2;
            userGroup.addChild(pkVs);
        }
    };
    TeamKnowResultScene.prototype.update = function () {
        var pkResult = DataManager.getInstance().getRoomData().pkResult;
        if (pkResult.end) {
            this.pkingStatus.visible = false;
            if (!this.winView)
                this.initWinView();
        }
        this.scoresText[TeamType.GREEN].text = "\u603B\u5206 " + pkResult.score[TeamType.GREEN];
        this.scoresText[TeamType.BLUE].text = "\u603B\u5206 " + pkResult.score[TeamType.BLUE];
        for (var key in pkResult.result) {
            var status_2 = pkResult.result[key];
            if (status_2 && status_2 !== WinnerStatus.PKING) {
                this.userViews[key].setWinnerStatus(status_2);
            }
        }
    };
    TeamKnowResultScene.prototype.initTop = function () {
        var roomData = DataManager.getInstance().getRoomData();
        var pkResult = roomData.pkResult;
        var leftScoreBg = Util.createBitmapByName('pk_result_left_bg_png');
        leftScoreBg.x = 50;
        leftScoreBg.y = 240;
        this.shareGroup.addChild(leftScoreBg);
        var leftScore = new egret.TextField;
        leftScore.text = "\u603B\u5206 " + pkResult.score[TeamType.GREEN];
        leftScore.height = leftScoreBg.height - 10;
        leftScore.x = leftScoreBg.x + 120;
        leftScore.y = leftScoreBg.y;
        leftScore.verticalAlign = 'middle';
        leftScore.size = 24;
        this.shareGroup.addChild(leftScore);
        this.scoresText[TeamType.GREEN] = leftScore;
        var rightScoreBg = Util.createBitmapByName('pk_result_right_bg_png');
        rightScoreBg.x = this.stage.stageWidth - rightScoreBg.width - 50;
        rightScoreBg.y = 240;
        this.shareGroup.addChild(rightScoreBg);
        var rightScore = new egret.TextField;
        rightScore.text = "\u603B\u5206 " + pkResult.score[TeamType.BLUE];
        rightScore.height = rightScoreBg.height - 10;
        rightScore.x = rightScoreBg.x + 30;
        rightScore.y = rightScoreBg.y;
        rightScore.verticalAlign = 'middle';
        rightScore.size = 24;
        this.shareGroup.addChild(rightScore);
        this.scoresText[TeamType.BLUE] = rightScore;
        var resultGroup = new eui.Group();
        this.shareGroup.addChild(resultGroup);
        if (!pkResult.end) {
            var pkingStatus = new egret.Bitmap;
            pkingStatus.texture = RES.getRes('pk_tip_waiting_png');
            pkingStatus.x = (this.stage.stageWidth - pkingStatus.width) / 2;
            pkingStatus.y = 80;
            resultGroup.addChild(pkingStatus);
            this.pkingStatus = pkingStatus;
        }
        else {
            this.initWinView();
        }
    };
    TeamKnowResultScene.prototype.initWinView = function () {
        var roomData = DataManager.getInstance().getRoomData();
        var pkResult = roomData.pkResult;
        var winView = new eui.Group();
        this.shareGroup.addChild(winView);
        var bgNames = { 1: "pk_winner_left_png", 2: "pk_winner_right_png", 0: "pk_tip_draw_png" };
        var bgImg = Util.createBitmapByName(bgNames[pkResult.winner]);
        if (pkResult.winner != 0) {
            bgImg.width = 444;
            bgImg.height = 104;
        }
        bgImg.x = (this.stage.stageWidth - bgImg.width) / 2;
        bgImg.y = 80;
        winView.addChild(bgImg);
        this.winView = winView;
    };
    return TeamKnowResultScene;
}(Scene));
__reflect(TeamKnowResultScene.prototype, "TeamKnowResultScene");
