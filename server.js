import server from "./src/app.js";
import ENV from "./src/configs/env.js";

const PORT = ENV.PORT || 5001;

server.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
