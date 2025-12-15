import mongoose from 'mongoose'


const UserSchema = new mongoose.Schema(
    {
        first: {
            type: String,
            required: [true, "First name is required"],
            trim: true,

        },
        last: {
            type: String,
            required: [true, "Last name is Required"],
            trim: true,

        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email"]
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^[0-9]{10}$/,
                "Phone number must be exactly 10 digits"
            ]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: true
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        }
    },
    { timestamps: true }

)

const UserModel = mongoose.model("UserDetails", UserSchema)

export default UserModel;
