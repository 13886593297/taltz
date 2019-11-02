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
        // this.nav = "竞技场"
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
        var leftUser = new PkUser({ nickName: '绿队' }, 'left', result.score[UserPositionType.LEFT] + '分');
        leftUser.y = 85;
        this.shareGroup.addChild(leftUser);
        // let pkData ={questions:[{id:962},{id:960}]}
        var rightUser = new PkUser({ nickName: '蓝队' }, 'right', result.score[UserPositionType.RIGHT] + '分');
        rightUser.y = 85;
        rightUser.anchorOffsetX = 243;
        rightUser.x = this.stage.stageWidth;
        this.shareGroup.addChild(rightUser);
        var pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.x = this.stage.stageWidth / 2;
        pkVs.y = 240;
        this.shareGroup.addChild(pkVs);
        var vsText = new egret.TextField();
        vsText.text = 'VS';
        vsText.width = 300;
        vsText.height = 100;
        vsText.anchorOffsetX = 150;
        vsText.anchorOffsetY = 50;
        vsText.y = 240;
        vsText.size = 30;
        vsText.x = this.stage.stageWidth / 2;
        vsText.textAlign = egret.HorizontalAlign.CENTER;
        vsText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.shareGroup.addChild(vsText);
        if (this.roomData.joinType === JoinType.OBSEVER) {
            var modelText = new egret.TextField();
            modelText.size = 25;
            modelText.text = '旁观模式';
            modelText.x = this.stage.stageWidth / 2;
            modelText.width = 200;
            modelText.anchorOffsetX = 100;
            modelText.textAlign = egret.HorizontalAlign.CENTER;
            modelText.y = 30;
            this.addChild(modelText);
        }
    };
    TeamResultScene.prototype.initUserList = function () {
        var y = 450;
        var userGroup = new eui.Group();
        userGroup.y = 450;
        this.shareGroup.addChildAt(userGroup, 100);
        var roomData = DataManager.getInstance().getRoomData();
        var pkUser = roomData.users;
        var number = 5;
        if (roomData.roomNumber == RoomNumber.SIX)
            number = 3;
        for (var key in pkUser) {
            var user = pkUser[key];
            if (user.position > roomData.roomNumber || user.position < 1)
                continue;
            var postionY = 140 * (user.position - 1);
            var postionFlag = UserPositionType.LEFT;
            if (user.position > number) {
                postionY = 140 * (user.position - number - 1);
                postionFlag = UserPositionType.RIGHT;
            }
            var teamUser = new LiteTeamUser(user.userInfo, postionFlag);
            teamUser.y = postionY;
            userGroup.addChild(teamUser);
            if (postionFlag == UserPositionType.RIGHT) {
                teamUser.anchorOffsetX = 105;
                teamUser.x = this.stage.stageWidth;
            }
            this.users[user.position] = teamUser;
        }
        if (this.roomData.pkResult && this.roomData.pkResult.mvps) {
            for (var _i = 0, _a = this.roomData.pkResult.mvps; _i < _a.length; _i++) {
                var mvp = _a[_i];
                var x = 105;
                var type = TeamType.GREEN;
                if (mvp.index > number) {
                    x = this.stage.stageWidth - 225;
                    type = TeamType.BLUE;
                }
                var mvpA = new MvpAlert(type);
                mvpA.x = x;
                mvpA.y = this.users[mvp.index].y;
                userGroup.addChildAt(mvpA, -1);
            }
        }
    };
    TeamResultScene.prototype.initResult = function () {
        var _this = this;
        //挑战成功界面
        var grayFliters = Util.grayFliter();
        var bg = Util.createBitmapByName('result_bg_png');
        bg.width = 500;
        bg.height = 281;
        bg.anchorOffsetX = 250;
        bg.x = this.stage.stageWidth / 2;
        bg.y = 450;
        this.shareGroup.addChildAt(bg, 0);
        var texts = {
            0: '平局', 1: '绿队获胜', 2: '蓝队获胜'
        };
        var result = this.roomData.pkResult;
        var resultText = texts[result.winner];
        var music = "pass_mp3";
        Util.playMusic(music);
        var text = new egret.TextField();
        text.text = resultText;
        text.width = 210;
        text.anchorOffsetX = 105;
        text.height = 90;
        text.size = 40;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.x = bg.x;
        text.y = bg.y + 95;
        this.shareGroup.addChild(text);
        var shareButton = new XButton("分享", ButtonType.YELLOW);
        shareButton.width = 400;
        shareButton.y = this.stage.stageHeight - 300;
        shareButton.anchorOffsetX = 200;
        shareButton.x = this.stage.stageWidth / 2;
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var tips = new SharePanel();
            _this.addChild(tips);
        }, this);
        this.addChild(shareButton);
        Util.registerShare(this.shareGroup, ShareType.PK_ANSWER);
        var saveButton = new XButton("保存图片");
        saveButton.width = 400;
        saveButton.y = this.stage.stageHeight - 200;
        saveButton.anchorOffsetX = 200;
        saveButton.x = this.stage.stageWidth / 2;
        this.addChild(saveButton);
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // Util.saveImg(this.shareGroup);
            var alert = new AlertPanel("提示:请自行截图保存图片", 900);
            _this.addChild(alert);
        }, this);
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
        var saveButton = new XButton("保存图片");
        saveButton.width = 325;
        saveButton.x = 30;
        saveButton.y = this.stage.stageHeight - 150;
        this.addChild(saveButton);
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // Util.saveImg(this.shareGroup);
            var alert = new AlertPanel("提示:请自行截图保存图片", 900);
            _this.addChild(alert);
        }, this);
        var shareButton = new XButton("分享", ButtonType.YELLOW);
        shareButton.width = 325;
        shareButton.anchorOffsetX = 325;
        shareButton.x = 720;
        shareButton.y = this.stage.stageHeight - 150;
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var tips = new SharePanel();
            _this.addChild(tips);
        }, this);
        this.addChild(shareButton);
        Util.registerShare(this.shareGroup, ShareType.PK_BATTLE);
    };
    TeamKnowResultScene.prototype.initUser = function () {
        var y = 200;
        var userGroup = new eui.Group();
        userGroup.y = 200;
        this.shareGroup.addChildAt(userGroup, 100);
        var rect = { width: 186, height: 165 };
        var roomData = DataManager.getInstance().getRoomData();
        var pkResult = roomData.pkResult;
        var pkUser = roomData.users;
        var number = 5;
        if (roomData.roomNumber == RoomNumber.SIX)
            number = 3;
        for (var key in pkUser) {
            var user = pkUser[key];
            if (user.position > roomData.roomNumber || user.position < 1)
                continue;
            var postionY = 190 * (user.position - 1);
            var postionFlag = UserPositionType.LEFT;
            if (user.position > number) {
                postionY = 190 * (user.position - number - 1);
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
                teamUser.anchorOffsetX = 243;
                teamUser.x = this.stage.stageWidth;
            }
        }
        for (var i = 0; i < number; i++) {
            var pkVs = Util.createBitmapByName('pk_vs_png');
            pkVs.width = 246;
            pkVs.height = 166;
            pkVs.anchorOffsetX = 123;
            pkVs.anchorOffsetY = 83;
            pkVs.x = this.stage.stageWidth / 2;
            pkVs.y = i * 190 + 93;
            userGroup.addChild(pkVs);
            var pkText = new egret.TextField();
            pkText.text = "VS";
            pkText.size = 40;
            pkText.width = 100;
            pkText.textAlign = egret.HorizontalAlign.CENTER;
            pkText.height = pkText.textHeight;
            pkText.anchorOffsetX = 50;
            pkText.anchorOffsetY = pkText.height / 2;
            pkText.x = this.stage.stageWidth / 2;
            pkText.y = i * 190 + 93;
            userGroup.addChild(pkText);
        }
    };
    /**
     * 更新页面信息
     * let pkResult = {
            score: data.teamScore,
            end: data.isOver,
        }
        if (data.isOver) {
            let winner = 0;
            if (data.teamScore[UserPositionType.LEFT] > data.teamScore[UserPositionType.RIGHT]) {
                winner = UserPositionType.LEFT;
            } else if (data.teamScore[UserPositionType.LEFT] < data.teamScore[UserPositionType.RIGHT]) {
                winner = UserPositionType.RIGHT;
            }
            pkResult['winner'] = winner;
        }
        let result = {};
        data.groupProgress.map(key=>{
            let group = data.groups[key];
             group.map(item => {
                if (item) {
                    let status = 0;
                    switch (item.isWin) {
                        case 1:
                            status = WinnerStatus.WIN
                            break;
                        case 0:
                            status = WinnerStatus.DRAW;
                            break;
                        case -1:
                            status = WinnerStatus.LOSE;
                            break;
                    }
                    if(item.isMvp) status = WinnerStatus.MVP;
                    result[item.index] = status;
                }
            })
        })
     */
    TeamKnowResultScene.prototype.update = function () {
        var pkResult = DataManager.getInstance().getRoomData().pkResult;
        if (pkResult.end) {
            this.pkingText.visible = false;
            if (!this.winView)
                this.initWinView();
        }
        this.scoresText[TeamType.GREEN].text = "\u603B\u5206:" + pkResult.score[TeamType.GREEN];
        this.scoresText[TeamType.BLUE].text = "\u603B\u5206:" + pkResult.score[TeamType.BLUE];
        for (var key in pkResult.result) {
            var status_2 = pkResult.result[key];
            if (status_2 && status_2 !== WinnerStatus.PKING) {
                this.userViews[key].setWinnerStatus(status_2);
            }
        }
    };
    TeamKnowResultScene.prototype.initTop = function () {
        var top = 70;
        var left = 30;
        var roomData = DataManager.getInstance().getRoomData();
        var pkResult = roomData.pkResult;
        var greenText = new egret.TextField();
        greenText.text = '绿队';
        greenText.size = 40;
        greenText.textColor = Config.COLOR_YELLOW;
        greenText.x = left;
        greenText.y = top;
        this.shareGroup.addChild(greenText);
        var greenScore = new egret.TextField();
        greenScore.text = "\u603B\u5206:" + pkResult.score[TeamType.GREEN];
        greenScore.textColor = Config.COLOR_YELLOW;
        greenScore.x = left;
        greenScore.y = top + 70;
        this.shareGroup.addChild(greenScore);
        this.scoresText[TeamType.GREEN] = greenScore;
        var blueText = new egret.TextField();
        blueText.textColor = Config.COLOR_BLUE;
        blueText.size = 40;
        blueText.text = '蓝队';
        blueText.x = this.stage.stageWidth - left;
        blueText.width = 100;
        blueText.anchorOffsetX = 100;
        blueText.textAlign = egret.HorizontalAlign.RIGHT;
        blueText.y = top;
        this.shareGroup.addChild(blueText);
        var blueScore = new egret.TextField();
        blueScore.text = "\u603B\u5206:" + pkResult.score[TeamType.BLUE];
        blueScore.textColor = Config.COLOR_BLUE;
        blueScore.textAlign = egret.HorizontalAlign.RIGHT;
        blueScore.x = this.stage.stageWidth - left;
        blueScore.width = 150;
        blueScore.anchorOffsetX = 150;
        blueScore.y = top + 70;
        this.shareGroup.addChild(blueScore);
        this.scoresText[TeamType.BLUE] = blueScore;
        var resultGroup = new eui.Group();
        this.shareGroup.addChild(resultGroup);
        if (!pkResult.end) {
            var pkingText = new egret.TextField();
            pkingText.text = "比赛进行中，请稍后";
            pkingText.width = 300;
            pkingText.y = top;
            pkingText.x = this.stage.stageWidth / 2 - 150;
            pkingText.textAlign = egret.HorizontalAlign.CENTER;
            pkingText.height = 55;
            pkingText.verticalAlign = egret.VerticalAlign.MIDDLE;
            pkingText.size = 32;
            resultGroup.addChild(pkingText);
            this.pkingText = pkingText;
            if (roomData.joinType === JoinType.OBSEVER) {
                var modelText = new egret.TextField();
                modelText.size = 25;
                modelText.text = '旁观模式';
                modelText.x = this.stage.stageWidth / 2;
                modelText.width = 200;
                modelText.anchorOffsetX = 100;
                modelText.textAlign = egret.HorizontalAlign.CENTER;
                modelText.y = 30;
                this.addChild(modelText);
            }
        }
        else {
            this.initWinView();
        }
    };
    TeamKnowResultScene.prototype.initWinView = function () {
        var roomData = DataManager.getInstance().getRoomData();
        var pkResult = roomData.pkResult;
        var top = 70;
        var winView = new eui.Group();
        this.shareGroup.addChild(winView);
        var bgNames = { 1: "green_win_bg_png", 2: "blue_win_bg_png", 0: "green_win_bg_png" };
        var textNames = { 1: "绿队获胜", 2: "蓝队获胜", 0: "平局" };
        var bgImg = Util.createBitmapByName(bgNames[pkResult.winner]);
        // bgImg.filters = [Util.grayFliter()];
        bgImg.width = 365;
        bgImg.height = 65;
        bgImg.y = top;
        bgImg.x = (this.stage.stageWidth - bgImg.width) / 2;
        winView.addChild(bgImg);
        var winnerText = new egret.TextField();
        winnerText.text = textNames[pkResult.winner];
        winnerText.height = 55;
        winnerText.width = 140;
        winnerText.textAlign = egret.HorizontalAlign.CENTER;
        winnerText.anchorOffsetX = 70;
        winnerText.x = this.stage.stageWidth / 2;
        winnerText.y = top + 5;
        winnerText.verticalAlign = egret.VerticalAlign.MIDDLE;
        winnerText.size = 32;
        winView.addChild(winnerText);
        if (pkResult.winner == 0) {
            var grayFliter = Util.grayFliter();
            bgImg.filters = [grayFliter];
        }
        this.winView = winView;
    };
    return TeamKnowResultScene;
}(Scene));
__reflect(TeamKnowResultScene.prototype, "TeamKnowResultScene");
