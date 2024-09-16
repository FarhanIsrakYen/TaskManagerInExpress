import {User} from "../model/UserModel.js";
import {TokenEncode} from "../utility/tokenUtility.js";
import {SendEmail} from "../utility/emailUtility.js"

export const Registration = async(req, res) => {
    try {
        let reqBody = req.body;
        await User.create(reqBody);
        return res.json({status:"success", "message": "Registration successful"});
    } catch (error) {
        console.log(error);
        return res.json({status:"fail", "message": error.toString()})
    }
}

export const Login = async(req, res) => {
    try {
        let reqBody = req.body;
        let data = await User.findOne(reqBody);
        if (data == null) {
            return res.json({status:"fail", "message": "User not found"});
        }
        let token = TokenEncode(data['email'], data['_id']);
        return res.json({status:"success", "message": "Login successful", data: {token: token}});
    } catch (error) {
        console.log(error);
        return res.json({status:"fail", "message": error.toString()})
    }
}

export const ProfileDetails = async(req, res) => {
    try {
        let userId = req.headers['userId'];
        let data = await User.findOne({_id: userId})
        return res.json({status:"success", message: "User retrieved successfully", data: data});
    } catch (error) {
        return res.json({status:"User not found"})
    }
}

export const ProfileUpdate = async(req, res) => {
    try {
        let reqBody = req.body;
        let userId = req.headers['userId'];
        let data = await User.updateOne({_id: userId}, reqBody)
        return res.json({status:"success", message: "User updated successfully", data: data});
    } catch (error) {
        return res.json({status:"fail", "message": error.toString()})
    }
}

export const EmailVerify = async(req, res) => {
    try {
        let email = req.params.email;

        let data = await User.findOne({email: email})
        if (data == null) {
            return res.json({status:"fail", "message": "User not found"});
        }
        let code = Math.floor(100000+Math.random()*9000000)
        let emailTo = data['email'];
        let emailText = "Your code is ";
        let emailSubject = "Task Manager Verification Code"

        await SendEmail(emailTo, emailText, emailSubject);
        await User.updateOne({email: email}, {otp:code})
        return res.json({status:"success"})
    } catch (error) {
        return res.json({status:"fail", "message": error.toString()})
    }
}

export const CodeVerify = async(req, res) => {
    let reqBody = req.body;
    let data = await User.findOne({email: reqBody['email'], otp:reqBody['otp']})
    if (data == null) {
        return res.json({status:"fail", "message": "Wrong verification Code"});
    }
    return res.json({status:"success", message: "Code verified successfully"});
}

export const ResetPassword = async(req, res) => {
    let reqBody = req.body;
    if (reqBody['otp'] == "0") {
        return res.json({
            status:"fail",
            message: "Wrong OTP"
        },400)
    }
    let data = await User.findOne({
            email: reqBody['email'],
            otp: reqBody['otp']
        })
    if (data == null) {
        return res.json({
            status: "fail",
            message: "Wrong verification Code"
        },400)
    }
    await User.updateOne({email: reqBody['email']},
        {
            password: reqBody['password'],
            otp: "0"
        })
    return res.json({status:"success", message: "Password reset successfully"})
}