# Weekend Work Submission

## 1. The Contract Table
| Component | Request (The Order) | Response (The Delivery) |
| :--- | :--- | :--- |
| **Method** | GET | |
| **Endpoint** | `/api/products?category=Clothing` | |
| **Headers** | Accept: application/json | Content-Type: application/json |
| **Status Code** | | 200 OK (or 500 Internal Server Error) |
| **Body (Data)** | *(Empty for GET)* | `[{"id": 5, "title": "Cotton Slim-Fit T-Shirt", ...}]` |

## 2. Sequence Diagram
```mermaid
flowchart LR
    classDef frontend fill:#e0f2fe,stroke:#2563eb,stroke-width:2px;
    classDef backend fill:#dcfce7,stroke:#059669,stroke-width:2px;
    classDef database fill:#fef9c3,stroke:#d97706,stroke-width:2px;

    subgraph Frontend [Frontend Environment]
        U((User))
        B[Browser UI]:::frontend
    end

    subgraph Backend [Backend Environment]
        S[Express Server Gatekeeper]:::backend
        D[(products.json)]:::database
    end

    U -- "1. Clicks 'Clothing'" --> B
    B -- "2. Request:\nGET /api/products?category=Clothing" --> S
    S -- "3a. Validate & Fetch" --> D
    D -- "3b. Return Raw Array" --> S
    S -- "3c. Filter by 'Clothing'" --> S
    S -- "4. Response:\n200 OK + JSON Package" --> B
    B -- "5. renderUI()" --> U 
```

## 3. GenAI Prompt
Prompt used to generate the Express route:
"Act as a Backend Architect. Using Node.js and Express, create a modular folder structure. Write a products.js route file that handles a GET request to /api/products. Accept a query parameter for 'category' to filter the results. The data is currently stored in a local JSON file. Ensure the code follows the Controller-Route-Service pattern and include comments explaining how it works."