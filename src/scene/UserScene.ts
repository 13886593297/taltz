/**
 * 用户中心
 */
class UserScene extends Scene {
    public constructor() {
        super()
    }

    public init() {
        super.setBackground()
        this.close_btn = 'close_yellow_png'
        Util.setTitle('个人中心')

        let shareGroup = new eui.Group()
        this.addChild(shareGroup)

        // 玩家信息
        let user = new UserInfo('center')
        shareGroup.addChild(user)

        // 保存图片和分享
        let radarPanel = new RadarPanel(this)
        radarPanel.x = (this.stage.stageWidth - 660) / 2
        radarPanel.y = 530
        this.addChild(radarPanel)

        // 玩家数据
        let userData = DataManager.getInstance().getUser()
        let radar = new Radar(userData.attrInfo, userData.attrName, 450, 450)
        radar.x = (this.stage.stageWidth - 450) / 2
        radar.y = 550
        shareGroup.addChild(radar)
        // 注册微信分享
        Util.registerShare(shareGroup, ShareType.USER_INFO, userData.nickName, userData.lvName)
    }
}