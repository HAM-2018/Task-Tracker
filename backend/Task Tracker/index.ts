import "reflect-metadata";
import express, {Request, Response, Express} from "express";
import { addRoutes } from "./src/config/routes.config";
import mongoose from "mongoose";
import { connect } from "http2";
import * as dotenv from "dotenv";
import { responseFormatter } from "./src/middleware/responseFormatter.middleware";
import cors, {CorsOptions} from "cors";

const app: Express = express();
dotenv.config();

app.use(express.json());

const port = process.env.PORT;

let corsOptions: CorsOptions = {
    origin: "https://example.com",
}

// ADD CORSOPTIONS BEFORE GOING LIVE
app.use(cors());

app.use(responseFormatter);
addRoutes(app);

async function bootstrap() {

    if(!process.env.DATABASE_URL) {
        throw new Error("Cannot read envrionment variables");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.DATABASE_URL,
            {
                dbName: process.env.DATABASE_NAME,
            }
    );
    console.log("Connected to MongoDb");
    app.listen(port, ()=>{
        console.log(`Server is running at http://localhost:${port}`)
    });
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
}

bootstrap();


