class TeamRankScene extends Scene {
    private personRank = []
    private groupView
    private size = 20
    private personPage = 1
    private scrollView
    private teamid
    private _width
    private _height

    constructor(teamid) {
        super()
        this.teamid = teamid
    }

    public init() {
        super.setBackground()
        this._width = this.stage.stageWidth
        this._height = this.stage.stageHeight

        let bg = Util.createBitmapByName("teamRank_png")
        this.addChild(bg)

        //请求团队数据
        Http.getInstance().post(Url.HTTP_TEAM_PERSON_RANK_LIST, { tid: this.teamid, page: this.personPage, size: this.size }, (json) => {
            this.personRank = json.data
            if (json.data.length == this.size) {
                this.personPage += 1
            } else {
                this.personPage = -1
            }
            this.initRanker()
        })
    }

    private initRanker() {
        let group = new eui.Group()
        this.groupView = group
        group.width = 640

        this.addItem(this.personRank)

        var myScroller: eui.Scroller = new eui.Scroller()
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this._width
        myScroller.height = this._height - 200
        myScroller.y = 150
        //设置viewport
        myScroller.viewport = group
        this.addChild(myScroller)
        this.scrollView = myScroller

        // 上滑加载更多
        myScroller.addEventListener(eui.UIEvent.CHANGE_END, () => {
            if (myScroller.viewport.scrollV + this._height >= myScroller.viewport.contentHeight) {
                this.loadMoreData()
            }
        }, this)
    }

    private addItem(data, y = 60) {
      //  console.log(data)
        for (let rank of data) {
            let rankItem = this.rankItemTemplate(rank, y)
            y += 200
            rankItem.height = 200
            this.groupView.addChild(rankItem)
        }
    }

    private rankItemTemplate(item, y): any {
        let rankGroup = new eui.Group()
        rankGroup.y = y

        // 排名背景
        let rankBg = Util.createBitmapByName('rank_item_bg_png')
        rankGroup.x = (this._width - rankBg.width) / 2
        rankGroup.width = rankBg.width

        rankGroup.addChild(rankBg)
        // 排名皇冠
        if (item.serialNo < 4) {
            let crown = Util.createBitmapByName('cup' + item.serialNo + '_png')
            crown.x = 515
            crown.y = -30
            rankGroup.addChild(crown)
        }

        // 排名No.
        let num = new egret.TextField()
        num.text = item.serialNo
        num.textColor = item.serialNo == 1 ? 0xd7a83f : item.serialNo == 2 ? 0xbebebe : item.serialNo == 3 ? 0xb77e43 : 0x077424
        num.bold = true
        num.size = item.serialNo < 100 ? 50 : 38
        num.x = 55
        num.y = 5
        num.width = 66
        num.height = 66
        num.textAlign = egret.HorizontalAlign.CENTER
        num.verticalAlign = egret.VerticalAlign.MIDDLE
        rankGroup.addChild(num)

        // 组名
        let userInfo = new egret.TextField()
        userInfo.textFlow = [
            { text: item.teamName + '\n', style: { size: 28 } },
            { text: Util.getStrByWith(item.userName, 160, 40), style: { size: 40 } }
        ]
        userInfo.y = 45
        userInfo.x = 145
        userInfo.lineSpacing = 10
        rankGroup.addChild(userInfo)

        // 达标率
        let achiRate = new egret.TextField()
        achiRate.textFlow = [
            { text: '个人达标率：\n' },
            { text: '个人当月积分：' }
        ]
        achiRate.x = 340
        achiRate.y = 60
        achiRate.size = 20
        achiRate.lineSpacing = 15
        rankGroup.addChild(achiRate)

        let achiRateNum = new egret.TextField()
        achiRateNum.textFlow = [
            { text: item.achiRate.toFixed(2) + '%\n' },
            { text: item.score + '' }
        ]
        achiRateNum.x = 470
        achiRateNum.size = 36
        achiRateNum.y = 50
        rankGroup.addChild(achiRateNum)

        return rankGroup
    }

    private loadMoreData() {
        if (this.personPage > 0) {
            Http.getInstance().post(Url.HTTP_TEAM_PERSON_RANK_LIST, { tid: this.teamid, page: this.personPage, size: this.size }, (json) => {
              //  console.log(json)
                if (json.data.length == this.size) {
                    this.personPage += 1
                } else {
                    this.personPage = -1
                }
                this.personRank.concat(json.data)
                this.addItem(json.data, this.scrollView.viewport.contentHeight)
            })
        }
    }
}