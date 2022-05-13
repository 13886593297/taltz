class RuleScene extends Scene {
    public init() {
        this.close_btn = false
        super.setBackground()

        let rule = Util.createBitmapByName('rule_png')
        rule.x = this.stage.stageWidth / 2
        rule.anchorOffsetX = rule.width / 2
        rule.y = 150
        this.addChild(rule)

        // 关闭按钮
        let closeButton = Util.createBitmapByName('close_white_png')
        this.addChild(closeButton)
        closeButton.x = 580
        closeButton.y = 200
        closeButton.touchEnabled = true
        closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.onBack()
        }, this)

        // 规则文字
        let group = new eui.Group
        group.width = this.stage.stageWidth

        let ruleText = new RuleText()
        group.addChild(ruleText)

        var myScroller: eui.Scroller = new eui.Scroller()
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = 520
        myScroller.height = 660
        myScroller.x = (this.stage.stageWidth - myScroller.width) / 2
        myScroller.y = 300
        //设置viewport
        myScroller.viewport = group
        this.addChild(myScroller)
    }
}


class RuleText extends eui.Group {
    constructor() {
        super()
        this.init()
    }
    public init() {
        var text: egret.TextField = new egret.TextField
        text.width = 520
        text.size = 28
        text.lineSpacing = 20
        text.fontFamily = "微软雅黑"
        text.textFlow = <Array<egret.ITextElement>>[
            { text: " \n" }
            , { text: " 一. 基本规则 \n", style: { "size": 35, bold: true } }
            , { text: "1. 排名规则 \n", style: { "size": 30, bold: true } }
            , { text: "a.个人排名:根据用户的个人达标率从高到低排名，达标率相同，根据当月积分从高到低来排名。\n" }
            , { text: "b.团队排名:根据团队达标率从高到低排名，达标率相同，根据团队当月平均积分从高到低来排名。\n\n" }
            , { text: "2. 达标率规则 \n", style: { "size": 30, bold: true } }
            , { text: "个人达标率：以个人当前日期向前推算30天，只要签到满16次(以20个工作日计算达到80%)即为达标，当个人30天内签到次数大于等于16次时，个人达标率显示为100%;\n" }
            , { text: "计算公式:30天内达标天数/16。\n" }
            , { text: "团队达标率：当前团队成员达标人数/团队总人数。\n\n" }
            , { text: "3. 如何签到 \n", style: { "size": 30, bold: true } }
            , { text: "每日进入游戏完成签到任务视为签到成功。\n\n" }
            , { text: "4. 如何获得积分 \n", style: { "size": 30, bold: true } }
            , { text: "个人积分：由每日签到的5积分和训练场每通关一关小关卡加20积分组成:\n" }
            , { text: "a. 每日完成签到任务一次，获得5积分,积分获得上限每日1次；\n" }
            , { text: "b. 在训练场中完成一关获得20积分，积分获得上限为每日1次；\n" }
            , { text: "c. 桃子森林每浇水5次，将长出一个桃子，摘取桃子后获得15积分；\n" }
            , { text: "d. 所有积分在每月最后一天清零；\n\n" }
            , { text: "5. 如何获得等级称号 \n", style: { "size": 30, bold: true } }
            , { text: "a. 完成四大训练场“净”“阶”“王”“者”中各20个关卡，可分别点亮“净”“阶”“王”“者”四个徽章，并解锁下一个训练场；\n" }
            , { text: "b. 在每个训练场中，每通过一个关卡，将解锁下一个关卡，并获得相应的等级称号 。\n\n\n" }
            , { text: "二.  训练场规则 \n", style: { "size": 35, bold: true } }
            , { text: "a.每一关卡含10道随机习题，完成10题并点击提交后，可查看本次训练的正确率；\n" }
            , { text: "b.正确率达到100%，才可通关并解锁下一关。要知道，训练可没有捷径能走！\n" }
            , { text: "c.答题过程中可收藏题目，在“训练场-我的收藏”中可查看。\n\n\n" }
            , { text: "**本平台规则由水果品牌组制定，并拥有最终解释权" }
        ]
        this.addChild(text)
        this.width = text.textWidth
        this.height = text.textHeight
    }
}