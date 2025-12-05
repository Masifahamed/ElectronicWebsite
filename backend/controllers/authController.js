import UserModel from "../models/usermodel.js";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config();

export const authenlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "you don't type the email and password please fill the email and password"
            })
        }
        //find user first
        const user = await UserModel.findOne({ email }).select("+password role first last")
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
         console.log(user.role,user)
        //Check password
        // const checkpassword=await UserModel.findOne({password})
        const isMatch = await bcrypt.compare(password, user.password)
        console.log("email", email)
        console.log("user", user)
        console.log("Entered:", password)
        console.log("Stored", user.password)
        console.log("Match", isMatch)
        if (!isMatch) {
            return res.status(401).json({
                message: "invalid Password"
            })
        }
        //generate the token
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
        //return response
        res.status(200).json({
            message: "Login successfully",
            token: token,
            user: {
                _id: user._id,
                name: user.first + " " + user.last,
                email: user.email,
                role: user.role
            }
        })
       

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error",
            error: err.message
        })
    }
}

export const createDefaultadmin = async () => {
    try {
        const adminEmail = "admin@example.com";

        const adminExists = await UserModel.findOne({
            email: adminEmail
        })
        if (adminExists) {
            console.log("admin already exists")
            return
        }
        const hashedPassword = await bcrypt.hash("admin123", 10)
        
        const defaultadmin = await UserModel.create({
            first: "Admin",
            last: "masif",
            email: adminEmail,
            phone: "8438557945",
            password: hashedPassword,
            confirmPassword: "admin123",
            role: 'admin',
        })
        console.log(hashedPassword)
        console.log("Default admin created :", defaultadmin)
        
    } catch (err) {
        console.log("Error creating default admin", err)
    }
}