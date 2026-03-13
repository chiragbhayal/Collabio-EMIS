import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { app } from "./app";

const PORT = Number(process.env.PORT || config.PORT || 8000);

const start = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
