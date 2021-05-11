let Vue
class Store {
    constructor(options = {}) {
        this._mutations = options.mutations || {}
        this._actions = options.actions || {}
        this._wrapperGetters = options.getters || {}
        this.getters = {}
        // 存放到computed中
        const computed = {}
        const store = this
        // computed中的属性函数不带参数，需要包装
        Object.keys(store._wrapperGetters).forEach(key => {
            const fn = store._wrapperGetters[key]
            computed[key] = function () {
                return fn(store.state)
            }
            Object.defineProperty(store.getters, key, {
                get: () => {
                    // computed中执行
                    return store._vm[key]
                }
            })
        })
        this._vm = new Vue({
            data: {
                $$state: options.state
            },
            computed
        })
        this.commit = this.commit.bind(this)
        this.dispatch = this.dispatch.bind(this)
    }
    get state() {
        return this._vm._data.$$state
    }
    set state(v) {
        // console.error('please use replaceState to reset state')
        return
    }
    commit(type, payload) {
        let mutation = this._mutations[type]
        if (!mutation) {
            // console.log(`unknown mutation type: ${type}`)
            return
        }
        mutation(this.state, payload)
    }
    dispatch(type, payload) {
        let action = this._actions[type]
        if (!action) {
            // console.log(`unknown mutation type: ${type}`)
            return
        }
        action(this, payload)
    }
}

function install(_Vue) {
    Vue = _Vue
    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        }
    })
}
export default {
    Store,
    install
}