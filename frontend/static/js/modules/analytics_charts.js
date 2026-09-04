/**
 * TraceHub Enterprise Analytics & Data Visualization Engine.
 * Provides custom SVG and Canvas charting for Burndown, Burnup, Cumulative Flow Diagrams (CFD),
 * Cycle Time Scatterplots, Velocity Trends, and Defect Severity Heatmaps.
 */

window.TraceHubCharts = (function() {
    'use strict';

    // SVG Namespace
    const SVG_NS = 'http://www.w3.org/2000/svg';

    /**
     * Helper to create SVG elements with attributes.
     */
    function createSvgElement(tag, attrs = {}, children = []) {
        const el = document.createElementNS(SVG_NS, tag);
        for (const [key, val] of Object.entries(attrs)) {
            el.setAttribute(key, val);
        }
        for (const child of children) {
            if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else if (child) {
                el.appendChild(child);
            }
        }
        return el;
    }

    /**
     * Formats numbers to 1 decimal place.
     */
    function formatNum(val) {
        return Number(val).toFixed(1);
    }


    /**
     * Renders a responsive SVG Burndown Chart.
     * @param {HTMLElement} container - DOM container element
     * @param {Array} dataPoints - Array of { date_str, day_number, ideal_remaining_points, actual_remaining_points, completed_points_today }
     * @param {Object} options - Customization options
     */
    function renderBurndownSvg(container, dataPoints, options = {}) {
        if (!container) return;
        container.innerHTML = '';

        if (!dataPoints || dataPoints.length === 0) {
            container.innerHTML = '<div class="text-center py-8 text-neutral-400">No burndown data available for current sprint.</div>';
            return;
        }

        const width = options.width || container.clientWidth || 650;
        const height = options.height || 320;
        const padding = { top: 30, right: 40, bottom: 45, left: 50 };

        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // Determine max points
        let maxPoints = 0;
        dataPoints.forEach(d => {
            if (d.ideal_remaining_points > maxPoints) maxPoints = d.ideal_remaining_points;
            if (d.actual_remaining_points > maxPoints) maxPoints = d.actual_remaining_points;
        });
        maxPoints = Math.max(10, Math.ceil(maxPoints * 1.1));

        const svg = createSvgElement('svg', {
            viewBox: `0 0 ${width} ${height}`,
            width: '100%',
            height: height,
            class: 'tracehub-burndown-chart'
        });

        // Background
        svg.appendChild(createSvgElement('rect', {
            x: 0, y: 0, width, height,
            fill: options.bgColor || '#1A2E26',
            rx: 8
        }));

        // Grid lines & Y Axis labels
        const yTicks = 5;
        for (let i = 0; i <= yTicks; i++) {
            const val = (maxPoints / yTicks) * i;
            const y = padding.top + chartHeight - (val / maxPoints) * chartHeight;

            // Grid line
            svg.appendChild(createSvgElement('line', {
                x1: padding.left, y1: y,
                x2: padding.left + chartWidth, y2: y,
                stroke: '#2D4A3E',
                'stroke-dasharray': '3,3',
                'stroke-width': '1'
            }));

            // Label
            const label = createSvgElement('text', {
                x: padding.left - 10, y: y + 4,
                fill: '#9CA3AF',
                'font-size': '11',
                'text-anchor': 'end',
                'font-family': 'monospace'
            }, [formatNum(val)]);
            svg.appendChild(label);
        }

        // X Axis points & labels
        const totalPointsCount = dataPoints.length;
        const xStep = chartWidth / Math.max(1, totalPointsCount - 1);

        dataPoints.forEach((d, idx) => {
            const x = padding.left + idx * xStep;

            // X grid line
            svg.appendChild(createSvgElement('line', {
                x1: x, y1: padding.top,
                x2: x, y2: padding.top + chartHeight,
                stroke: '#243E33',
                'stroke-dasharray': '2,2',
                'stroke-width': '1'
            }));

            // X label (Day or Date)
            const dateLabel = d.date_str ? d.date_str.slice(5) : `D${d.day_number}`;
            if (idx === 0 || idx === totalPointsCount - 1 || idx % Math.ceil(totalPointsCount / 6) === 0) {
                const label = createSvgElement('text', {
                    x: x, y: height - 15,
                    fill: '#9CA3AF',
                    'font-size': '10',
                    'text-anchor': 'middle',
                    'font-family': 'sans-serif'
                }, [dateLabel]);
                svg.appendChild(label);
            }
        });

        // Ideal line path (Guideline)
        const idealPathD = dataPoints.map((d, idx) => {
            const x = padding.left + idx * xStep;
            const y = padding.top + chartHeight - (d.ideal_remaining_points / maxPoints) * chartHeight;
            return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        svg.appendChild(createSvgElement('path', {
            d: idealPathD,
            fill: 'none',
            stroke: '#6B7280',
            'stroke-width': '2',
            'stroke-dasharray': '5,5'
        }));

        // Actual Line Path
        const actualPoints = dataPoints.filter(d => d.actual_remaining_points !== null && d.actual_remaining_points !== undefined);
        if (actualPoints.length > 0) {
            const actualPathD = actualPoints.map((d, idx) => {
                const x = padding.left + idx * xStep;
                const y = padding.top + chartHeight - (d.actual_remaining_points / maxPoints) * chartHeight;
                return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ');

            // Area fill under actual curve
            const firstX = padding.left;
            const lastX = padding.left + (actualPoints.length - 1) * xStep;
            const bottomY = padding.top + chartHeight;
            const areaD = `${actualPathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

            svg.appendChild(createSvgElement('path', {
                d: areaD,
                fill: 'rgba(217, 119, 6, 0.15)'
            }));

            // Actual line
            svg.appendChild(createSvgElement('path', {
                d: actualPathD,
                fill: 'none',
                stroke: '#D97706',
                'stroke-width': '3',
                'stroke-linecap': 'round'
            }));

            // Data node dots
            actualPoints.forEach((d, idx) => {
                const x = padding.left + idx * xStep;
                const y = padding.top + chartHeight - (d.actual_remaining_points / maxPoints) * chartHeight;

                const circle = createSvgElement('circle', {
                    cx: x, cy: y, r: '4',
                    fill: '#F59E0B',
                    stroke: '#16241F',
                    'stroke-width': '2',
                    class: 'cursor-pointer'
                });

                // Tooltip title
                const titleEl = createSvgElement('title', {}, [
                    `Day ${d.day_number} (${d.date_str}): Remaining ${d.actual_remaining_points} pts (Completed today: ${d.completed_points_today} pts)`
                ]);
                circle.appendChild(titleEl);
                svg.appendChild(circle);
            });
        }

        // Legend
        const legend = createSvgElement('g', { transform: `translate(${padding.left + 20}, ${padding.top - 10})` });
        // Ideal legend
        legend.appendChild(createSvgElement('line', { x1: 0, y1: 0, x2: 20, y2: 0, stroke: '#6B7280', 'stroke-width': '2', 'stroke-dasharray': '3,3' }));
        legend.appendChild(createSvgElement('text', { x: 26, y: 4, fill: '#9CA3AF', 'font-size': '11' }, ['Ideal Guideline']));
        // Actual legend
        legend.appendChild(createSvgElement('line', { x1: 130, y1: 0, x2: 150, y2: 0, stroke: '#D97706', 'stroke-width': '3' }));
        legend.appendChild(createSvgElement('text', { x: 156, y: 4, fill: '#D97706', 'font-size': '11', 'font-weight': 'bold' }, ['Actual Remaining']));

        svg.appendChild(legend);
        container.appendChild(svg);
    }


    /**
     * Renders an interactive Cumulative Flow Diagram (CFD).
     * @param {HTMLElement} container - DOM target element
     * @param {Array} historyData - Daily status distribution counts [{ date, todo, in_progress, testing, completed }]
     */
    function renderCumulativeFlowDiagramSvg(container, historyData, options = {}) {
        if (!container) return;
        container.innerHTML = '';

        if (!historyData || historyData.length === 0) {
            container.innerHTML = '<div class="text-center py-8 text-neutral-400">No cumulative flow history available.</div>';
            return;
        }

        const width = options.width || container.clientWidth || 650;
        const height = options.height || 340;
        const padding = { top: 30, right: 40, bottom: 45, left: 50 };

        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // Calculate max cumulative tasks per day
        let maxTasks = 0;
        historyData.forEach(d => {
            const total = (d.todo || 0) + (d.in_progress || 0) + (d.testing || 0) + (d.completed || 0);
            if (total > maxTasks) maxTasks = total;
        });
        maxTasks = Math.max(10, Math.ceil(maxTasks * 1.15));

        const svg = createSvgElement('svg', {
            viewBox: `0 0 ${width} ${height}`,
            width: '100%',
            height: height,
            class: 'tracehub-cfd-chart'
        });

        // Background
        svg.appendChild(createSvgElement('rect', {
            x: 0, y: 0, width, height,
            fill: options.bgColor || '#16241F',
            rx: 8
        }));

        const totalDays = historyData.length;
        const xStep = chartWidth / Math.max(1, totalDays - 1);

        // Compute cumulative layers for stacking:
        // Layer 1: Completed (Green)
        // Layer 2: Completed + Testing (Purple)
        // Layer 3: Completed + Testing + In Progress (Blue)
        // Layer 4: Completed + Testing + In Progress + To Do (Grey/Amber)
        const layers = [
            { key: 'completed', label: 'Completed', color: '#10B981', fill: 'rgba(16, 185, 129, 0.7)' },
            { key: 'testing', label: 'Testing', color: '#8B5CF6', fill: 'rgba(139, 92, 246, 0.6)' },
            { key: 'in_progress', label: 'In Progress', color: '#3B82F6', fill: 'rgba(59, 130, 246, 0.5)' },
            { key: 'todo', label: 'To Do', color: '#6B7280', fill: 'rgba(107, 114, 128, 0.4)' }
        ];

        // Draw stacked area polygons
        // We accumulate values from bottom to top
        for (let lIdx = layers.length - 1; lIdx >= 0; lIdx--) {
            const curLayer = layers[lIdx];
            const upperPoints = [];
            const lowerPoints = [];

            historyData.forEach((d, dIdx) => {
                const x = padding.left + dIdx * xStep;

                // Sum of all layers up to this one
                let upperSum = 0;
                for (let i = 0; i <= lIdx; i++) {
                    upperSum += (d[layers[i].key] || 0);
                }
                const upperY = padding.top + chartHeight - (upperSum / maxTasks) * chartHeight;
                upperPoints.push(`${x},${upperY}`);

                // Sum of layers below this one
                let lowerSum = 0;
                for (let i = 0; i < lIdx; i++) {
                    lowerSum += (d[layers[i].key] || 0);
                }
                const lowerY = padding.top + chartHeight - (lowerSum / maxTasks) * chartHeight;
                lowerPoints.unshift(`${x},${lowerY}`);
            });

            const polygonPoints = [...upperPoints, ...lowerPoints].join(' ');
            svg.appendChild(createSvgElement('polygon', {
                points: polygonPoints,
                fill: curLayer.fill,
                stroke: curLayer.color,
                'stroke-width': '1'
            }));
        }

        // Axes & Grid
        const yTicks = 5;
        for (let i = 0; i <= yTicks; i++) {
            const val = (maxTasks / yTicks) * i;
            const y = padding.top + chartHeight - (val / maxTasks) * chartHeight;

            svg.appendChild(createSvgElement('line', {
                x1: padding.left, y1: y,
                x2: padding.left + chartWidth, y2: y,
                stroke: '#2D4A3E',
                'stroke-dasharray': '2,2'
            }));

            svg.appendChild(createSvgElement('text', {
                x: padding.left - 10, y: y + 4,
                fill: '#9CA3AF',
                'font-size': '10',
                'text-anchor': 'end',
                'font-family': 'monospace'
            }, [Math.round(val).toString()]));
        }

        // X labels
        historyData.forEach((d, idx) => {
            if (idx === 0 || idx === totalDays - 1 || idx % Math.ceil(totalDays / 5) === 0) {
                const x = padding.left + idx * xStep;
                svg.appendChild(createSvgElement('text', {
                    x: x, y: height - 15,
                    fill: '#9CA3AF',
                    'font-size': '10',
                    'text-anchor': 'middle'
                }, [d.date ? d.date.slice(5) : `D${idx + 1}`]));
            }
        });

        // Legend bar
        const legend = createSvgElement('g', { transform: `translate(${padding.left}, ${padding.top - 15})` });
        let legendX = 0;
        layers.forEach(layer => {
            legend.appendChild(createSvgElement('rect', { x: legendX, y: 0, width: 12, height: 12, fill: layer.color, rx: 2 }));
            legend.appendChild(createSvgElement('text', { x: legendX + 16, y: 10, fill: '#D1D5DB', 'font-size': '11' }, [layer.label]));
            legendX += 105;
        });
        svg.appendChild(legend);

        container.appendChild(svg);
    }


    /**
     * Renders a Sprint Velocity Bar Chart.
     * @param {HTMLElement} container - DOM element
     * @param {Array} sprints - Array of { name, committed_points, completed_points }
     */
    function renderVelocityChartSvg(container, sprints, options = {}) {
        if (!container) return;
        container.innerHTML = '';

        if (!sprints || sprints.length === 0) {
            container.innerHTML = '<div class="text-center py-8 text-neutral-400">No historical sprint velocity data.</div>';
            return;
        }

        const width = options.width || container.clientWidth || 600;
        const height = options.height || 300;
        const padding = { top: 30, right: 30, bottom: 45, left: 50 };

        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        let maxVal = 0;
        sprints.forEach(s => {
            if (s.committed_points > maxVal) maxVal = s.committed_points;
            if (s.completed_points > maxVal) maxVal = s.completed_points;
        });
        maxVal = Math.max(15, Math.ceil(maxVal * 1.2));

        const svg = createSvgElement('svg', {
            viewBox: `0 0 ${width} ${height}`,
            width: '100%',
            height: height
        });

        // Background
        svg.appendChild(createSvgElement('rect', { x: 0, y: 0, width, height, fill: '#16241F', rx: 8 }));

        // Y Grid
        for (let i = 0; i <= 5; i++) {
            const val = (maxVal / 5) * i;
            const y = padding.top + chartHeight - (val / maxVal) * chartHeight;
            svg.appendChild(createSvgElement('line', {
                x1: padding.left, y1: y, x2: padding.left + chartWidth, y2: y,
                stroke: '#2D4A3E', 'stroke-dasharray': '3,3'
            }));
            svg.appendChild(createSvgElement('text', {
                x: padding.left - 10, y: y + 4, fill: '#9CA3AF', 'font-size': '10', 'text-anchor': 'end'
            }, [Math.round(val).toString()]));
        }

        // Bars
        const barGroupWidth = chartWidth / sprints.length;
        const singleBarWidth = Math.min(24, barGroupWidth * 0.35);

        sprints.forEach((s, idx) => {
            const groupX = padding.left + idx * barGroupWidth + (barGroupWidth / 2);

            // Committed Bar
            const comH = (s.committed_points / maxVal) * chartHeight;
            const comY = padding.top + chartHeight - comH;
            svg.appendChild(createSvgElement('rect', {
                x: groupX - singleBarWidth - 2, y: comY, width: singleBarWidth, height: comH,
                fill: '#4B5563', rx: 3
            }));

            // Completed Bar
            const compH = (s.completed_points / maxVal) * chartHeight;
            const compY = padding.top + chartHeight - compH;
            svg.appendChild(createSvgElement('rect', {
                x: groupX + 2, y: compY, width: singleBarWidth, height: compH,
                fill: '#10B981', rx: 3
            }));

            // Label
            svg.appendChild(createSvgElement('text', {
                x: groupX, y: height - 15, fill: '#D1D5DB', 'font-size': '10', 'text-anchor': 'middle'
            }, [s.name || `S${idx + 1}`]));
        });

        container.appendChild(svg);
    }

    return {
        renderBurndownSvg,
        renderCumulativeFlowDiagramSvg,
        renderVelocityChartSvg
    };
})();
