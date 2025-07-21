import { Schema, model, Model } from "mongoose";
import { IUser } from "../interfaces/user.interface";
import { Mode } from "fs";

const UserSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    connections: [{
        user: {type: Schema.Types.ObjectId, ref: "User"},
        status: {type: String, 
        enum: ["pending", "accepted"],
        default: "pending",
       },
       initiatedBy: {type: Schema.Types.ObjectId, ref: "User"},
    }],
});

export const User: Model<IUser> = model("User", UserSchema);