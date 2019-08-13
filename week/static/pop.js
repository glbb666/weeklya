function showPopError(mes,_this) {
    _this.$store.dispatch("showpop",{
        popif: true,
        words: mes,
        type: 0
    });
}
function showPopRight(mes,_this){
    _this.$store.dispatch("showpop",{
        popif: true,
        words: mes,
        type: 1
    });
}
function showPopJoin(mes,_this) {
    _this.$store.dispatch("showpop",{
        popif: true,
        words: mes,
        type: 2
    });
}
function showPopWarning(mes,_this){
    _this.$store.dispatch('showpop',{
        popif:true,
        words:mes,
        type:3
    })
}
export {
    showPopRight,
    showPopError,
    showPopJoin,
    showPopWarning
}