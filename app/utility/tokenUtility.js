import {JWT_EXPIRE_TIME, JWT_KEY} from "../config/config.js";
import jwt from "jsonwebtoken";

export const TokenEncode = (email, userId) => {
    const KEY = JWT_KEY
    const EXPIRE = {expiresIn: JWT_EXPIRE_TIME}
    const PAYLOAD = {email: email, user_id: userId}
    return jwt.sign(PAYLOAD, KEY, EXPIRE)
}

export const TokenDecode = (token) => {
    try {
        return jwt.verify(token, JWT_KEY)
    } catch (error) {
        return null
    }
}