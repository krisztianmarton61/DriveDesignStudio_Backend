"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const index_js_1 = require("./utils/index.js");
const uuid_1 = require("uuid");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const index_js_2 = require("./types/index.js");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const cognitoClient = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({});
const dydbClient = new client_dynamodb_1.DynamoDBClient({});
const handler = async (event) => {
    switch (event.httpMethod) {
        case "POST":
            if (event.body)
                return handleSaveOrder(event.body);
            else
                return (0, index_js_1.LambdaResponse)(400, index_js_1.ORDER_CANNOT_BE_PROCESSED);
        case "GET":
            if (event.pathParameters && event.pathParameters.id) {
                return handleGetOrderById(event.pathParameters.id);
            }
            else {
                return handleGetOrders();
            }
        default:
            return (0, index_js_1.LambdaResponse)(405, index_js_1.METHOD_NOT_ALLOWED);
    }
};
exports.handler = handler;
const handleGetOrders = async () => {
    try {
        const response = await dydbClient.send(new client_dynamodb_1.ScanCommand({
            TableName: process.env.DYNAMO_DB_TABLE_NAME,
        }));
        const orders = response.Items?.map((item) => {
            return {
                id: item.id.S,
                email: item.email.S,
                billingInformation: item.billingInformation.M,
                shippingInformation: item.shippingInformation.M,
                products: item.products.L,
                status: item.status.S,
                timestamp: item.timestamp.N,
            };
        });
        return (0, index_js_1.LambdaResponse)(200, JSON.stringify(orders));
    }
    catch (error) {
        return (0, index_js_1.LambdaResponse)(500, error.message);
    }
};
const handleGetOrderById = async (orderId) => {
    try {
        const response = await dydbClient.send(new client_dynamodb_1.ScanCommand({
            TableName: process.env.DYNAMO_DB_TABLE_NAME,
            FilterExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": { S: orderId },
            },
        }));
        if (response.Items && response.Items.length > 0) {
            const item = response.Items[0];
            const order = {
                id: item.id.S,
                email: item.email.S,
                billingInformation: item.billingInformation.M,
                shippingInformation: item.shippingInformation.M,
                products: item.products.L,
                status: item.status.S,
                timestamp: item.timestamp.N,
            };
            return (0, index_js_1.LambdaResponse)(200, JSON.stringify(order));
        }
        else {
            return (0, index_js_1.LambdaResponse)(404, index_js_1.ORDER_NOT_FOUND_ERROR);
        }
    }
    catch (error) {
        return (0, index_js_1.LambdaResponse)(500, error.message);
    }
};
const handleSaveOrder = async (body) => {
    try {
        const order = JSON.parse(body);
        if (order.password)
            await createUser(order.email, order.password, order.billingInformation.firstName, order.billingInformation.lastName, order.billingInformation.phone);
        const orderId = await saveOrder(order);
        return (0, index_js_1.LambdaResponse)(200, JSON.stringify(orderId));
    }
    catch (error) {
        return (0, index_js_1.LambdaResponse)(500, error.message);
    }
};
const saveOrder = async (order) => {
    try {
        const orderId = (0, uuid_1.v4)();
        const item = {
            id: { S: orderId },
            email: { S: order.email },
            billingInformation: { M: {} },
            shippingInformation: { M: {} },
            products: { L: [] },
            status: { S: index_js_2.IOrderStatus.PENDING },
            timestamp: { N: new Date().getTime().toString() },
        };
        Object.entries(order.billingInformation).forEach(([key, value]) => {
            item.billingInformation.M = item.billingInformation.M || {};
            item.billingInformation.M[key] = { S: value };
        });
        if (order.shippingInformation) {
            Object.entries(order.shippingInformation).forEach(([key, value]) => {
                item.shippingInformation.M = item.shippingInformation.M || {};
                item.shippingInformation.M[key] = { S: value };
            });
        }
        order.products.forEach((product, index) => {
            const productItem = {
                M: {
                    productId: { S: product.productId },
                    quantity: { N: product.quantity.toString() },
                    imageId: { S: product.imageId },
                },
            };
            item.products.L = item.products.L || [];
            item.products.L.push(productItem);
        });
        await dydbClient.send(new client_dynamodb_1.PutItemCommand({
            TableName: process.env.DYNAMO_DB_TABLE_NAME,
            Item: item,
        }));
        return orderId;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
const createUser = async (email, password, firstName, lastName, phoneNumber) => {
    const createUserParams = {
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
        Username: email,
        UserAttributes: [
            { Name: "email", Value: email },
            { Name: "email_verified", Value: "true" },
            { Name: "custom:role", Value: "user" },
            { Name: "Family Name", Value: firstName },
            { Name: "Given Name", Value: lastName },
            { Name: "phone_number", Value: phoneNumber },
        ],
    };
    const setPasswordParams = {
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
        Username: email,
        Password: password,
        Permanent: true,
    };
    try {
        const createUserCommand = new client_cognito_identity_provider_1.AdminCreateUserCommand(createUserParams);
        const createUserResponse = await cognitoClient.send(createUserCommand);
        const sub = createUserResponse.User?.Attributes?.find((attr) => attr?.Name === "sub")?.Value;
        const setPasswordCommand = new client_cognito_identity_provider_1.AdminSetUserPasswordCommand(setPasswordParams);
        await cognitoClient.send(setPasswordCommand);
        return sub;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3JkZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtDQUswQjtBQUUxQiwrQkFBb0M7QUFDcEMsOERBS2tDO0FBQ2xDLCtDQUF3RDtBQUN4RCxnR0FJbUQ7QUFFbkQsTUFBTSxhQUFhLEdBQUcsSUFBSSxnRUFBNkIsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM1RCxNQUFNLFVBQVUsR0FBRyxJQUFJLGdDQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFbkMsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQTJCLEVBQUUsRUFBRTtJQUMzRCxRQUFRLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN6QixLQUFLLE1BQU07WUFDVCxJQUFJLEtBQUssQ0FBQyxJQUFJO2dCQUFFLE9BQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Z0JBQzlDLE9BQU8sSUFBQSx5QkFBYyxFQUFDLEdBQUcsRUFBRSxvQ0FBeUIsQ0FBQyxDQUFDO1FBQzdELEtBQUssS0FBSztZQUNSLElBQUksS0FBSyxDQUFDLGNBQWMsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNwRCxPQUFPLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckQsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLE9BQU8sZUFBZSxFQUFFLENBQUM7WUFDM0IsQ0FBQztRQUNIO1lBQ0UsT0FBTyxJQUFBLHlCQUFjLEVBQUMsR0FBRyxFQUFFLDZCQUFrQixDQUFDLENBQUM7SUFDbkQsQ0FBQztBQUNILENBQUMsQ0FBQztBQWRXLFFBQUEsT0FBTyxXQWNsQjtBQUVGLE1BQU0sZUFBZSxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQ2pDLElBQUksQ0FBQztRQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FDcEMsSUFBSSw2QkFBVyxDQUFDO1lBQ2QsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CO1NBQzVDLENBQUMsQ0FDSCxDQUFDO1FBRUYsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMxQyxPQUFPO2dCQUNMLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2IsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkIsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQzdDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUMvQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN6QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNyQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzVCLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBQSx5QkFBYyxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLElBQUEseUJBQWMsRUFBQyxHQUFHLEVBQUcsS0FBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELENBQUM7QUFDSCxDQUFDLENBQUM7QUFFRixNQUFNLGtCQUFrQixHQUFHLEtBQUssRUFBRSxPQUFlLEVBQUUsRUFBRTtJQUNuRCxJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxJQUFJLENBQ3BDLElBQUksNkJBQVcsQ0FBQztZQUNkLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQjtZQUMzQyxnQkFBZ0IsRUFBRSxVQUFVO1lBQzVCLHlCQUF5QixFQUFFO2dCQUN6QixLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFO2FBQ3RCO1NBQ0YsQ0FBQyxDQUNILENBQUM7UUFFRixJQUFJLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDaEQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLEtBQUssR0FBRztnQkFDWixFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ25CLGtCQUFrQixFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUM3QyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDL0MsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDckIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM1QixDQUFDO1lBRUYsT0FBTyxJQUFBLHlCQUFjLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNwRCxDQUFDO2FBQU0sQ0FBQztZQUNOLE9BQU8sSUFBQSx5QkFBYyxFQUFDLEdBQUcsRUFBRSxnQ0FBcUIsQ0FBQyxDQUFDO1FBQ3BELENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sSUFBQSx5QkFBYyxFQUFDLEdBQUcsRUFBRyxLQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkQsQ0FBQztBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0sZUFBZSxHQUFHLEtBQUssRUFBRSxJQUFZLEVBQUUsRUFBRTtJQUM3QyxJQUFJLENBQUM7UUFDSCxNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksS0FBSyxDQUFDLFFBQVE7WUFDaEIsTUFBTSxVQUFVLENBQ2QsS0FBSyxDQUFDLEtBQUssRUFDWCxLQUFLLENBQUMsUUFBUSxFQUNkLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQ2xDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQ2pDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQy9CLENBQUM7UUFDSixNQUFNLE9BQU8sR0FBRyxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV2QyxPQUFPLElBQUEseUJBQWMsRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxJQUFBLHlCQUFjLEVBQUMsR0FBRyxFQUFHLEtBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2RCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxTQUFTLEdBQUcsS0FBSyxFQUFFLEtBQWEsRUFBbUIsRUFBRTtJQUN6RCxJQUFJLENBQUM7UUFDSCxNQUFNLE9BQU8sR0FBRyxJQUFBLFNBQU0sR0FBRSxDQUFDO1FBRXpCLE1BQU0sSUFBSSxHQUFtQztZQUMzQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFO1lBQ2xCLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ3pCLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtZQUM3QixtQkFBbUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7WUFDOUIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtZQUNuQixNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsdUJBQVksQ0FBQyxPQUFPLEVBQUU7WUFDbkMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUU7U0FDbEQsQ0FBQztRQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtZQUNoRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzVELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtnQkFDakUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDOUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN4QyxNQUFNLFdBQVcsR0FBbUI7Z0JBQ2xDLENBQUMsRUFBRTtvQkFDRCxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRTtvQkFDbkMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUU7b0JBQzVDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFO2lCQUNoQzthQUNGLENBQUM7WUFFRixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxVQUFVLENBQUMsSUFBSSxDQUNuQixJQUFJLGdDQUFjLENBQUM7WUFDakIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CO1lBQzNDLElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUNILENBQUM7UUFFRixPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE1BQU0sSUFBSSxLQUFLLENBQUUsS0FBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLENBQUM7QUFDSCxDQUFDLENBQUM7QUFFRixNQUFNLFVBQVUsR0FBRyxLQUFLLEVBQ3RCLEtBQWEsRUFDYixRQUFnQixFQUNoQixTQUFpQixFQUNqQixRQUFnQixFQUNoQixXQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxnQkFBZ0IsR0FBRztRQUN2QixVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0I7UUFDaEQsUUFBUSxFQUFFLEtBQUs7UUFDZixjQUFjLEVBQUU7WUFDZCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUMvQixFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3pDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3RDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ3pDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQ3ZDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1NBQzdDO0tBQ0YsQ0FBQztJQUVGLE1BQU0saUJBQWlCLEdBQUc7UUFDeEIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCO1FBQ2hELFFBQVEsRUFBRSxLQUFLO1FBQ2YsUUFBUSxFQUFFLFFBQVE7UUFDbEIsU0FBUyxFQUFFLElBQUk7S0FDaEIsQ0FBQztJQUVGLElBQUksQ0FBQztRQUNILE1BQU0saUJBQWlCLEdBQUcsSUFBSSx5REFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFdkUsTUFBTSxHQUFHLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQ25ELENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxLQUFLLEtBQUssQ0FDL0IsRUFBRSxLQUFLLENBQUM7UUFFVCxNQUFNLGtCQUFrQixHQUFHLElBQUksOERBQTJCLENBQ3hELGlCQUFpQixDQUNsQixDQUFDO1FBQ0YsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFN0MsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE1BQU0sSUFBSSxLQUFLLENBQUUsS0FBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLENBQUM7QUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIExhbWJkYVJlc3BvbnNlLFxyXG4gIE1FVEhPRF9OT1RfQUxMT1dFRCxcclxuICBPUkRFUl9DQU5OT1RfQkVfUFJPQ0VTU0VELFxyXG4gIE9SREVSX05PVF9GT1VORF9FUlJPUixcclxufSBmcm9tIFwiLi91dGlscy9pbmRleC5qc1wiO1xyXG5pbXBvcnQgeyBBUElHYXRld2F5UHJveHlFdmVudCB9IGZyb20gXCJhd3MtbGFtYmRhXCI7XHJcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gXCJ1dWlkXCI7XHJcbmltcG9ydCB7XHJcbiAgQXR0cmlidXRlVmFsdWUsXHJcbiAgRHluYW1vREJDbGllbnQsXHJcbiAgUHV0SXRlbUNvbW1hbmQsXHJcbiAgU2NhbkNvbW1hbmQsXHJcbn0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1keW5hbW9kYlwiO1xyXG5pbXBvcnQgeyBJT3JkZXIsIElPcmRlclN0YXR1cyB9IGZyb20gXCIuL3R5cGVzL2luZGV4LmpzXCI7XHJcbmltcG9ydCB7XHJcbiAgQ29nbml0b0lkZW50aXR5UHJvdmlkZXJDbGllbnQsXHJcbiAgQWRtaW5DcmVhdGVVc2VyQ29tbWFuZCxcclxuICBBZG1pblNldFVzZXJQYXNzd29yZENvbW1hbmQsXHJcbn0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1jb2duaXRvLWlkZW50aXR5LXByb3ZpZGVyXCI7XHJcblxyXG5jb25zdCBjb2duaXRvQ2xpZW50ID0gbmV3IENvZ25pdG9JZGVudGl0eVByb3ZpZGVyQ2xpZW50KHt9KTtcclxuY29uc3QgZHlkYkNsaWVudCA9IG5ldyBEeW5hbW9EQkNsaWVudCh7fSk7XHJcblxyXG5leHBvcnQgY29uc3QgaGFuZGxlciA9IGFzeW5jIChldmVudDogQVBJR2F0ZXdheVByb3h5RXZlbnQpID0+IHtcclxuICBzd2l0Y2ggKGV2ZW50Lmh0dHBNZXRob2QpIHtcclxuICAgIGNhc2UgXCJQT1NUXCI6XHJcbiAgICAgIGlmIChldmVudC5ib2R5KSByZXR1cm4gaGFuZGxlU2F2ZU9yZGVyKGV2ZW50LmJvZHkpO1xyXG4gICAgICBlbHNlIHJldHVybiBMYW1iZGFSZXNwb25zZSg0MDAsIE9SREVSX0NBTk5PVF9CRV9QUk9DRVNTRUQpO1xyXG4gICAgY2FzZSBcIkdFVFwiOlxyXG4gICAgICBpZiAoZXZlbnQucGF0aFBhcmFtZXRlcnMgJiYgZXZlbnQucGF0aFBhcmFtZXRlcnMuaWQpIHtcclxuICAgICAgICByZXR1cm4gaGFuZGxlR2V0T3JkZXJCeUlkKGV2ZW50LnBhdGhQYXJhbWV0ZXJzLmlkKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gaGFuZGxlR2V0T3JkZXJzKCk7XHJcbiAgICAgIH1cclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBMYW1iZGFSZXNwb25zZSg0MDUsIE1FVEhPRF9OT1RfQUxMT1dFRCk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgaGFuZGxlR2V0T3JkZXJzID0gYXN5bmMgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGR5ZGJDbGllbnQuc2VuZChcclxuICAgICAgbmV3IFNjYW5Db21tYW5kKHtcclxuICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LkRZTkFNT19EQl9UQUJMRV9OQU1FLFxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBvcmRlcnMgPSByZXNwb25zZS5JdGVtcz8ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaWQ6IGl0ZW0uaWQuUyxcclxuICAgICAgICBlbWFpbDogaXRlbS5lbWFpbC5TLFxyXG4gICAgICAgIGJpbGxpbmdJbmZvcm1hdGlvbjogaXRlbS5iaWxsaW5nSW5mb3JtYXRpb24uTSxcclxuICAgICAgICBzaGlwcGluZ0luZm9ybWF0aW9uOiBpdGVtLnNoaXBwaW5nSW5mb3JtYXRpb24uTSxcclxuICAgICAgICBwcm9kdWN0czogaXRlbS5wcm9kdWN0cy5MLFxyXG4gICAgICAgIHN0YXR1czogaXRlbS5zdGF0dXMuUyxcclxuICAgICAgICB0aW1lc3RhbXA6IGl0ZW0udGltZXN0YW1wLk4sXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gTGFtYmRhUmVzcG9uc2UoMjAwLCBKU09OLnN0cmluZ2lmeShvcmRlcnMpKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmV0dXJuIExhbWJkYVJlc3BvbnNlKDUwMCwgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBoYW5kbGVHZXRPcmRlckJ5SWQgPSBhc3luYyAob3JkZXJJZDogc3RyaW5nKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZHlkYkNsaWVudC5zZW5kKFxyXG4gICAgICBuZXcgU2NhbkNvbW1hbmQoe1xyXG4gICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuRFlOQU1PX0RCX1RBQkxFX05BTUUsXHJcbiAgICAgICAgRmlsdGVyRXhwcmVzc2lvbjogXCJpZCA9IDppZFwiLFxyXG4gICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcclxuICAgICAgICAgIFwiOmlkXCI6IHsgUzogb3JkZXJJZCB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG5cclxuICAgIGlmIChyZXNwb25zZS5JdGVtcyAmJiByZXNwb25zZS5JdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGNvbnN0IGl0ZW0gPSByZXNwb25zZS5JdGVtc1swXTtcclxuICAgICAgY29uc3Qgb3JkZXIgPSB7XHJcbiAgICAgICAgaWQ6IGl0ZW0uaWQuUyxcclxuICAgICAgICBlbWFpbDogaXRlbS5lbWFpbC5TLFxyXG4gICAgICAgIGJpbGxpbmdJbmZvcm1hdGlvbjogaXRlbS5iaWxsaW5nSW5mb3JtYXRpb24uTSxcclxuICAgICAgICBzaGlwcGluZ0luZm9ybWF0aW9uOiBpdGVtLnNoaXBwaW5nSW5mb3JtYXRpb24uTSxcclxuICAgICAgICBwcm9kdWN0czogaXRlbS5wcm9kdWN0cy5MLFxyXG4gICAgICAgIHN0YXR1czogaXRlbS5zdGF0dXMuUyxcclxuICAgICAgICB0aW1lc3RhbXA6IGl0ZW0udGltZXN0YW1wLk4sXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gTGFtYmRhUmVzcG9uc2UoMjAwLCBKU09OLnN0cmluZ2lmeShvcmRlcikpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIExhbWJkYVJlc3BvbnNlKDQwNCwgT1JERVJfTk9UX0ZPVU5EX0VSUk9SKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmV0dXJuIExhbWJkYVJlc3BvbnNlKDUwMCwgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBoYW5kbGVTYXZlT3JkZXIgPSBhc3luYyAoYm9keTogc3RyaW5nKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IG9yZGVyOiBJT3JkZXIgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgaWYgKG9yZGVyLnBhc3N3b3JkKVxyXG4gICAgICBhd2FpdCBjcmVhdGVVc2VyKFxyXG4gICAgICAgIG9yZGVyLmVtYWlsLFxyXG4gICAgICAgIG9yZGVyLnBhc3N3b3JkLFxyXG4gICAgICAgIG9yZGVyLmJpbGxpbmdJbmZvcm1hdGlvbi5maXJzdE5hbWUsXHJcbiAgICAgICAgb3JkZXIuYmlsbGluZ0luZm9ybWF0aW9uLmxhc3ROYW1lLFxyXG4gICAgICAgIG9yZGVyLmJpbGxpbmdJbmZvcm1hdGlvbi5waG9uZVxyXG4gICAgICApO1xyXG4gICAgY29uc3Qgb3JkZXJJZCA9IGF3YWl0IHNhdmVPcmRlcihvcmRlcik7XHJcblxyXG4gICAgcmV0dXJuIExhbWJkYVJlc3BvbnNlKDIwMCwgSlNPTi5zdHJpbmdpZnkob3JkZXJJZCkpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXR1cm4gTGFtYmRhUmVzcG9uc2UoNTAwLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IHNhdmVPcmRlciA9IGFzeW5jIChvcmRlcjogSU9yZGVyKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3Qgb3JkZXJJZCA9IHV1aWR2NCgpO1xyXG5cclxuICAgIGNvbnN0IGl0ZW06IFJlY29yZDxzdHJpbmcsIEF0dHJpYnV0ZVZhbHVlPiA9IHtcclxuICAgICAgaWQ6IHsgUzogb3JkZXJJZCB9LFxyXG4gICAgICBlbWFpbDogeyBTOiBvcmRlci5lbWFpbCB9LFxyXG4gICAgICBiaWxsaW5nSW5mb3JtYXRpb246IHsgTToge30gfSxcclxuICAgICAgc2hpcHBpbmdJbmZvcm1hdGlvbjogeyBNOiB7fSB9LFxyXG4gICAgICBwcm9kdWN0czogeyBMOiBbXSB9LFxyXG4gICAgICBzdGF0dXM6IHsgUzogSU9yZGVyU3RhdHVzLlBFTkRJTkcgfSxcclxuICAgICAgdGltZXN0YW1wOiB7IE46IG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCkgfSxcclxuICAgIH07XHJcblxyXG4gICAgT2JqZWN0LmVudHJpZXMob3JkZXIuYmlsbGluZ0luZm9ybWF0aW9uKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgICAgaXRlbS5iaWxsaW5nSW5mb3JtYXRpb24uTSA9IGl0ZW0uYmlsbGluZ0luZm9ybWF0aW9uLk0gfHwge307XHJcbiAgICAgIGl0ZW0uYmlsbGluZ0luZm9ybWF0aW9uLk1ba2V5XSA9IHsgUzogdmFsdWUgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChvcmRlci5zaGlwcGluZ0luZm9ybWF0aW9uKSB7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKG9yZGVyLnNoaXBwaW5nSW5mb3JtYXRpb24pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICAgIGl0ZW0uc2hpcHBpbmdJbmZvcm1hdGlvbi5NID0gaXRlbS5zaGlwcGluZ0luZm9ybWF0aW9uLk0gfHwge307XHJcbiAgICAgICAgaXRlbS5zaGlwcGluZ0luZm9ybWF0aW9uLk1ba2V5XSA9IHsgUzogdmFsdWUgfTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb3JkZXIucHJvZHVjdHMuZm9yRWFjaCgocHJvZHVjdCwgaW5kZXgpID0+IHtcclxuICAgICAgY29uc3QgcHJvZHVjdEl0ZW06IEF0dHJpYnV0ZVZhbHVlID0ge1xyXG4gICAgICAgIE06IHtcclxuICAgICAgICAgIHByb2R1Y3RJZDogeyBTOiBwcm9kdWN0LnByb2R1Y3RJZCB9LFxyXG4gICAgICAgICAgcXVhbnRpdHk6IHsgTjogcHJvZHVjdC5xdWFudGl0eS50b1N0cmluZygpIH0sXHJcbiAgICAgICAgICBpbWFnZUlkOiB7IFM6IHByb2R1Y3QuaW1hZ2VJZCB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpdGVtLnByb2R1Y3RzLkwgPSBpdGVtLnByb2R1Y3RzLkwgfHwgW107XHJcbiAgICAgIGl0ZW0ucHJvZHVjdHMuTC5wdXNoKHByb2R1Y3RJdGVtKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGF3YWl0IGR5ZGJDbGllbnQuc2VuZChcclxuICAgICAgbmV3IFB1dEl0ZW1Db21tYW5kKHtcclxuICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LkRZTkFNT19EQl9UQUJMRV9OQU1FLFxyXG4gICAgICAgIEl0ZW06IGl0ZW0sXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBvcmRlcklkO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVVc2VyID0gYXN5bmMgKFxyXG4gIGVtYWlsOiBzdHJpbmcsXHJcbiAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICBmaXJzdE5hbWU6IHN0cmluZyxcclxuICBsYXN0TmFtZTogc3RyaW5nLFxyXG4gIHBob25lTnVtYmVyOiBzdHJpbmdcclxuKSA9PiB7XHJcbiAgY29uc3QgY3JlYXRlVXNlclBhcmFtcyA9IHtcclxuICAgIFVzZXJQb29sSWQ6IHByb2Nlc3MuZW52LkFXU19DT0dOSVRPX1VTRVJfUE9PTF9JRCxcclxuICAgIFVzZXJuYW1lOiBlbWFpbCxcclxuICAgIFVzZXJBdHRyaWJ1dGVzOiBbXHJcbiAgICAgIHsgTmFtZTogXCJlbWFpbFwiLCBWYWx1ZTogZW1haWwgfSxcclxuICAgICAgeyBOYW1lOiBcImVtYWlsX3ZlcmlmaWVkXCIsIFZhbHVlOiBcInRydWVcIiB9LFxyXG4gICAgICB7IE5hbWU6IFwiY3VzdG9tOnJvbGVcIiwgVmFsdWU6IFwidXNlclwiIH0sXHJcbiAgICAgIHsgTmFtZTogXCJGYW1pbHkgTmFtZVwiLCBWYWx1ZTogZmlyc3ROYW1lIH0sXHJcbiAgICAgIHsgTmFtZTogXCJHaXZlbiBOYW1lXCIsIFZhbHVlOiBsYXN0TmFtZSB9LFxyXG4gICAgICB7IE5hbWU6IFwicGhvbmVfbnVtYmVyXCIsIFZhbHVlOiBwaG9uZU51bWJlciB9LFxyXG4gICAgXSxcclxuICB9O1xyXG5cclxuICBjb25zdCBzZXRQYXNzd29yZFBhcmFtcyA9IHtcclxuICAgIFVzZXJQb29sSWQ6IHByb2Nlc3MuZW52LkFXU19DT0dOSVRPX1VTRVJfUE9PTF9JRCxcclxuICAgIFVzZXJuYW1lOiBlbWFpbCxcclxuICAgIFBhc3N3b3JkOiBwYXNzd29yZCxcclxuICAgIFBlcm1hbmVudDogdHJ1ZSxcclxuICB9O1xyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgY3JlYXRlVXNlckNvbW1hbmQgPSBuZXcgQWRtaW5DcmVhdGVVc2VyQ29tbWFuZChjcmVhdGVVc2VyUGFyYW1zKTtcclxuICAgIGNvbnN0IGNyZWF0ZVVzZXJSZXNwb25zZSA9IGF3YWl0IGNvZ25pdG9DbGllbnQuc2VuZChjcmVhdGVVc2VyQ29tbWFuZCk7XHJcblxyXG4gICAgY29uc3Qgc3ViID0gY3JlYXRlVXNlclJlc3BvbnNlLlVzZXI/LkF0dHJpYnV0ZXM/LmZpbmQoXHJcbiAgICAgIChhdHRyKSA9PiBhdHRyPy5OYW1lID09PSBcInN1YlwiXHJcbiAgICApPy5WYWx1ZTtcclxuXHJcbiAgICBjb25zdCBzZXRQYXNzd29yZENvbW1hbmQgPSBuZXcgQWRtaW5TZXRVc2VyUGFzc3dvcmRDb21tYW5kKFxyXG4gICAgICBzZXRQYXNzd29yZFBhcmFtc1xyXG4gICAgKTtcclxuICAgIGF3YWl0IGNvZ25pdG9DbGllbnQuc2VuZChzZXRQYXNzd29yZENvbW1hbmQpO1xyXG5cclxuICAgIHJldHVybiBzdWI7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpO1xyXG4gIH1cclxufTtcclxuIl19