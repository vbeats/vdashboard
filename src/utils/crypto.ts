import NodeRSA from "node-rsa"

const publicKey = "-----BEGIN PUBLIC KEY-----\n" +
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmyE3OrBvgaytNQmjD1BV\n" +
    "eRjaPwOBsbEv/ETvmg7PN563aVQ7yuScz+2MdEvvs8SMyOX5jnrejTdZwHPnEINE\n" +
    "2zq0PwncU7p5Ik17kI3VpBZFPwUsdiVKWCMgqxeJIwF6Pq55chWxOhT8NP78EeLY\n" +
    "RivMQUHID1zklvXLfiDYw/27JZ3yf/WlezqJa1DHcyYA9s4JlgYYMEynpiDZR8kM\n" +
    "hBUdjNdBKR7oudYmn9OYcUYMlqR6SGY/oi40RBZHBw4Drbg/vTrO1GdOIiOHNNlc\n" +
    "N5EyRM8UtbIdSVhVJlHSHo/4Z4cs6YrvCljtNcpfpvTl7GTrKDHssX5Ug6gnJPRe\n" +
    "AwIDAQAB\n" +
    "-----END PUBLIC KEY-----"

const rsa = new NodeRSA(publicKey, 'pkcs8-public-pem', {encryptionScheme: 'pkcs1'})

const encrypt = (content: string): string => {
    return rsa.encrypt(content, "base64")
}

export default encrypt