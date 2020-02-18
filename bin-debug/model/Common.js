var ShareType;
(function (ShareType) {
    ShareType[ShareType["NORMAL"] = 1] = "NORMAL";
    ShareType[ShareType["USER_INFO"] = 2] = "USER_INFO";
    ShareType[ShareType["TRAIN_RESULT"] = 3] = "TRAIN_RESULT";
    ShareType[ShareType["PK_BATTLE"] = 4] = "PK_BATTLE";
    ShareType[ShareType["PK_KNOW"] = 5] = "PK_KNOW";
    ShareType[ShareType["PK_ANSWER"] = 5] = "PK_ANSWER";
    ShareType[ShareType["PK_INVITE_FRIEND"] = 10] = "PK_INVITE_FRIEND";
})(ShareType || (ShareType = {}));
var EquipmentConfigs = [
    { id: 0, icon: '', bg: '', name: '搜索结果', type: 0, qaids: 51 },
    { id: 1, icon: '', bg: 'equip_bg_1_png', name: '最新内容', type: 15, qaids: '51' },
    { id: 2, icon: '', bg: 'equip_bg_2_png', name: '疾病档案', type: 16, qaids: '49' },
    { id: 3, icon: '', bg: 'equip_bg_3_png', name: '产品资料', type: 17, qaids: '46, 48, 50, 51' },
    { id: 4, icon: '', bg: 'equip_bg_4_png', name: '竞品分析', type: 18, qaids: '47' }
];
