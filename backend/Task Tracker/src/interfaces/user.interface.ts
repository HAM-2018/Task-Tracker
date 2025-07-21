import { ObjectId } from "mongodb";

export interface IUser {
    _id: string,
    email: string,
    passwordHash: string,
    username: string,
    connections: {
        user: ObjectId;
        status: "pending" | "accepted";
    } [];
}