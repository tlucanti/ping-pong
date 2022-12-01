
const url =     'http://localhost:3000/api/engine/move/1';
//const get_url = 'http://localhost:3000/api/engine/get/1';
const get_url = 'http://localhost:3000/api/user/get/lol';
let coord = 0.5

function max(a, b)
{
    if (a > b)
        return a;
    return b;
}

function min(a, b)
{
    if (a < b)
        return a;
    return b;
}

function getjson(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('GET', '0.0.0.0:3001', true);
    //xhr.setRequestHeader('Origin', 'http://localhost:3000');
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

let resp = getjson(get_url, function(status, resp) {
    console.log(status, resp);
});

let timer = setInterval(
    function() {
    getjson(get_url, function(status, resp) {
        console.log(status, resp);
    });
        /*fetch(get_url,
            {
                mode: "no-cors",
                headers: {
                    Accept: 'application/json',
                },
            })
        .then(response => response.json())
        .then(json => { console.log(json)}); */
    },
    100000000000
);

document.onkeypress = async function(ev) {
    ev = ev || window.event;
    switch (ev.key) {
        case 'w':
            console.log('pressed w');
            coord = min(1, coord + 0.1);
            break ;
        case 's':
            console.log('pressed s');
            coord = max(0, coord - 0.1);
            break ;
    }
    const data = {
        position: coord
    };
    const response = await fetch(url, {
        mode: 'no-cors',
        method: 'POST',
        body: "body",
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
