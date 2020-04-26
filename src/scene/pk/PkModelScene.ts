class PkModelScene extends Scene {
    private readonly config = {
        "1": {
            title: 'pk_modal_title_person_png',
            items: [
                { icon: 'pk_auto_png', type: PkModel.AUTO },
                { icon: 'pk_friend_png', type: PkModel.FRIEND }]
        },
        "2": {
            title: 'pk_modal_title_team_png',
            items: [
                { icon: 'pk_answer_png', type: PkModel.ANSWER },
                { icon: 'pk_knowledge_png', type: PkModel.KNOW }
            ]
        }
    }

    private data
    private type
    constructor(type) {
        super()
        this.type = type
        this.data = this.config[type]
    }

    public init() {
        super.setBackground()
        this.name = "pkmodel"

        let stageW = ViewManager.getInstance().stage.stageWidth
        let title = Util.createBitmapByName(this.data.title)
        title.x = (stageW - title.width) / 2
        title.y = 45
        this.addChild(title)

        if (this.type == PKTYPE.PERSON) {
            SocketX.getInstance().connectPersonPk()
        } else {
            SocketX.getInstance().connectTeamPk()
        }

        let itemY = 400
        for (let data of this.data.items) {
            let item = new PkItem(data)
            this.addChild(item)
            item.y = itemY
            itemY += 200
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                Util.playMusic('model_select_mp3')
                DataManager.getInstance().setPkModel(data.type)
                switch (data.type) {
                    case PkModel.ANSWER:
                        let matchScene = new PkRoomScene(data.type)
                        ViewManager.getInstance().changeScene(matchScene)
                        break
                    case PkModel.KNOW:
                        // let resultScene = new TeamResultScene()
                        // let resultScene = new TeamKnowResultScene()
                        let roomScene = new PkRoomScene(data.type)
                        ViewManager.getInstance().changeScene(roomScene)
                        break
                    case PkModel.AUTO:
                        //进入房间
                        let scene = new PkMatchScene()
                        ViewManager.getInstance().changeScene(scene)
                        break
                    case PkModel.FRIEND:
                        let tips = new SharePanel()
                        this.addChild(tips)
                        let user = DataManager.getInstance().getUser()
                        //TODO  注册分享挑战
                        SocketX.getInstance().addEventListener(NetEvent.PK_INVITE, (data) => {
                            let inviteScene = new PkInviteScene(InviteStatus.INVITING)
                            ViewManager.getInstance().changeScene(inviteScene)
                        })
                        Util.registerShare(null, ShareType.PK_INVITE_FRIEND, user.nickName, null, (code) => {
                            //跳转等待对手加入界面
                            this.removeChild(tips)
                            SocketX.getInstance().sendMsg(NetEvent.PK_INVITE, { pkCode: code })
                        })
                        // test begin
                        // let code = Util.randomString(32)
                        // console.log('pkcode:'+code)
                        // SocketX.getInstance().sendMsg(NetEvent.PK_INVITE,{pkCode:code})
                        // let inviteScene = new PkInviteScene(InviteStatus.INVITING)
                        // ViewManager.getInstance().changeScene(inviteScene)
                        // test end
                        break
                }

            }, this)
        }


        if (this.type == 1) {//挑战记录
            let record = Util.createBitmapByName('pk_record_png')
            record.x = (stageW - record.width) / 2
            record.y = this.stage.stageHeight - 300
            record.touchEnabled = true
            this.addChild(record)
            // SocketX.getInstance().addEventListener(NetEvent.PK_RECORDS,(data)=>{})
            // SocketX.getInstance().sendMsg(NetEvent.PK_RECORDS,{ page:1,pageSize:20})

            record.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                let record = new PkRecordScene()
                ViewManager.getInstance().changeScene(record)
            }, this)
        }
    }

    public onBack() {
        SocketX.getInstance().close()
        ViewManager.getInstance().back()
    }
}

