
class TeamRankScene extends Scene {


    private personRank = [];
    private groupView;

    private size = 20;
    private personPage = 1;
    private scrollView;

    private teamid;

    constructor(teamid) {
        super();
        this.teamid = teamid;
    }

    public init() {
        super.setBackground();

        let bg = Util.createBitmapByName("blue_small_bg_png");
        bg.width = 590;
        // bg.height = 1080;
        bg.x = (this.stage.width - bg.width) / 2;
        bg.y = 80;
        this.addChild(bg);

        let title = new CTitle('队内月排行');
        title.y = 160;
        title.x = (this.stage.stageWidth - 283) / 2;
        this.addChild(title);

        //请求团队数据
        Http.getInstance().post(Url.HTTP_TEAM_PERSON_RANK_LIST, { tid: this.teamid, page: this.personPage, size: this.size }, (json) => {
            this.personRank = json.data;
            if (json.data.length == this.size) {
                this.personPage += 1;
            } else {
                this.personPage = -1;
            }
            this.initRanker();
        })
    }



    private initRanker() {

        let x = this.stage.stageWidth / 2 - 315;
        let bg = Util.createBitmapByName("user_border_png");
        bg.width = 630;
        bg.height = 830
        bg.x = x;
        bg.y = 250;
        this.addChild(bg);

        let group = new eui.Group();
        this.groupView = group;
        group.width = 630;
        let rankDatas = this.personRank;
        let y = 10;
        for (let rank of rankDatas) {
            rank.type = 1;
            // let rankItem = new RankItemTemplate(rank);
            // rankItem.x = (this.stage.stageWidth - 555) / 2;
            // rankItem.y = y;
            // group.addChild(rankItem);
            // y += 210;
        }

        var myScroller: eui.Scroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth;
        myScroller.height = 700;
        myScroller.y = 280;
        //设置viewport
        myScroller.viewport = group;
        this.addChild(myScroller);
        this.scrollView = myScroller;

        myScroller.addEventListener(eui.UIEvent.CHANGE_END, () => {
            if (myScroller.viewport.scrollV + 800 >= myScroller.viewport.contentHeight) {
                this.loadMoreData();
            }
        }, this);

        let downArrow = Util.createBitmapByName('icon_down_png');
        downArrow.anchorOffsetX = 66;
        downArrow.y = 1050;
        downArrow.x = this.stage.stageWidth / 2;
        this.addChild(downArrow);
        downArrow.touchEnabled = true;
        downArrow.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            myScroller.viewport.scrollV += 200;
        }, this)

    }


    private loadMoreData() {

        if (this.personPage > 0) {
            Http.getInstance().post(Url.HTTP_TEAM_PERSON_RANK_LIST, { tid: this.teamid, page: this.personPage, size: this.size }, (json) => {
                if (json.data.length == this.size) {
                    this.personPage += 1;
                } else {
                    this.personPage = -1;
                }
                this.personRank.concat(json.data);
                let x = this.stage.stageWidth / 2 - 315;
                let y = this.scrollView.viewport.contentHeight
                for (let rank of json.data) {
                    rank.type = 1;
                    let rankItem = new RankItem(rank, 500);
                    rankItem.x = x + 65;
                    rankItem.y = y;
                    this.groupView.addChild(rankItem);
                    y += rankItem.height + 10;

                }
            })
        }
    }
}