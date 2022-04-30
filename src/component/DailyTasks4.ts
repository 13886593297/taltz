class DailyTasks4 extends eui.Component implements eui.UIComponent {

    btnClose: eui.Image
    btnGoto: eui.Image
    clickArea: eui.Label
    t: any
    i: any
    flag: boolean = true

    public constructor() {
        super()
        Http.getInstance().post(Url.HTTP_DAILYTASKS_CONTENT, {}, (data) => {
            if (typeof data.data == 'object') {
                this.i = data.data[0].typeid
                this.t = '本篇内容涉及领域为：' + EquipmentConfigs[this.i].name
            } else {
                this.flag = false
            }
        })
    }

    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance)
    }

    protected childrenCreated(): void {
        super.childrenCreated()

        this.clickArea.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (this.flag) {
                this.parent.parent.parent.removeChild(this.parent.parent)
                DataManager.getInstance().hasShowSignIn = true
                Http.getInstance().post(Url.HTTP_DAILYTASKS_START, { questionAttrIds: EquipmentConfigs[this.i].qaids }, (data) => {
                    if (data.data.questions.length) {
                        let answer = new Answers()
                        answer.lifecycleId = data.data.lifecycleId
                        answer.questions = data.data.questions
                        let scene = new AnswerScene(answer, 9)
                        ViewManager.getInstance().changeScene(scene)
                    } else {
                        let alert = new AlertPanel('未指定题目，请联系管理员。', 950)
                        alert.anchorOffsetX = 30
                        this.addChild(alert)
                    }
                })
            } else {
                let alert = new AlertPanel('未添加装备信息，请联系管理员。', 950)
                alert.anchorOffsetX = 30
                this.addChild(alert)
            }
        }, this)

        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.parent.parent.parent.removeChild(this.parent.parent)
            DataManager.getInstance().hasShowSignIn = true
            let scene = new IndexScene()
            ViewManager.getInstance().changeScene(scene)
        }, this)
    }

}