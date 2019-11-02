

class BattleScene extends Scene {

    private index = 0;
    private pkData;
    private topic;
    private userInfo;
    private timer;
    private timeNumber;
    private timeText;
    private topicGroup;
    private scroller;

    private selfProgress;
    private otherProgress;

    private submitButton;

    private canSubmit;
    private readonly TIMER = 15;
    private numberText;


    private initData() {
        this.timeNumber = this.TIMER;
        //注册答题结束事件
        SocketX.getInstance().addEventListener(NetEvent.PK_PROGRESS, this.updateProgress, this)
        SocketX.getInstance().addEventListener(NetEvent.PK_ANSWER,(data)=>{
            if(data.data.tipsCode == InviteStatus.PK_END_WAIT){ //答题结束
                 let pk = new PkInviteScene(InviteStatus.PK_END_WAIT);
                 ViewManager.getInstance().changeScene(pk);
            }
        }, this)
        //十秒倒计时
        let timer = new egret.Timer(1000, this.TIMER + 10);
        this.timer = timer;
        timer.addEventListener(egret.TimerEvent.TIMER, () => {
            this.timeNumber--;
            this.timeText.text = this.timeNumber;
            if (this.timeNumber == 0) {
                timer.stop();
                if(!this.canSubmit) return;
                this.submitNull();
            }
        }, this);
        timer.start();
    }




    public init() {

        this.width = 750;
        this.anchorOffsetX = 375;
        this.x = this.stage.stageWidth / 2;
        this.initData();

        let userinfo = DataManager.getInstance().getUser();
        this.userInfo = userinfo;
        let leftUser = new PkUser(userinfo);
        leftUser.y = 100;
        this.addChild(leftUser);

        // let pkData ={questions:[{id:962},{id:960}]}

        let pkData = DataManager.getInstance().getPkData();

        this.pkData = pkData;
        let rightUser = new PkUser(pkData.pkUser, 'right');
        rightUser.y = 100;
        rightUser.anchorOffsetX = 243;
        rightUser.x = this.stage.stageWidth;
        this.addChild(rightUser);
        
       


        let pkVs = Util.createBitmapByName('pk_vs_png');
        pkVs.anchorOffsetX = 128;
        pkVs.anchorOffsetY = 86;
        pkVs.x = 375;
        pkVs.y = 240;
        this.addChild(pkVs)

        let progress = new VProgress(1, this.pkData.questions.length);
        progress.x = 30
        progress.y = 500;
        this.addChild(progress);
        progress.setRate(0);
        this.selfProgress = progress;
        let progress2 = new VProgress(2, this.pkData.questions.length);
        progress2.x = 690
        progress2.y = 500;
        this.addChild(progress2);
        progress2.setRate(0);
        this.otherProgress = progress2;
        if(pkData.type == 4 && pkData.pkUser){
              this.otherProgress.setRate(this.pkData.questions.length); 
        }

        let vs = new egret.TextField();
        vs.text = `${this.TIMER}`;
        vs.width = 100;
        vs.height = 100;
        vs.anchorOffsetX = 50;
        vs.anchorOffsetY = 50;
        vs.y = 240
        vs.x = 375;
        vs.textAlign = egret.HorizontalAlign.CENTER;
        vs.verticalAlign = egret.VerticalAlign.MIDDLE;
        vs.size = 40;
        this.addChild(vs);
        this.timeText = vs;

        let trainid = this.pkData.questions[this.index]['id']


        let subject: Subject = Util.getTrain(trainid);
        //选项 
         if(!subject)return;
        let group = new eui.Group();
        // this.addChild(group);

     

        group.width = 600;
            let number = new egret.TextField();
        number.width = 600;
        number.text ="Q"+(this.index+1);
        number.textColor = Config.COLOR_YELLOW;
        number.textAlign = egret.HorizontalAlign.CENTER;
        group.addChild(number);
        this.numberText = number;
        let topic = new Topic(subject);
        this.topic = topic;
        topic.y = 50;
        group.addChild(topic);
        this.topicGroup = group;
        var myScroller: eui.Scroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = 600;
        myScroller.height = this.stage.stageHeight - 650;
        myScroller.y = 450;
        myScroller.x = 75;
        //设置viewport
        myScroller.viewport = group;
        this.scroller = myScroller;
        this.addChild(myScroller);

        this.canSubmit = true;
        let submit = new XButton("提交");
        submit.width = 450;
        submit.x = 150;
        this.submitButton = submit;
        submit.y = this.stage.stageHeight - 150;
        this.addChild(submit);
        submit.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

            if(!this.canSubmit) return;
            let selectOption = this.topic.getSelect();
            if (!selectOption) {
                //TODO 
                let alert = new AlertPanel("请选择答案！", 900)
                this.addChild(alert);
                return;
            }
            let result = this.topic.getSelectResult();
            this.submitResult(result, selectOption);
            this.topic.setDisableSeleced();
        }, this)

    }

  
    /**
     * 提交答案
     *  1.正常提交
     *  2.超时提交答案
     */
    public submitResult(result, reply) {
        this.canSubmit = false;
        let qattrId = this.topic.getQAttrId();
        let useTime = this.TIMER - this.timeNumber;
        let params = {
            userId: this.userInfo.userId,//答题用户ID
            pkCode: this.pkData.pkCode,//唯一PkCode
            type: this.pkData.pkType,//3=在线匹配,4=离线答题
            qid: this.pkData.questions[this.index].id,//问题ID
            qattrId: qattrId,//问题属性ID
            reply: reply,//用户答案
            isCorrect: result ? 1 : 0,//回答是否正确1=正确,0=错误
            useTime: useTime//答题时间
        };
        SocketX.getInstance().sendMsg(NetEvent.PK_ANSWER, params)
        if (result) {
            Util.playMusic('answer_ok_mp3')
            this.topic.setSelectedStatus(TopicItem.STATUS_OK);
        }
        else {
            this.topic.setSelectedStatus(TopicItem.STATUS_ERROR);
            Util.playMusic('answer_err3_mp3')
        }
         this.submitButton.visible = false;
        this.selfProgress.setRate(this.index + 1)
        //如果有下一題，直接进入下一题
        if (this.index < this.pkData.questions.length - 1) {
            setTimeout(()=>{ this.next();},3000)
        }
    }

    public submitNull(){
        this.canSubmit = false;
        let qattrId = this.topic.getQAttrId();
        let useTime = this.TIMER - this.timeNumber;
        let params = {
            userId: this.userInfo.userId,//答题用户ID
            pkCode: this.pkData.pkCode,//唯一PkCode
            type: this.pkData.pkType,//3=在线匹配,4=离线答题
            qid: this.pkData.questions[this.index].id,//问题ID
            qattrId: qattrId,//问题属性ID
            reply: 'null',//用户答案
            isCorrect: 0,//回答是否正确1=正确,0=错误
            useTime: useTime//答题时间
        };
        SocketX.getInstance().sendMsg(NetEvent.PK_ANSWER, params)
        Util.playMusic('answer_err3_mp3')
        this.selfProgress.setRate(this.index + 1)
        //如果有下一題，直接进入下一题
        if (this.index < this.pkData.questions.length - 1) {
           this.next();
        }else{
            // 跳转等待页面
            // let pk = new PkInviteScene(InviteStatus.PK_END_WAIT);
            // ViewManager.getInstance().changeScene(pk);
        }
    }


    //进入下一题
    public next() {
        this.canSubmit = true;
        this.submitButton.visible = true;
        this.index++;
        this.numberText.text = `Q${this.index+1}`;
        this.timeNumber = this.TIMER;
        this.timer.reset();
        this.timeText.text = this.timeNumber;
        this.timer.start();
        this.topicGroup.removeChild(this.topic);
        let trainid = this.pkData.questions[this.index].id;
        let subject: Subject = Util.getTrain(trainid);
         if(!subject)return;
        //选项 
        let topic = new Topic(subject);
        topic.y = 50;
        this.topic = topic;
        this.topicGroup.addChild(topic);
        this.scroller.viewport.scrollV = 0;
    }

    /**
     * 更新进度条
     */
    public updateProgress(data) {
        this.otherProgress.setRate(data.data.seriaNo);
    }

}