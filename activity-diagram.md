# Online Shopping - Checkout Activity Diagram with Swimlanes

## 1. Activity Diagram (Vertical - Top to Bottom)

```mermaid
graph TD
    Start((" "))

    subgraph Customer["👤 REGISTERED CUSTOMER"]
        A1["Click Checkout<br/>Button"]
        A2["Enter Shipping &<br/>Billing Address"]
        A3["Review Order<br/>Details"]
        A4["Confirm<br/>Purchase"]
        A5["View Order<br/>Confirmation"]
    end

    subgraph Auth["🔐 AUTHENTICATION SERVICE"]
        B1{"User Logged<br/>In?"}
        B2["Redirect to<br/>Login Page"]
        B3["Verify User<br/>Credentials"]
    end

    subgraph System["⚙️ SYSTEM LOGIC"]
        C1["Validate Address<br/>Information"]
        C2["Calculate Total &<br/>Check Stock"]
        C3["Create Order<br/>Record"]
    end

    subgraph Payment["💳 PAYMENT SERVICE"]
        D1["Process Payment<br/>Transaction"]
        D2{"Payment<br/>Valid?"}
        D3["Authorize<br/>Transaction"]
    end

    subgraph Response["📧 SYSTEM RESPONSE"]
        E1["Generate Order<br/>Confirmation"]
        E2["Send Confirmation<br/>Email"]
        E3["Update Inventory"]
        End((" "))
    end

    Start --> A1
    A1 --> B1

    B1 -->|No| B2
    B2 --> B3
    B3 -->|Success| B1

    B1 -->|Yes| A2
    A2 --> C1
    C1 -->|Valid| A3
    C1 -->|Invalid| A2

    A3 --> A4
    A4 --> C2
    C2 --> D1

    D1 --> D2
    D2 -->|Invalid| A2
    D2 -->|Valid| D3

    D3 --> C3
    C3 --> E1
    E1 --> E2
    E2 --> E3
    E3 --> A5
    A5 --> End

    style Start fill:#1a1a1a,stroke:#333,color:#fff
    style End fill:#1a1a1a,stroke:#333,color:#fff
    style B1 fill:#fff3cd,stroke:#ff9800,stroke-width:2px
    style D2 fill:#fff3cd,stroke:#ff9800,stroke-width:2px
    style C1 fill:#fff3cd,stroke:#ff9800,stroke-width:2px
    style A5 fill:#d4edda,stroke:#28a745,stroke-width:2px
```

---

## 2. Horizontal Swimlane Diagram (Left to Right)

```mermaid
graph LR
    Start((" "))

    subgraph Customer["👤 REGISTERED CUSTOMER"]
        A1["Click Checkout<br/>Button"]
        A2["Enter Shipping &<br/>Billing Address"]
        A3["Review Order<br/>Details"]
        A4["Confirm<br/>Purchase"]
        A5["View Order<br/>Confirmation"]
    end

    subgraph Auth["🔐 AUTHENTICATION SERVICE"]
        B1{"User Logged<br/>In?"}
        B2["Redirect to<br/>Login Page"]
        B3["Verify User<br/>Credentials"]
    end

    subgraph System["⚙️ SYSTEM LOGIC"]
        C1["Validate Address<br/>Information"]
        C2["Calculate Total &<br/>Check Stock"]
        C3["Create Order<br/>Record"]
    end

    subgraph Payment["💳 PAYMENT SERVICE"]
        D1["Process Payment<br/>Transaction"]
        D2{"Payment<br/>Valid?"}
        D3["Authorize<br/>Transaction"]
    end

    subgraph Response["📧 SYSTEM RESPONSE"]
        E1["Generate Order<br/>Confirmation"]
        E2["Send Confirmation<br/>Email"]
        E3["Update Inventory"]
        End((" "))
    end

    Start --> A1
    A1 --> B1

    B1 -->|No| B2
    B2 --> B3
    B3 -->|Success| B1

    B1 -->|Yes| A2
    A2 --> C1
    C1 -->|Valid| A3
    C1 -->|Invalid| A2

    A3 --> A4
    A4 --> C2
    C2 --> D1

    D1 --> D2
    D2 -->|Invalid| A2
    D2 -->|Valid| D3

    D3 --> C3
    C3 --> E1
    E1 --> E2
    E2 --> E3
    E3 --> A5
    A5 --> End

    style Start fill:#1a1a1a,stroke:#333,color:#fff
    style End fill:#1a1a1a,stroke:#333,color:#fff
    style B1 fill:#fff3cd,stroke:#ff9800,stroke-width:2px
    style D2 fill:#fff3cd,stroke:#ff9800,stroke-width:2px
    style C1 fill:#fff3cd,stroke:#ff9800,stroke-width:2px
    style A5 fill:#d4edda,stroke:#28a745,stroke-width:2px
```

---

## Swimlane Description & Flow Details

### Diagram Overview

- **Diagram 1 (Vertical)**: Shows the complete activity flow from top to bottom - best for understanding the complete sequence
- **Diagram 2 (Horizontal)**: Shows swimlanes side-by-side - best for identifying which actor is responsible for each activity

### 1. **REGISTERED CUSTOMER** 👤

**Responsible for:** Initiating the checkout process and providing information

| Activity                         | Description                                     |
| -------------------------------- | ----------------------------------------------- |
| Click Checkout Button            | User initiates checkout from cart               |
| Enter Shipping & Billing Address | User inputs delivery and billing information    |
| Review Order Details             | Customer reviews items, quantities, and pricing |
| Confirm Purchase                 | Customer confirms and submits the order         |
| View Order Confirmation          | Displays final confirmation message             |

---

### 2. **AUTHENTICATION SERVICE** 🔐

**Responsible for:** Verifying user identity and authorization

| Activity                | Description                                      |
| ----------------------- | ------------------------------------------------ |
| User Logged In?         | Decision point - checks if user session is valid |
| Redirect to Login Page  | Routes user to login if not authenticated        |
| Verify User Credentials | Validates username/password or session token     |

---

### 3. **SYSTEM LOGIC** ⚙️

**Responsible for:** Validating data and processing order logic

| Activity                      | Description                                |
| ----------------------------- | ------------------------------------------ |
| Validate Address Information  | Checks address format and completeness     |
| Calculate Total & Check Stock | Computes total cost and verifies inventory |
| Create Order Record           | Saves order to database                    |

---

### 4. **PAYMENT SERVICE** 💳

**Responsible for:** Processing financial transactions

| Activity                    | Description                                |
| --------------------------- | ------------------------------------------ |
| Process Payment Transaction | Initiates payment processing               |
| Payment Valid?              | Decision point - validates payment success |
| Authorize Transaction       | Confirms payment authorization             |

---

### 5. **SYSTEM RESPONSE** 📧

**Responsible for:** Sending confirmations and notifications

| Activity                    | Description                    |
| --------------------------- | ------------------------------ |
| Generate Order Confirmation | Creates confirmation document  |
| Send Confirmation Email     | Emails receipt to customer     |
| Update Inventory            | Adjusts stock levels in system |

---

## Key Decision Points

🔶 **Is User Logged In?**

- **YES** → Proceed to enter shipping information
- **NO** → Redirect to login page

🔶 **Is Address Valid?**

- **VALID** → Continue to review order
- **INVALID** → Return to address entry

🔶 **Payment Valid?**

- **VALID** → Authorize and complete order
- **INVALID** → Return to information entry for retry
