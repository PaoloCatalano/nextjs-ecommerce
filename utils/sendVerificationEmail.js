import sendEmail from "./sendEmail";

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/verify-email?token=${verificationToken}&email=${email}`;

  const message = `<a href="${verifyEmail}"> Please confirm your email by clicking this link </a> <p> Or this link: </p> <a href="${verifyEmail}">${verifyEmail}</a></p> <hr/> <h3>Thank you from <a href="${origin}"> ${origin}</a>!</h3>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `
        <h4>Hello, ${name}</h4>${message}
        `,
  });
};

module.exports = sendVerificationEmail;
