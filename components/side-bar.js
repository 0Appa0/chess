export default {
    setup() {
        const routes = [
            { name: "Play Game", route: "/main"},
            { name: "Create Board", route: "/custom"}
        ]

        return {
            routes
        }
    },
    template: 
    ` 
        <div class="sidebar">
            <div class="menu" v-for="item in routes" :key="item.route" :href="item.route">
                <a > {{ item.name }} </a>
            </div>
        </div>
    `
}