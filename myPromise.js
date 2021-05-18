

function myPromise(executor) {
    this.status = 'pending'
    this.resolveVal = null
    this.rejectReason = null

    const resolve = (val) => {
        if (this.status === 'pending') {
            this.resolveVal = val
            this.status = 'fulfilled'
        }
    }

    const reject = (reason) => {
        if (this.status === 'pending') {
            this.rejectReason = reason
            this.status = 'rejected'
        }
    }

    executor(resolve, reject)
}


myPromise.prototype.then = function (onfulfilled = Function.prototype, onrejected = Function.prototype) {

    if (this.status === 'fulfilled') {
        onfulfilled(this.resolveVal)
    } else if (this.status === 'rejected') {
        onrejected(this.rejectReason)
    }
}

// 模拟
var promise = new myPromise((resolve, reject) => {
    const a = 10
    if (a > 10) {
        setTimeout(() => {
            resolve(a)
        })
    } else {
        reject('a<10')
    }
})
promise.then(res => {
    console.log('immu:', res)
}, err => {
    console.log('immu:', err)
})

// 真实
var _promise = new Promise((resolve, reject) => {
    const a = 10
    if (a > 10) {
        setTimeout(() => {
            resolve(a)
        })
    } else {
        reject('a<10')
    }
})
_promise.then(res => {
    console.log('real:', res)
}, err => {
    console.log('real:', err)
})

