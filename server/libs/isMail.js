//合法性
function isMail(mail) {
    let mailreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return mailreg.test(mail);
}
module.exports = isMail;