import { createApp } from "./app.js";
import { getEnv } from "./config/env.js";

const env = getEnv();
const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
