
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
                if (request.readyState === 4) {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(request.responseText)
                    } else if (request.status >= 400) {
                        reject(event)
                    }
                }
            })
        })
    }
}


// 不封装的 xhr
// 逻辑零散
function onResolve(response) { console.log(response) }
function onReject(err) { console.log(err) }

let xhr_nopackage = new XMLHttpRequest()
xhr_nopackage.ontimeout = (e) => {
    onReject(e)
}
xhr_nopackage.onerror = (e) => {
    onReject(e)
}
xhr_nopackage.onreadystatechange = () => {
    onResolve(xhr_nopackage.response)
}

let url = 'https://time.geekbang.org'
xhr_nopackage.open('Get', url, true)

xhr_nopackage.timeout = 4000
xhr_nopackage.responseType = 'text'
xhr_nopackage.setRequestHeader('X_TEST', 'time.geekbang')

xhr_nopackage.send()




// 简易封装的 xhr
// 关注输入配置参数、输出结果，并处理
function xhr_packaged(settings, onSuccess, onError) {
    let packagedXHR = new XMLHttpRequest()
    packagedXHR.ontimeout = (e) => {
        onError(e)
    }
    packagedXHR.onerror = (e) => {
        onError(e)
    }
    packagedXHR.onreadystatechange = () => {
        if (packagedXHR.status == 200) {
            onSuccess(packagedXHR.response)
        }
    }

    packagedXHR.open(settings.method, settings.url, settings.isSync)

    packagedXHR.timeout = settings.timeout
    packagedXHR.responseType = settings.responseType
    packagedXHR.setRequestHeader(settings.header)

    packagedXHR.send()
}

let requestSetting = {
    method: 'Get',
    url: 'https://time.geekbang.org',
    isSync: true,
    timeout: 4000,
    responseType: 'text',
    header: '',
}
xhr_packaged(requestSetting,
    response => {
        console.log(response)
    },
    err => {
        console.log(err)
    })


// 简易封装后，使用更为方便明确了，但是有两个问题：
// 1. 回调地狱
// 2. 成功返回和错误需要写两套逻辑，错误部分的逻辑在嵌套时基本是重复的

// 用 promise 可以解决上述问题，如以下代码：
function xhr_promisify(settings) {
    // function xhr_promisify(settings, onSuccess, onError) {
    function executor(resolve, reject) {
        let packagedXHR = new XMLHttpRequest()
        packagedXHR.ontimeout = (e) => {
            reject(e)
        }
        packagedXHR.onerror = (e) => {
            reject(e)
        }
        packagedXHR.onreadystatechange = () => {
            if (packagedXHR.status == 200) {
                resolve(packagedXHR.response)
            }
        }

        packagedXHR.open(settings.method, settings.url, settings.isSync)

        packagedXHR.timeout = settings.timeout
        packagedXHR.responseType = settings.responseType
        packagedXHR.setRequestHeader(settings.header)

        packagedXHR.send()
    }
    // return new Promise(executor(onSuccess, onError))
    return new Promise(executor)

}

var xp1 = xhr_promisify(requestSetting)

var xp2 = xp1.then(res => {
    console.log('xp1', res)
    return xhr_promisify(requestSetting)
})

var xp3 = xp2.then(res => {
    console.log('xp2', res)
    return xhr_promisify(requestSetting)
})

xp3.catch(err => {
    console.log(err)
})

// 那是如何解决的呢
// 对于1，我们可以把回调函数延迟绑定，先创建并调用请求，等请求返回了再把回调函数传给我们的封装，执行回调函数。
// 这样看起来就不是回调函数的样子了，而是单独的一次赋值
// 其次，为了实现链式调用，我们会在赋值的回调函数中继续返回 promise，这样如果有嵌套的情况，就可以避免嵌套，继续回调函数延迟绑定。
// 对于2，内部是冒泡处理，只要有一个捕获错误的函数，最后就会一层一层的冒泡直到被捕获，这样捕获逻辑只要写在最后一层就可以了。

// 我们可以仿照这个思路，来实现我们自己的promise
