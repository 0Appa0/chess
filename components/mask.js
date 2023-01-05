export default {
    emits: ["closeMask"],
    props: {
        message: {
            type: String,
            required: true
        }
    },
    setup(_props, context) {
        const handleKeyDown = () => {
            context.emit("closeMask")
        }

        return {
            handleKeyDown
        }
    },
    template: 
    `
        <div class="mask" @click="handleKeyDown">
            <div class="info__message">
                {{ message }}
            </div>
        </div>
    `
}