class RankScene extends Scene {
    private currentIdx = 1
    private teamRank = []
    private personRank = []
    private groupView
    private size = 20
    private teamPage = 1
    private personPage = 1
    private scrollView
    private _width
    private _height

    public init() {
        super.setBackground()
        Util.setTitle('排行榜')
        this._width = this.stage.stageWidth
        this._height = this.stage.stageHeight

        this.initTitle()

        // 请求个人数据
        this.getRank(Url.HTTP_PERSON_RANK_LIST, this.personPage, this.size)
            .then(data => {
                this.personRank = data.list
                this.personPage = data.page
                this.initRanker(this.currentIdx)
            })

        // 请求战队数据
        this.getRank(Url.HTTP_TEAM_RANK_LIST, this.teamPage, this.size)
            .then(data => {
                this.teamRank = data.list
                this.teamPage = data.page
            })
    }

    /**
     * 返回排名数据
     * @param url 个人排名或战队排名url
     * @param page 第几页
     * @param size 每页显示多少条
     */
    private getRank(url, page, size): any {
        return new Promise(resolve => {
            Http.getInstance().post(url, { page, size }, json => {
                if (json.data.length == size) {
                    page += 1
                } else {
                    page = -1
                }
                resolve({
                    list: json.data, 
                    page
                })
            })
        })
    }

    private initTitle() {
        let y = 50
        let grayFilter = Util.grayFliter()

        let selfRank = Util.createBitmapByName('rank_title_self_png')
        this.addChild(selfRank)

        let teamRank = Util.createBitmapByName('rank_title_team_png')
        this.addChild(teamRank)
        selfRank.x = this._width / 2 - selfRank.width - 10
        teamRank.x = this._width / 2 + 5
        teamRank.y = selfRank.y = y
        teamRank.touchEnabled = selfRank.touchEnabled = true
        teamRank.filters = [grayFilter]

        // 点击切换排名
        selfRank.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.initRanker(1)
            selfRank.filters = []
            teamRank.filters = [grayFilter]
        }, this)

        teamRank.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.initRanker(2)
            selfRank.filters = [grayFilter]
            teamRank.filters = []
        }, this)
    }

    private initRanker(type) {
        // 切换排名先删除清空子元素
        if (this.groupView) {
            this.groupView.removeChildren()
            this.scrollView.stopAnimation()
            this.scrollView.viewport.scrollV = 0
        }

        let group = new eui.Group()
        this.groupView = group
        group.width = 640
        let rankDatas = this.personRank
        if (type == 2) {
            rankDatas = this.teamRank
        }

        this.addItem(rankDatas, type)
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

    private addItem(data, type, y = 60) {
        for (let rank of data) {
            let rankItem = this.rankItemTemplate(type, rank, y)
            y += 200
            rankItem.height = 200
            this.groupView.addChild(rankItem)
        }
    }

    private loadMoreData() {
        if (this.currentIdx == 1 && this.personPage > 0) {
            this.getRank(Url.HTTP_PERSON_RANK_LIST, this.personPage, this.size)
                .then(data => {
                  //  console.log(data)
                    this.personRank.concat(data.list)
                    this.personPage = data.page
                    this.addItem(data.list, 1, this.scrollView.viewport.contentHeight)
                })
        }

        if (this.currentIdx == 2 && this.teamPage > 0) {
            this.getRank(Url.HTTP_TEAM_RANK_LIST, this.teamPage, this.size)
                .then(data => {
                    this.teamRank.concat(data.list)
                    this.teamPage = data.page
                    this.addItem(data.list, 2, this.scrollView.viewport.contentHeight)
                })
        }
    }

    private rankItemTemplate(type, rank, y): any {
        let rankGroup = new eui.Group()
        rankGroup.y = y

        // 排名背景
        let rankBg = Util.createBitmapByName('rank_item_bg_png')
        rankGroup.x = (this._width - rankBg.width) / 2
        rankGroup.width = rankBg.width
        rankGroup.addChild(rankBg)

        // 排名皇冠
        if (rank.serialNo < 4) {
            let crown = Util.createBitmapByName('cup' + rank.serialNo + '_png')
            crown.x = 515
            crown.y = -30
            rankGroup.addChild(crown)
        }

        // 排名No.
        let num = new egret.TextField()
        num.text = rank.serialNo
        num.textColor = rank.serialNo == 1 ? 0xd7a83f : rank.serialNo == 2 ? 0xbebebe : rank.serialNo == 3 ? 0xb77e43 : 0x077424
        num.bold = true
        num.size = rank.serialNo < 100 ? 50 : 38
        num.x = 55
        num.y = 5
        num.width = 66
        num.height = 66
        num.textAlign = egret.HorizontalAlign.CENTER
        num.verticalAlign = egret.VerticalAlign.MIDDLE
        rankGroup.addChild(num)

        // 组名 用户名
        let userInfo = new egret.TextField()
        if (type == 1) {
            userInfo.textFlow = [
                { text: rank.teamName + '\n', style: { size: 28 } },
                { text: Util.getStrByWith(rank.userName, 160, 40), style: { size: 40 } }
            ]
            userInfo.lineSpacing = 10
        } else {
            userInfo.text = rank.teamName
            userInfo.size = 44
            userInfo.width = 300
            userInfo.height = 90
            userInfo.verticalAlign = 'middle'
        }
        userInfo.y = 45
        userInfo.x = 145
        rankGroup.addChild(userInfo)

        // 达标率
        let achiRate = new egret.TextField()
        if (type == 1) {
            achiRate.textFlow = [
                { text: '个人达标率：\n' },
                { text: '个人当月积分：' }
            ]
            achiRate.x = 340
            achiRate.y = 60
            achiRate.size = 20
            achiRate.lineSpacing = 15
        } else {
            achiRate.text = '团队平均积分'
            achiRate.x = 460
            achiRate.y = 100
            achiRate.size = 22
        }
        rankGroup.addChild(achiRate)

        let achiRateNum = new egret.TextField()
        if (type == 1) {
            achiRateNum.textFlow = [
                { text: rank.achiRate.toFixed(2) + '%\n' },
                { text: rank.score + '' }
            ]
            achiRateNum.x = 470
            achiRateNum.size = 36
            achiRateNum.y = 50
        } else {
            achiRateNum.text = rank.score ? rank.score.toFixed(2) : '0'
            achiRateNum.x = 450
            achiRateNum.width = 150
            achiRateNum.textAlign = egret.HorizontalAlign.CENTER
            achiRateNum.size = 42
            achiRateNum.y = 50
        }
        rankGroup.addChild(achiRateNum)

        // 如果是战队排行榜，注册点击事件
        if (type == 2) {
            rankGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                let scene = new TeamRankScene(rank.teamId)
                ViewManager.getInstance().changeScene(scene)
            }, this)
        }
        return rankGroup
    }
}