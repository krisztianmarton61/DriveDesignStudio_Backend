# Backend

The backend infrastructure is built on **Amazon Web Services (AWS)**, using a serverless architecture to ensure scalability and cost-efficiency. Key AWS services used include:

- **API Gateway** – Handles HTTP requests.
- **AWS Lambda** – Runs serverless backend functions.
- **S3** – Stores user-generated and processed images.
- **DynamoDB** – Manages structured, scalable data storage.

## Infrastructure as Code

To manage the backend infrastructure efficiently, we use:

- **AWS CloudFormation**  
  Initially used for defining infrastructure as YAML templates, enabling reproducible deployments.

- **AWS CDK (Cloud Development Kit)**  
  To simplify development and maintenance, we transitioned to AWS CDK. It allows us to define infrastructure using familiar programming languages (JavaScript, in our case), offering:
  - Type checking
  - Object-oriented design
  - Easier readability and refactoring compared to raw YAML/JSON

## Benefits of CDK

- Rapid deployment and updates
- Improved developer experience
- Reusable and modular infrastructure code

## Tech Stack

- **AWS Lambda** – Serverless backend logic
- **API Gateway** – REST API interface
- **Amazon S3** – File and asset storage
- **Amazon DynamoDB** – NoSQL database
- **AWS CDK** – Infrastructure as code (in JavaScript)
- **Node.js** – Runtime environment for Lambda functions
- **CloudFormation** – Infrastructure templating
