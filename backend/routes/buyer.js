import express from 'express';
import jwtAuth from '../middlewares/jwtAuth.js';
import negotiateModel from '../models/negotiate.js';
import BuyerModel from '../models/Buyer.js';

const BuyerRouter = express.Router();

BuyerRouter.get('/get', jwtAuth, async (req, res) => {
    try {
        const userId = req.userId; 
        const negotiations = await negotiateModel.find({ farmer: userId });
        console.log(negotiations);

        const negotiationIds = negotiations.map(n => n._id);
        const buyers = await BuyerModel.find({ negotiation: { $in: negotiationIds } })
            .populate('buyer', 'name email') 
            .populate('negotiation'); 

        console.log(buyers);
        res.status(200).json({data:buyers});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

export default BuyerRouter;
