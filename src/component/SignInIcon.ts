class SignInIcon extends eui.Component implements eui.UIComponent {

    btnOpen: eui.Image;
    btnClose: eui.Image;
    btnGoto: eui.Image;
    public constructor() {
        super();
    }

    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
        super.childrenCreated();

        this.btnOpen.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            egret.Tween.get(this).to({ x: 0 }, 600, egret.Ease.sineIn);
        }, this);

        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            egret.Tween.get(this).to({ x: -260 }, 600, egret.Ease.sineIn);
        }, this);

        this.btnGoto.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let week = DataManager.getInstance().getTime()
            switch (week) {
                case 1:
                    var i = Util.getDailyTaskID();
                    let scene = new EquipList(EquipmentConfigs[i]);
                    scene.isFromDY = true;
                    ViewManager.getInstance().changeScene(scene);
                    break;
                case 2:
                    var i = Util.getDailyTaskID();
                    Http.getInstance().post(Url.HTTP_DAILYTASKS_START, { questionAttrIds: EquipmentConfigs[i].qaids }, (data) => {
                        let answer = new Answers();
                        answer.lifecycleId = data.data.lifecycleId;
                        answer.questions = data.data.questions.slice(0, 5);

                        let scene = new AnswerScene(answer, 9);
                        ViewManager.getInstance().changeScene(scene);
                    });
                    break;
                case 3:
                    Http.getInstance().post(Url.HTTP_DAILYTASKS_CONTENT, {}, (data) => {
                        if (typeof data.data == 'object') {
                            let i = data.data[0].typeid
                            let scene = new EquipList(EquipmentConfigs[i]);
                            scene.isFromDY = true;
                            ViewManager.getInstance().changeScene(scene);
                        } else {
                            let alert = new AlertPanel("未添加装备信息，请联系管理员。", 1120)
                            this.parent.addChild(alert)
                        }
                    })
                    break;
                case 4:
                    Http.getInstance().post(Url.HTTP_DAILYTASKS_CONTENT, {}, (json) => {
                        if (typeof json.data == 'object') {
                            let i = json.data[0].typeid
                            Http.getInstance().post(Url.HTTP_DAILYTASKS_START, { questionAttrIds: EquipmentConfigs[i].qaids }, (data) => {
                                if (data.data.questions.length) {
                                    let answer = new Answers();
                                    answer.lifecycleId = data.data.lifecycleId;
                                    answer.questions = data.data.questions
            
                                    let scene = new AnswerScene(answer, 9);
                                    ViewManager.getInstance().changeScene(scene);
                                } else {
                                    let alert = new AlertPanel("未指定题目，请联系管理员。", 1120)
                                    this.parent.addChild(alert)
                                }
                            });
                        } else {
                            let alert = new AlertPanel("未添加装备信息，请联系管理员。", 1120)
                            this.parent.addChild(alert)
                        }
                    })
                    break;
            }
            egret.Tween.get(this).to({ x: -260 }, 600, egret.Ease.sineIn);
        }, this);
    }
}