/**
 * Swagger UI Setup
 * Mengintegrasikan Swagger UI ke dalam Express app
 */

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

export const setupSwagger = (app) => {
  // Serve Swagger UI at /api-docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "list",
    },
    customCss: `
      .swagger-ui .topbar {
        background-color: #2c3e50;
      }
      .swagger-ui .scheme-container {
        background: #f5f5f5;
      }
    `,
    customSiteTitle: "Machinara API Documentation",
  }));

  const PORT = process.env.PORT || 5000;
  console.log(`✅ Swagger UI tersedia di http://localhost:${PORT}/api-docs`);
};
