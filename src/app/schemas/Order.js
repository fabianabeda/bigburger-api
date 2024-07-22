import mongoose from 'mongoose';


const OrderSchema = mongoose.Schema({
    user: {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    products: [
        {
            id: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            category: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                requered: true,

            },
        
        },
    ],
    status: {
        type: String,
        requered: true,
    },
},
{
    timestamps: true,
    },

    
);

export default mongoose.model('Order', OrderSchema);