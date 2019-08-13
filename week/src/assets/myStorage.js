var myStorage = {
    setItem(key,val,...rest){
        var arr = ['list','msgCount']
        if(arr.indexOf(key)!==-1){
            window.localStorage.setItem(key,JSON.stringify(val));
            var _this = rest[0];
            var method;
            method = key==='list'?"setMessage":"setMesCount";
            _this.$store.dispatch(method,val);
            return;
        }
        window.localStorage.setItem(key,val);
    },
    getItem(key,...rest){
        var arr = ['list','msgCount']
        if(arr.indexOf(key)!==-1){
            return JSON.parse(window.localStorage.getItem(key));
        }
        return window.localStorage.getItem(key);
    }
}
export default myStorage