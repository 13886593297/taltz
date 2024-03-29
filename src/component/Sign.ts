/**
 * 每日签到组件
 * 半透明背景、背景、标头、日历  关闭按钮
 *
 */
class Sign extends egret.DisplayObjectContainer {
    private readonly WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    private _myGroup: eui.Group
    private signed
    private signData
    public constructor() {
        super()
        this.signData = DataManager.getInstance().getSign()
        let signed = this.signData['signStr'].split('')
        let signedData = []
        for (let i = 0; i < signed.length; i++) {
            if (signed[i] > 0) {
                signedData.push(i + 1)
            }
        }
        this.signed = signedData
        this.init()
    }

    public init() {
        let stage = ViewManager.getInstance().stage

        let mask: egret.Bitmap = Util.createBitmapByName('sign_bg_png')
        mask.x = 0
        mask.y = 0
        mask.width = stage.stageWidth
        mask.height = stage.stageHeight
        this.addChild(mask)

        // 窗口弹出效果
        let group = new eui.Group()
        group.width = stage.stageWidth
        group.height = stage.stageHeight
        group.x = stage.stageWidth / 2
        group.y = stage.stageHeight / 2
        group.anchorOffsetX = group.width / 2
        group.anchorOffsetY = group.height / 2
        group.scaleX = 0
        group.scaleY = 0
        this.addChild(group)
        this._myGroup = group
        egret.Tween.get(group).to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.backInOut)

        // 签到背景
        var signBg = Util.createBitmapByName('sign_date_bg_png')
        signBg.x = stage.stageWidth / 2
        signBg.anchorOffsetX = signBg.width / 2
        signBg.y = 150
        group.addChild(signBg)

        // 关闭按钮
        let closeButton = Util.createBitmapByName('close_white_png')
        closeButton.x = 580
        closeButton.y = 180
        closeButton.touchEnabled = true
        closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            Util.playMusic('model_select_mp3')
            eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CLOSING, true, true)
            this.parent.removeChild(this)
        }, this)
        group.addChild(closeButton)

        this.createCalendar()
    }

    private createSignText() {
        let group = new eui.Group()
        group.y = 780
        this._myGroup.addChild(group)

        let text1 = new egret.TextField()
        text1.textFlow = [
            {
                text: ' ' + this.signData.signtTotal + ' ',
                style: { size: 50, underline: true }
            },
            { text: '天', style: { size: 40 } },
            { text: '累计签到', style: { size: 30 } }
        ]
        text1.x = 150
        text1.y = 20
        text1.textColor = 0x333333
        group.addChild(text1)

        let text2 = new egret.TextField()
        text2.textFlow = [
            {
                text: ' ' + this.signData.signAllTotal + ' ',
                style: { size: 50, underline: true }
            },
            { text: '人', style: { size: 40 } },
            { text: '今日签到', style: { size: 30 } }
        ]
        text2.x = 420
        text2.y = 20
        text2.textColor = 0x333333
        group.addChild(text2)

        let userinfo = DataManager.getInstance().getUser()

        let notes = new egret.TextField()
        notes.textFlow = [
            {
                text: '你已持续达标',
            },
            {
                text: userinfo.contSignTotal + '',
                style: { textColor: Config.COLOR_MAINCOLOR, bold: true }
            },
            {
                text: '天',
            },
        ]
        notes.x = 230
        notes.y = 250
        notes.size = 40
        notes.textColor = 0xffffff
        group.addChild(notes)
    }

    // 创建日历
    private createCalendar() {
        let group = new eui.Group()
        group.y = 180
        this._myGroup.addChild(group)

        let width = 70 // 每个日期的宽度
        let left = 140 // 最初的左边距

        // 创建星期头部
        for (let i = 0; i < this.WEEK.length; i++) {
            let label = new egret.TextField()
            label.text = this.WEEK[i]
            label.x = left + i * width
            label.y = 150
            label.width = width
            label.textAlign = egret.HorizontalAlign.CENTER
            label.size = 26
            label.textColor = 0x333333
            group.addChild(label)
        }

        let height = 72 // 每个数字的高度
        let date = new Date() // 当前日期
        let currentDay = date.getDate()
        // 获取这个月有多少天：
        // 将月份下移到下一个月份，同时将日期设置为0，
        // 由于Date里的日期是1~31，所以Date对象自动跳转到上一个月的最后一天，getDate获取天数即可。
        date.setMonth(date.getMonth() + 1)
        date.setDate(0)
        let currentMonthMaxDays = date.getDate()
        // 设置回第一天，获取第一天星期几
        date.setDate(1)
        let firstDayWeek = date.getDay() == 0 ? 7 : date.getDay()
        let max = firstDayWeek + currentMonthMaxDays
        for (let i = 0; i < max; i++) {
            if (i >= firstDayWeek) {
                let day = i - firstDayWeek + 1
                let sign = 0 // 未签到
                if (this.signed.indexOf(day) > -1) {
                    sign = 1 // 已签到
                } else {
                    if (currentDay == day) {
                        sign = 2 // 正在签到
                    }
                }
                
                let singItem = new SignItem(day, sign)
                singItem.x = left + ((i - 1) % 7) * width
                singItem.y = Math.ceil(i / 7) * height + 110
                group.addChild(singItem)
            }
        }

        this.createSignText()
    }
}

class SignItem extends egret.DisplayObjectContainer {
    private text
    private readonly W = 88
    private readonly H = 70
    private sign = 0
    constructor(text, sign = 0) {
        super()
        this.text = text
        this.sign = sign
        this.width = this.W
        this.height = this.H
        this.init()
    }
    private init() {
        if (this.sign > 0) {
            let icon = Util.createBitmapByName('sign_mask_png')
            icon.x = (this.W - icon.width) / 2
            icon.y = (this.H - icon.height) / 2 - 2
            this.addChild(icon)

            //当前签到中
            if (this.sign == 2) {
                icon.alpha = 0
                egret.Tween.get(icon).to(
                    { alpha: 1 },
                    3000,
                    egret.Ease.backInOut
                )
            }
        }

        let label = new egret.TextField()
        label.text = this.text
        label.width = this.W
        label.height = this.H
        label.size = 28
        label.textAlign = egret.HorizontalAlign.CENTER
        label.verticalAlign = egret.VerticalAlign.MIDDLE
        label.textColor = 0x333333
        this.addChild(label)
    }
}
