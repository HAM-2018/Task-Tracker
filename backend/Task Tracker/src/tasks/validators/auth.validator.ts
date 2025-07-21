import { checkSchema } from "express-validator";
import { User } from "../../user/user.schema";

export const signupValidator = checkSchema({
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "Please use a valid email address",
    },
    normalizeEmail: true,
    custom: {
      options: async (email) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return Promise.reject("E-mail already in use");
        }
      },
    },
  },
  username: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Username is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Username must be at least 3 characters long",
    },
    trim: true,
    custom: {
      options: async (username) => {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return Promise.reject("Username already in use");
        }
      },
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Password required",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must have at least 8 characters!",
    },
  },
});
