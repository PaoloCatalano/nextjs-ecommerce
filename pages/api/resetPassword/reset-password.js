import Users from "../../../models/userModel";
import bcrypt from "bcrypt";

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await resetPassword(req, res);
      break;
  }
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    res.status(404).json({ err: "Please provide all values." });
  }

  const user = await Users.findOne({ email });

  console.log(token);
  console.log(user.passwordToken);

  const currentDate = new Date();

  if (user) {
    if (user.passwordTokenExpirationDate < currentDate) {
      res.status(404).json({
        err: "Session expired (10 minutes time only)",
      });
    }
    if (user.passwordToken !== token)
      res.status(401).json({ err: "Invalid reset password." });

    console.log(
      `password token expired: ${
        user.passwordTokenExpirationDate < currentDate
      }`
    );

    if (
      user.passwordToken === token &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      const passwordHash = await bcrypt.hash(password, 12);

      user.password = passwordHash;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();

      res.status(200).json({
        msg: `Success! Try to login now.`,
      });
    }
  } else {
  }
};
