class GetKettle extends Scene implements egret.DisplayObjectContainer {
  private userScore
  private scoreContent
  private scoreAni
  constructor() {
    super()
  }

  private _myRotation: Number = 5  // 旋转

  public init() {
    super.setBackground('taltz_bg_png')
    this.close_btn = 'close_white_png'
    Util.setTitle('桃子森林')

    let stage = ViewManager.getInstance().stage
    let userInfo = DataManager.getInstance().getUser()
    this.userScore = userInfo.score

    // 桃子森林标题
    let title = Util.createBitmapByName('title_png')
    title.x = 50
    title.y = 30
    this.addChild(title)

    // 头像积分背景
    let avatar_bg = Util.createBitmapByName('avatar_bg_png')
    avatar_bg.x = stage.stageWidth - avatar_bg.width
    avatar_bg.y = 200
    this.addChild(avatar_bg)

    // 头像
    Util.setUserImg(userInfo.avatar, 108, 476, 205, this)

    // 积分文字
    let scoreText = new egret.TextField()
    scoreText.text = '积分'
    scoreText.x = 610
    scoreText.y = 220
    scoreText.size = 40
    this.addChild(scoreText)

    // 积分数值
    this.showScore(this.userScore)

    // 树下阴影
    let treeShadow = Util.createBitmapByName('shadow_png')
    treeShadow.y = 1190
    this.addChild(treeShadow)

    // 桃子树
    let peachArr = [
      { bg: 'peachTreeLevel6_png', x: 0, y: stage.stageHeight / 2 - 150, width: 750 },
      { bg: 'peachTreeLevel5_png', x: 580, y: 810, width: 230 },
      { bg: 'peachTreeLevel4_png', x: 245, y: 870, width: 230 },
      { bg: 'peachTreeLevel3_png', x: 0, y: stage.stageHeight / 2 - 150, width: 750 },
      { bg: 'peachTreeLevel2_png', x: 360, y: 730, width: 230 },
      { bg: 'peachTreeLevel1_png', x: 0, y: stage.stageHeight / 2 - 150, width: 750 },
    ]
    for (let i = 0; i < peachArr.length; i++) {
      let peach = Util.createBitmapByName(peachArr[i].bg)
      peach.x = peachArr[i].x
      peach.y = peachArr[i].y
      peach.width = peachArr[i].width
      this.addChild(peach)
      if (i == 1 || i == 2 || i == 4) {
        peach.anchorOffsetX = peach.width / 2
        peach.rotation = -this._myRotation
        let tw = egret.Tween.get(peach, { loop: true })
        tw.to({ rotation: this._myRotation }, 1000, egret.Ease.quadInOut)
          .to({ rotation: -this._myRotation }, 1000, egret.Ease.quadInOut)
        peach.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.Event) => {
          let tw = egret.Tween.get(evt.target)
          tw.to({ x: 640, y: 266, scaleX: 0.2, scaleY: 0.2 }, 1500).call(() => {
            this.userScore += 15
            this.showScore(this.userScore)
            this.showScoreAni()
          }).to({alpha: 0}, 500)
        }, this)
        peach.touchEnabled = true
      }
    }

    // 浇水动画
    let kettle = new MyMovieClip('kettleMovie')
    kettle.x = 380
    kettle.y = 450
    kettle.alpha = 0
    this.addChild(kettle)
    let tw = egret.Tween.get(kettle)
    tw.to({ alpha: 1 }, 500).wait(2000)
      .to({ alpha: 0 }, 500)
  }

  // 显示积分数值变化
  private showScore(num) {
    if (this.scoreContent) {
      this.removeChild(this.scoreContent)
    }
    this.scoreContent = new egret.TextField()
    this.scoreContent.text = num
    this.scoreContent.x = 610
    this.scoreContent.y = 266
    this.scoreContent.size = 40
    this.addChild(this.scoreContent)
  }

  // 积分增加的动画
  private showScoreAni() {
    this.scoreAni = new egret.TextField()
    this.scoreAni.text = '+15'
    this.scoreAni.size = 50
    this.scoreAni.x = 660
    this.scoreAni.y = 280
    this.addChild(this.scoreAni)
    let tw = egret.Tween.get(this.scoreAni)
    tw.to({ y: 240, alpha: 0 }, 500)
  }
}