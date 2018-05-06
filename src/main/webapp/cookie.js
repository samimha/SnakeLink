document.addEventListener('DOMContentLoaded', function () {

    let myCookies = {};

    //load
    //key-value-pairs
    let kvp = document.cookie.split(';');

    //rebuilding the cookie list
    for (let key in kvp){
        let cookie = kvp[key].split('=');
        myCookies[cookie[0].trim()] = cookie [1];
    }
    document.querySelector('#user').value = myCookies['user'];
    document.querySelector('#color').value = myCookies['color'];


    //save function
    document.querySelector('#save').addEventListener('click', function (){
        myCookies['user'] = document.querySelector('#user').value;
        myCookies['color'] = document.querySelector('#color').value;
        
        document.cookie = '';
        let expiry = new Date(Date.now() + 60 * 1000).toString(); //60 sec from now on
        let cookieString = '';
        for(let key in myCookies){
            cookieString = key + '=' + myCookies[key] + ';' + expiry + ";path=/";
            document.cookie = cookieString;
        }
        alert(document.cookie);
    });

    
});