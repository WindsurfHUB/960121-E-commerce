# Online Shopping - Checkout Activity Diagram with Swimlanes

## Flow Diagram

```mermaid
graph TD
    %% Swimlane 1: Registered Customer
    subgraph Customer["👤 Registered Customer"]
        Start((" ")) --> ClickCheckout["🛒 Click Checkout Button"]
        ClickCheckout --> EnterInfo["📝 Enter Shipping &<br/>Billing Info"]
        EnterInfo --> ReviewOrder["✅ Review Order"]
        ReviewOrder --> ConfirmOrder["🔔 Confirm Purchase"]
    end

    %% Swimlane 2: Authentication Service
    subgraph Auth["🔐 Authentication Service"]
        CheckAuth{"Is User<br/>Logged In?"}
        AuthPrompt["⚠️ Redirect to<br/>Login Page"]
        ReAuth["Verify Credentials"]
    end

    %% Swimlane 3: System Logic
    subgraph System["⚙️ System Logic Layer"]
        ValidateCart["📊 Calculate Total &<br/>Check Stock"]
        ValidateInfo["✔️ Validate Address<br/>& Payment Info"]
        RecordOrder["💾 Save Order<br/>to Database"]
    end

    %% Swimlane 4: Payment Service
    subgraph Payment["💳 Payment Service"]
        ProcessTrans["🔄 Execute Payment<br/>Transaction"]
        VerifyPay{"Payment<br/>Valid?"}
    end

    %% Swimlane 5: System Response
    subgraph Response["📧 System Response"]
        ViewSuccess["✨ Display Success<br/>Message"]
        SendEmail["📨 Send Order<br/>Confirmation Email"]
        Stop((" "))
    end

    %% Cross-swimlane flow logic
    ClickCheckout --> CheckAuth
    CheckAuth -->|"No"| AuthPrompt
    AuthPrompt --> ReAuth
    ReAuth -->|"Success"| CheckAuth
    CheckAuth -->|"Yes"| EnterInfo

    EnterInfo --> ValidateInfo
    ReviewOrder --> ValidateCart
    ConfirmOrder --> ProcessTrans

    ProcessTrans --> VerifyPay
    VerifyPay -->|"Invalid"| EnterInfo
    VerifyPay -->|"Valid"| RecordOrder

    RecordOrder --> ViewSuccess
    ViewSuccess --> SendEmail
    SendEmail --> Stop

    %% Styling
    style Start fill:#1a1a1a,stroke:#333,color:#fff
    style Stop fill:#1a1a1a,stroke:#333,color:#fff
    style VerifyPay fill:#fff3cd,stroke:#ff9800,stroke-width:2px
    style CheckAuth fill:#fff3cd,stroke:#ff9800,stroke-width:2px
    style ViewSuccess fill:#d4edda,stroke:#28a745,stroke-width:2px
```

---

## Activity Flow Description

### Swimlanes & Actors

| Swimlane                   | Role             | Responsibility                              |
| -------------------------- | ---------------- | ------------------------------------------- |
| **Registered Customer**    | End User         | Initiates checkout and provides information |
| **Authentication Service** | External Service | Verifies user login credentials             |
| **System Logic Layer**     | Backend          | Validates data and manages order processing |
| **Payment Service**        | External Service | Processes payment transactions              |
| **System Response**        | Backend          | Sends confirmations and notifications       |

### Key Steps

1. **Customer Initiation** - User clicks checkout button
2. **Authentication Check** - System verifies user is logged in
3. **Information Collection** - Customer enters shipping & billing details
4. **Validation** - System validates cart, stock, and payment information
5. **Payment Processing** - Payment service processes the transaction
6. **Order Recording** - Order is saved to the database
7. **Confirmation** - Success message displayed and email sent

### Decision Points

- **Is User Logged In?** - Routes to login if not authenticated
- **Payment Valid?** - Loops back to information entry if payment fails
