import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Lantern REST API",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "Session ID",
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
