import AuditLog from "./audit.model.js";

export const createAuditLog =
async ({
    userId=null,
    action,
    status,
    ipAddress,
    userAgent,
    fingerprint,
    metadata={}
})=>{

    return await AuditLog.create({
        userId,
        action,
        status,
        ipAddress,
        userAgent,
        fingerprint,
        metadata
    });

};