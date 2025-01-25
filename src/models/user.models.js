import mongoose , {Schema} from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,            
            index: true
        },
        avatar: {
            type: String,
            required:[true, "avatar is required"]
        },
        coverImage: {
            type: String
        },
        watchHistory: [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        passsword: {
            type: string,
            required: [true, "password is required"]
        },
        refreshToken:{
            type: string
        }

    },{timestamps: true}
)

userSchema.pre("save", async function (next){
    if(!this.isModified("password"))return next();
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function
(password){
    return await bcrypt.compare(passsword, this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jsonwebtoken.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function (){
    jsonwebtoken.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

export const User = mongoose.model("User", userSchema)