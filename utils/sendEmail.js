import sgMail from "@sendgrid/mail";

const sendEmail = async ({ to, subject, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to, // Change to your recipient
    from: `${process.env.WEBSITE_NAME} <${process.env.ADMIN_EMAIL}>`, // Change to your verified sender
    subject,
    html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmail;
