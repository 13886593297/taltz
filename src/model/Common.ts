

enum ShareType {
    NORMAL = 1, //普通分享
    USER_INFO = 2, //用户中心
    TRAIN_RESULT = 3, //训练场结果
    PK_BATTLE = 4,//个人挑战赛
    PK_ANSWER = 5,//团队抢答题
    PK_KNOW = 6,//团队知识赛
    PK_INVITE_FRIEND = 10,//邀请对战 
}

const EquipmentConfigs = [
    { id: 1, bg: 'equip_bg_1_png', name: '最新内容', qaType: [3178, 3168], type: [15, 11], qaids: '51' },
    { id: 2, bg: 'equip_bg_2_png', name: '疾病档案', qaType: [3177, 3167], type: [16, 12], qaids: '49' },
    { id: 3, bg: 'equip_bg_3_png', name: '产品资料', qaType: [3175, 3179], type: [17, 13], qaids: '46, 48, 50, 51' },
    { id: 4, bg: 'equip_bg_4_png', name: '竞品分析', qaType: [3176, 3180], type: [18, 14], qaids: '47' }
]