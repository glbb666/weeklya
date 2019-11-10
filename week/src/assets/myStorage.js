var myStorage = {
    setItem(key,val,...rest){
        var obj = {
            'list':'setMessage',
            'msgCount':'setMesCount'
        };
        if(obj[key]){
            window.localStorage.setItem(key,JSON.stringify(val));
            var _this = rest[0];
            _this.$store.dispatch(obj[key],val);
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