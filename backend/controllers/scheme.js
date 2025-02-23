const SchemaModel = require("../models/SchemeModels");

const getSchemeController = async (req, res)=>{
    try {
        const scheme = await SchemaModel.find();
        res.status(200).json({success:true,data:scheme});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message: "Internal server error"});
    }
}

module.exports = {getSchemeController};