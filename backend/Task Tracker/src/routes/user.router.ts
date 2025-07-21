import { Router, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { UserController } from "../user/user.controller";
import { signupValidator } from "../tasks/validators/auth.validator";
import { validationResult } from "express-validator";
import { authenticate } from "../middleware/authentication.middleware";

@injectable()
export class UserRouter {
  public router: Router;

  constructor(
    @inject(UserController) private userController: UserController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", signupValidator, (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()){
          res.status(400).json({
          errors: errors.array()
        });
        return;
      }
      this.userController.handleRegister(req, res);
    });

    this.router.post("/login", (req: Request, res: Response) => {
      this.userController.handleLogin(req, res);
    });

    this.router.get("/users", authenticate, (req: Request, res: Response)  => {
      this.userController.handleSearchUsers(req, res);
    });

    this.router.post("/users/:id/connections", authenticate, (req: Request, res: Response) => {
      this.userController.handleAddConnection(req, res);
    });
    this.router.get("/me/connections", authenticate, (req: Request, res: Response) => {
      this.userController.handleGetConnections(req, res);
  });
  this.router.post("/users/:id/connections/accept", authenticate, (req: Request, res: Response) => {
      this.userController.handleAcceptConnection(req, res);
});

}

}
