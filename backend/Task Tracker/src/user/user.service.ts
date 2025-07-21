import { injectable } from "inversify";
import { User } from "./user.schema";
import { hashPassword, verifyPassword, generateToken } from "../utils/authentication";
import { ObjectId } from "mongodb";

@injectable()
export class UserService {
    async register(email: string, password: string, username: string) {
        const existing = await User.findOne({email});
        if(existing) {
            throw new Error("Email is already associaited with a account");
        }

        const passwordHash = await hashPassword(password);
        const newUser = new User ({email, passwordHash, username });
        await newUser.save();

        return { id: newUser._id };
    }

    async login(email: string, password: string) {
        const user = await User.findOne ({email}).select("_id username passwordHash");
        if (!user) {
            throw new Error("Invalid username");
        }
        if (!await verifyPassword(password, user.passwordHash)) {
          throw new Error("Invalid credentials");
        }
        const match = await verifyPassword(password, user.passwordHash);
        if(!match) {
            throw new Error("Invalid credentials");
        }
        const token  = generateToken({
          userId: user._id.toString(),
          username: user.username,
        });
        console.log("Token:", token);
        return token;
    }
    async searchUsers(query: string, currentUserId: string) {
        const regex = new RegExp(query, "i");
        return User.find({
            _id: {$ne: new ObjectId(currentUserId)},
            $or: [{ username: regex}, {email: regex}],
        }).select("_id username email");
    }
    async addConnection(currentUserId: string, targetUserId: string) {
  if (!ObjectId.isValid(targetUserId)) {
    throw new Error("Invalid target user ID");
  }

  if (currentUserId === targetUserId) {
    throw new Error("Cannot connect to yourself");
  }

  // Make sure BOTH users exist!
  const targetUser = await User.findById(targetUserId).select("_id");
  const currentUser = await User.findById(currentUserId).select("_id");

  if (!targetUser || !currentUser) {
    throw new Error("One or both users do not exist");
  }

  // Add connection for current user
  await User.updateOne(
    { _id: new ObjectId(currentUserId) },
    {
      $addToSet: {
        connections: {
          user: new ObjectId(targetUserId),
          status: "pending",
          initiatedBy: new ObjectId(currentUserId),
        },
      },
    }
  );

  // Add connection for target user to see it too
  await User.updateOne(
    { _id: new ObjectId(targetUserId) },
    {
      $addToSet: {
        connections: {
          user: new ObjectId(currentUserId),
          status: "pending",
          initiatedBy: new ObjectId(currentUserId),
        },
      },
    }
  );

  return true;
}


    async acceptConnection(currentUserId: ObjectId, targetUserId: string) {
  await User.updateOne(
    {
      _id: currentUserId,
      "connections.user": new ObjectId(targetUserId),
    },
    { $set: { "connections.$.status": "accepted" } }
  );

  await User.updateOne(
    {
      _id: new ObjectId(targetUserId),
      "connections.user": currentUserId,
    },
    { $set: { "connections.$.status": "accepted" } }
  );
}

    async getConnections(currentUserId: ObjectId) {
        return User.findById(currentUserId)
        .populate("connections.user", "username email")
        .select("connections");
    }
}