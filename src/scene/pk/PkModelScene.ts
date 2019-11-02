class PkModelScene extends Scene {

    private readonly config = {
        "1": {
            title: 'PK模式',
            items: [{
                icon: 'pk_auto_png', title: '自动匹配', iconWidth: 98, type: PkModel.AUTO
            }, {
                icon: 'pk_friend_png', title: '邀请好友', iconWidth: 126, type: PkModel.FRIEND
            }]
        },
        "2": {
            title: '对战形式',
            items: [{
                icon: 'team_answer_png', title: '抢答赛', iconWidth: 107, type: PkModel.ANSWER
            }, {
                icon: 'team_know_png', title: '知识赛', iconWidth: 200, type: PkModel.KNOW
            }]
        }
    }

    private data;
    private type;
    constructor(type) {
        super();
        this.type = type;
        this.data = this.config[type];
    }


    public init() {
        super.setBackground();
        let y = 100;
        this.name = "pkmodel";
        let title = new Title(this.data.title);
        this.addChild(title);
        title.y = y;

        if (this.type == PKTYPE.PERSON) {
            SocketX.getInstance().connectPersonPk();
        } else {
            SocketX.getInstance().connectTeamPk();
        }

        let itemY = 300;
        for (let data of this.data.items) {
            let item = new PkItem(data);
            this.addChild(item);
            item.y = itemY;
            itemY += 300;
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                console.log(data.type);
                Util.playMusic('model_select_mp3')
                DataManager.getInstance().setPkModel(data.type);
                switch (data.type) {
                    case PkModel.ANSWER:
                        let matchScene = new PkRoomScene(data.type);
                        ViewManager.getInstance().changeScene(matchScene);
                        break;
                    case PkModel.KNOW:
                        // let resultScene = new TeamResultScene();
                        // let resultScene = new TeamKnowResultScene();
                        let roomScene = new PkRoomScene(data.type);
                        ViewManager.getInstance().changeScene(roomScene);
                        break;
                    case PkModel.AUTO:
                        //进入房间
                        let scene = new PkMatchScene();
                        ViewManager.getInstance().changeScene(scene);
                        break;
                    case PkModel.FRIEND:
                        let tips = new SharePanel();
                        this.addChild(tips);
                        let user = DataManager.getInstance().getUser();
                        //TODO  注册分享挑战
                        SocketX.getInstance().addEventListener(NetEvent.PK_INVITE, (data) => {
                            let inviteScene = new PkInviteScene(InviteStatus.INVITING);
                            ViewManager.getInstance().changeScene(inviteScene);
                        })
                        Util.registerShare(null, ShareType.PK_INVITE_FRIEND, user.nickName, null, (code) => {
                            //跳转等待对手加入界面
                            this.removeChild(tips);
                            SocketX.getInstance().sendMsg(NetEvent.PK_INVITE, { pkCode: code });
                        });
                        // let code = Util.randomString(32);
                        // console.log('pkcode:'+code);
                        // SocketX.getInstance().sendMsg(NetEvent.PK_INVITE,{pkCode:code});
                        // let inviteScene = new PkInviteScene(InviteStatus.INVITING);
                        // ViewManager.getInstance().changeScene(inviteScene);
                        break;
                }

            }, this);
        }


        if (this.type == 1) {//挑战记录

            let text = new egret.TextField();
            text.text = "挑战记录";
            text.size = 40;
            text.textColor = 0xf36e23;

            text.width = this.stage.stageWidth;
            text.textAlign = egret.HorizontalAlign.CENTER;
            text.y = this.stage.stageHeight - 100;
            this.addChild(text);
            text.touchEnabled = true;

            // SocketX.getInstance().addEventListener(NetEvent.PK_RECORDS,(data)=>{

            // })
            // SocketX.getInstance().sendMsg(NetEvent.PK_RECORDS,{ page:1,pageSize:20});

            text.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                let record = new PkRecordScene();
                ViewManager.getInstance().changeScene(record);
            }, this);

        }
    }

    public onBack() {
        SocketX.getInstance().close();
        ViewManager.getInstance().back();
    }
}

