import jwt from "jsonwebtoken";
import { SiweMessage } from "siwe";
import User from "../models/User.js";

export const siwe = async (req, res) => {
  const { message, signature } = req.body;
  try {
    const siwe = new SiweMessage(message);
    const fields = await siwe.validate(signature);
    let user = await User.findOne({ wallet: fields.address });
    if (!user) user = await User.create({ wallet: fields.address });
    const token = jwt.sign(
      { wallet: fields.address, id: user._id },
      process.env.JWT_SECRET
    );
    res.json({ token, user });
  } catch (e) {
    res.status(401).json({ error: "Invalid SIWE signature" });
  }
};
