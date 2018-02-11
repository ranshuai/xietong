var Getquerystring = {
      getquerystring: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        console.log(r);
        if (r != null) return unescape(r[2]);
        return null;
    
        }
    
}
exports = Getquerystring;
