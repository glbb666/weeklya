<template>
   <div class="selectWeek"  >
       <input type="text" v-model="nowWeek" @click.stop="show=true" ref="inputWeek" placeholder="select Week">
       <div class="showWeek" @click.stop ="show=true" ref="showWeek" v-if="show"> 
           <div class="year">
               <a @click="change('year',-1)" title="上一年" class="left select">««</a>
               <a @click="change('moon',-1)" title="上个月" class="left select">«</a>
               <span><a class="select" title="选择年份">{{year}}年</a><a class="select" title="选择月份">{{moon}}月</a></span>
               <a @click="change('year',1)" title="下一年" class="right select">»»</a>
               <a @click="change('moon',1)" title="下个月" class="right select">»</a>
           </div>
        <div>
               <table>
                   <thead>
                       <tr>
                            <th></th>
                            <th>一</th>
                            <th>二</th>
                            <th>三</th>
                            <th>四</th>
                            <th>五</th>
                            <th>六</th>
                            <th>日</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr v-for="(week,i) of list" :class="{selectBg:curWeek===getYearWeek(year,moon,1)+i&&year===curYear}">
                            <td class="weekNum">{{getYearWeek(year,moon,1)+i}}</td>
                            <td v-for="weekday of week" @click.stop="selectOk($event,i,weekday.text)">
                                {{weekday.text}}
                            </td>
                        </tr>
                   </tbody>
               </table>
           </div>
       </div>
  </div>
</template>
<script>
  import {showPopError,showPopRight} from '../../../../../../../static/pop.js'
  export default {
    name: "selectWeek",
    props:['pyear','pmoon'],
    data(){
        return{
            year:null,
            moon:null,
            curYear:null,
            curMoon:null,
            firstday:null,
            weekFlag:false,
            show:false,
            list:[],
            currentMonthFirstDay: null, // 当前月的1号属于星期几
            currentMonthEndDate: null,  // 当前月的最后一天是几号
            currentMonthEndDay: null,   // 当前月的最后一天属于星期几
            lastMonthEndDate: null,     // 上个月的最后一天是几号
            curWeek:null,
            nowWeek:null,
            curWeekday:null,
            weekList:[],
            userId:null
        }
    },
    watch:{
        'year':function(){  
            this.reset();
        },
        'moon':function(){
            this.reset()
        },
        'curWeek':function(){
            this.nowWeek = this.year+"-"+this.curWeek+"周"  
        },
        'show':function(newValue){
            if(newValue){
                document.addEventListener('click',this.bindEvent);
            }else{
                document.removeEventListener('click',this.bindEvent);
            }
        }
    },
    methods:{
        init(){
            this.year = this.pyear
            this.moon = this.pmoon;
            this.userId = this.$route.query.userId? this.$route.query.userId:null;
        },
        reset(){
            //当前月的第一天是星期几
         //   this.currentMonthFirstDay = new Date(this.year, this.moon - 1, 1).getDay();
            this.currentMonthFirstDay = this.myGetDay(new Date(this.year, this.moon - 1, 1));

            //当前月的最后一天是几号
            this.currentMonthEndDate = new Date(this.year, this.moon, 0).getDate();
            //当前月的最后一天是星期几
         //   this.currentMonthEndDay = new Date(this.year, this.moon, 0).getDay();
            this.currentMonthEndDay = this.myGetDay(new Date(this.year, this.moon, 0));

            //前一个月的最后一天是几号
            if(this.moon === 1){
                this.lastMonthEndDate = new Date(this.year-1,12,0).getDate();
            }else{
                this.lastMonthEndDate = new Date(this.year,this.moon-1,0).getDate();
            }
            this.getDateList();  
        },
        bindEvent(){
            //点击文档日历收起
            this.show = false;
            //没有选中,重新初始化
            if(!this.curWeek){
                this.init();
            }
            //选中了,下次呈现的日历用选中的年月渲染
            if(this.curYear){
                this.year = this.curYear;
                this.moon = this.curMoon;
            }
        },
        change(obj,action){
             //obj为 moon或者year
            //action为1或者-1
            console.log(this[obj]);
            let nowYear = this.pyear;
            let nowMoon = this.pmoon;
            let result = this[obj]+action;
            if(obj==='moon'){
                if(this.year===nowYear&&result>nowMoon){
                    showPopError('已经到底了哦',this);
                    return;
                }
                if(result===0){
                    this.moon = 12;
                    this.year--;
                    return;
                }
                if(result===13){
                    this.moon = 1;
                    this.year++;
                    return;
                }
            }else{
                if(result>nowYear){
                    showPopError('已经到底了哦',this);
                    return;
                }        
            }
            this[obj]=result;

        },
        getDateList() {
                this.list = []
                // 获取日历第一行的数据（需加上第一个星期中所包含上个月的几天）
                //temp计算出上个月最后一天的星期数减去这个月第一天的星期数
                //上个月的最后一天是几号
                console.log(this.lastMonthEndDate);
                //这个月的第一天是星期几
                console.log(this.currentMonthFirstDay);
                //(this.currentMonthFirstDay - 1)得到的是上个月的最后一天是星期几
                //temp的值是在本页呈现的上个月的开始天数
                //上个月最后一天是星期五。31号
                //31-(5) = 26
                //日 一 二  三 四 五
                //26 27 28 29 30 31
                //let temp = this.lastMonthEndDate - (this.currentMonthFirstDay - 1);

                //为了改成星期一到星期五,需要少一天
                let temp = this.lastMonthEndDate - (this.currentMonthFirstDay - 1)+1;
                // 一 二  三 四 五
                // 27 28 29 30 31
                // let list = 
                //     this.numberList(temp, this.lastMonthEndDate, true)
                //     .concat(this.numberList(1, 7 - this.currentMonthFirstDay))
                //剩下的时间就得多填一天
                let list = 
                    this.numberList(temp, this.lastMonthEndDate, true)
                    .concat(this.numberList(1, 7 - this.currentMonthFirstDay+1))
                this.list.push(list);
                //好了，第一行填完了
                //剩下的天数,从第一行结束的天数开始算起
                temp = (7 - this.currentMonthFirstDay) + 2
                /*
                * 剩下的行数
                */
                // 计算除了第一行剩下的天数
                const leftDays = this.currentMonthEndDate - (7 - this.currentMonthFirstDay)-1;
                console.log(leftDays);
                // 剩下的星期数,决定还要写多少行
                const lineNumber = Math.ceil(leftDays / 7)
                // 包含下个月日历的天数
                const nextDays = 7 - (leftDays % 7)
                for (let i = 0; i < lineNumber; i++) {
                    //最后一行如果包含有别的月的情况
                    if (i === lineNumber - 1 && nextDays > 0 && nextDays !== 7) {
                        this.list[lineNumber] = 
                            this.numberList(temp, this.currentMonthEndDate)
                            .concat(this.numberList(1, nextDays, true))
                    } else {
                        this.list.push(this.numberList(temp, temp + 6))
                    }
                    temp = temp + 7
                }
        },
        numberList(start, end, flag) {
            let list = []
            for (let i = start; i <= end; i++) {
                list.push({
                    text: i,
                    flag: !!flag
                })
            }
            return list
        },
        getYearWeek(a, b, c) {
            //date1是当前日期
            //date2是当年第一天
            //d是当前日期是今年第多少天
            //用d + 当前年的第一天的周差距的和在除以7就是本年第几周
            var date1 = new Date(a, parseInt(b) - 1, c), date2 = new Date(a, 0, 1),
            d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
            return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
        },
        selectOk(target,i,weekday){
                this.show = false;
                this.curYear = this.year;
                this.curMoon = this.moon;
                this.curWeek = this.getYearWeek(this.year,this.moon,1)+i;
                this.curWeekday = weekday;
                this.getTask();
        },
        getTask(){
            console.log(this.curYear);
            console.log(this.curWeek);
            let time = this.curYear+""+this.curWeek;
            this.$axios.get('weekly_war/task/getOneTask.do?weektime='+time+'&userId='+this.userId).then(result=>{
            result = result.data;
            console.log(result)
            if (result.success){
              showPopRight('获取成功',this);
              this.$emit('func',result.Task);
              //对之前得到的数据进行同步修改
              this.weekList = result.Task;
              console.log(this.weekList);
            } else{
              showPopError('获取失败',this);
            }
          })
        },
        myGetDay(day){
            var w = day.getDay();
            if(w === 0){
                w = 7;
            }
            return w;
        }
    },
    created(){
        this.init();
    }
  }
</script>

<style scoped>
.selectWeek{
    position: relative;
}  
input{
    margin:10px 33px;
    height: 32px;
    padding:4px 11px;
    font-size: 14px;
    border:1px solid #d9d9d9;
    transition:all .3s;
    border-radius: 7px;
    width: 180px;
}
input:hover{
    box-shadow:0 0 2px #686fbf inset;
}
input:focus{
    border:#686fbf 1px solid;
}
.showWeek{
    position: absolute;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 8;
    background-color: #fff;
    left: 33px;
    top: 10px;
    transition: all .3s;
    border-radius: 7px;
    /* opacity: 0; */
    padding: 10px;
}
.year{
    height: 40px;
    line-height: 40px;
    text-align: center;
}
.year span{
    margin: 0 auto;
    display: inline-block;
}
.left{
    float: left;
    margin:0 10px;
}
.right{
    float: right;
    margin:0 10px;
}
table{
    font-size: 14px;
    border-spacing: 0px;
}
th{
    width: 33px;
    /* padding: 6px 0; */
}
tr{
    line-height: 1.5;
    cursor: pointer;
}
tr:hover{
    background-color: rgba(104,111,191, .3);
    font-weight: bold;
}
.selectBg{
    background-color: rgba(104,111,191, .6);
    font-weight: bold;
}
td{
    text-align: center;
    height: 24px;
    padding: 4px 0;
}
.weekNum{
    opacity: .5;
}
.select{
    color: #000;
}
.select:hover{
    color: #686fbf;
}
</style>
