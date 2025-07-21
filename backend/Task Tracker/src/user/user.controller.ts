import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { UserService } from "./user.service";
import { AuthenticatedRequest } from "../interfaces/authenticate.user.interface";
import { ObjectId } from "mongodb";

@injectable()
export class UserController {
  constructor(
    @inject(UserService) private userService: UserService
  ) {}

  async handleRegister(req: Request, res: Response) {
    try {
      const { email, password, username } = req.body;
      if (!username){
        return res.status(400).json({message: "Username is required!"});
      }
      const result = await this.userService.register(email, password, username);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.code === 11000) {
      res.status(400).json({ message: error.message });
      }
      console.error ("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async handleLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await this.userService.login(email, password);
      res.status(200).json({ token });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
  async handleSearchUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const query = req.query.query?.toString() || "";
      const currentUserId = req.user?.userId;

      if (!currentUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const users = await this.userService.searchUsers(query, currentUserId);
      res.status(200).json(users);
    } catch (error: any) {
      console.error("Search users error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async handleAddConnection(req: AuthenticatedRequest, res: Response) {
    try {
      const currentUserId = req.user?.userId;
      const targetUserId = req.params.id;

      if (!currentUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (currentUserId === targetUserId) {
        return res.status(400).json({ message: "Cannot connect to yourself." });
      }

      const success = await this.userService.addConnection(currentUserId, targetUserId);

      if (success) {
        res.status(200).json({ message: "Connection added." });
      } else {
        res.status(400).json({ message: "Connection failed." });
      }
    } catch (error: any) {
      console.error("Add connection error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async handleAcceptConnection(req: AuthenticatedRequest, res: Response) {
  const currentUserId = req.user?.userId;
  const targetUserId = req.params.id;

  if (!currentUserId) return res.status(401).json({ message: "Unauthorized" });

  await this.userService.acceptConnection(new ObjectId(currentUserId), targetUserId);

  // AFTER accepting, load fresh connections
  const connections = await this.userService.getConnections(new ObjectId(currentUserId));

  if (!connections) {
  return res.status(404).json({ message: "User not found" });
}
  res.status(200).json({
    status: "success",
    message: "Connection accepted",
    data: connections.connections,   // make sure `data` is an arrayy
  });
}


async handleGetConnections(req: AuthenticatedRequest, res: Response) {
  const currentUserId = req.user?.userId;

  if (!currentUserId) return res.status(401).json({ message: "Unauthorized" });

  const connections = await this.userService.getConnections(new ObjectId(currentUserId));

  if (!connections) {
    return res.status(404).json({ message: "User not found"});
  }
  res.status(200).json({ 
    status: "success", 
    message: "Connection accepted",
    data: Array.isArray(connections.connections) ? connections.connections : []
  });
}

}

