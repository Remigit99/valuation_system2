import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    action:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:[
            "SUCCESS",
            "FAILED"
        ],
        required:true
    },

    ipAddress:{
        type:String
    },

    userAgent:{
        type:String
    },

    fingerprint:{
        type:String
    },

    metadata:{
        type:Object,
        default:{}
    }

},
{
    timestamps:true
}
);

const AuditLog =
mongoose.model(
    "AuditLog",
    auditSchema
);

export default AuditLog;