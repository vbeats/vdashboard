import {JSEncrypt} from "jsencrypt"

const publicKey = "-----BEGIN PUBLIC KEY-----\n" +
    "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAmwU8KJMgMDNSnmlYLfGE\n" +
    "CbpECbS9qcmCQgMXWbeK1dae3xnbVNtIsN/Hsdr9q8wT8qzynGw739ijp/is1Wcf\n" +
    "HqFn3diuurZQSIQHN1pLz7pxISKYzjY+e0j1ELsGkGdb04fqsPGJnh/TEzcVMeHD\n" +
    "xGT8+9XZkp3Ub3ZyZ6bqwNVwr1eTR4L2FGMmEBq5CXTd2HOH/nfKiz8+kOv02DTW\n" +
    "JmNSPTGEzpG7gwWeZFsRLipHaoNq0n4xoHCUGGM9gzgzgjAVVdwlVKkej+NiSKcq\n" +
    "JfxRvjzaI9+y6TCxfJ/zs7ccUJljeckrVz4iktGzxfBm+JenNTYx74E4jT0Bg28o\n" +
    "Tn7QeTCK6Hog9Ro/ow8ceU/K8Yrn7p2FqKbwPViKVEu66MosJ09O+Cogj9NanKO5\n" +
    "Qh6ip08/dtxl+ln2sSJOA1LNcKZA0hbhSkIIF9P0Q8rUNWka1peZqSOQk0SFLB3s\n" +
    "Htvv1dsbi3hY5zBNdG6X09bbylMwdasSVplurOYBubCSrcT3dbenjmoqBLCZzOlx\n" +
    "o9IydVKKo8y+0KZ9FTgn+T6WQxNCKrp7tbKWlAkHzio06+BDZ6uFOwzUm+Ur9RtZ\n" +
    "QvipaGtEQoEaw+h7AP50WQs6OrBPh7HeVp728CJOaXk4kkHmSfIrmQsr9BunWtX1\n" +
    "Y8wDuSslUuP0CfVwlStT5EcCAwEAAQ==\n" +
    "-----END PUBLIC KEY-----"

const jsEncrypt = new JSEncrypt({default_key_size: '4096'})
jsEncrypt.setPublicKey(publicKey)

const encrypt = (content: string): string => {
    return jsEncrypt.encrypt(content) || ''
}

export default encrypt