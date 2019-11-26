
class Ajax {
    constructor(wrapper) {
        this.wrapper = wrapper;
    }
    get(url) {
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

export {Ajax, Cookie}