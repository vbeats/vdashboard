import {useTitle} from "@vueuse/core";
import {useRoute} from "vue-router";

export default () => {
    const title = useTitle('V Dashboard')
    const route = useRoute()

    title.value += ' | ' + route.meta.title
}