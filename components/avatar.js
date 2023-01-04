export default {
    props: {
        imgUrl: {
            type: String,
            default: ""
        },
        name: {
            type: String,
            default: "Narendra"
        }
    },
    template: 
    `
        <div class="avatar">
            <img :src="imgUrl"/>
            <p>{{ name.split("")[0] }} </p>
        </div>
    `
}