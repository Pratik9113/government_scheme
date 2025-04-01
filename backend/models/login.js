import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({   
    name: {
        type: String,
        required: true
    },  
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
    }
})


const LoginModel =  mongoose.models.User ||  mongoose.model('User', loginSchema);

export default LoginModel;
