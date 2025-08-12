# Yape Code Challenge :rocket:

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [API Resources](#api_resources)
- [High Volume Scenario Considerations Implemented](#considerations)
- [How to Run the Project](#how_to_run_the_project)

# Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status.
For now, we have only three transaction statuses:

<ol>
  <li>pending</li>
  <li>approved</li>
  <li>rejected</li>  
</ol>

Every transaction with a value greater than 1000 should be rejected.

```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```

## Tech Stack

- NestJS
- Prisma ORM
- PostgreSQL
- Redis
- GraphQL
- Kafka for messaging

## API Resources

1. Create a transaction:

Request:

```gql
mutation CreateTransaction($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    transactionExternalId
    value
    createdAt
    accountExternalIdCredit
    accountExternalIdDebit
  }
}
```

Response:

```json
{
  "data": {
    "getTransaction": {
      "transactionExternalId": "81a08e52-b288-4f93-a2db-55b29892480a",
      "createdAt": "2025-08-12T15:37:00.863Z",
      "value": 999,
      "transactionStatus": {
        "name": "Approved"
      },
      "transactionType": {
        "name": "Standard"
      }
    }
  }
}
```

2. Retrieve a transaction
   Request:

```gql
query GetTransaction($transactionExternalId: String!) {
  getTransaction(transactionExternalId: $transactionExternalId) {
    transactionExternalId
    createdAt
    value
    transactionStatus {
      name
    }
    transactionType {
      name
    }
  }
}
```

Response:

```json
{
  "data": {
    "createTransaction": {
      "transactionExternalId": "81a08e52-b288-4f93-a2db-55b29892480a",
      "value": 999,
      "createdAt": "2025-08-12T15:37:00.863Z",
      "accountExternalIdCredit": "2d13c348-4209-439f-8c9f-bcbf72fe23c1",
      "accountExternalIdDebit": "1a368a89-09d5-4177-a581-990bce3110cb"
    }
  }
}
```

## High Volume Scenario Considerations Implemented

In this project, several strategies were applied to ensure robustness and scalability under high concurrency and volume:

- **Caching:**  
  To improve performance and reduce the load on the primary database, Redis was used as a caching layer. Frequently accessed data, such as transaction details and statuses, are cached to provide faster read responses. The cache is properly invalidated or updated whenever the underlying data changes to maintain consistency.

- **Event-Driven Architecture:**  
  Kafka was used as the messaging backbone to enable asynchronous communication between microservices. This decouples services and enhances scalability and fault tolerance.

- **Idempotency:**  
  A basic idempotency check was implemented by validating if the transaction status to update was already set. If so, the update is skipped to avoid duplicate processing.

  This can be extended using idempotency identifiers for better performance and reliability.

- **Optimistic Concurrency Control (OCC):**  
  Transactions include version numbers to detect concurrent modifications. Updates verify that the version matches the current one in the database, preventing lost updates and ensuring data integrity.

- **CQRS Pattern:**  
  Write and read models are separated to optimize for scalability and performance, enabling independent scaling and simpler read operations.

These considerations help the system handle high throughput scenarios efficiently and reliably.

## How to Run the Project

You can run the project in two ways:

### 1. Using Docker Compose (Recommended)

This method will build and start all necessary services including the microservices, database, Kafka, and Redis.

Run the following command in the root folder:

```bash
docker-compose up --build
```

By default, the transaction microservice is expose on port 3001. So you can access to the playground:

```bash
http://localhost:3001/graphql
```

### 2. Running Services Locally (Manual Setup)

If you prefer to run only specific services locally, follow these steps:

#### 2.1 Set environment variables for the transactions and antifraud microservices, for example:

```env
// ms-transactions
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/yape
KAFKA_CONSUMER_GROUP="transaction-service-consumer"
KAFKA_BROKER="localhost:9093"
REDIS_HOST=localhost
REDIS_PORT=6379
```

```env
// ms-anti-fraud
KAFKA_CONSUMER_GROUP="anti-fraud-consumer"
KAFKA_BROKER="localhost:9093"
```

#### 2.2 Install dependencies and prepare the database:

```bash
cd ms-transactions
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed
```

```bash
cd ms-anti-fraud
npm install
```

#### 2.2 Start the microservices in development mode:

```bash
cd ms-transactions
npm run start:dev
```

```bash
cd ms-anti-fraud
npm run start:dev
```

Make sure Kafka, Redis, and PostgreSQL are running locally and accessible at the configured hosts and ports before starting the microservice. You can use the docker-compose.yml file.

```bash
docker-compose up --build
```

Finally, access to the playground in the port 3000:

```bash
http://localhost:3000/graphql
```
