const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        maxlength: 500
    },
    price: {
        type: Number
    },
    status: {
        type: Number,
        default: 0
    }
}, { timestamps: true })


const Offer = mongoose.model('Offer', offerSchema);

module.exports = { Offer: Offer }