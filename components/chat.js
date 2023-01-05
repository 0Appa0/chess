import Avatar from "./avatar.js"
const { ref, onMounted , watch, nextTick } = Vue

export default {
    components: {
        Avatar,
    },
    setup() {
        const message = ref("")
        const messages = ref([
            { messager: "opp", message: "Hello"},
            { messager: "user", message: "Hello"},
            { messager: "opp", message: "Hello, how are you doing?"},
            { messager: "user", message: "I am doing fine, how the hell are you doing?"},
            { messager: "opp", message: "Have you heard of jijivisha?"},
            { messager: "opp", message: "I have heard that they are a good team."},
            { messager: "opp", message: "Hello"},
            { messager: "user", message: "Hello"},
            { messager: "opp", message: "Hello, how are you doing?"},
            { messager: "user", message: "I am doing fine, how the hell are you doing?"},
            { messager: "opp", message: "Have you heard of jijivisha?"},
            { messager: "opp", message: "I have heard that they are a good team."},
        ])
        
        const handleMessageSend = async () => {
            if(message.value){
                messages.value = [...messages.value, { 
                    messager:  Math.random() < 0.5 ? "user": "opp", 
                    message: message.value 
                }]  
                message.value = ""
                await nextTick()
                const doc = document.getElementById('chat-box')
                doc.scrollTop = doc.scrollHeight
            }
        }

        onMounted(() => {
            const doc = document.getElementById('chat-box')
            doc.scrollTop = doc.scrollHeight
        })
        
        return {
            message,
            messages,
            handleMessageSend
        }
    },
    template: 
    `
        <div class="chat">
            <div class="chat__box" id="chat-box">
                <div class="chat__box-message" v-for="(item, index) in messages" :key="index" :class="[item.messager]">
                    <Avatar :name="item.messager" />
                    <p class="msg">{{ item.message }}</p>
                </div>
            </div>
            <div class="chat__input">
                <input placeholder="Enter your message here" v-model="message"/>
                <button class="send-button" @click="handleMessageSend">Send</button>
            </div>
        </div>
    `
}