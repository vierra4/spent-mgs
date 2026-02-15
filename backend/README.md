flowchart TD
    %% Users
    A[User/Employee] -->|Submit Spend| B[FastAPI Backend]

    %% Backend Services
    B --> C[SpendService]
    B --> D[PolicyService]
    B --> E[ApprovalService]
    B --> F[NotificationService]
    B --> G[AuditService]
    B --> H[Gemini Extraction Service]

    %% DB Logic
    I[(PostgreSQL / Tortoise ORM)]
    C & D & E & F & G & H --- I

    %% Auth Flow
    A -->|Login / Token| J[Auth0]
    B -->|Validate JWT & Roles| J

    %% Notification Flow
    E -->|Create Approval| F
    F -->|Store Notification| I
    A -->|Poll Notifications| F

    %% Policy & Gemini Logic
    C -->|Evaluate| D
    D -->|Return Actions| C
    C -->|Process Document| H
    H -->|Structured Data| C
    C -->|Trigger| E

    %% Audit
    C & D & E & H --> G

    %% Styles
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style I fill:#bfb,stroke:#333,stroke-width:2px
    style J fill:#ffb,stroke:#333,stroke-width:2px
