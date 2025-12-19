import jwt from "jsonwebtoken";
import UserModel from "../models/usermodel.js";
import bcrypt from "bcrypt";


export const createUser = async (req, res) => {
    try {
        const { first, last, email, phone, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const exists = await UserModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Email already exists" });
        }
        console.log(password)
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            first,
            last,
            email,
            phone,
            password: hashedPassword,
            //confirmPassword: undefined, // ❌ Do not store this
            role: "user"
        });
       console.log(user)
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const finduser = await UserModel.find({role:"user"})
        .select('-password -confirmPassword') // Exclude passwords

        if (!finduser || finduser.length === 0) { // FIXED: Proper empty check
            return res.status(404).json({ // FIXED: Added return
                message: "No users found"
            });
        }

        return res.status(200).json({ // FIXED: Added return
            message: "All users retrieved successfully",
            count: finduser.length,
            data: finduser
        });

    } catch (err) {
        console.log("getUser Error:", err.message);
        return res.status(500).json({ // FIXED: Added return
            message: err.message // FIXED: Removed "message.err"
        });
    }
}
export const getsingleuser = async (req, res) => {
    try {
        const { id } = req.params;

        // FIXED: Exclude password from response
        const getsingleuser = await UserModel.findById(id).select('-password -confirmPassword');

        if (!getsingleuser) {
            return res.status(404).json({ // FIXED: Added return
                message: "User not found"
            });
        }

        return res.status(200).json({ // FIXED: Changed to 200 for success
            message: "User retrieved successfully",
            data: getsingleuser
        });

    } catch (err) {
        console.log("getsingleuser Error:", err.message);

        // Handle invalid ObjectId format
        if (err.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid user ID format"
            });
        }

        return res.status(500).json({ // FIXED: Added return
            message: err.message
        });
    }
}


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If password is being updated, hash it
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
       
        // Never update confirmPassword to database
        if (updateData.confirmPassword) {
            delete updateData.confirmPassword;
        }

        // FIXED: Use { new: true } to return updated document and run validators
        const updateUser = await UserModel.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true, // Return updated document
                runValidators: true // Run schema validations
            }
        ).select('+password +confirmPassword'); // include passwords from response

        if (!updateUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true, // FIXED: Consistent response format
            message: "User data updated successfully",
            data: updateUser
        });

    } catch (err) {
        console.log("updateUser Error:", err.message);

        // Handle validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({ message: errors.join(', ') });
        }

        // Handle duplicate email error
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        return res.status(500).json({
            message: err.message
        });
    }
}


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteuser = await UserModel.findByIdAndDelete(id);

        if (!deleteuser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true, // FIXED: Consistent response format
            message: "User deleted successfully",
            data: deleteuser
        });

    } catch (err) {
        console.log("deleteUser Error:", err.message);

        // Handle invalid ObjectId format
        if (err.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid user ID format"
            });
        }

        return res.status(500).json({
            message: err.message
        });
    }
}

export const deleteall = async (req, res) => {
    try {
        const deleteall = await UserModel.deleteMany({})
        if (!deleteall) {
            return res.status(404).json({
                message: "it not delete all user somethings wrong"
            })

        }
        res.status(200).json({
            success: true,
            message: "successfully delete all user",
            data: deleteall
        })
    } catch (err) {
        res.status(500).json({
            message: "it can't delete the all user",
            error: message.err
        })
    }
}

// export const RegisterUser = async (req, res) => {
//     try {
//         const { first, last, email, phone, password, confirmPassword } = req.body;

//         if (password !== confirmPassword) {
//             return res.status(400).json({
//                 message: "password is not match"
//             })
//         }
//         const exists = await UserModel.findOne({ email });
//         if (exists) {
//             return res.status(400).json({ message: "Email already registered" })
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newuser = await UserModel.create({
//             first,
//             last,
//             email,
//             phone,
//             password: hashedPassword,
//            // confirmPassword: undefined,
//             role: "user"
//         })
//         res.status(201).json({
//             message: "User registered successfully",
//             user: {
//                 id:user._id,
//                 email:newuser.email
//             }
//         })
//     } catch (err) {
//         res.status(500).json({
//             message: "Server error",
//             error: err.message
//         })
//     }
// }
// export const emailcheck=async(req,res)=>{
//     const email=req.params.email;
//     const user=await UserModel.findOne({email})
//     res.json({exists:!!user})
// }