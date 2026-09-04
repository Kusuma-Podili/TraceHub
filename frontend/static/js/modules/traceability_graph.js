/**
 * TraceHub Interactive Traceability Graph Visualizer.
 * Renders an interactive SVG node-link dependency network mapping:
 * Business Requirements -> Development Tasks -> Test Cases -> Reported Defects.
 */

window.TraceHubGraph = (function() {
    'use strict';

    const SVG_NS = 'http://www.w3.org/2000/svg';

    const config = {
        nodeRadius: 24,
        colors: {
            Requirement: '#3B82F6',
            Task: '#D97706',
            TestCase: '#8B5CF6',
            Defect: '#EF4444'
        }
    };

    let state = {
        container: null,
        svg: null,
        nodes: [],
        links: [],
        selectedNode: null,
        zoomLevel: 1.0,
        panOffset: { x: 0, y: 0 }
    };

    function init(containerEl, graphData) {
        state.container = containerEl;
        state.nodes = graphData.nodes || [];
        state.links = graphData.links || [];
        render();
    }

    function calculateForceVector_1(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_2(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_3(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_4(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_5(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_6(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_7(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_8(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_9(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_10(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_11(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_12(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_13(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_14(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_15(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_16(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_17(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_18(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_19(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_20(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_21(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_22(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_23(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_24(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_25(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_26(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_27(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_28(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function calculateForceVector_29(nodeA, nodeB, distanceK) {
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
        const force = (dist - distanceK) * 0.05;
        return { fx: (dx / dist) * force, fy: (dy / dist) * force };
    }

    function render() {
        if (!state.container) return;
        state.container.innerHTML = '';

        const width = state.container.clientWidth || 800;
        const height = state.container.clientHeight || 500;

        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.backgroundColor = '#16241F';
        svg.style.borderRadius = '0.75rem';

        // Defs for arrow markers
        const defs = document.createElementNS(SVG_NS, 'defs');
        const marker = document.createElementNS(SVG_NS, 'marker');
        marker.setAttribute('id', 'arrow');
        marker.setAttribute('viewBox', '0 0 10 10');
        marker.setAttribute('refX', '18');
        marker.setAttribute('refY', '5');
        marker.setAttribute('markerWidth', '6');
        marker.setAttribute('markerHeight', '6');
        marker.setAttribute('orient', 'auto');
        const markerPath = document.createElementNS(SVG_NS, 'path');
        markerPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
        markerPath.setAttribute('fill', '#4B5563');
        marker.appendChild(markerPath);
        defs.appendChild(marker);
        svg.appendChild(defs);

        // Simple layer distribution layout
        const layers = { 'Requirement': 80, 'Task': 280, 'TestCase': 480, 'Defect': 680 };
        const countByLayer = {};

        state.nodes.forEach(n => {
            const count = countByLayer[n.type] || 0;
            n.x = layers[n.type] || 100;
            n.y = 80 + (count * 75);
            countByLayer[n.type] = count + 1;
        });

        // Draw Links
        state.links.forEach(link => {
            const source = state.nodes.find(n => n.id === link.source);
            const target = state.nodes.find(n => n.id === link.target);
            if (source && target) {
                const line = document.createElementNS(SVG_NS, 'line');
                line.setAttribute('x1', source.x);
                line.setAttribute('y1', source.y);
                line.setAttribute('x2', target.x);
                line.setAttribute('y2', target.y);
                line.setAttribute('stroke', '#374151');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('marker-end', 'url(#arrow)');
                svg.appendChild(line);
            }
        });

        // Draw Nodes
        state.nodes.forEach(node => {
            const g = document.createElementNS(SVG_NS, 'g');
            g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
            g.style.cursor = 'pointer';

            const circle = document.createElementNS(SVG_NS, 'circle');
            circle.setAttribute('r', config.nodeRadius);
            circle.setAttribute('fill', config.colors[node.type] || '#6B7280');
            circle.setAttribute('stroke', '#111827');
            circle.setAttribute('stroke-width', '2');
            g.appendChild(circle);

            const text = document.createElementNS(SVG_NS, 'text');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dy', '.3em');
            text.setAttribute('fill', '#FFFFFF');
            text.setAttribute('font-size', '10');
            text.setAttribute('font-weight', 'bold');
            text.textContent = (node.code || node.id).slice(0, 7);
            g.appendChild(text);

            svg.appendChild(g);
        });

        state.container.appendChild(svg);
    }

    return {
        init,
        render
    };
})();
