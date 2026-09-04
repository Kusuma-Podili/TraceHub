# TraceHub - Enterprise Software Development Life Cycle (SDLC) Management System

An enterprise-grade, human-crafted **SDLC Project Management System** architected to guide software engineering organizations through the complete end-to-end software delivery lifecycle:

```
Requirement Analysis → Planning → Design → Development → Testing → Deployment → Maintenance
```

Built with **FastAPI**, **SQLAlchemy 2.0**, **SQLite**, and a tailored responsive Single-Page Architecture using a distinctive **warm cream / off-white (`#FAF8F5`)** and **deep charcoal / dark forest green (`#16241F`, `#1E3A2F`)** visual design system.

---

## Key Capabilities & Role Governance

### 1. Project Manager (Full Governance & Release Gatekeeping)
- **Project Creation & Portfolio Tracking**: Define project code, priority, scope, start/target dates, and team allocation.
- **SDLC Phase Progression Engine**: Advance projects through the 7 SDLC stages with strict gate validations (e.g. requires approved specifications before planning; verified dev reviews before QA; zero critical defects before deployment).
- **Executive Analytics & KPI Dashboard**: Real-time Chart.js visual metrics:
  - SDLC Phase Distribution
  - Task Status Flow Breakdown
  - Defect Severity & Quality Risk
  - QA Test Execution Outcomes
- **Comprehensive Traceability Reports**: Exportable cross-cutting reports filtered across 7 dimensions.

### 2. Developer (Engineering Workspace & Task Delivery)
- **Dedicated Sprint Workspace**: Focused view of in-progress tasks, completed deliverables, assigned requirements, and assigned defect patch tickets.
- **Interactive Kanban Board**: 4-column drag-and-drop / select status board (`To Do` → `In Progress` → `Review` → `Completed`).
- **QA Testing Handoff**: Submit completed development tasks for formal tester validation.
- **Defect Patch Resolution**: Submit root cause fix notes for reported bugs to queue them for QA retesting.

### 3. Tester (QA Verification & Defect Lifecycle)
- **Test Management Suite**: Preconditions, step-by-step test execution, expected vs. actual results, duration logging, and pass/fail telemetry.
- **Defect Reporting**: Direct integration from failed test runs to bug reporting.
- **Retesting Verification Queue**: Inspect developer fix notes, execute retests, and either mark `Closed` (verified) or `Reopened` (failed).

---

## Default Demo Credentials

The platform initializes on first launch with realistic demo projects (including the flagship **Aetheria AAA Cloud Gaming Engine & Platform**):

| Role | Username / Email | Password | Access Level |
|---|---|---|---|
| **Project Manager** | `pm@enterprise.com` or `manager` | `manager123` | Full Governance & Release Authority |
| **Developer** | `dev@enterprise.com` or `developer` | `developer123` | Sprint Backlog & Code Submissions |
| **Tester** | `tester@enterprise.com` or `tester` | `tester123` | Test Runner & Defect Verification |

*(Quick demo buttons are also available on the login page for 1-click credential filling)*

---

## Quickstart & Installation

### Dependency Installation

The project provides dependency manifests and locked versions for both Python backend and client-side tooling:

#### Option A: Poetry (Recommended Backend Workflow)
```powershell
# Install locked backend dependencies using poetry.lock
poetry install
```

#### Option B: Standard Pip
```powershell
# Install from requirements.txt
pip install -r requirements.txt
```

#### Client & Tooling Dependencies (Node.js)
```powershell
# Install client-side tooling dependencies using package-lock.json
npm ci
# or
npm install
```

### Launch the Application
```powershell
python run.py
```
Open your browser and navigate to:
```
http://127.0.0.1:8000
```

### Running Automated Test Suite
Run the 17 automated test cases covering authentication, SDLC gate validation, Kanban transitions, defect lifecycles, and reports:
```powershell
python -m pytest backend/app/tests/ -v
```

---

## License

**Proprietary and Confidential.** All rights reserved.  
Copyright © 2026 TraceHub. Unauthorized copying, distribution, or modification of this software and associated documentation files via any medium is strictly prohibited.

---

## Project Structure

```
sdlc/
├── backend/
│   └── app/
│       ├── config.py              # Application settings & constants
│       ├── database.py            # SQLAlchemy database engine & sessionmaker
│       ├── main.py                # FastAPI app setup, static mounting, router registration
│       ├── models/                # SQLAlchemy database models
│       │   ├── user.py            # User credentials & roles
│       │   ├── project.py         # Project, ProjectMember, SDLCPhase
│       │   ├── requirement.py     # Functional & business requirements
│       │   ├── task.py            # Sprint tasks & Kanban
│       │   ├── test_case.py       # Test cases & execution logs
│       │   ├── bug.py             # Defects & retest status
│       │   ├── deployment.py      # Environments (Dev, Test, Staging, Prod)
│       │   ├── maintenance.py     # Post-release tickets & enhancements
│       │   └── notification.py    # In-app alerts & activity logs
│       ├── routers/               # Modular REST API endpoints
│       ├── schemas/               # Pydantic validation schemas
│       ├── services/              # Auth hashing, progress computation, demo data seed
│       └── tests/                 # Automated pytest test suites (15 tests)
├── frontend/
│   └── static/
│       ├── css/
│       │   └── style.css          # Warm cream & deep charcoal/forest design system
│       ├── js/
│       │   ├── api.js             # Unified async API client
│       │   ├── app.js             # SPA router & state controller
│       │   ├── components/        # Dynamic sidebar & top header
│       │   └── views/             # 12 functional view controllers
│       └── index.html             # Main SPA entry container
├── run.py                         # Application runner script
└── README.md
```
