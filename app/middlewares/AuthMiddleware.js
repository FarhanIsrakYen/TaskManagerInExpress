import {TokenDecode} from "../utility/tokenUtility.js";

export default (req, res, next) => {
    let token = req.headers['token']
    let decoded = TokenDecode(token)
    if (decoded == null) {
        res.status(401).json({status: "fail", message: "Unauthorized"})
    }
    let email = decoded.email;
    let userId = decoded.user_id;
    req.headers.email = email;
    req.headers.userId = userId;
    next()
}