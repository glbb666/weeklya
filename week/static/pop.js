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
export {
    showPopRight,
    showPopError
}