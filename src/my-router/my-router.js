import LINK from './my-router-link'
import VIEW from './my-router-view'
let Vue
class VueRouter {
    constructor(options) {
        this.$options = options
        // 缓存path和route映射关系
        // this.routeMap = {}
        // this.$options.routes.forEach(route => {
        //     this.routeMap[route.path] = route
        // })
        this.current = window.location.hash.slice(1) || '/'
        Vue.util.defineReactive(this, 'matched', [])
        this.match()
        window.addEventListener('hashchange', this.onHashChange.bind(this))
        window.addEventListener('load', this.onHashChange.bind(this))
    }
    onHashChange() {
        this.current = window.location.hash.slice(1)
        this.matched = []
        this.match()
    }
    match(routes) {
        routes = routes || this.$options.routes
        for (const route of routes) {
            // 首页不会有子路由配置项
            if (route.path === '/' && this.current === '/') {
                this.matched.push(route)
                return
            }
            if (route.path !== '/' && this.current.indexOf(route.path) != -1) {
                this.matched.push(route)
                if (route.children) {
                    this.match(route.children)
                }
                return
            }
        }
    }
}

VueRouter.install = function (_Vue) {
    Vue = _Vue
    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router
            }
        }
    })

    Vue.component('router-view', VIEW)
    Vue.component('router-link', LINK)
}

export default VueRouter