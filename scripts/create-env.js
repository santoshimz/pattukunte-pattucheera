if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
  const fs = require("fs");
  fs.writeFileSync(
    ".env",
    "REACT_APP_FormsLink=https://forms.gle/9rDLcRBUpcUb4FR89\nNODE_ENV=development\n REACT_APP_BANNER=\nREACT_APP_CDN_URL=./static\nREACT_APP_S3=./static"
  );
}
