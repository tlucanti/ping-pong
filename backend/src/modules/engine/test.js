
const url =     'http://localhost:3000/api/engine/move/1';
const get_url = 'http://localhost:3000/api/engine/get/1';
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
    xhr.open('GET', url, true);
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

let timer = setInterval(
    function() {
        fetch(get_url,
            {
                mode: "no-cors",
                headers: {
                    Accept: 'application/json',
                },
            })
        .then(response => response.json())
        .then(json => { console.log(json)});
    },
    1000
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
