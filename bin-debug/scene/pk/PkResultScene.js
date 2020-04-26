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
        // test begin
        // this.result = {
        //     receiver: {
        //         pkResult: { scoretips: "超过8次,无积分", userAddScore: 0, userAnswerUseTimeTotal: 60 },
        //         pkUser: { userId: "3", avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/cKqXyr3j6icxgs4TSy6cpMMkbsWXSdAfXqFkLysDgacAbrzulVqj6eulmZGRianMKqIlL8hWGAAToc8PkcTOGtgA/132", nickName: "希博士" }
        //     },
        //     sender: {
        //         pkResult: { scoretips: "", userAddScore: 10, userAnswerUseTimeTotal: "18" },
        //         pkUser: { userId: "ohggBuO6DyT39nB116p35TxAp-YQ", avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/cKqXyr3j6icxgs4TSy6cpMMkbsWXSdAfXqFkLysDgacAbrzulVqj6eulmZGRianMKqIlL8hWGAAToc8PkcTOGtgA/132", nickName: "黄欢" }
        //     },
        //     tipsMsg: '本局无效，友谊的小船荡呀荡，but你们都却没有答题',
        //     status: 1
        // }
        // test end
        _this.back = back;
        return _this;
    }
    PkResultScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        if (ViewManager.getInstance().views.length < 5) {
            this.isBackHome = true;
        }
        var shareGroup = new eui.Group();
        this.addChild(shareGroup);
        this.shareGroup = shareGroup;
        shareGroup.width = this.stage.stageWidth;
        var pkResult = this.result;
        // 玩家自己
        var self = pkResult.sender;
        var selfScore = 0;
        var selfTime;
        var selfPkUser = null;
        if (self && self.pkResult && self.pkUser) {
            selfPkUser = self.pkUser;
            selfScore = self.pkResult.userAddScore;
            selfTime = Util.converTimer(self.pkResult.userAnswerUseTimeTotal);
        }
        var leftUser = new PkUser(selfPkUser, "left", selfScore + '分', selfTime);
        leftUser.y = 120;
        shareGroup.addChild(leftUser);
        // 对手
        var opponent = pkResult.receiver;
        var opponentScore = 0;
        var opponentTime;
        var opponentPkUser = null;
        if (opponent && opponent.pkResult && opponent.pkUser) {
            opponentPkUser = opponent.pkUser;
            opponentScore = opponent.pkResult.userAddScore;
            opponentTime = Util.converTimer(opponent.pkResult.userAnswerUseTimeTotal);
        }
        var rightUser = new PkUser(opponentPkUser, 'right', opponentScore + '分', opponentTime);
        rightUser.x = this.stage.stageWidth - rightUser.width;
        rightUser.y = 120;
        shareGroup.addChild(rightUser);
        var pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.x = (this.stage.stageWidth - pkVs.width) / 2;
        pkVs.y = 150;
        shareGroup.addChild(pkVs);
        // 无效局
        if (pkResult.status == PkResult.INVALID) {
            var tip = new LineInfo(pkResult.tipsMsg);
            shareGroup.addChild(tip);
            return;
        }
        // 结果背景和音乐
        var result_bg = 'pk_success_png';
        var music = "pass_mp3";
        switch (pkResult.status) {
            case PkResult.SUCCESS:
                break;
            case PkResult.DRAW:
                result_bg = "pk_draw_png";
                break;
            case PkResult.FAIL:
                result_bg = "pk_fail_png";
                music = "nopass_mp3";
                break;
        }
        var bg = Util.createBitmapByName(result_bg);
        bg.x = (this.stage.stageWidth - bg.width) / 2;
        bg.y = 450;
        shareGroup.addChild(bg);
        Util.playMusic(music);
        var selfScoreDescription = this.scoreItem(self.pkUser.nickName, self.pkResult.userAddScore, self.pkResult.scoretips);
        selfScoreDescription.y = 830;
        shareGroup.addChild(selfScoreDescription);
        var opponentScoreDescription = this.scoreItem(opponent ? opponent.pkUser.nickName : '???', opponent ? opponent.pkResult.userAddScore : 0, opponent ? opponent.pkResult.scoretips : null);
        opponentScoreDescription.y = 910;
        shareGroup.addChild(opponentScoreDescription);
        var saveButton = Util.createBitmapByName('button_small_1_png');
        saveButton.x = this.stage.stageWidth / 2 - saveButton.width - 30;
        saveButton.y = this.stage.stageHeight - 200;
        saveButton.touchEnabled = true;
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var alert = new AlertPanel("提示:请自行截图保存图片", _this.stage.stageHeight - 80);
            _this.addChild(alert);
        }, this);
        this.addChild(saveButton);
        var shareButton = Util.createBitmapByName('button_small_2_png');
        shareButton.x = this.stage.stageWidth / 2 + 30;
        shareButton.y = saveButton.y;
        shareButton.touchEnabled = true;
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var tips = new SharePanel();
            _this.addChild(tips);
        }, this);
        this.addChild(shareButton);
        Util.registerShare(this.shareGroup, ShareType.PK_BATTLE, self.pkUser.nickName, opponent.pkUser.nickName);
    };
    PkResultScene.prototype.scoreItem = function (name, score, scoretips) {
        var group = new eui.Group;
        var bg = Util.drawRoundRect(3, Config.COLOR_MAINCOLOR, 0xffffff, 274, 60, 30);
        group.width = bg.width;
        group.x = (this.stage.stageWidth - group.width) / 2;
        group.addChild(bg);
        var nickName = new egret.TextField;
        nickName.text = name + ':';
        nickName.width = 160;
        nickName.height = 24;
        nickName.x = 20;
        nickName.y = 20;
        nickName.size = 24;
        nickName.textColor = Config.COLOR_MAINCOLOR;
        group.addChild(nickName);
        if (scoretips) {
            nickName.y = 10;
            var tips = new egret.TextField;
            tips.text = '(' + scoretips + ')';
            tips.width = bg.width;
            tips.y = 35;
            tips.textAlign = 'center';
            tips.size = 20;
            tips.textColor = Config.COLOR_MAINCOLOR;
            group.addChild(tips);
        }
        var addScore = new egret.TextField;
        addScore.text = '+' + score + '分';
        addScore.width = 70;
        addScore.height = nickName.height;
        addScore.x = 190;
        addScore.y = nickName.y;
        addScore.size = nickName.size;
        addScore.textAlign = 'right';
        addScore.textColor = Config.COLOR_MAINCOLOR;
        group.addChild(addScore);
        return group;
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
    function TeamKnowPkResultScene() {
        return _super.call(this) || this;
    }
    TeamKnowPkResultScene.prototype.init = function () {
        _super.prototype.setBackground.call(this);
        this.close_btn = false;
        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, function (data) {
            DataManager.getInstance().updateTeamKonwResult(data.data);
            var scene = new TeamKnowResultScene();
            ViewManager.getInstance().changeScene(scene);
        }, this);
        var roomData = DataManager.getInstance().getRoomData();
        this.pkData = roomData.pkData;
        var pkResult = this.pkData.result;
        var leftUser = new PkUser(this.pkData.users[TeamType.GREEN], "teamLeft", pkResult.score[TeamType.GREEN] + '分', null, true);
        leftUser.y = 100;
        this.addChild(leftUser);
        var rightUser = new PkUser(this.pkData.users[TeamType.BLUE], 'right', pkResult.score[TeamType.BLUE] + '分', null, true);
        rightUser.x = this.stage.stageWidth - rightUser.width;
        rightUser.y = 100;
        this.addChild(rightUser);
        var pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.x = (this.stage.stageWidth - pkVs.width) / 2;
        pkVs.y = 130;
        this.addChild(pkVs);
        //倒计时 15 秒进入 结果页
        var timer = new egret.Timer(1000, 15);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId });
        }, this);
        timer.start();
        var seeTeamResult = Util.createBitmapByName('pk_result_btn_png');
        seeTeamResult.x = (this.stage.stageWidth - seeTeamResult.width) / 2;
        seeTeamResult.y = this.stage.stageHeight - 150;
        seeTeamResult.touchEnabled = true;
        seeTeamResult.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            timer.stop();
            SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId });
        }, this);
        this.addChild(seeTeamResult);
        if (pkResult.status == PkResult.INVALID) {
            var info = new LineInfo(pkResult.tipsMsg);
            this.addChild(info);
            return;
        }
        // 获胜背景
        var resultBgArr = ['pk_winner_draw2_png', 'pk_winner_left2_png', 'pk_winner_right2_png'];
        var resultBg = Util.createBitmapByName(resultBgArr[pkResult.winner]);
        resultBg.x = (this.stage.stageWidth - resultBg.width) / 2;
        resultBg.y = 450;
        this.addChild(resultBg);
        var music = "pass_mp3";
        Util.playMusic(music);
        var selfScoreDescription = this.scoreItem(this.pkData.users[1].nickName, pkResult.score[1]);
        selfScoreDescription.y = 830;
        this.addChild(selfScoreDescription);
        var opponentScoreDescription = this.scoreItem(this.pkData.users[2].nickName, pkResult.score[2]);
        opponentScoreDescription.y = 910;
        this.addChild(opponentScoreDescription);
    };
    TeamKnowPkResultScene.prototype.scoreItem = function (name, score) {
        var group = new eui.Group;
        var bg = Util.drawRoundRect(3, Config.COLOR_MAINCOLOR, 0xffffff, 274, 60, 30);
        group.width = bg.width;
        group.x = (this.stage.stageWidth - group.width) / 2;
        group.addChild(bg);
        var nickName = new egret.TextField;
        nickName.text = name + ':';
        nickName.width = 160;
        nickName.height = 24;
        nickName.x = 20;
        nickName.y = 20;
        nickName.size = 24;
        nickName.textColor = Config.COLOR_MAINCOLOR;
        group.addChild(nickName);
        var addScore = new egret.TextField;
        addScore.text = score > 0 ? "+" + score + "\u5206" : score + "\u5206";
        addScore.width = 70;
        addScore.height = nickName.height;
        addScore.x = 190;
        addScore.y = nickName.y;
        addScore.size = nickName.size;
        addScore.textAlign = 'right';
        addScore.textColor = Config.COLOR_MAINCOLOR;
        group.addChild(addScore);
        return group;
    };
    TeamKnowPkResultScene.prototype.onBack = function () {
        DataManager.getInstance().removePkData();
        ViewManager.getInstance().jumpHome();
    };
    return TeamKnowPkResultScene;
}(Scene));
__reflect(TeamKnowPkResultScene.prototype, "TeamKnowPkResultScene");
