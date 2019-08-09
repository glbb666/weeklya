var myStorage = {
    setItem(key,val,...rest){
        if(key==='list'){
            window.localStorage.setItem(key,JSON.stringify(val));
            var _this = rest[0];
            _this.$store.dispatch("setMessage",val);
            return;
        }
        window.localStorage.setItem(key,val);
    },
    getItem(key,...rest){
        if(key==='list'){
            return JSON.parse(window.localStorage.getItem(key));
        }
        return window.localStorage.getItem(key);
    }
}
export default myStorage