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
app.use(cors());

/* CORS config */
// app.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "http://localhost:8000"
//   ],
//   credentials: true
// }));
/* CORS config */
const corsOptions = {
  origin: [
    process.env.NODE_ENV === 'production' 
      ? 'https://yourdomain.com' 
      : 'http://frontend:3000', // Docker service name
    'http://localhost:3000' // Fallback for local dev
  ],
  credentials: true,
  exposedHeaders: ['Cross-Origin-Resource-Policy']
};
app.use(cors(corsOptions));

/* Static Files */
// app.use('/api/images', express.static(path.join(__dirname, '../assets'), {
//   // Cache images for 1 year (recommended for production)
//   maxAge: 31536000,
//   // Allow CORS for images
//   setHeaders: (res) => {
//     res.set('Cross-Origin-Resource-Policy', 'cross-origin');
//   }
// }));
// app.use('/api/images', express.static(path.join(__dirname, '../assets'))); #simpler version w/o cors

/* ROUTES */
app.use("/dashboard", dashboardRoutes); // http://localhost:8000/dashboard
app.use("/products", productRoutes); // http://localhost:8000/products
app.use("/users", userRoutes); // http://localhost:8000/users
app.use("/expenses", expenseRoutes) // http://localhost:8000/expenses

// health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});
/* SERVER */
const port = Number(process.env.PORT) || 8000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});