import mongoose from "mongoose";
const farmerSchema = new mongoose.Schema({
    grainType:{type:String, required:true},
    quantity:{type:Number, required:true},
    pricePerKg:{type:Number, required:true},
    notes:{type:String, required:true},
    vendorId :{type:mongoose.Schema.Types.ObjectId, ref:"vendor"},
});

const farmerModel = mongoose.models.farmer || mongoose.model('farmer', farmerSchema);
export default farmerModel;
