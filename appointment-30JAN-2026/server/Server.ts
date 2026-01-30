import { app } from "../src";

export async function Server() {
    app.listen(4000,()=> {
        console.log("Server running on 4000");
    })
}