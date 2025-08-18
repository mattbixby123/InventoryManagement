import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
/* ROUTE IMPORTS */
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* CORS config */
const corsOptions = {
  origin: [
    process.env.NODE_ENV === 'production' 
      ? 'https://inventory.matthewbixby.com' 
      : 'https://localhost',  // Change to HTTPS since nginx redirects
    'http://localhost:3000'
  ],
  credentials: true,
  exposedHeaders: ['Cross-Origin-Resource-Policy']
};
app.use(cors(corsOptions));

/* Static Files handled in .env.local for non docker development*/
if (process.env.SERVE_STATIC_IMAGES === 'true' && !process.env.DOCKER_ENV) {
  // Use process.cwd() to get the project root, not __dirname
  const imagesPath = path.join(process.cwd(), 'public/images');
  app.use('/api/public/images', express.static(imagesPath));
  console.log('🖼️ Serving static images from:', imagesPath);
}

/* ROUTES */
app.use("/api/dashboard", dashboardRoutes); // http://localhost:8000/dashboard
app.use("/api/products", productRoutes); // http://localhost:8000/products
app.use("/api/users", userRoutes); // http://localhost:8000/users
app.use("/api/expenses", expenseRoutes) // http://localhost:8000/expenses


// health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

/* SERVER */
const port = Number(process.env.PORT) || 8000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});