import userAuthRoutes from "./routes/userAuthRoutes.js";
import userOrderRoutes from "./routes/userOrderRoutes.js";

app.use("/api/user/auth", userAuthRoutes);
app.use("/api/user/order", userOrderRoutes);
