class Auth{

    login(cb){
        cb();
        localStorage.setItem("authenticated","true")
    }
    logout(cb){
        cb();
        localStorage.clear();
    }
    isAuthenticated(){
        return localStorage.getItem("authenticated");
    }
}

export default new Auth();