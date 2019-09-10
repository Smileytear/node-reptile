const arr = [1, 2, 3]

const newArr = new Proxy(arr, {
    get: (target, key, receiver) => {
        return Reflect.get(target, key, receiver)
    },
    set: (target, key, value, receiver) => {
        console.log(`key:${key}`)
        return Reflect.set(target, key, value, receiver)
    }
})

newArr.push(4)