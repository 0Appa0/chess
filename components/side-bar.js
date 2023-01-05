export default {
    emits:["select"],
    setup(_props, context) {
        const routes = [
            { name: "New Game", route: "/main"},
            { name: "Create Board", route: "/custom"}
        ]
        const handleMenuSelect = (item) => {
            context.emit("select", { item })
        }

        return {
            routes,
            handleMenuSelect,
        }
    },
    template: 
    ` 
        <div class="sidebar">
            <div class="menu" v-for="item in routes" :key="item.route" @click="handleMenuSelect(item)">
                <a> {{ item.name }} </a>
            </div>
        </div>
    `
}