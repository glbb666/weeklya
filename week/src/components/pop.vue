<template>
	<div class="pop">
		<div class="pop-bd">
			<div class="pop-hd">
				<i class="el-icon-circle-close" v-if="type===0"></i>
				<i class="el-icon-circle-check" v-else-if="type===1"></i>
				<i class="el-icon-warning" v-else></i>
			</div>
			<div class="pop-cont">
				{{words}}
			</div>
			<div class="pop-box" v-if="type!==2">
				<button @click="popnone(false)" class="pop-btn">确定</button>
			</div>
			<div class="pop-box" v-else>
				<button class="pop-btn" @click="popnone(true)">去加入</button>
				<button class="pop-btn" @click="popnone(false)"> 算了</button>
			</div>
		</div>
	</div> 
</template>

<script>
export default {
	name : 'pop',
	methods : {
		popnone (go) {
			console.log(go);
			if(go){
				this.$router.replace('/week/person/information');
			}
			this.$store.dispatch("showpop",{'popif' : false,'words' : '','type' : 0});
		},
	},
	props : ['words','type']
}
</script>

<style scoped>
.pop {
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.5);
	position: fixed;
	display: flex;
	top:0;
	left: 0;
	align-items: center;
	letter-spacing:2px;
	z-index: 9;
}

.pop .pop-bd {
	width: 20%;
	border-radius: 10px;
	height: 35%;
	margin: 50% auto;
	background-color: white;
}
.pop-bd .pop-hd {
	width: 100%;
	height: 55%;
}
.pop-hd i {
	width: 100%;
	height: 100%;
	background-size: auto 70%;
	background-position: center;
}

.pop-bd .pop-cont {
	width: 80%;
	height: 18%;
	margin: 0 auto;
	color: #686fbf;
	text-align: center;
	font-size: 23px;
}

.pop-cont .pop-top {
	width: 100%;
	height: 50%;
}

.pop-bd .pop-btn {
	width: 30%;
	border-radius: 90px;
	height: 15%;
	margin: 3% ;
	line-height: 50px;
	font-size: 25px;
	text-align: center;
	color:white;
	background-color: #686fbf;
	cursor: pointer;
}
.pop-box{
	display:flex;
	justify-content: center;
}
i{
	display: block;
	color: #686fbf;
	width: 100%;
	height: 100%;
	font-size: 120px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>