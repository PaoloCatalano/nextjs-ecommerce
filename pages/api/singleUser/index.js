import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getUser(req, res);
      break;
  }
};
//single User
const getUser = async (req, res) => {
  try {
    const result = await auth(req, res);

    const user = await Users.findOne({ _id: result.id }).select("-password");
    res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
