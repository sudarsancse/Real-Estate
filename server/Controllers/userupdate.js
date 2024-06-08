//USER -Update route page

import User from "../models/UserModel.js";
import {errorHandler} from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const userupdate = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your accoutnt!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 15);
    }
    const updateUser = await User.findByIdAndDelete(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      {new: true}
    );
    const {password, ...rest} = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
