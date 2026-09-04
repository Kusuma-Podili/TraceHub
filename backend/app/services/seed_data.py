from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.app.models.user import User
from backend.app.models.project import Project, ProjectMember, SDLCPhase
from backend.app.models.requirement import Requirement
from backend.app.models.task import Task
from backend.app.models.test_case import TestCase, TestExecution
from backend.app.models.bug import Bug
from backend.app.models.deployment import Deployment
from backend.app.models.maintenance import MaintenanceRecord
from backend.app.models.notification import Notification, ActivityLog
from backend.app.services.auth_service import hash_password
from backend.app.config import SDLC_PHASES_ORDER

def seed_database(db: Session):
    # Check if data already exists
    if db.query(User).first():
        return

    print("Seeding initial enterprise demo data...")

    # 1. Users
    users = [
        User(
            username="manager",
            email="pm@enterprise.com",
            full_name="Sarah Chen",
            role="Project Manager",
            hashed_password=hash_password("manager123"),
            avatar_color="#1E3A2F"
        ),
        User(
            username="developer",
            email="dev@enterprise.com",
            full_name="Alex Rivera",
            role="Developer",
            hashed_password=hash_password("developer123"),
            avatar_color="#2D5A43"
        ),
        User(
            username="tester",
            email="tester@enterprise.com",
            full_name="Priya Patel",
            role="Tester",
            hashed_password=hash_password("tester123"),
            avatar_color="#3C6E71"
        ),
        User(
            username="marcus",
            email="marcus@enterprise.com",
            full_name="Marcus Vance",
            role="Developer",
            hashed_password=hash_password("marcus123"),
            avatar_color="#4361EE"
        ),
        User(
            username="elena",
            email="elena@enterprise.com",
            full_name="Elena Rostova",
            role="Tester",
            hashed_password=hash_password("elena123"),
            avatar_color="#7209B7"
        )
    ]
    db.add_all(users)
    db.commit()

    pm_user = users[0]
    dev_user = users[1]
    qa_user = users[2]
    dev2_user = users[3]
    qa2_user = users[4]

    # 2. Project 1: Aetheria - AAA Cloud Gaming Engine & Multiplayer Infrastructure
    now = datetime.utcnow()
    project1 = Project(
        code="AETH-01",
        name="Aetheria: AAA Cloud Gaming Engine & Multiplayer Platform",
        description="High-performance real-time cloud gaming platform featuring a multithreaded Vulkan graphics pipeline, WebRTC sub-30ms input streaming, distributed matchmaking microservices, 3D spatial audio DSP, and an immutable inventory ledger.",
        manager_id=pm_user.id,
        priority="Critical",
        status="Active",
        current_phase="Development",
        start_date=now - timedelta(days=60),
        target_date=now + timedelta(days=90),
        progress_percent=58.5,
        architecture_notes="""# Architecture Overview
- **Client Rendering Layer**: C++20 / WebAssembly Vulkan abstraction with dynamic frame pacing.
- **Networking Core**: WebRTC DataChannels for ultra-low latency inputs; QUIC protocol for telemetry.
- **Backend Microservices**: Go & Python distributed cluster orchestrated via Kubernetes.
- **State Synchronization**: Redis cluster for transient room state; PostgreSQL + TimescaleDB for telemetry logs.
- **Cloud Infrastructure**: AWS GameLift for dynamic fleet scaling across US-East, EU-Central, and AP-East.""",
        ui_ux_notes="""# UI/UX Design Guidelines
- Minimal HUD overlay with 60 FPS CSS/WebGL transitions.
- Low-latency touch and gamepad controller mapping with custom vibration feedback.
- Warm charcoal UI skin with high contrast tactical indicators.""",
        db_design_notes="""# Database Schemas
- `players`: UUID, gamer_tag, region, elo_rating, created_at.
- `matches`: match_uuid, server_pod_ip, map_seed, start_tick, end_tick, outcome.
- `player_inventory`: player_uuid, item_sku, durability, acquired_at.""",
        tech_design_notes="""# Technical Specifications
- Target Latency: < 35ms end-to-end input-to-photon on 5G/Fiber.
- Target Throughput: 120 FPS at 1440p using hardware H.265 / AV1 hardware encoders."""
    )
    db.add(project1)
    db.commit()
    db.refresh(project1)

    # Assign members
    members1 = [
        ProjectMember(project_id=project1.id, user_id=pm_user.id, role_in_project="Project Manager"),
        ProjectMember(project_id=project1.id, user_id=dev_user.id, role_in_project="Lead Developer"),
        ProjectMember(project_id=project1.id, user_id=dev2_user.id, role_in_project="Graphics Engineer"),
        ProjectMember(project_id=project1.id, user_id=qa_user.id, role_in_project="QA Lead"),
        ProjectMember(project_id=project1.id, user_id=qa2_user.id, role_in_project="Performance Tester")
    ]
    db.add_all(members1)

    # SDLC Phases for Project 1
    phase_configs = [
        ("Requirement Analysis", 0, "Gather player specifications, engine performance targets, and cloud infrastructure requirements.", "Completed", now - timedelta(days=60), now - timedelta(days=46), 100.0),
        ("Planning", 1, "Sprint roadmap, budget forecasting, GPU instance provisioning, and risk assessment.", "Completed", now - timedelta(days=45), now - timedelta(days=36), 100.0),
        ("Design", 2, "Vulkan pipeline diagrams, distributed microservice schemas, network packet layouts, and UI/UX wireframes.", "Completed", now - timedelta(days=35), now - timedelta(days=21), 100.0),
        ("Development", 3, "Core graphics engine build, WebRTC signaling servers, physics integration, and player matchmaking.", "In Progress", now - timedelta(days=20), now + timedelta(days=25), 65.0),
        ("Testing", 4, "Stress testing frame rates, latency jitter verification, penetration testing, and QA regressions.", "Not Started", now + timedelta(days=26), now + timedelta(days=50), 0.0),
        ("Deployment", 5, "Multi-region AWS GameLift fleet rollout, CDN edge routing, and monitoring telemetry.", "Not Started", now + timedelta(days=51), now + timedelta(days=70), 0.0),
        ("Maintenance", 6, "Live operations, server patch updates, hotfix deployment, and seasonal content patches.", "Not Started", now + timedelta(days=71), now + timedelta(days=90), 0.0),
    ]

    for name, idx, desc, status, s_date, e_date, pct in phase_configs:
        db.add(SDLCPhase(
            project_id=project1.id,
            phase_name=name,
            order_index=idx,
            description=desc,
            status=status,
            start_date=s_date,
            end_date=e_date,
            completion_percent=pct
        ))
    db.commit()

    # Requirements for Project 1
    reqs = [
        Requirement(
            req_code="REQ-AETH-101",
            project_id=project1.id,
            title="Multi-threaded Vulkan Graphics Render Pipeline",
            description="The graphics engine must support asynchronous compute shaders and multi-queue Vulkan command buffers sustaining 120 FPS at 1440p.",
            priority="Critical",
            status="Completed",
            assigned_to_id=dev2_user.id,
            created_by_id=pm_user.id
        ),
        Requirement(
            req_code="REQ-AETH-102",
            project_id=project1.id,
            title="Sub-35ms WebRTC Input & Frame Streamer",
            description="Video encoder output must be packetized over SCTP/RTP with dynamic bitrate adaptation to handle internet jitter up to 8% without frame drops.",
            priority="Critical",
            status="In Progress",
            assigned_to_id=dev_user.id,
            created_by_id=pm_user.id
        ),
        Requirement(
            req_code="REQ-AETH-103",
            project_id=project1.id,
            title="Distributed Low-Latency Matchmaking Service",
            description="Matchmaking service should group players within 50ms ping radius and comparable ELO skill ratings inside 5 seconds.",
            priority="High",
            status="In Progress",
            assigned_to_id=dev_user.id,
            created_by_id=pm_user.id
        ),
        Requirement(
            req_code="REQ-AETH-104",
            project_id=project1.id,
            title="3D Positional Spatial Audio DSP Engine",
            description="Hardware-accelerated HRTF audio pipeline rendering 64 simultaneous audio voices with distance attenuation and occlusion.",
            priority="Medium",
            status="In Progress",
            assigned_to_id=dev2_user.id,
            created_by_id=pm_user.id
        ),
        Requirement(
            req_code="REQ-AETH-105",
            project_id=project1.id,
            title="Anti-Cheat Memory Scanning & Integrity Verification",
            description="Client runtime must detect debugger attachments, DLL injection, and unsigned process memory tampering.",
            priority="High",
            status="Approved",
            assigned_to_id=dev_user.id,
            created_by_id=pm_user.id
        ),
    ]
    db.add_all(reqs)
    db.commit()
    for r in reqs:
        db.refresh(r)

    # Tasks for Project 1
    tasks = [
        Task(
            task_code="TSK-AETH-201",
            project_id=project1.id,
            requirement_id=reqs[0].id,
            title="Initialize Vulkan Context and Swapchain Setup",
            description="Configure Vulkan instance, physical device scoring, logical queues, and double-buffered swapchain presentation.",
            assigned_to_id=dev2_user.id,
            phase_name="Development",
            priority="Critical",
            status="Completed",
            progress_percent=100.0,
            due_date=now - timedelta(days=10)
        ),
        Task(
            task_code="TSK-AETH-202",
            project_id=project1.id,
            requirement_id=reqs[1].id,
            title="Implement WebRTC PeerConnection SDP Handshake",
            description="Build WebSocket signaling server to exchange ICE candidates and SDP offers between game server pod and browser client.",
            assigned_to_id=dev_user.id,
            phase_name="Development",
            priority="Critical",
            status="Completed",
            progress_percent=100.0,
            due_date=now - timedelta(days=5)
        ),
        Task(
            task_code="TSK-AETH-203",
            project_id=project1.id,
            requirement_id=reqs[3].id,
            title="Integrate HRTF Convolution Filtering for Spatial Audio",
            description="Write audio DSP pass converting mono sound sources to binaural stereo output based on listener vector matrix.",
            assigned_to_id=dev2_user.id,
            phase_name="Development",
            priority="Medium",
            status="Review",
            progress_percent=90.0,
            due_date=now + timedelta(days=2)
        ),
        Task(
            task_code="TSK-AETH-204",
            project_id=project1.id,
            requirement_id=reqs[2].id,
            title="Redis Geo-Partitioned Matchmaking Lobby Queue",
            description="Implement Redis sorted sets by player ping and rating brackets with exponential expansion over wait time.",
            assigned_to_id=dev_user.id,
            phase_name="Development",
            priority="High",
            status="In Progress",
            progress_percent=60.0,
            due_date=now + timedelta(days=5)
        ),
        Task(
            task_code="TSK-AETH-205",
            project_id=project1.id,
            requirement_id=reqs[4].id,
            title="Kernel Driver DLL Injection Detection Hooks",
            description="Implement memory integrity checker scanning PE header import tables and intercepting suspicious remote thread creation.",
            assigned_to_id=dev_user.id,
            phase_name="Development",
            priority="High",
            status="To Do",
            progress_percent=0.0,
            due_date=now + timedelta(days=14)
        ),
        Task(
            task_code="TSK-AETH-206",
            project_id=project1.id,
            requirement_id=reqs[0].id,
            title="Dynamic Resolution Frame Pacing Controller",
            description="Automatically step down render target resolution when GPU frame time exceeds 8.3ms to preserve smooth 120 FPS.",
            assigned_to_id=dev2_user.id,
            phase_name="Development",
            priority="Medium",
            status="To Do",
            progress_percent=0.0,
            due_date=now + timedelta(days=18)
        )
    ]
    db.add_all(tasks)
    db.commit()

    # Test Cases for Project 1
    tcases = [
        TestCase(
            case_code="TC-AETH-301",
            project_id=project1.id,
            requirement_id=reqs[0].id,
            name="Vulkan Pipeline 120 FPS Frame Time Stress Verification",
            description="Verify render loop does not drop frames below 118 FPS during heavy particle physics simulation.",
            preconditions="RTX 4080 test bench, Vulkan validation layers enabled in profile mode.",
            test_steps="1. Launch demo benchmark scene with 50,000 active compute particles.\n2. Record frame times for 180 seconds.\n3. Verify 99th percentile frame latency < 8.33ms.",
            expected_result="Mean frame rate >= 119.5 FPS, zero frame stalls or pipeline descriptor leaks.",
            actual_result="Passed with average 121.2 FPS and 7.1ms mean frame time.",
            priority="Critical",
            status="Passed",
            created_by_id=qa_user.id
        ),
        TestCase(
            case_code="TC-AETH-302",
            project_id=project1.id,
            requirement_id=reqs[1].id,
            name="WebRTC Stream Recovery Under 10% Simulated Packet Drop",
            description="Verify WebRTC video stream recovers within 250ms when simulated network packet loss reaches 10%.",
            preconditions="Clumsy or NetLimiter packet drops injected at client interface.",
            test_steps="1. Connect client to cloud render node.\n2. Inject 10% random packet drops for 30 seconds.\n3. Observe frame freeze duration and RTCP NACK retransmission.",
            expected_result="Client dynamically adjusts bitrate, triggers intra-frame I-frame request, recovers playback without crash.",
            actual_result="Stream adapted resolution gracefully to 1080p within 180ms.",
            priority="High",
            status="Passed",
            created_by_id=qa_user.id
        ),
        TestCase(
            case_code="TC-AETH-303",
            project_id=project1.id,
            requirement_id=reqs[3].id,
            name="Spatial Audio 360-Degree Azimuth Rotation Test",
            description="Validate that 3D audio pan shifts correctly between left and right stereo ears as player camera orbits audio source.",
            preconditions="Headphone binaural monitor tool attached to audio output buffer.",
            test_steps="1. Place stationary sound emitter at (0, 0, 10).\n2. Rotate player camera 360 degrees in 15-degree increments.\n3. Inspect HRTF filter output amplitude and phase delay.",
            expected_result="Audio pan smoothly interpolates between ears with realistic distance falloff.",
            actual_result="Audio buffer underrun detected when rotating camera at angular speed > 180 deg/sec.",
            priority="Medium",
            status="Failed",
            created_by_id=qa_user.id
        ),
        TestCase(
            case_code="TC-AETH-304",
            project_id=project1.id,
            requirement_id=reqs[2].id,
            name="Matchmaking Queue Under 5,000 Concurrent Requests",
            description="Load test Redis matchmaking service with 5k simulated players submitting match requests simultaneously.",
            preconditions="Locust test cluster configured with simulated player ping metadata.",
            test_steps="1. Ramp up to 5,000 synthetic players in 10 seconds.\n2. Verify average match creation latency.\n3. Check server CPU and memory usage.",
            expected_result="All players matched into 4-player lobbies within 4.5 seconds; 0 dropped connections.",
            actual_result="Pending execution in next test sprint.",
            priority="High",
            status="Not Executed",
            created_by_id=qa2_user.id
        )
    ]
    db.add_all(tcases)
    db.commit()
    for tc in tcases:
        db.refresh(tc)

    # Executions
    execs = [
        TestExecution(
            test_case_id=tcases[0].id,
            executed_by_id=qa_user.id,
            status="Passed",
            actual_result="Maintained 121.2 FPS average. GPU memory remained steady at 2.4 GB.",
            notes="Benchmark run #104 passed all criteria.",
            execution_time_ms=180000
        ),
        TestExecution(
            test_case_id=tcases[1].id,
            executed_by_id=qa_user.id,
            status="Passed",
            actual_result="WebRTC bitrate throttled gracefully from 25Mbps to 16Mbps under 10% packet drop.",
            notes="Adaptive bitrate algorithm performing as expected.",
            execution_time_ms=45000
        ),
        TestExecution(
            test_case_id=tcases[2].id,
            executed_by_id=qa_user.id,
            status="Failed",
            actual_result="Audio crackles and buffer underrun when rotating camera rapidly.",
            notes="Logged BUG-AETH-401 for audio DSP team.",
            execution_time_ms=12000
        )
    ]
    db.add_all(execs)
    db.commit()

    # Bugs for Project 1
    bugs = [
        Bug(
            bug_code="BUG-AETH-401",
            title="Audio DSP buffer underrun crackle on rapid player camera yaw rotation",
            description="When player executes a quick flick shot or rapid 180-degree turn, the HRTF convolution calculation fails to complete within the 5ms audio buffer deadline, producing audible audio pops and crackles.",
            project_id=project1.id,
            requirement_id=reqs[3].id,
            test_case_id=tcases[2].id,
            severity="High",
            priority="High",
            status="Open",
            assigned_to_id=dev2_user.id,
            reported_by_id=qa_user.id,
            due_date=now + timedelta(days=3)
        ),
        Bug(
            bug_code="BUG-AETH-402",
            title="Shader compilation freeze on initial startup on NVIDIA driver 545.x",
            description="First frame render hangs for up to 4.2 seconds while compiling monolithic Vulkan SPIR-V pipeline shaders.",
            project_id=project1.id,
            requirement_id=reqs[0].id,
            severity="Medium",
            priority="Medium",
            status="Ready for Retesting",
            assigned_to_id=dev2_user.id,
            reported_by_id=qa2_user.id,
            resolution_notes="Implemented asynchronous background pipeline compilation with pre-warmed shader bytecode cache on disk.",
            due_date=now + timedelta(days=1)
        ),
        Bug(
            bug_code="BUG-AETH-403",
            title="Memory leak in WebRTC peer connection teardown during abrupt client disconnect",
            description="When a player closes the browser tab without sending an orderly goodbye packet, the media transport context buffer was not deallocated.",
            project_id=project1.id,
            requirement_id=reqs[1].id,
            severity="Critical",
            priority="Critical",
            status="Closed",
            assigned_to_id=dev_user.id,
            reported_by_id=qa_user.id,
            resolution_notes="Registered RAII smart pointer cleanup and watchdog heartbeat ping that cleans up zombie peers after 3 seconds of silence."
        )
    ]
    db.add_all(bugs)
    db.commit()

    # Deployments for Project 1
    deps = [
        Deployment(
            project_id=project1.id,
            version="v0.8.2-alpha",
            environment="Development",
            status="Successful",
            deployed_by_id=pm_user.id,
            release_notes="Internal alpha build featuring Vulkan rendering core and initial WebRTC video streaming pipeline."
        ),
        Deployment(
            project_id=project1.id,
            version="v0.9.0-rc1",
            environment="Staging",
            status="In Progress",
            deployed_by_id=pm_user.id,
            release_notes="Release Candidate 1 for closed tester group: Spatial audio and multi-region matchmaking."
        )
    ]
    db.add_all(deps)

    # Maintenance records
    maint = [
        MaintenanceRecord(
            project_id=project1.id,
            title="Add NVIDIA DLSS 3.5 Frame Generation & Ray Reconstruction Support",
            type="Enhancement",
            priority="High",
            status="In Analysis",
            assigned_to_id=dev2_user.id,
            resolution_details="Evaluating NVAPI SDK integration for cloud gaming GPU instances."
        )
    ]
    db.add_all(maint)

    # Activity Logs
    logs = [
        ActivityLog(project_id=project1.id, user_id=pm_user.id, action_type="project_created", description="Project 'Aetheria: AAA Cloud Gaming Engine' created."),
        ActivityLog(project_id=project1.id, user_id=pm_user.id, action_type="phase_changed", description="Moved project from Requirement Analysis to Planning."),
        ActivityLog(project_id=project1.id, user_id=pm_user.id, action_type="phase_changed", description="Moved project from Planning to Design."),
        ActivityLog(project_id=project1.id, user_id=pm_user.id, action_type="phase_changed", description="Moved project from Design to Development."),
        ActivityLog(project_id=project1.id, user_id=qa_user.id, action_type="bug_reported", description="Logged High-severity BUG-AETH-401 (Audio DSP crackle)."),
        ActivityLog(project_id=project1.id, user_id=dev2_user.id, action_type="bug_fixed", description="Resolved shader compilation freeze (BUG-AETH-402). Awaiting QA retest.")
    ]
    db.add_all(logs)

    # Notifications
    notifications = [
        Notification(user_id=dev_user.id, title="New Task Assigned", message="You have been assigned to 'Redis Geo-Partitioned Matchmaking Lobby Queue'.", type="info", link="#tasks"),
        Notification(user_id=dev2_user.id, title="Bug Assigned", message="Priya Patel assigned BUG-AETH-401 (Audio DSP crackle) to you.", type="warning", link="#bugs"),
        Notification(user_id=qa_user.id, title="Bug Ready for Retest", message="Marcus Vance resolved BUG-AETH-402 (Shader compilation freeze). Please retest.", type="success", link="#bugs"),
        Notification(user_id=pm_user.id, title="Phase Advancement Ready", message="Project Aetheria development phase is at 65% completion.", type="info", link="#projects")
    ]
    db.add_all(notifications)

    # 3. Project 2: NovaPay Cross-Border Settlement Gateway
    project2 = Project(
        code="NOVA-02",
        name="NovaPay: Global B2B Cross-Border Settlement Gateway",
        description="ISO 20022 compliant enterprise banking gateway with automated SWIFT / SEPA routing, real-time FX hedging, and AML transaction screening.",
        manager_id=pm_user.id,
        priority="High",
        status="Active",
        current_phase="Testing",
        start_date=now - timedelta(days=90),
        target_date=now + timedelta(days=30),
        progress_percent=78.0,
        architecture_notes="Java Spring Boot microservices with Kafka event streaming and PostgreSQL.",
        ui_ux_notes="Corporate banking portal adhering to WCAG 2.1 AA accessibility.",
        db_design_notes="Double-entry ledger with immutable audit logs.",
        tech_design_notes="P99 response time < 120ms for international wire validations."
    )
    db.add(project2)
    db.commit()
    db.refresh(project2)

    db.add(ProjectMember(project_id=project2.id, user_id=pm_user.id, role_in_project="Project Manager"))
    db.add(ProjectMember(project_id=project2.id, user_id=dev_user.id, role_in_project="Backend Lead"))
    db.add(ProjectMember(project_id=project2.id, user_id=qa_user.id, role_in_project="QA Engineer"))

    for name, idx, desc, status, s_date, e_date, pct in [
        ("Requirement Analysis", 0, "Banking regulatory compliance and SWIFT standards.", "Completed", now - timedelta(days=90), now - timedelta(days=75), 100.0),
        ("Planning", 1, "Security audits and multi-currency capital requirements.", "Completed", now - timedelta(days=74), now - timedelta(days=60), 100.0),
        ("Design", 2, "Ledger state machine and FX quotation API specs.", "Completed", now - timedelta(days=59), now - timedelta(days=45), 100.0),
        ("Development", 3, "Core payment routing and transaction encryption.", "Completed", now - timedelta(days=44), now - timedelta(days=15), 100.0),
        ("Testing", 4, "PCI-DSS vulnerability scans and simulated banking settlement runs.", "In Progress", now - timedelta(days=14), now + timedelta(days=15), 70.0),
        ("Deployment", 5, "Deployment to SOC2 certified cloud infrastructure.", "Not Started", now + timedelta(days=16), now + timedelta(days=25), 0.0),
        ("Maintenance", 6, "24/7 bank operational support and SLA tracking.", "Not Started", now + timedelta(days=26), now + timedelta(days=30), 0.0),
    ]:
        db.add(SDLCPhase(
            project_id=project2.id,
            phase_name=name,
            order_index=idx,
            description=desc,
            status=status,
            start_date=s_date,
            end_date=e_date,
            completion_percent=pct
        ))

    # Add quick demo items for Project 2
    req_nova = Requirement(
        req_code="REQ-NOVA-101",
        project_id=project2.id,
        title="ISO 20022 XML Message Validation Engine",
        description="Verify incoming pain.001 and pacs.008 payment instruction formats against federal schemas.",
        priority="Critical",
        status="Completed",
        assigned_to_id=dev_user.id,
        created_by_id=pm_user.id
    )
    db.add(req_nova)
    db.commit()

    db.add(Task(
        task_code="TSK-NOVA-201",
        project_id=project2.id,
        requirement_id=req_nova.id,
        title="Validate XML XSD schemas for SEPA Instant Payments",
        assigned_to_id=dev_user.id,
        phase_name="Testing",
        priority="High",
        status="Completed",
        progress_percent=100.0,
        due_date=now - timedelta(days=3)
    ))

    db.add(TestCase(
        case_code="TC-NOVA-301",
        project_id=project2.id,
        requirement_id=req_nova.id,
        name="Sanctions Screening AML Name Match Accuracy",
        description="Submit 10,000 synthetic wire transfers through OFAC sanctions filter.",
        test_steps="1. Upload simulated transaction batch.\n2. Verify watchlist hits flag transactions for compliance hold.",
        expected_result="100% true positive match on sanctioned entities with zero false negatives.",
        actual_result="Passed with 0 false negatives.",
        priority="Critical",
        status="Passed",
        created_by_id=qa_user.id
    ))

    # 4. Project 3: HealthSync - EHR & Telehealth Portal
    project3 = Project(
        code="HLTH-03",
        name="HealthSync: Hospital EHR & Telehealth Portal",
        description="HIPAA-compliant electronic health records system with integrated encrypted video consultations and HL7/FHIR interoperability.",
        manager_id=pm_user.id,
        priority="Medium",
        status="Completed",
        current_phase="Maintenance",
        start_date=now - timedelta(days=180),
        target_date=now - timedelta(days=10),
        progress_percent=100.0
    )
    db.add(project3)
    db.commit()
    db.refresh(project3)

    db.add(Deployment(
        project_id=project3.id,
        version="v2.1.0-prod",
        environment="Production",
        status="Successful",
        deployed_by_id=pm_user.id,
        release_notes="Production release certified for HIPAA hospital rollouts."
    ))

    db.add(MaintenanceRecord(
        project_id=project3.id,
        title="FHIR R4 Patient Export API pagination enhancement",
        type="Enhancement",
        priority="Medium",
        status="Resolved",
        assigned_to_id=dev_user.id,
        resolution_details="Added cursor-based pagination for large clinical query result sets."
    ))

    db.commit()
    print("Database seeding completed successfully!")
