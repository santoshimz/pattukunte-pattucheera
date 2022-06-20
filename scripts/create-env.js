if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
  const fs = require("fs");
  fs.writeFileSync(".env", "NODE_ENV=development\n REACT_APP_BANNER=\nREACT_APP_CDN_URL=./static");
}
