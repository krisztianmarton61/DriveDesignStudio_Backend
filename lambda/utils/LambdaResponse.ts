export interface LambdaResponse {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

const LambdaResponse = (
  statusCode: number,
  body: string,
  headers?: { [key: string]: string }
): LambdaResponse => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5173", // Allow requests from any origin
      "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, PATCH, DELETE", // Specify allowed methods
      "Access-Control-Allow-Headers": "Content-Type, Authorization", // Specify allowed headers
      "Access-Control-Max-Age": "86400",
      ...headers,
    },
    body,
  };
};

export { LambdaResponse };
