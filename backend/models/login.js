import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({   
    name: {
        type: String,
        required: true
    },  
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ["Farmer", "Vendor"], // Restricts values to either Farmer or Vendor
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt & updatedAt

const LoginModel = mongoose.models.User || mongoose.model('User', loginSchema);

export default LoginModel;
