"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaResponse = void 0;
const LambdaResponse = (statusCode, body, headers) => {
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
exports.LambdaResponse = LambdaResponse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmRhUmVzcG9uc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJMYW1iZGFSZXNwb25zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFNQSxNQUFNLGNBQWMsR0FBRyxDQUNyQixVQUFrQixFQUNsQixJQUFZLEVBQ1osT0FBbUMsRUFDbkIsRUFBRTtJQUNsQixPQUFPO1FBQ0wsVUFBVTtRQUNWLE9BQU8sRUFBRTtZQUNQLDZCQUE2QixFQUFFLHVCQUF1QixFQUFFLGlDQUFpQztZQUN6Riw4QkFBOEIsRUFBRSx3Q0FBd0MsRUFBRSwwQkFBMEI7WUFDcEcsOEJBQThCLEVBQUUsNkJBQTZCLEVBQUUsMEJBQTBCO1lBQ3pGLHdCQUF3QixFQUFFLE9BQU87WUFDakMsR0FBRyxPQUFPO1NBQ1g7UUFDRCxJQUFJO0tBQ0wsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVPLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBMYW1iZGFSZXNwb25zZSB7XHJcbiAgc3RhdHVzQ29kZTogbnVtYmVyO1xyXG4gIGhlYWRlcnM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XHJcbiAgYm9keTogc3RyaW5nO1xyXG59XHJcblxyXG5jb25zdCBMYW1iZGFSZXNwb25zZSA9IChcclxuICBzdGF0dXNDb2RlOiBudW1iZXIsXHJcbiAgYm9keTogc3RyaW5nLFxyXG4gIGhlYWRlcnM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9XHJcbik6IExhbWJkYVJlc3BvbnNlID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgc3RhdHVzQ29kZSxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCJodHRwOi8vbG9jYWxob3N0OjUxNzNcIiwgLy8gQWxsb3cgcmVxdWVzdHMgZnJvbSBhbnkgb3JpZ2luXHJcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kc1wiOiBcIk9QVElPTlMsIEdFVCwgUE9TVCwgUFVULCBQQVRDSCwgREVMRVRFXCIsIC8vIFNwZWNpZnkgYWxsb3dlZCBtZXRob2RzXHJcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiOiBcIkNvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvblwiLCAvLyBTcGVjaWZ5IGFsbG93ZWQgaGVhZGVyc1xyXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLU1heC1BZ2VcIjogXCI4NjQwMFwiLFxyXG4gICAgICAuLi5oZWFkZXJzLFxyXG4gICAgfSxcclxuICAgIGJvZHksXHJcbiAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IExhbWJkYVJlc3BvbnNlIH07XHJcbiJdfQ==