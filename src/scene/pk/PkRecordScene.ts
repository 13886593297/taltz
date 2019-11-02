
class PkRecordScene extends Scene {

    public constructor() {
        super();
    }

    private groupView;
    private scrollView;
    private itemY = 10;
    private page = 1;
    private pageSize = 20;
    private end = false;



    public init() {

        // this.nav = "返回";

        SocketX.getInstance().addEventListener(NetEvent.PK_RECORDS, (data) => {
            ViewManager.getInstance().hideLoading();
            this.updateGroup(data.data || [])
        })
        SocketX.getInstance().sendMsg(NetEvent.PK_RECORDS, { page: this.page, pageSize: this.pageSize });
        let title = new Title("挑战记录");
        title.y = 100;
        this.addChild(title);

        let group = new eui.Group();
        this.groupView = group;
        group.width = 720;

        var myScroller: eui.Scroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth;
        myScroller.height = 800;
        myScroller.y = 220;
        //设置viewport
        myScroller.viewport = group;
        this.addChild(myScroller);
        this.scrollView = myScroller;

        myScroller.addEventListener(eui.UIEvent.CHANGE_END, () => {
            if (myScroller.viewport.scrollV + 800 >= myScroller.viewport.contentHeight) {
                if (!this.end) {
                    SocketX.getInstance().sendMsg(NetEvent.PK_RECORDS, { page: this.page, pageSize: this.pageSize });
                }
            }
        }, this);

        let backButton = new XButton("返回PK模式目录");
        this.addChild(backButton);
        backButton.width = 350;
        backButton.anchorOffsetX = 175;
        backButton.x = this.stage.stageWidth / 2;
        backButton.y = this.stage.stageHeight - 200;
        backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            ViewManager.getInstance().back();
        }, this)
        ViewManager.getInstance().showLoading('数据加载中...');
    }


    private updateGroup(list) {
        if (list.length < 20) {
            this.end = true;
        }
        if (list.length == 0 && this.page == 1) {
            let alert = new egret.TextField();
            alert.size = 35;
            alert.height = 100;
            alert.verticalAlign = egret.VerticalAlign.MIDDLE;
            alert.textAlign = egret.HorizontalAlign.CENTER;
            alert.width = 600;
            alert.x = this.stage.stageWidth / 2 - 300
            alert.text = "暂无挑战数据"
            this.groupView.addChild(alert);
        }
        this.page += 1;
        for (let data of list) {
            let item = new RecordItem(data);
            item.x = this.stage.stageWidth / 2
            item.y = this.itemY;
            this.groupView.addChild(item);
            this.itemY += item.height;
        }
    }


}




class RecordItem extends eui.Group {

    private data;

    private status = {
        "1": { text: "胜利", style: { "textColor": 0xf6da6b } },
        "2": { text: '失败', style: { "textColor": 0xd23d60 } },
        '3': { text: '进行中' },
        '4': { text: '平局' },
        '5': { text: '无效局' }
    }

    constructor(data) {
        super();
        this.data = data;
        this.init();
    }

    private init() {
        this.width = 720;

        this.anchorOffsetX = 360;

        let title = new egret.TextField();
        // title.text = this.data.title;

        let pkWayText = this.data.pkWay == 1 ? '匹配' : '邀请'
        title.textFlow = <Array<egret.ITextElement>>[
            { text: this.data.sendName },
            { text: ` ${pkWayText}\n`, style: { "textColor": Config.COLOR_YELLOW } },
            { text: this.data.acceptName },
            { text: "  对战", style: { "textColor": Config.COLOR_YELLOW } }
        ];


        // title.textColor = Config.COLOR_YELLOW;
        // title.height = 100;
        title.lineSpacing = 20;
        title.x = 20;
        title.verticalAlign = egret.VerticalAlign.MIDDLE;
        title.width = 520;
        this.height = 150;

        this.addChild(title);
        let selfid = DataManager.getInstance().getUser().userId;


        // let res = 1;
        // switch (this.data.status) {
        //     case 0:
        //         res = 5;
        //         break;
        //     case 1:
        //     case 2:
        //         res = 3;
        //         break;

        //     case 3:
        //         if (this.data.winUserId == 0) {
        //             res = 4;
        //         } else {

        //             if (selfid == this.data.sendUserId) { //我是发起者
        //                 if (this.data.winUserId == this.data.sendUserId) {
        //                     res = 1;
        //                 } else {
        //                     res = 2;
        //                 }
        //             } else {
        //                 if (this.data.winUserId == this.data.sendUserId) {
        //                     res = 2;
        //                 } else {
        //                     res = 1;
        //                 }
        //             }
        //         }
        //         break;
        // }

        let result = new egret.TextField();
        let text = this.data.pkResult; //this.status[res];
        result.size = 35;
        result.textFlow = <Array<egret.ITextElement>>[text];
        result.height = 100;
        result.verticalAlign = egret.VerticalAlign.MIDDLE;
        result.textAlign = egret.HorizontalAlign.CENTER;
        result.width = 150;
        result.x = 285


        this.addChild(result);



        let date = new egret.TextField();
        date.text = this.data.createTime;
        date.width = 200;
        date.textAlign = egret.HorizontalAlign.RIGHT;
        date.height = 100;
        date.verticalAlign = egret.VerticalAlign.MIDDLE;
        date.x = title.width;
        this.addChild(date);


        let line = Util.createBitmapByName('dialog_line_png');
        line.width = this.width;
        line.y = title.textHeight + 10;
        this.addChild(line);


        this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            SocketX.getInstance().addEventListener(NetEvent.PK_INFO, (data) => {
                let result = data.data;
                if (result.tipsCode == InviteStatus.WATTING) {
                    let pk = new PkInviteScene(InviteStatus.WATTING);
                    ViewManager.getInstance().changeScene(pk);
                } else {
                    // result.sendUserId = this.data.sendUserId
                    // result.accepUserId = this.data.accepUserId
                    result = DataManager.getInstance().convertPkResult(result);
                    let resultScene = new PkResultScene(result, PkResultBackModel.BACK)
                    ViewManager.getInstance().changeScene(resultScene);
                }


            })
            SocketX.getInstance().sendMsg(NetEvent.PK_INFO, { pkCode: this.data.pkCode })

        }, this);

    }
}   