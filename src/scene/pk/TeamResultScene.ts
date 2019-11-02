class TeamResultScene extends Scene {

    private shareGroup;
    private roomData: Room;
    private users = {};


    constructor() {
        super()
    }



    public init() {
        // this.nav = "竞技场"
        this.shareGroup = new eui.Group()
        this.addChild(this.shareGroup)
        this.roomData = DataManager.getInstance().getRoomData();

        this.initHead();
        this.initUserList();
        this.initResult();
    }

    public onBack() {
        DataManager.getInstance().clearRoomData();
        ViewManager.getInstance().backByName('pklist');
    }

    private initHead() {

        let result = this.roomData.pkResult

        let leftUser = new PkUser({ nickName: '绿队' }, 'left', result.score[UserPositionType.LEFT] + '分');
        leftUser.y = 85;
        this.shareGroup.addChild(leftUser);

        // let pkData ={questions:[{id:962},{id:960}]}


        let rightUser = new PkUser({ nickName: '蓝队' }, 'right', result.score[UserPositionType.RIGHT] + '分');
        rightUser.y = 85;
        rightUser.anchorOffsetX = 243;
        rightUser.x = this.stage.stageWidth;
        this.shareGroup.addChild(rightUser);

        let pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.x = this.stage.stageWidth / 2;
        pkVs.y = 240;
        this.shareGroup.addChild(pkVs)

        let vsText = new egret.TextField();
        vsText.text = 'VS';
        vsText.width = 300;
        vsText.height = 100;
        vsText.anchorOffsetX = 150;
        vsText.anchorOffsetY = 50;
        vsText.y = 240
        vsText.size = 30;
        vsText.x = this.stage.stageWidth / 2;
        vsText.textAlign = egret.HorizontalAlign.CENTER;
        vsText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.shareGroup.addChild(vsText);


        if (this.roomData.joinType === JoinType.OBSEVER) {
            let modelText = new egret.TextField();
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

    private initUserList() {
        let y = 450;
        let userGroup = new eui.Group();
        userGroup.y = 450;
        this.shareGroup.addChildAt(userGroup, 100)


        let roomData = DataManager.getInstance().getRoomData();
        let pkUser = roomData.users;
        let number = 5;
        if (roomData.roomNumber == RoomNumber.SIX) number = 3;
        for (let key in pkUser) {
            let user = pkUser[key];
            if (user.position > roomData.roomNumber || user.position < 1) continue;
            let postionY = 140 * (user.position - 1);
            let postionFlag = UserPositionType.LEFT;
            if (user.position > number) { //蓝队用户
                postionY = 140 * (user.position - number - 1);
                postionFlag = UserPositionType.RIGHT;
            }
            let teamUser = new LiteTeamUser(user.userInfo, postionFlag);
            teamUser.y = postionY;
            userGroup.addChild(teamUser);
            if (postionFlag == UserPositionType.RIGHT) {
                teamUser.anchorOffsetX = 105;
                teamUser.x = this.stage.stageWidth;
            }
            this.users[user.position] = teamUser;
        }

        if (this.roomData.pkResult && this.roomData.pkResult.mvps) {
            for (let mvp of this.roomData.pkResult.mvps) {
                let x = 105;
                let type = TeamType.GREEN;
                if (mvp.index > number) {
                    x = this.stage.stageWidth - 225;
                    type = TeamType.BLUE;
                }
                let mvpA = new MvpAlert(type);
                mvpA.x = x;
                mvpA.y = this.users[mvp.index].y;
                userGroup.addChildAt(mvpA, -1);
            }
        }

    }

    private initResult() {
        //挑战成功界面
        let grayFliters = Util.grayFliter();
        let bg = Util.createBitmapByName('result_bg_png');
        bg.width = 500
        bg.height = 281
        bg.anchorOffsetX = 250;
        bg.x = this.stage.stageWidth / 2;
        bg.y = 450;
        this.shareGroup.addChildAt(bg, 0)


        let texts = {
            0: '平局', 1: '绿队获胜', 2: '蓝队获胜'
        }


        let result = this.roomData.pkResult;
        let resultText = texts[result.winner];
        let music = "pass_mp3";
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
        text.y = bg.y + 95;
        this.shareGroup.addChild(text);


        let shareButton = new XButton("分享", ButtonType.YELLOW);
        shareButton.width = 400;
        shareButton.y = this.stage.stageHeight - 300;
        shareButton.anchorOffsetX = 200;
        shareButton.x = this.stage.stageWidth / 2;
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let tips = new SharePanel();
            this.addChild(tips);
        }, this);
        this.addChild(shareButton);
        Util.registerShare(this.shareGroup, ShareType.PK_ANSWER);

        let saveButton = new XButton("保存图片");
        saveButton.width = 400;
        saveButton.y = this.stage.stageHeight - 200;
        saveButton.anchorOffsetX = 200;
        saveButton.x = this.stage.stageWidth / 2;
        this.addChild(saveButton);
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // Util.saveImg(this.shareGroup);
            let alert = new AlertPanel("提示:请自行截图保存图片", 900)
            this.addChild(alert);
        }, this)
    }



}




/**
 * 知识赛结果页
 */
class TeamKnowResultScene extends Scene {

    private shareGroup;
    private userViews = {};
    private scoresText = {}
    private pkingText;
    private winView;


    init() {
        this.shareGroup = new eui.Group();
        this.addChild(this.shareGroup);
        this.initEvent();
        this.initTop()
        this.initUser();
        this.initBottomButton();
    }

    private initEvent() {
        SocketX.getInstance().addEventListener(NetEvent.TEAM_END_PK, (data) => {
            //更新数据
            DataManager.getInstance().updateTeamKonwResult(data.data);
            this.update();
        }, this)
    }

    public onBack() {
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_END_PK);
        DataManager.getInstance().clearRoomData();
        ViewManager.getInstance().backByName('pklist');

    }

    private initBottomButton() {
        let saveButton = new XButton("保存图片");
        saveButton.width = 325;
        saveButton.x = 30;
        saveButton.y = this.stage.stageHeight - 150;
        this.addChild(saveButton);
        saveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // Util.saveImg(this.shareGroup);
            let alert = new AlertPanel("提示:请自行截图保存图片", 900)
            this.addChild(alert);
        }, this)


        let shareButton = new XButton("分享", ButtonType.YELLOW);
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


    private initUser() {
        let y = 200;
        let userGroup = new eui.Group();
        userGroup.y = 200;
        this.shareGroup.addChildAt(userGroup, 100)
        let rect = { width: 186, height: 165 };
        let roomData = DataManager.getInstance().getRoomData();
        let pkResult = roomData.pkResult;
        let pkUser = roomData.users;
        let number = 5;
        if (roomData.roomNumber == RoomNumber.SIX) number = 3;
        for (let key in pkUser) {
            let user = pkUser[key];
            if (user.position > roomData.roomNumber || user.position < 1) continue;
            let postionY = 190 * (user.position - 1);
            let postionFlag = UserPositionType.LEFT;
            if (user.position > number) { //蓝队用户
                postionY = 190 * (user.position - number - 1);
                postionFlag = UserPositionType.RIGHT;
            }
            let teamUser = new TeamUser(user.userInfo, postionFlag);

            this.userViews[user.position] = teamUser;
            let status = pkResult.result[user.position];
            if (status && status !== WinnerStatus.PKING) {
                teamUser.setWinnerStatus(status);
            }
            teamUser.y = postionY;
            userGroup.addChild(teamUser);
            if (postionFlag == UserPositionType.RIGHT) {
                teamUser.anchorOffsetX = 243;
                teamUser.x = this.stage.stageWidth;
            }
        }

        for (let i = 0; i < number; i++) {
            let pkVs = Util.createBitmapByName('pk_vs_png');
            pkVs.width = 246;
            pkVs.height = 166;
            pkVs.anchorOffsetX = 123;
            pkVs.anchorOffsetY = 83;
            pkVs.x = this.stage.stageWidth / 2;
            pkVs.y = i * 190 + 93;
            userGroup.addChild(pkVs)

            let pkText = new egret.TextField();
            pkText.text = "VS";
            pkText.size = 40
            pkText.width = 100;
            pkText.textAlign = egret.HorizontalAlign.CENTER;
            pkText.height = pkText.textHeight;
            pkText.anchorOffsetX = 50;
            pkText.anchorOffsetY = pkText.height / 2
            pkText.x = this.stage.stageWidth / 2;
            pkText.y = i * 190 + 93;
            userGroup.addChild(pkText)
        }



    }

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
    private update() {
        let pkResult = DataManager.getInstance().getRoomData().pkResult;
        if (pkResult.end) {
            this.pkingText.visible = false;
            if (!this.winView) this.initWinView();
        }
        this.scoresText[TeamType.GREEN].text = `总分:${pkResult.score[TeamType.GREEN]}`;
        this.scoresText[TeamType.BLUE].text = `总分:${pkResult.score[TeamType.BLUE]}`;

        for (let key in pkResult.result) {
            let status = pkResult.result[key];
            if (status && status !== WinnerStatus.PKING) {
                this.userViews[key].setWinnerStatus(status);
            }
        }

    }


    private initTop() {

        let top = 70;
        let left = 30;
        let roomData = DataManager.getInstance().getRoomData();
        let pkResult = roomData.pkResult;
        let greenText = new egret.TextField();
        greenText.text = '绿队';
        greenText.size = 40;
        greenText.textColor = Config.COLOR_YELLOW;
        greenText.x = left;
        greenText.y = top;
        this.shareGroup.addChild(greenText);

        let greenScore = new egret.TextField();
        greenScore.text = `总分:${pkResult.score[TeamType.GREEN]}`;
        greenScore.textColor = Config.COLOR_YELLOW;
        greenScore.x = left;
        greenScore.y = top + 70;
        this.shareGroup.addChild(greenScore);
        this.scoresText[TeamType.GREEN] = greenScore;


        let blueText = new egret.TextField();
        blueText.textColor = Config.COLOR_BLUE;
        blueText.size = 40;
        blueText.text = '蓝队';
        blueText.x = this.stage.stageWidth - left;
        blueText.width = 100;
        blueText.anchorOffsetX = 100;
        blueText.textAlign = egret.HorizontalAlign.RIGHT;
        blueText.y = top;
        this.shareGroup.addChild(blueText);

        let blueScore = new egret.TextField();
        blueScore.text = `总分:${pkResult.score[TeamType.BLUE]}`;
        blueScore.textColor = Config.COLOR_BLUE;
        blueScore.textAlign = egret.HorizontalAlign.RIGHT;
        blueScore.x = this.stage.stageWidth - left;
        blueScore.width = 150;
        blueScore.anchorOffsetX = 150;
        blueScore.y = top + 70;
        this.shareGroup.addChild(blueScore);
        this.scoresText[TeamType.BLUE] = blueScore;


        let resultGroup = new eui.Group();
        this.shareGroup.addChild(resultGroup);

        if (!pkResult.end) {
            let pkingText = new egret.TextField();
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
                let modelText = new egret.TextField();
                modelText.size = 25;
                modelText.text = '旁观模式';
                modelText.x = this.stage.stageWidth / 2;
                modelText.width = 200;
                modelText.anchorOffsetX = 100;
                modelText.textAlign = egret.HorizontalAlign.CENTER;
                modelText.y = 30;
                this.addChild(modelText);
            }

        } else {

            this.initWinView();
        }

    }


    private initWinView() {
        let roomData = DataManager.getInstance().getRoomData();
        let pkResult = roomData.pkResult;
        let top = 70;
        let winView = new eui.Group();
        this.shareGroup.addChild(winView);

        let bgNames = { 1: "green_win_bg_png", 2: "blue_win_bg_png", 0: "green_win_bg_png" }
        let textNames = { 1: "绿队获胜", 2: "蓝队获胜", 0: "平局" }

        let bgImg = Util.createBitmapByName(bgNames[pkResult.winner]);
        // bgImg.filters = [Util.grayFliter()];
        bgImg.width = 365;
        bgImg.height = 65;
        bgImg.y = top;
        bgImg.x = (this.stage.stageWidth - bgImg.width) / 2
        winView.addChild(bgImg);
        let winnerText = new egret.TextField();
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
            let grayFliter = Util.grayFliter();
            bgImg.filters = [grayFliter];
        }
        this.winView = winView;

    }

}