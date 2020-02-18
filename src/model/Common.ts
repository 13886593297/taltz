

enum ShareType {
    NORMAL = 1, //普通分享
    USER_INFO = 2, //用户中心
    TRAIN_RESULT = 3, //训练场结果
    PK_BATTLE = 4,//个人挑战赛
    PK_KNOW = 5,//团队知识赛
    PK_ANSWER = 5,//团队抢答题
    PK_INVITE_FRIEND = 10,//邀请对战 
}

const EquipmentConfigs = [
    { id: 0, icon: '', bg: '', name: '搜索结果', type: 0, qaids: 51 },
    { id: 1, icon: '', bg: 'equip_bg_1_png', name: '最新内容', type: 15, qaids: '51' },
    { id: 2, icon: '', bg: 'equip_bg_2_png', name: '疾病档案', type: 16, qaids: '49' },
    { id: 3, icon: '', bg: 'equip_bg_3_png', name: '产品资料', type: 17, qaids: '46, 48, 50, 51' },
    { id: 4, icon: '', bg: 'equip_bg_4_png', name: '竞品分析', type: 18, qaids: '47' }
]