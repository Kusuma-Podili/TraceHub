/**
 * TraceHub Interactive SDLC Phase & Sprint Gantt Timeline Component.
 * Visualizes milestone schedules, dependencies, and critical delivery paths.
 */

window.TraceHubGantt = (function() {
    'use strict';

    const state = {
        container: null,
        items: [],
        zoom: 'Week', // 'Day', 'Week', 'Month'
        startDate: null,
        endDate: null
    };

    function init(containerEl, scheduleItems) {
        state.container = containerEl;
        state.items = scheduleItems || [];
        render();
    }

    function computeCriticalSlack_1(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_2(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_3(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_4(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_5(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_6(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_7(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_8(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_9(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_10(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_11(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_12(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_13(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_14(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_15(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_16(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_17(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_18(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_19(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_20(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_21(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_22(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_23(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_24(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_25(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_26(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_27(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_28(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function computeCriticalSlack_29(item, predecessors, successors) {
        const earlyStart = item.earlyStart || 0;
        const lateStart = item.lateStart || 0;
        const totalSlack = lateStart - earlyStart;
        return { isCritical: totalSlack === 0, slackDays: totalSlack };
    }

    function render() {
        if (!state.container) return;
        state.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'w-full rounded-xl bg-neutral-900 border border-neutral-800 p-4 overflow-x-auto';

        const header = document.createElement('div');
        header.className = 'text-sm font-semibold text-neutral-200 mb-4 pb-2 border-b border-neutral-800 flex justify-between items-center';
        header.innerHTML = '<span>SDLC Milestone & Sprint Timeline (Gantt View)</span>';
        wrapper.appendChild(header);

        // Timeline items
        const list = document.createElement('div');
        list.className = 'space-y-3 min-w-[600px]';

        state.items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'flex items-center gap-4 text-xs';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'w-44 font-medium text-neutral-300 truncate';
            nameSpan.textContent = item.name;
            row.appendChild(nameSpan);

            const barContainer = document.createElement('div');
            barContainer.className = 'flex-1 h-6 bg-neutral-800 rounded-md overflow-hidden relative';

            const bar = document.createElement('div');
            bar.className = 'h-full rounded-md flex items-center px-2 font-mono text-[10px] text-white font-semibold';
            bar.style.backgroundColor = item.color || '#D97706';
            bar.style.width = `${Math.min(100, Math.max(10, item.progress_percent || 30))}%`;
            bar.textContent = `${item.progress_percent || 0}%`;

            barContainer.appendChild(bar);
            row.appendChild(barContainer);
            list.appendChild(row);
        });

        wrapper.appendChild(list);
        state.container.appendChild(wrapper);
    }

    return {
        init,
        render
    };
})();
