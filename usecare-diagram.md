# Online Shopping System - Use Case Diagram

```mermaid
usecaseDiagram
    %% Actors
    actor "Web Customer" as WC
    actor "New Customer" as NC
    actor "Registered Customer" as RC
    actor "Authentication Service" as AU
    actor "Payment Service" as PS

    %% Generalization (Inheritance)
    NC --|> WC
    RC --|> WC

    rectangle "Online Shopping System" {
        usecase "View Items" as UC1
        usecase "Register Account" as UC2
        usecase "Manage Cart" as UC3
        usecase "Checkout" as UC4
    }

    %% Customer Interactions
    WC --> UC1
    NC --> UC2
    RC --> UC3
    RC --> UC4

    %% System Dependencies
    UC2 ..|> AU : uses
    UC4 ..|> PS : uses
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
