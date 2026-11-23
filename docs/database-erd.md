# Database ERD — Telehealth MVP

*The data model, as built in `supabase/migrations/`. Renders as a diagram on GitHub. Last updated: 2026-11-23.*

- **profiles** = people (patients, clinicians, admins); `id` is the Supabase Auth user id.
- **cases** = the spine — one patient's treatment journey.
- Step tables (**intakes, appointments, consultations, lab_orders, plans, prescriptions**) clip onto a case via `case_id`.
- **products** = the EDE-gated catalog; **plan_items** = the join table (many products per plan).
- **consents** + **audit_log** = the compliance layer.

```mermaid
erDiagram
  profiles ||--o{ cases : "is patient in"
  profiles ||--o{ cases : "is clinician on"
  profiles ||--o{ consents : signs
  profiles ||--o{ audit_log : acts
  cases ||--o{ intakes : has
  cases ||--o{ appointments : has
  cases ||--o{ consultations : has
  cases ||--o{ lab_orders : has
  cases ||--o{ plans : has
  cases ||--o{ prescriptions : has
  cases ||--o{ consents : covers
  plans ||--o{ plan_items : contains
  products ||--o{ plan_items : "appears in"
  products ||--o{ prescriptions : "prescribed as"

  profiles {
    uuid id PK
    user_role role
    text full_name
    timestamptz created_at
  }
  cases {
    uuid id PK
    uuid patient_id FK
    uuid clinician_id FK
    case_stage stage
    timestamptz created_at
  }
  intakes {
    uuid id PK
    uuid case_id FK
    jsonb answers
  }
  appointments {
    uuid id PK
    uuid case_id FK
    timestamptz scheduled_at
    text video_link
  }
  consultations {
    uuid id PK
    uuid case_id FK
    text outcome
  }
  lab_orders {
    uuid id PK
    uuid case_id FK
    text status
  }
  plans {
    uuid id PK
    uuid case_id FK
  }
  plan_items {
    uuid id PK
    uuid plan_id FK
    uuid product_id FK
    text dosage
  }
  prescriptions {
    uuid id PK
    uuid case_id FK
    uuid product_id FK
  }
  products {
    uuid id PK
    text name
    bool ede_cleared
  }
  consents {
    uuid id PK
    uuid profile_id FK
    uuid case_id FK
    text version
  }
  audit_log {
    uuid id PK
    uuid profile_id FK
    text action
  }
```

**How to read the lines:** `||` = one, `o{` (crow's foot) = many. So `profiles ||--o{ cases` means *one profile → many cases*, and each case has exactly one patient.
