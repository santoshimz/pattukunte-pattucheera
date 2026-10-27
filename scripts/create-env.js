if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
  const fs = require("fs");
  fs.writeFileSync(
    ".env",
    "REACT_APP_FormsLink=https://forms.gle/9rDLcRBUpcUb4FR89\nNODE_ENV=development\nREACT_APP_BANNER=\nREACT_APP_CDN_URL=./static\nREACT_APP_S3=./static\nREACT_APP_API_KEY=\nREACT_APP_AUTH_DOMAIN=\nREACT_APP_PROJECT_ID=\nREACT_APP_STORAGE_BUCKET=\nREACT_APP_MESSAGE_SENDER_ID=\nREACT_APP_APP_ID="
  );
}
