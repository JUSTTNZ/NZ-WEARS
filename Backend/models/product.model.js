const {Schema, model} =  require("mongoose");

const productSchema= Schema({
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image: {
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available: {
        type:Boolean,
        default:true,
    },

})

module.exports = model("Products", productSchema);