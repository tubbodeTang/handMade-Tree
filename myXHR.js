
// xml 请求 获取 json 文件


function myXHR() {

}

myXHR.prototype = {
    get: function (url, data, options) {
        return new Promise((resolve, reject) => {
            myXHR.prototype.request({
                method: 'get',
                url: url,
                data: data,
                options: options
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    post: function (url, data, options) {
        return new Promise((resolve, reject) => {
            myXHR.prototype.request({
                method: 'post',
                url: url,
                data: data,
                options: options
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    request: function (options) {
        let {
            method,
            url,
            data,
            options
        } = options
        let xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.send(data)
        return new Promise((resolve, reject) => {
            xhr.onreadystatechange(event => {
                if (event.state === 200) {
                    resolve(event)
                } else {
                    reject(event)
                }
            })
        })
    }
}