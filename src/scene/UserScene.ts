/**
 * 用户中心
 */
class UserScene extends Scene {

    public constructor() {
        super()
    }

    public init() {
        super.setBackground()
        this.btn_bg = 'close_png'
        Util.setTitle('个人中心')

        let shareGroup = new eui.Group()
        this.addChild(shareGroup)

        // 玩家信息
        let user = new UserInfo('center')
        user.y = 20
        shareGroup.addChild(user)

        // 保存图片和分享
        let radarPanel = new RadarPanel(this)
        radarPanel.x = (this.stage.stageWidth - 660) / 2
        radarPanel.y = 590
        shareGroup.addChild(radarPanel)

        // 玩家数据
        let userData = DataManager.getInstance().getUser()
        // // 调试代码开始
        // var x = 0.1
        // userData.attrInfo.map(item => {
        //     item.rate = x
        //     x += 0.15
        // })
        // // 调试代码结束
        let radar = new Radar(userData.attrInfo, userData.attrName, 450, 450)
        radar.x = 140
        radar.y = 580
        shareGroup.addChild(radar)
        // 注册微信分享
        Util.registerShare(shareGroup, ShareType.USER_INFO, userData.nickName, userData.lvName)
    }
}