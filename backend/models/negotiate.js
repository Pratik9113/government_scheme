const mongoose = require("mongoose")

const negotiateSchema = new mongoose.Schema({
    grainType : {type:String, required :true},
    availableQuantity: {type:Number, required :true},
    pricePerKg: {type:Number, required :true},
    description: {type:String, required :true},
    cropType : {type:String, required:true},
    buyer : [{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Buyer'
    }]
},{timestamps:true})

const negotiateModel = mongoose.models.Negotiate || mongoose.model('Negotiate', negotiateSchema);
module.exports = negotiateModel;