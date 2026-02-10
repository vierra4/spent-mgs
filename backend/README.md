flowchart TD
    %% Users
    A[Employee / Manager / Finance / Admin] -->|Submit Spend| B[FastAPI Backend]

    %% Backend
    B --> C[SpendService]
    B --> D[PolicyService]
    B --> E[ApprovalService]
    B --> F[NotificationService]
    B --> G[AuditService]
    B --> H[Gemini Extraction Service]

    %% DB
    B --> I[(PostgreSQL / Tortoise ORM)]
    C --> I
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I

    %% Auth
    A -->|Login / Token| J[Auth0]
    B -->|Validate JWT & Roles| J

    %% Notification Flow
    E -->|Create approval| F
    F -->|Store notification| I
    A -->|Poll notifications| F

    %% Policy Evaluation
    C -->|Send spend| D
    D -->|Return actions| C
    C -->|Trigger approval / auto-approve| E

    %% Gemini Extraction
    C -->|Invoice / Receipt| H
    H -->|Structured Data| C

    %% Audit Logs
    C --> G
    D --> G
    E --> G
    H --> G

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style I fill:#bfb,stroke:#333,stroke-width:2px
    style J fill:#ffb,stroke:#333,stroke-width:2px
