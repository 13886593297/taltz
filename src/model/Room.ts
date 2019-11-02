class Room{
    //房间id
    tableNo:string;
    /**房间类型[知识赛、抢答题]*/
    roomType:PkModel;
   /**房间人数  6 or 10  */
    roomNumber:RoomNumber;
    /**进入房间的模式 1:参与者 2:旁观者*/
    joinType:JoinType;

    /** self: 自己在的位置 1到10 0表示未在战队中**/
    self:Object;
    /**用户  postion：user */
    users:Object;
    //PK结果
    pkResult:any;
    /**
     * PK数据
     * pkCode:对战code
     * questions:答题列表
     * pkType:
     * blue: 蓝队用户
     * green: 绿队用户
     * result:本次对战结果
     */
    pkData:any; 


}