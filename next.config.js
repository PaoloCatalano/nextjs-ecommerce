module.exports = {
  env: {
    WEBSITE_NAME: process.env.WEBSITE_NAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    BASE_URL: process.env.BASE_URL,
    MONGODB_URL: process.env.MONGODB_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    CLOUD_UPDATE_PRESET: process.env.CLOUD_UPDATE_PRESET,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API: process.env.CLOUD_API,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      require("./scripts/generate-sitemap");
    }

    return config;
  },
  async redirects() {
    return [
      {
        source: "/product",
        destination: "/",
        permanent: false,
      },
    ];
  },
};
