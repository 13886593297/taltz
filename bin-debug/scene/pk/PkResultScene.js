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
var PkResultScene = (function (_super) {
    __extends(PkResultScene, _super);
    function PkResultScene(result, back) {
        if (back === void 0) { back = PkResultBackModel.BACK; }
        var _this = _super.call(this) || this;
        _this.result = result;
        _this.back = back;
        return _this;
    }
    PkResultScene.prototype.init = function () {
        var _this = this;
        this.width = 750;
        this.anchorOffsetX = 375;
        this.x = this.stage.stageWidth / 2;
        // this.nav = '返回'
        // if (this.back == PkResultBackModel.BACK_HOME) {
        //     this.nav = '首页'
        // }
        var shareGroup = new eui.Group();
        this.shareGroup = shareGroup;
        shareGroup.width = 750;
        var sky = Util.createBitmapByName("bg_jpg");
        shareGroup.addChildAt(sky, -2);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        this.addChild(shareGroup);
        var pkResult = this.result;
        var sender = pkResult.sender;
        var userinfo = DataManager.getInstance().getUser();
        var senderScore = 0;
        if (sender && sender.pkResult)
            senderScore = sender.pkResult.userAddScore;
        var leftUser = new PkUser(sender ? sender.pkUser : null, "left", senderScore + '分');
        leftUser.y = 100;
        var sUseTime = 0;
        if (sender && sender.pkResult)
            sUseTime = sender.pkResult.userAnswerUseTimeTotal;
        var useTime = Util.converTimer(sUseTime);
        leftUser.addPkTime(useTime);
        shareGroup.addChild(leftUser);
        var receiver = pkResult.receiver;
        var score = 0;
        if (receiver && receiver.pkResult)
            score = receiver.pkResult.userAddScore;
        var rightUser = new PkUser(receiver ? receiver.pkUser : null, 'right', score + '分');
        rightUser.y = 100;
        rightUser.anchorOffsetX = 243;
        rightUser.x = 750;
        var rUseTime = 0;
        if (receiver && receiver.pkResult)
            rUseTime = receiver.pkResult.userAnswerUseTimeTotal;
        var receiverUseTime = Util.converTimer(rUseTime);
        rightUser.addPkTime(receiverUseTime);
        shareGroup.addChild(rightUser);
        var pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.x = 375;
        pkVs.y = 240;
        shareGroup.addChild(pkVs);
        var vs = new egret.TextField();
        vs.text = "VS";
        vs.width = 100;
        vs.height = 100;
        vs.anchorOffsetX = 50;
        vs.anchorOffsetY = 50;
        vs.y = 240;
        vs.x = 375;
        vs.textAlign = egret.HorizontalAlign.CENTER;
        vs.verticalAlign = egret.VerticalAlign.MIDDLE;
        vs.size = 40;
        shareGroup.addChild(vs);
        if (pkResult.status == PkResult.INVALID) {
            var info = new LineInfo(pkResult.tipsMsg);
            info.y = 600;
            shareGroup.addChild(info);
            return;
        }
        //挑战成功界面
        var grayFliters = Util.grayFliter();
        var bg = Util.createBitmapByName('result_bg_png');
        bg.width = 560;
        bg.height = 315;
        bg.anchorOffsetX = 280;
        bg.x = 375;
        bg.y = 450;
        shareGroup.addChild(bg);
        var resultText = "挑战成功！";
        var music = "pass_mp3";
        switch (pkResult.status) {
            case PkResult.SUCCESS:
                break;
            case PkResult.DRAW:
                resultText = "平局";
                break;
            case PkResult.FAIL:
                resultText = "挑战失败！";
                music = "nopass_mp3";
                break;
        }
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
        text.y = bg.y + 110;
        shareGroup.addChild(text);
        var result = new eui.Group();
        shareGroup.addChild(result);
        result.y = 800;
        var y = 0;
        if (sender) {
            var selfScoreText = sender.pkUser.nickName + ":+" + sender.pkResult.userAddScore + "\u79EF\u5206";
            var selfScore = new LineInfo(selfScoreText);
            if (sender.pkResult.userAddScore == 0) {
                var textFlow = void 0;
                if (sender.pkResult.scoretips) {
                    textFlow = [
                        { text: selfScoreText },
                        { text: "\n(" + sender.pkResult.scoretips + ")", style: { "size": 22 } }
                    ];
                }
                else {
                    textFlow = [
                        { text: selfScoreText }
                    ];
                }
                selfScore.setTextFlow(textFlow);
                y += selfScore.height + 25;
            }
            else {
                y += 80;
            }
            console.log('y:', y);
            result.addChild(selfScore);
        }
        if (receiver) {
            var userTeamText = receiver.pkUser.nickName + ":+" + receiver.pkResult.userAddScore + "\u79EF\u5206";
            var userTeam = new LineInfo(userTeamText);
            userTeam.y = y;
            if (receiver.pkResult.userAddScore == 0) {
                var textFlow = [
                    { text: userTeamText },
                    { text: "\n(" + receiver.pkResult.scoretips + ")", style: { "size": 22 } }
                ];
                userTeam.setTextFlow(textFlow);
                y += userTeam.height + 25;
            }
            else {
                y += 80;
            }
            result.addChild(userTeam);
        }
        if (pkResult.status == PkResult.FAIL) {
            bg.filters = [grayFliters];
            text.filters = [grayFliters];
            result.filters = [grayFliters];
        }
        var saveButton = new XButton("保存图片");
        saveButton.width = 325;
        saveButton.x = 30;
        saveButton.y = this.stage.stageHeight - 150;
        this.addChild(saveButton);
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var alert = new AlertPanel("提示:请自行截图保存图片", 900);
            _this.addChild(alert);
        }, this);
        var shareButton = new XButton("分享");
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
    PkResultScene.prototype.onBack = function () {
        DataManager.getInstance().removePkData();
        switch (this.back) {
            case PkResultBackModel.BACK:
                ViewManager.getInstance().back();
                break;
            case PkResultBackModel.BACK_HOME:
                ViewManager.getInstance().jumpHome();
                break;
            case PkResultBackModel.BACK_PK:
                ViewManager.getInstance().backByName('pkmodel');
                break;
        }
    };
    return PkResultScene;
}(Scene));
__reflect(PkResultScene.prototype, "PkResultScene");
/**
 * 单人PK结果
 */
var TeamKnowPkResultScene = (function (_super) {
    __extends(TeamKnowPkResultScene, _super);
    /**
     *
     *
     */
    function TeamKnowPkResultScene() {
        return _super.call(this) || this;
    }
    TeamKnowPkResultScene.prototype.init = function () {
        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, function (data) {
            DataManager.getInstance().updateTeamKonwResult(data.data);
            var scene = new TeamKnowResultScene();
            ViewManager.getInstance().changeScene(scene);
        }, this);
        var roomData = DataManager.getInstance().getRoomData();
        this.pkData = roomData.pkData;
        this.width = 750;
        this.anchorOffsetX = 375;
        this.x = this.stage.stageWidth / 2;
        // this.nav = '首页'
        var shareGroup = new eui.Group();
        this.shareGroup = shareGroup;
        shareGroup.width = 750;
        var sky = Util.createBitmapByName("bg_jpg");
        shareGroup.addChildAt(sky, -2);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        this.addChild(shareGroup);
        var pkResult = this.pkData.result;
        var leftUser = new PkUser(this.pkData.users[TeamType.GREEN], "left", pkResult.score[TeamType.GREEN] + '分');
        leftUser.y = 100;
        shareGroup.addChild(leftUser);
        var rightUser = new PkUser(this.pkData.users[TeamType.BLUE], 'right', pkResult.score[TeamType.BLUE] + '分');
        rightUser.y = 100;
        rightUser.anchorOffsetX = 243;
        rightUser.x = 750;
        shareGroup.addChild(rightUser);
        var pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.x = 375;
        pkVs.y = 240;
        shareGroup.addChild(pkVs);
        var vs = new egret.TextField();
        vs.text = "VS";
        vs.width = 100;
        vs.height = 100;
        vs.anchorOffsetX = 50;
        vs.anchorOffsetY = 50;
        vs.y = 240;
        vs.x = 375;
        vs.textAlign = egret.HorizontalAlign.CENTER;
        vs.verticalAlign = egret.VerticalAlign.MIDDLE;
        vs.size = 40;
        shareGroup.addChild(vs);
        //倒计时 15 秒进入 结果页
        var timer = new egret.Timer(1000, 15);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId });
        }, this);
        timer.start();
        var seeTeamResult = new XButton("查看比赛结果");
        seeTeamResult.width = 400;
        seeTeamResult.y = this.stage.stageHeight - 200;
        seeTeamResult.x = this.stage.stageWidth / 2 - 200;
        seeTeamResult.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            timer.stop();
            SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId });
        }, this);
        this.addChild(seeTeamResult);
        if (pkResult.status == PkResult.INVALID) {
            var info = new LineInfo(pkResult.tipsMsg);
            info.y = 600;
            shareGroup.addChild(info);
            return;
        }
        //挑战成功界面
        var grayFliters = Util.grayFliter();
        var bg = Util.createBitmapByName('result_bg_png');
        bg.width = 560;
        bg.height = 315;
        bg.anchorOffsetX = 280;
        bg.x = 375;
        bg.y = 450;
        shareGroup.addChild(bg);
        var restultTexts = { 0: '平局', 1: '绿方代表获胜', 2: '蓝方代表获胜' };
        var resultText = restultTexts[pkResult.winner];
        var music = "pass_mp3";
        Util.playMusic(music);
        var text = new egret.TextField();
        text.text = resultText;
        text.width = 210;
        text.anchorOffsetX = 105;
        text.height = 90;
        text.size = 30;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.x = bg.x;
        text.y = bg.y + 110;
        shareGroup.addChild(text);
        var result = new eui.Group();
        shareGroup.addChild(result);
        result.y = 800;
        var y = 0;
        var score = pkResult.score[TeamType.GREEN];
        if (pkResult.score[TeamType.GREEN] > 0) {
            score = '+' + score;
        }
        var greenScoreText = this.pkData.users[TeamType.GREEN].nickName + ":" + score + "\u79EF\u5206";
        var greenScoreInfo = new LineInfo(greenScoreText);
        result.addChild(greenScoreInfo);
        y += 80;
        var score1 = pkResult.score[TeamType.BLUE];
        if (pkResult.score[TeamType.BLUE] > 0) {
            score1 = '+' + score1;
        }
        var blueScoreText = this.pkData.users[TeamType.BLUE].nickName + ":" + score1 + "\u79EF\u5206";
        var blueScoreInfo = new LineInfo(blueScoreText);
        blueScoreInfo.y = y;
        result.addChild(blueScoreInfo);
    };
    TeamKnowPkResultScene.prototype.onBack = function () {
        DataManager.getInstance().removePkData();
        ViewManager.getInstance().jumpHome();
    };
    return TeamKnowPkResultScene;
}(Scene));
__reflect(TeamKnowPkResultScene.prototype, "TeamKnowPkResultScene");
