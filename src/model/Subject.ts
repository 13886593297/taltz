
class Subject {

    /**题目类型：选择题 填空题  */
    public type:number;
    public id:number;
    /**
     * 标题内容
     */
    public title:string;
    /**
     * 题目选项
     */
    public options:Array<TOptions>;
    /**
     * 题目结果
     */
    public result:string;

    /**
     * 错题分析
     */
    public content:string;

    /**
     * 题目状态
     */
    public status:number;

    public qattrid:number;
}

/**
 * 题目选项
 */
class TOptions {

    public name:string;

    public flag:string;

}