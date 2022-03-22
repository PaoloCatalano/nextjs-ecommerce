import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await verifyEmail(req, res);
      break;
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken, email } = req.body;

    const user = await Users.findOne({ email });

    if (!user) res.status(401).json({ err: `Email ${email} error.` });
    if (user.verificationToken !== verificationToken)
      res.status(401).json({ err: "Verification failed." });
    if (user.isVerified)
      res.status(404).json({ err: "This user is already verified." });

    user.isVerified = true;
    user.verified = Date.now();
    // user.verificationToken = ""; //ONLY one time convalidate

    await user.save();

    res.status(200).json({ msg: "Email verified" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
