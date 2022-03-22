import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import valid from "../../../utils/valid";
import bcrypt from "bcrypt";
import sendVerificationEmail from "../../../utils/sendVerificationEmail";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await register(req, res);
      break;
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, cf_password, address, mobile } = req.body;

    const errMsg = valid(name, email, password, cf_password);
    if (errMsg) return res.status(400).json({ err: errMsg });

    const user = await Users.findOne({ email });
    if (user)
      return res.status(400).json({ err: "This email already exists." });

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = bcrypt.genSaltSync(20);

    const newUser = new Users({
      name,
      email,
      password: passwordHash,
      cf_password,
      address,
      mobile,
      verificationToken,
    });

    await sendVerificationEmail({
      name,
      email,
      verificationToken,
      origin: process.env.BASE_URL,
    });

    await newUser.save();
    res.json({ msg: "Register Success! Please check your email" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
