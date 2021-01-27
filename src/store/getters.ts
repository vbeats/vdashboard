import {State, SUser} from "@/store/interface";

export default {
    getUserInfo: (state: State): SUser => state.user
}