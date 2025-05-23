"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAccessHeaders = void 0;
const addAccessHeaders = () => {
    return {
        'Access-Control-Allow-Origin': 'http://localhost:5173', // Allow requests from any origin
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE', // Specify allowed methods
        'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Specify allowed headers
        'Access-Control-Max-Age': '86400',
    };
};
exports.addAccessHeaders = addAccessHeaders;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzcG9uc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJSZXNwb25zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBTyxNQUFNLGdCQUFnQixHQUFHLEdBQUcsRUFBRTtJQUNuQyxPQUFPO1FBQ0gsNkJBQTZCLEVBQUUsdUJBQXVCLEVBQUUsaUNBQWlDO1FBQ3pGLDhCQUE4QixFQUFFLHdDQUF3QyxFQUFFLDBCQUEwQjtRQUNwRyw4QkFBOEIsRUFBRSw2QkFBNkIsRUFBRSwwQkFBMEI7UUFDekYsd0JBQXdCLEVBQUUsT0FBTztLQUNwQyxDQUFDO0FBQ0osQ0FBQyxDQUFBO0FBUFksUUFBQSxnQkFBZ0Isb0JBTzVCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGFkZEFjY2Vzc0hlYWRlcnMgPSAoKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICdodHRwOi8vbG9jYWxob3N0OjUxNzMnLCAvLyBBbGxvdyByZXF1ZXN0cyBmcm9tIGFueSBvcmlnaW5cclxuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnT1BUSU9OUywgR0VULCBQT1NULCBQVVQsIFBBVENILCBERUxFVEUnLCAvLyBTcGVjaWZ5IGFsbG93ZWQgbWV0aG9kc1xyXG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24nLCAvLyBTcGVjaWZ5IGFsbG93ZWQgaGVhZGVyc1xyXG4gICAgICAnQWNjZXNzLUNvbnRyb2wtTWF4LUFnZSc6ICc4NjQwMCcsIFxyXG4gIH07XHJcbn0iXX0=