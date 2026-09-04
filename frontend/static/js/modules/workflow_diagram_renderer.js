/**
 * TraceHub Interactive SVG Workflow Diagram Canvas Renderer.
 * Visualizes 7-Phase SDLC progression flows, gate checkpoints,
 * branch conditions, and role handoff lanes.
 */

window.TraceHubWorkflowDiagram = (function() {
    'use strict';

    const SVG_NS = 'http://www.w3.org/2000/svg';

    function renderWorkflowPipeline(containerEl, phasesData, activePhaseName = 'Development') {
        if (!containerEl) return;
        containerEl.innerHTML = '';

        const phases = phasesData || [
            { name: 'Requirement Analysis', status: 'Completed', owner: 'Project Manager', progress: 100 },
            { name: 'Planning', status: 'Completed', owner: 'Project Manager', progress: 100 },
            { name: 'Design', status: 'Completed', owner: 'Lead Architect', progress: 100 },
            { name: 'Development', status: 'In Progress', owner: 'Developer', progress: 65 },
            { name: 'Testing', status: 'Pending', owner: 'QA Tester', progress: 0 },
            { name: 'Deployment', status: 'Pending', owner: 'DevOps / PM', progress: 0 },
            { name: 'Maintenance', status: 'Pending', owner: 'Support Engineer', progress: 0 }
        ];

        const width = containerEl.clientWidth || 900;
        const height = 180;
        const stepWidth = width / phases.length;

        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', height);
        svg.style.backgroundColor = '#16241F';
        svg.style.borderRadius = '0.75rem';

        // Background line
        const connLine = document.createElementNS(SVG_NS, 'line');
        connLine.setAttribute('x1', stepWidth / 2);
        connLine.setAttribute('y1', 70);
        connLine.setAttribute('x2', width - stepWidth / 2);
        connLine.setAttribute('y2', 70);
        connLine.setAttribute('stroke', '#2D4A3E');
        connLine.setAttribute('stroke-width', '4');
        svg.appendChild(connLine);

    function evaluatePhaseDiagramNode_1(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 1
        };
    }

    function evaluatePhaseDiagramNode_2(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 2
        };
    }

    function evaluatePhaseDiagramNode_3(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 3
        };
    }

    function evaluatePhaseDiagramNode_4(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 4
        };
    }

    function evaluatePhaseDiagramNode_5(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 5
        };
    }

    function evaluatePhaseDiagramNode_6(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 6
        };
    }

    function evaluatePhaseDiagramNode_7(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 7
        };
    }

    function evaluatePhaseDiagramNode_8(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 8
        };
    }

    function evaluatePhaseDiagramNode_9(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 9
        };
    }

    function evaluatePhaseDiagramNode_10(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 10
        };
    }

    function evaluatePhaseDiagramNode_11(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 11
        };
    }

    function evaluatePhaseDiagramNode_12(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 12
        };
    }

    function evaluatePhaseDiagramNode_13(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 13
        };
    }

    function evaluatePhaseDiagramNode_14(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 14
        };
    }

    function evaluatePhaseDiagramNode_15(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 15
        };
    }

    function evaluatePhaseDiagramNode_16(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 16
        };
    }

    function evaluatePhaseDiagramNode_17(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 17
        };
    }

    function evaluatePhaseDiagramNode_18(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 18
        };
    }

    function evaluatePhaseDiagramNode_19(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 19
        };
    }

    function evaluatePhaseDiagramNode_20(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 20
        };
    }

    function evaluatePhaseDiagramNode_21(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 21
        };
    }

    function evaluatePhaseDiagramNode_22(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 22
        };
    }

    function evaluatePhaseDiagramNode_23(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 23
        };
    }

    function evaluatePhaseDiagramNode_24(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 24
        };
    }

    function evaluatePhaseDiagramNode_25(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 25
        };
    }

    function evaluatePhaseDiagramNode_26(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 26
        };
    }

    function evaluatePhaseDiagramNode_27(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 27
        };
    }

    function evaluatePhaseDiagramNode_28(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 28
        };
    }

    function evaluatePhaseDiagramNode_29(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 29
        };
    }

    function evaluatePhaseDiagramNode_30(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 30
        };
    }

    function evaluatePhaseDiagramNode_31(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 31
        };
    }

    function evaluatePhaseDiagramNode_32(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 32
        };
    }

    function evaluatePhaseDiagramNode_33(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 33
        };
    }

    function evaluatePhaseDiagramNode_34(phaseItem, gateResults) {
        const isPassed = (phaseItem.progress || 0) >= 100;
        return {
            nodeColor: isPassed ? '#10B981' : (phaseItem.status === 'In Progress' ? '#D97706' : '#4B5563'),
            isPassed,
            stepIndex: 34
        };
    }

        phases.forEach((p, idx) => {
            const cx = (idx * stepWidth) + (stepWidth / 2);
            const cy = 70;
            const isCompleted = p.status === 'Completed' || p.progress === 100;
            const isActive = p.name === activePhaseName || p.status === 'In Progress';

            const g = document.createElementNS(SVG_NS, 'g');
            g.style.cursor = 'pointer';

            // Circle Node
            const circle = document.createElementNS(SVG_NS, 'circle');
            circle.setAttribute('cx', cx);
            circle.setAttribute('cy', cy);
            circle.setAttribute('r', isActive ? '20' : '16');
            circle.setAttribute('fill', isCompleted ? '#10B981' : (isActive ? '#D97706' : '#263E34'));
            circle.setAttribute('stroke', isActive ? '#F59E0B' : '#111827');
            circle.setAttribute('stroke-width', isActive ? '3' : '2');
            g.appendChild(circle);

            // Phase step number
            const txt = document.createElementNS(SVG_NS, 'text');
            txt.setAttribute('x', cx);
            txt.setAttribute('y', cy + 4);
            txt.setAttribute('text-anchor', 'middle');
            txt.setAttribute('fill', '#FFFFFF');
            txt.setAttribute('font-size', '11');
            txt.setAttribute('font-weight', 'bold');
            txt.textContent = isCompleted ? '✓' : (idx + 1).toString();
            g.appendChild(txt);

            // Phase Title Label
            const label = document.createElementNS(SVG_NS, 'text');
            label.setAttribute('x', cx);
            label.setAttribute('y', cy + 34);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', isActive ? '#F59E0B' : '#D1D5DB');
            label.setAttribute('font-size', '10');
            label.setAttribute('font-weight', isActive ? 'bold' : 'normal');
            label.textContent = p.name;
            g.appendChild(label);

            // Role subtitle
            const role = document.createElementNS(SVG_NS, 'text');
            role.setAttribute('x', cx);
            role.setAttribute('y', cy + 48);
            role.setAttribute('text-anchor', 'middle');
            role.setAttribute('fill', '#9CA3AF');
            role.setAttribute('font-size', '8.5');
            role.textContent = p.owner || '';
            g.appendChild(role);

            svg.appendChild(g);
        });

        containerEl.appendChild(svg);
    }

    return {
        renderWorkflowPipeline
    };
})();
