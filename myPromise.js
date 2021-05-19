

function myPromise(executor) {
    this.status = 'pending'
    this.resolveVal = null
    this.rejectReason = null
    this.onfulfilledArr = []
    this.onrejectedArr = []
    // 在 then 中保存 fulfill 以便在 resolve、reject 中执行，这样异步也可以转“同步”响应

    const resolve = (val) => {
        if (this.status === 'pending') {
            this.resolveVal = val
            this.status = 'fulfilled'

            setTimeout(() => {
                // 一方面为了解决同步情况下获取不到fulfill函数的问题，实际是微任务形式
                // 另一方面，promise 本身就是微任务的异步执行，这里用 setTimeout 宏任务来模拟，
                // reject 中的结果处理，应该是在微任务队列中的
                this.onfulfilledArr.forEach(func => {
                    func(val)
                })
            }, 1)
        }
    }

    const reject = (reason) => {
        if (this.status === 'pending') {
            this.rejectReason = reason
            this.status = 'rejected'

            setTimeout(() => {
                this.onrejectedArr.forEach(func => {
                    func(reason)
                })
            }, 1)
        }
    }

    try { // 错误处理
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}


myPromise.prototype.then = function (onfulfilled = Function.prototype, onrejected = Function.prototype) {

    if (this.status === 'fulfilled') {
        // onfulfilled(this.resolveVal)
        // this.onfulfilledArr = onfulfilled
        this.onfulfilledArr.push(onfulfilled)
    } else if (this.status === 'rejected') {
        // onrejected(this.rejectReason)
        // this.onrejectedArr = onrejected
        this.onrejectedArr.push(onrejected)
    } else if (this.status === 'pending') {
        this.onfulfilledArr.push(onfulfilled)
        this.onrejectedArr.push(onrejected)
    }
}

// 模拟
var promise = new myPromise((resolve, reject) => {
    const a = Math.random() * 10
    setTimeout(() => {
        if (a > 5) {
            resolve(a)
        } else {
            reject('a<=5')
        }
    }, 1000)
})
promise.then(res => {
    console.log('immu1:', res)
}, err => {
    console.log('immu1:', err)
})

promise.then(res => {
    console.log('immu2:', res)
}, err => {
    console.log('immu2:', err)
})

console.log('immu-test')

// 真实
var _promise = new Promise((resolve, reject) => {
    const a = Math.random() * 10
    setTimeout(() => {
        if (a > 5) {
            resolve(a)
        } else {
            reject('a<=5')
        }
    }, 1000)
})
_promise.then(res => {
    console.log('real1:', res)
}, err => {
    console.log('real1:', err)
})

_promise.then(res => {
    console.log('real2:', res)
}, err => {
    console.log('real2:', err)
})

console.log('real-test')

