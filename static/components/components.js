
class Ajax {
    constructor(wrapper) {
        this.wrapper = wrapper;
    }
    get(url) {
        return new Promise(function(resolve, reject) {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onload = function() {
            if (this.status == 200) {
              resolve(this.response);
            } else {
              const error = new Error(this.statusText);
              error.code = this.status;
              reject(error);
            }
          };
          xhr.onerror = function() {
            reject(new Error("Network Error"));
          };
          xhr.send();
        });
    };
    post(url, params, csrf) {
        return new Promise(function(resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Cookie', csrf)
            xhr.setRequestHeader('Content-Type', 'multipart/form-data')
            // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.onload = function() {
                if (this.status == 200) {
                  resolve(this.response);
                } else {
                  const error = new Error(this.statusText);
                  error.code = this.status;
                  reject(error);
                }
            };
            xhr.onerror = function() {
                reject(new Error("Network Error"));
            };
            xhr.send(params);
        })
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

export {Ajax, Cookie}