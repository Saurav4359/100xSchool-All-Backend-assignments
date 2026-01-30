 
import z from "zod";

export const signup=z.object({
    name :z.string(),
    email : z.email(),
    password : z.string(),
    role : z.enum(["USER","SERVICE_PROVIDER"])
})

export const signin=z.object({ 
     email : z.email(),
    password : z.string()
})

export const service=z.object({
    name :z.string(),
    type : z.enum(["MEDICAL","HOUSE_HELP","BEAUTY","FITNESS","EDUCATION","OTHER"]),
    durationMinutes : z.number()
})