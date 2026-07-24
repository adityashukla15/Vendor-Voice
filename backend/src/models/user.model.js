import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import validator from "validator";

const userSchema=new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
  type: String,
  required: [true, "Email is required"],
  unique: true,
  lowercase: true,
  trim: true,
  index: true,
  validate: {
    validator: validator.isEmail,
    message: "Please enter a valid email address",
  },
},

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
    },

    shopName: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
      maxlength: 100,
    },

    preferredLanguage: {
      type: String,
      enum: ["English", "Hindi", "Bengali", "Hinglish"],
      default: "English",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    
},{timestamps:true})

userSchema.methods.toJSON = function () {
  const user = this.toObject();
 delete user.password;
delete user.__v;
  return user;
};
userSchema.pre('save',async function(next){
     if(!this.isModified('password')){
        return next()
    }
    const hash=await bcrypt.hash(this.password,12)
    this.password=hash
    return next()
})

userSchema.methods.comparePassword=async  function(password){
     return await bcrypt.compare(password,this.password)
}
const User = mongoose.model("User", userSchema);
export default User;