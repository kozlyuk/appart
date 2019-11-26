
class Resident {
    constructor(wrapper) {
        this.wrapper = wrapper;
    }
    httpGet(url) {
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onload = function() {
            if (this.status == 200) {
              resolve(this.response);
            } else {
              var error = new Error(this.statusText);
              error.code = this.status;
              reject(error);
            }
          };
          xhr.onerror = function() {
            reject(new Error("Network Error"));
          };
          xhr.send();
        });
    }
}

class Cookie {
    constructor(args) {
        this.args = args;
    }
    get(name) {
        let matches = document.cookie.match(
            new RegExp(
                "(?:^|; )" +
                name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                "=([^;]*)"
            )
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
}


class App {
    constructor(content) {
        this.content = content;
    }
    put(content) {
        document.getElementById("app").innerHTML = content;
    }
}



export {Resident, Cookie, App}
// let xhr = new XMLHttpRequest();
//     let wrapper = document.getElementById('modal-wrapper');
//     xhr.open('GET', '/accounts/api/v1/users/', true);
//     xhr.responseType = 'json';
//     xhr.send();
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState != 4) return;
//         let array = xhr.response;
//         array.forEach(element => {
//             wrapper.innerHTML += '<p> <td>email: ' + element.email + '</p<>';
//         });
//     }