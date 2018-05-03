document.addEventListener("DOMContentLoaded", function () {

    let myCookies = {};

    document.querySelector('#save').addEventListener("click", function (){
        myCookies["user"] = document.querySelector('#user').value;
        myCookies["age"] = document.querySelector('#age').value;
        myCookies['color'] = document.querySelector('#color').value;
        
        document.cookie = '';
        let expiry = new Date(Date.now() + 60 * 1000).toString();
        let cookieString = '';
        for(let key in myCookies){
            cookieString = key + '=' + myCookies[key] + ';' + expiry + ';';
            document.cookie = cookieString;
        }
        document.querySelector('#out').textContent += document.cookie;
        alert(document.cookie);
    });
});