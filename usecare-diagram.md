# Online Shopping System - Use Case Diagram

```mermaid
graph TD
    subgraph Actors["👥 Actors"]
        WC["Web Customer"]
        NC["New Customer"]
        RC["Registered Customer"]
        AU["🔐 Authentication Service"]
        PS["💳 Payment Service"]
    end

    subgraph UseCases["🛒 Online Shopping System"]
        UC1["View Items"]
        UC2["Register Account"]
        UC3["Manage Cart"]
        UC4["Checkout"]
    end

    %% Customer interactions
    WC -->|uses| UC1
    NC -->|uses| UC2
    RC -->|uses| UC3
    RC -->|uses| UC4

    %% Inheritance relationships
    NC -.->|inherits from| WC
    RC -.->|inherits from| WC

    %% External services
    UC2 -->|integrates| AU
    UC4 -->|integrates| PS
```

## Description

This use case diagram represents the **Online Shopping System** with the following components:

### Actors

- **Web Customer** (base actor)
  - **New Customer** - visitors registering for the first time
  - **Registered Customer** - returning customers
- **Authentication Service** - external service for user verification
- **Payment Service** - external service for transaction processing

### Use Cases

1. **View Items** - Browse available products (all customers)
2. **Register Account** - Create a new customer account (new customers)
3. **Manage Cart** - Add/remove items and view cart (registered customers)
4. **Checkout** - Complete purchase process (registered customers)

### Key Relationships

- New and Registered customers inherit from Web Customer
- Registration uses Authentication Service
- Checkout uses Payment Service
