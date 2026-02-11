Spent-mgs
---

## 1. High level flow

Everything revolves around **SpendEvent lifecycle**.

```
Input → SpendEvent → Policy Engine → Approval Engine → Finalization → Output
```

No shortcuts. No special cases.

---

## 2. Spend intake flow

This is how data enters the system.

### Sources

* Manual expense
* Receipt upload
* Bank CSV import
* Vendor bill upload

### Logic

1. User submits expense or system imports it
2. Create SpendEvent with status = "pending"
3. Attach Receipt if available
4. Write AuditLog: SpendEvent created
5. Emit internal event: SpendCreated

Models touched:

* SpendEvent
* Receipt
* AuditLog

---

## 3. Policy evaluation flow

Triggered immediately after creation.

### Policy Engine responsibility

* Read SpendEvent
* Load all active Policies for org
* Evaluate PolicyRules by priority
* Produce decisions

### Decisions can be:

* Auto approve
* Require approval
* Block spend
* Require receipt
* Flag anomaly

### Logic

1. Consume SpendCreated
2. Fetch policies
3. Evaluate rules against SpendEvent fields
4. Aggregate actions
5. Update SpendEvent status if applicable
6. Emit next event

Models touched:

* Policy
* PolicyRule
* SpendEvent
* AuditLog

Internal event:

* PolicyEvaluated

---

## 4. Approval workflow

Only runs if policy demands it.

### Approval Engine responsibility

* Create Approval records
* Track state changes
* Enforce ordering

### Logic

1. PolicyEvaluated says approval needed
2. Create Approval with status = "pending"
3. Notify approver
4. Approver approves or rejects
5. Update Approval status
6. Update SpendEvent status
7. Write AuditLog

Models touched:

* Approval
* SpendEvent
* AuditLog

Internal events:

* ApprovalRequested
* ApprovalCompleted

---

## 5. Receipt verification flow

Can run in parallel.

### Logic

1. Receipt uploaded
2. OCR async task runs
3. Extracted data saved
4. Receipt marked verified or flagged
5. Policy may re evaluate if required

Models touched:

* Receipt
* SpendEvent
* AuditLog

Internal event:

* ReceiptVerified

---

## 6. Spend finalization

This is the point of truth.

### Conditions

* All required approvals completed
* Required receipts present
* No blocking policies

### Logic

1. ApprovalCompleted or PolicyEvaluated triggers check
2. Validate SpendEvent completeness
3. Mark SpendEvent as approved or rejected
4. Lock fields from mutation
5. Write AuditLog

Models touched:

* SpendEvent
* AuditLog

Internal event:

* SpendFinalized

---

## 7. Accounting output flow

Passive but essential.

### Logic

* Finance exports approved SpendEvents
* Categories mapped to accounting codes
* No business logic here

Models touched:

* SpendEvent
* Category

---

## 8. Communication pattern summary

Even if implemented inline, **think like this**:

```
Controller
  ↓
Service
  ↓
Model
  ↓
AuditLog
  ↓
Event
```

Later you can:

* Swap events for message queue
* Run policy and OCR async
* Scale approvals independently

No model needs to know about another model’s logic.

---

## 9. What this unlocks later

* Cards create SpendEvents
* Budgets become policies
* AI suggestions become policy actions
* Real time controls plug in naturally

---

## Next step options

1. Policy rule JSON structure and evaluator
2. Approval state machine code
3. SpendEvent API lifecycle endpoints
4. Async task and event abstraction
## Notes
tools used :
1. Tortoise ORM, Sqlite for testing locally, AUTH0 for authentication & Authorization cycle, Fastapi
2. Reactjs with AUTH0 for Auth, React-router-dom, React-hook-form, Tialwindcss, Shadcn-ui,  
--
