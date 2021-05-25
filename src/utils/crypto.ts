import {JSEncrypt} from "jsencrypt"

const publicKey = import.meta.env.VITE_PUBLIC_KEY

const jsEncrypt = new JSEncrypt({default_key_size: '4096'})
jsEncrypt.setPublicKey(publicKey)

const encrypt = (content: string): string => {
    return jsEncrypt.encrypt(content) || ''
}

export default encrypt