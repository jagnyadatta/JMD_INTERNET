import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
    },
    details: [
        {
            service: String,
            refNo: String,
            date: Date,
            followUp: Date,
            remark: String
        }
    ]
},{timestamps: true});

export default mongoose.model("Record", recordSchema);
