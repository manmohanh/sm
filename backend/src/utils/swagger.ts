import AuthApiDoc from "../swagger/auth.swagger";

const SwaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "Besties Official api",
    description: "All the private and public apis listed here",
    version: "1.0.0",
    contact: {
      name: "Manmohan Hansda",
      email: "hmanmohan12@gmail.com",
    },
  },
  servers: [
    {
      url: process.env.SERVER,
    },
  ],
  paths: {
    ...AuthApiDoc,
  },
};

export default SwaggerConfig;
