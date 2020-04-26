/**
 * 题目信息
 */
class Topic extends eui.Group {
    //答案
    public answer
    //问题
    private _topic

    private subject: Subject

    private options = {}

    private selected

    private canSelected = true

    private textFlow
    private title
    private isTeamAnswer

    constructor(subject: Subject, width = 633, isTeamAnswer?) {
        super()
        this.subject = subject
        this.width = width
        this.isTeamAnswer = isTeamAnswer
        if (this.subject.type == TopicType.BLANK) { //填空题
            this.initBlank()
        } else {//选择题
            this.init()
        }
    }

    private init() {
        //题目标题
        let qtitle = new egret.TextField()
        qtitle.y = 10
        qtitle.width = this.width
        qtitle.textColor = Config.COLOR_MAINCOLOR

        let titleText = this.subject.title
        if (this.subject.type == TopicType.MULTIPLE) {//多选题
            titleText += "(多选题)"
        }
        this.title = qtitle
        qtitle.text = titleText
        qtitle.size = 36
        if (this.width < 600 && this.width > 400) {
            qtitle.size = 30
        } else if (this.width < 400) {
            qtitle.size = 24
        }
        qtitle.lineSpacing = 10
        qtitle.textAlign = egret.HorizontalAlign.CENTER
        this.addChild(qtitle)

        let y = qtitle.textHeight + 40

        let optionNumArr = ['A', 'B', 'C', 'D']
        this.subject.options.forEach((item, i) => {
            if (item.name && item.name.length >= 1) {
                let topicItem = new TopicItem(optionNumArr[i], item, this.width, this.isTeamAnswer)
                topicItem.y = y
                topicItem.x = 0
                this.addChild(topicItem)
                this.options[item.flag] = topicItem
                topicItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelect(item.flag), this)
                y += topicItem.height + 20
            }
        })
        this.height = y + 100
    }

    private onSelect(flag) {
        return () => {
            Util.playMusic('model_select_mp3')
            if (!this.canSelected) return
            //TODO 处理新的问题
            for (let k in this.options) {
                let topicItem = this.options[k]
                if (k == flag) {
                    if (this.subject.type == TopicType.MULTIPLE) { //多选题 重复点击会取消
                        if (!this.selected) this.selected = []
                        let index = this.selected.indexOf(flag)
                        if (index > -1) {//已选择 取消
                            this.selected.splice(index, 1)
                            topicItem.setStatus(TopicItem.STATUS_NORMAL)
                        } else { //未选择 请选择
                            this.selected.push(flag)
                            topicItem.setStatus(TopicItem.STATUS_SELECTED)
                        }
                    } else { //单选
                        this.selected = flag
                        topicItem.setStatus(TopicItem.STATUS_SELECTED)
                    }
                } else {
                    if (this.subject.type == TopicType.MULTIPLE) {
                        continue
                    }
                    topicItem.reset()
                }
            }
        }
    }
    //初始化填空题
    private initBlank() {
        this.width = 600
        //题目标题
        let qtitle = new egret.TextField()
        qtitle.width = 600
        this.title = qtitle
        // qtitle.text = this.subject.title
        qtitle.lineSpacing = 10
        qtitle.y = 10
        // qtitle.textAlign = egret.HorizontalAlign.LEFT
        this.addChild(qtitle)

        let titles = this.subject.title.split('__')
        let textFlow = <Array<egret.ITextElement>>[]
        this.textFlow = textFlow
        let k = 0
        for (let item of titles) {
            textFlow.push({ text: item })
            if (k == 0) textFlow.push({ text: '         ', style: { underline: true, size: 30 } })
            k++
        }
        qtitle.textFlow = textFlow

        let input: egret.TextField = new egret.TextField()
        this.addChild(input)
        input.text = ''
        input.width = 1
        input.height = 1
        input.y = 100
        input.alpha = 0.01
        /*** 本示例关键代码段开始 ***/
        input.type = egret.TextFieldType.INPUT
        input.addEventListener(egret.FocusEvent.FOCUS_IN, function (e: egret.FocusEvent) {
            console.log('input set FOCUS')
        }, this)
        input.addEventListener(egret.FocusEvent.FOCUS_OUT, function (e: egret.FocusEvent) {
        }, this)
        input.addEventListener(egret.Event.CHANGE, function (e: egret.Event) {
            this.selected = input.text
            this.textFlow[1] = { text: '  ' + input.text + '  ', style: { "underline": true, size: 30 } }
            qtitle.textFlow = this.textFlow
        }, this)

        qtitle.touchEnabled = true
        qtitle.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
            console.log('input set FOCUS_OUT')
            input.setFocus()
        }, this)


        let alertText = new egret.TextField()
        alertText.text = '点击横线处输入答案'
        alertText.textColor = 0x999999
        alertText.width = this.width
        alertText.y = 300
        alertText.textAlign = egret.HorizontalAlign.CENTER
        this.addChild(alertText)
    }
    /**
     * 获取答题选项
     */
    public getSelect() {
        if (!this.selected) return null
        if (this.subject.type == TopicType.MULTIPLE) return this.selected.join("")
        return this.selected
    }
    /**
     * 设置题目状态
     */
    public setSelectedStatus(status) {
        switch (this.subject.type) {
            case TopicType.SINGLE:
                this.options[this.selected].setStatus(status)
                break
            case TopicType.MULTIPLE:
                let result = this.subject.result.split(',')
                for (let key in this.options) {
                    let option = this.options[key]
                    if (Util.inArray(key, this.selected)) {
                        if (Util.inArray(key, result)) {
                            option.setStatus(TopicItem.STATUS_OK)
                        } else {
                            option.setStatus(TopicItem.STATUS_ERROR)
                        }
                    } else {
                        if (Util.inArray(key, result)) {
                            option.setStatus(TopicItem.STATUS_CORRECT)
                        }
                    }
                }
                break
            case TopicType.BLANK:
                switch (status) {
                    case TopicItem.STATUS_OK:
                        this.textFlow[1]['style'].textColor = Config.COLOR_YELLOW
                        this.title.textFlow = this.textFlow
                        break
                    case TopicItem.STATUS_ERROR:
                        this.textFlow[1]['style'].textColor = 0xFF0000
                        this.title.textFlow = this.textFlow
                        break
                }
                break
        }
    }

    /**
     * 不能选择
     */
    public setDisableSeleced() {
        this.canSelected = false
    }

    /**
     * 判断题目的准确性
     */
    public getSelectResult() {
        switch (this.subject.type) {
            case TopicType.SINGLE:
            case TopicType.BLANK:
                if (this.selected == this.subject.result) {
                    return true
                }
                return false
            case TopicType.MULTIPLE:
                let result = this.subject.result.split(',')
                if (result.sort().toString() == this.selected.sort().toString()) {
                    return true
                }
                return false
        }

    }

    public getQAttrId() {
        return this.subject.qattrid
    }

    /**
     * 设置正确选项
     */
    public setCorrectItem() {
        this.subject.result.split(',').map(key => {
            this.options[key].setStatus(TopicItem.STATUS_CORRECT)
        })
    }
}

enum TopicType {
    SINGLE = 1,
    MULTIPLE = 2,
    BLANK = 3,
}

class TopicItem extends egret.DisplayObjectContainer {

    private bg: egret.Bitmap
    private icon: egret.Bitmap
    private text: egret.TextField

    private option
    private readonly BG_RES = ['option_normal_png', 'option_select_png', 'option_error_png', 'option_ok_png', 'option_ok_png']

    private readonly ICON_RES = { 2: "icon_err_png", 3: "icon_ok_png" }

    public static readonly STATUS_NORMAL = 0
    public static readonly STATUS_SELECTED = 1
    public static readonly STATUS_ERROR = 2
    public static readonly STATUS_OK = 3
    public static readonly STATUS_CORRECT = 4

    private status
    private optionNum
    private prefix
    private isTeamAnswer

    public constructor(optionNum, option, width = 633, isTeamAnswer?) {
        super()
        this.width = width
        this.option = option
        this.optionNum = optionNum
        this.isTeamAnswer = isTeamAnswer
        this.status = TopicItem.STATUS_NORMAL
        this.touchEnabled = true
        this.init()
    }

    public init() {
        let x, width, size, height
        if (this.width < 600 && this.width > 400) {
            x = 150
            width = 250
            size = 24
            height = 30
        } else if (this.width < 400) {
            x = 110
            width = 225
            size = 20
            height = 24
        } else {
            x = 150
            width = 420
            size = 30
            height = 36
        }

        let line = Math.ceil(Util.getWidth(this.option.name, size) / width)
        this.height = 82 + (line - 1) * height
        this.initBg()

        // 答案内容
        let text = new egret.TextField()
        text.text = this.option.name
        text.width = width
        text.height = this.height
        text.lineSpacing = 10
        text.x = x
        text.size = size
        text.textAlign = egret.HorizontalAlign.CENTER
        text.verticalAlign = egret.VerticalAlign.MIDDLE
        text.textColor = 0x79cd72
        this.text = text
        this.addChild(text)
        
        // 答案前缀
        let prefix = new egret.TextField()
        prefix.text = this.optionNum
        this.prefix = prefix
        prefix.width = 100
        prefix.height = this.height
        prefix.size = 40
        prefix.textAlign = egret.HorizontalAlign.CENTER
        prefix.verticalAlign = egret.VerticalAlign.MIDDLE
        this.addChild(prefix)
    }

    private initBg() {
        let bg = Util.createBitmapByName(this.BG_RES[this.status])
        bg.width = this.width
        bg.height = this.height

        this.bg = bg
        this.addChild(bg)

        let icon = new egret.Bitmap()
        if (this.status == TopicItem.STATUS_OK || this.status == TopicItem.STATUS_ERROR) {
            this.icon.texture = RES.getRes(this.ICON_RES[this.status])
        }
        icon.x = 580
        icon.y = this.height / 2
        icon.anchorOffsetY = 24
        if (this.width < 600 && this.width > 400) {
            icon.x = 400
        } else if (this.width < 400) {
            icon.x = 300
        }
        this.icon = icon
        this.addChild(icon)
    }

    private onTap() {
        this.setStatus(TopicItem.STATUS_SELECTED)
    }
    /**
     * 重置状态
     */
    public reset() {
        this.setStatus(TopicItem.STATUS_NORMAL)
    }

    /**
     * 设置状态  默认单选
     */
    public setStatus(status: number) {
        if (this.status == status) return
        this.status = status
        this.bg.texture = RES.getRes(this.BG_RES[status])
        if (status == 0) {
            this.text.textColor = 0x79cd72
        } else if (status == 2) {
            this.text.textColor = 0x4d7d44
            this.prefix.textColor = 0x99a496
        } else {
            this.text.textColor = 0xffffff
        }
        if (this.isTeamAnswer) return
        if (status == TopicItem.STATUS_OK || status == TopicItem.STATUS_ERROR) {
            this.icon.visible = true
            this.icon.texture = RES.getRes(this.ICON_RES[status])
        } else {
            this.icon.visible = false;
        }
    }

    public release() {
        this.removeChildren()
    }
}


/**
 * 填空题
 */
class Blanks extends eui.Group {

}