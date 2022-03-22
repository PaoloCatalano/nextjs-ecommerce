import Users from "../../../models/userModel";
import bcrypt from "bcrypt";
import sendResetPasswordEmail from "../../../utils/sendResetPasswordEmail";

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await forgotPassword(req, res);
      break;
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(404).json({ err: "Please insert valid email." });
  }

  const user = await Users.findOne({ email });

  if (user) {
    const passwordToken = bcrypt.genSaltSync(20);
    //send email
    const origin = process.env.BASE_URL;

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });
    const _10Minutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + _10Minutes);

    user.passwordToken = passwordToken;
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res.status(200).json({
    msg: "Please check your email and click on the reset password link.",
  });
};
