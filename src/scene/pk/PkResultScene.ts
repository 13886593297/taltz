
class PkResultScene extends Scene {


    private result;
    private shareGroup;
    private back;
    constructor(result, back = PkResultBackModel.BACK) {
        super();
        this.result = result;
        this.back = back;
    }


    public init() {

        this.width = 750;
        this.anchorOffsetX = 375;
        this.x = this.stage.stageWidth / 2;

        // this.nav = '返回'
        // if (this.back == PkResultBackModel.BACK_HOME) {
        //     this.nav = '首页'
        // }


        let shareGroup = new eui.Group();
        this.shareGroup = shareGroup;
        shareGroup.width = 750;
        let sky = Util.createBitmapByName("bg_jpg");
        shareGroup.addChildAt(sky, -2);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        this.addChild(shareGroup);

        let pkResult = this.result;

        let sender = pkResult.sender;

        let userinfo = DataManager.getInstance().getUser();

        let senderScore = 0;
        if (sender && sender.pkResult) senderScore = sender.pkResult.userAddScore

        let leftUser = new PkUser(sender ? sender.pkUser : null, "left", senderScore + '分');
        leftUser.y = 100;
        let sUseTime = 0;
        if (sender && sender.pkResult) sUseTime = sender.pkResult.userAnswerUseTimeTotal
        let useTime = Util.converTimer(sUseTime);
        leftUser.addPkTime(useTime)
        shareGroup.addChild(leftUser);


        let receiver = pkResult.receiver;


        let score = 0;
        if (receiver && receiver.pkResult) score = receiver.pkResult.userAddScore;

        let rightUser = new PkUser(receiver ? receiver.pkUser : null, 'right', score + '分');
        rightUser.y = 100;
        rightUser.anchorOffsetX = 243;
        rightUser.x = 750;

        let rUseTime = 0;
        if (receiver && receiver.pkResult) rUseTime = receiver.pkResult.userAnswerUseTimeTotal;
        let receiverUseTime = Util.converTimer(rUseTime);
        rightUser.addPkTime(receiverUseTime);
        shareGroup.addChild(rightUser);

        let pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.x = 375;
        pkVs.y = 240;
        shareGroup.addChild(pkVs)


        let vs = new egret.TextField();
        vs.text = "VS";
        vs.width = 100;
        vs.height = 100;
        vs.anchorOffsetX = 50;
        vs.anchorOffsetY = 50;
        vs.y = 240
        vs.x = 375;
        vs.textAlign = egret.HorizontalAlign.CENTER;
        vs.verticalAlign = egret.VerticalAlign.MIDDLE;

        vs.size = 40;
        shareGroup.addChild(vs);

        if (pkResult.status == PkResult.INVALID) {
            let info = new LineInfo(pkResult.tipsMsg);
            info.y = 600;
            shareGroup.addChild(info);
            return;
        }


        //挑战成功界面
        let grayFliters = Util.grayFliter();
        let bg = Util.createBitmapByName('result_bg_png');
        bg.width = 560
        bg.height = 315
        bg.anchorOffsetX = 280;
        bg.x = 375;
        bg.y = 450;
        shareGroup.addChild(bg)


        let resultText = "挑战成功！"
        let music = "pass_mp3";
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

        Util.playMusic(music)

        let text = new egret.TextField();
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


        let result = new eui.Group();
        shareGroup.addChild(result);
        result.y = 800;
        let y = 0;

        if (sender) {
            let selfScoreText = `${sender.pkUser.nickName}:+${sender.pkResult.userAddScore}积分`
            let selfScore = new LineInfo(selfScoreText)
            if (sender.pkResult.userAddScore == 0) {
                let textFlow;
                if (sender.pkResult.scoretips) {
                    textFlow = [
                        { text: selfScoreText }
                        , { text: `\n(${sender.pkResult.scoretips})`, style: { "size": 22 } }];
                } else {
                    textFlow = [
                        { text: selfScoreText }
                    ];
                }
                selfScore.setTextFlow(textFlow)
                y += selfScore.height + 25;
            } else {
                y += 80;
            }
            console.log('y:', y);
            result.addChild(selfScore);
        }


        if (receiver) {
            let userTeamText = `${receiver.pkUser.nickName}:+${receiver.pkResult.userAddScore}积分`;

            let userTeam = new LineInfo(userTeamText)
            userTeam.y = y;
            if (receiver.pkResult.userAddScore == 0) {
                let textFlow = [
                    { text: userTeamText }
                    , { text: `\n(${receiver.pkResult.scoretips})`, style: { "size": 22 } }];
                userTeam.setTextFlow(textFlow)
                y += userTeam.height + 25;
            } else {
                y += 80;
            }
            result.addChild(userTeam);
        }


        if (pkResult.status == PkResult.FAIL) {
            bg.filters = [grayFliters];
            text.filters = [grayFliters];
            result.filters = [grayFliters];
        }

        let saveButton = new XButton("保存图片");
        saveButton.width = 325;
        saveButton.x = 30;
        saveButton.y = this.stage.stageHeight - 150;
        this.addChild(saveButton);
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let alert = new AlertPanel("提示:请自行截图保存图片", 900)
            this.addChild(alert);
        }, this)


        let shareButton = new XButton("分享");
        shareButton.width = 325;
        shareButton.anchorOffsetX = 325;
        shareButton.x = 720;
        shareButton.y = this.stage.stageHeight - 150;
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let tips = new SharePanel();
            this.addChild(tips);
        }, this);
        this.addChild(shareButton);
        Util.registerShare(this.shareGroup, ShareType.PK_BATTLE);
    }

    public onBack() {
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
    }

}




/**
 * 单人PK结果
 */
class TeamKnowPkResultScene extends Scene {

    private pkData;
    private shareGroup;

    /**
     * 
     * 
     */
    constructor() {
        super();
    }


    public init() {
        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, (data) => {
            DataManager.getInstance().updateTeamKonwResult(data.data);
            let scene = new TeamKnowResultScene();
            ViewManager.getInstance().changeScene(scene);
        }, this)
        let roomData = DataManager.getInstance().getRoomData();
        this.pkData = roomData.pkData;

        this.width = 750;
        this.anchorOffsetX = 375;
        this.x = this.stage.stageWidth / 2;
        // this.nav = '首页'

        let shareGroup = new eui.Group();
        this.shareGroup = shareGroup;
        shareGroup.width = 750;
        let sky = Util.createBitmapByName("bg_jpg");
        shareGroup.addChildAt(sky, -2);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        this.addChild(shareGroup);

        let pkResult = this.pkData.result;


        let leftUser = new PkUser(this.pkData.users[TeamType.GREEN], "left", pkResult.score[TeamType.GREEN] + '分');
        leftUser.y = 100;
        shareGroup.addChild(leftUser);


        let rightUser = new PkUser(this.pkData.users[TeamType.BLUE], 'right', pkResult.score[TeamType.BLUE] + '分');
        rightUser.y = 100;
        rightUser.anchorOffsetX = 243;
        rightUser.x = 750;

        shareGroup.addChild(rightUser);

        let pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.x = 375;
        pkVs.y = 240;
        shareGroup.addChild(pkVs)


        let vs = new egret.TextField();
        vs.text = "VS";
        vs.width = 100;
        vs.height = 100;
        vs.anchorOffsetX = 50;
        vs.anchorOffsetY = 50;
        vs.y = 240
        vs.x = 375;
        vs.textAlign = egret.HorizontalAlign.CENTER;
        vs.verticalAlign = egret.VerticalAlign.MIDDLE;

        vs.size = 40;
        shareGroup.addChild(vs);

        //倒计时 15 秒进入 结果页
        let timer = new egret.Timer(1000, 15);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId })
        }, this);
        timer.start();

        let seeTeamResult = new XButton("查看比赛结果");
        seeTeamResult.width = 400;
        seeTeamResult.y = this.stage.stageHeight - 200;
        seeTeamResult.x = this.stage.stageWidth / 2 - 200;
        seeTeamResult.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            timer.stop();
            SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo, groupId: roomData.pkData.groupId })
        }, this);
        this.addChild(seeTeamResult);



        if (pkResult.status == PkResult.INVALID) {
            let info = new LineInfo(pkResult.tipsMsg);
            info.y = 600;
            shareGroup.addChild(info);
            return;
        }


        //挑战成功界面
        let grayFliters = Util.grayFliter();
        let bg = Util.createBitmapByName('result_bg_png');
        bg.width = 560
        bg.height = 315
        bg.anchorOffsetX = 280;
        bg.x = 375;
        bg.y = 450;
        shareGroup.addChild(bg)


        let restultTexts = { 0: '平局', 1: '绿方代表获胜', 2: '蓝方代表获胜' };
        let resultText = restultTexts[pkResult.winner]
        let music = "pass_mp3";
        Util.playMusic(music)

        let text = new egret.TextField();
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


        let result = new eui.Group();
        shareGroup.addChild(result);
        result.y = 800;
        let y = 0;

        let score = pkResult.score[TeamType.GREEN];
        if (pkResult.score[TeamType.GREEN] > 0) {
            score = '+' + score;
        }

        let greenScoreText = `${this.pkData.users[TeamType.GREEN].nickName}:${score}积分`
        let greenScoreInfo = new LineInfo(greenScoreText)
        result.addChild(greenScoreInfo);
        y += 80;

        let score1 = pkResult.score[TeamType.BLUE];
        if (pkResult.score[TeamType.BLUE] > 0) {
            score1 = '+' + score1;
        }
        let blueScoreText = `${this.pkData.users[TeamType.BLUE].nickName}:${score1}积分`;
        let blueScoreInfo = new LineInfo(blueScoreText)
        blueScoreInfo.y = y;
        result.addChild(blueScoreInfo);




    }

    public onBack() {
        DataManager.getInstance().removePkData();
        ViewManager.getInstance().jumpHome();
    }
}


