import mongoose from "mongoose";

const dbconnect  = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_CNX)
        console.log("base datos en linea");
        
    } catch (error) {
        console.log(error);
        throw new Error("Error connecting")
    }
}

export { dbconnect }; 