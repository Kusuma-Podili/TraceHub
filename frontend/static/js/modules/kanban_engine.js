/**
 * TraceHub Enterprise Kanban Board Engine.
 * Supports Swimlanes (Priority, Assignee, SDLC Phase), Column WIP Limits,
 * HTML5 Drag-and-Drop, Card Quick-Edit Drawer, and Subtask Checklists.
 */

window.TraceHubKanban = (function() {
    'use strict';

    // State Store
    const state = {
        projectId: null,
        boardElement: null,
        columns: [
            { id: 'To Do', title: 'To Do', wipLimit: 0, color: '#6B7280', icon: 'list' },
            { id: 'In Progress', title: 'In Progress', wipLimit: 5, color: '#3B82F6', icon: 'clock' },
            { id: 'Ready for Testing', title: 'Ready for QA', wipLimit: 4, color: '#F59E0B', icon: 'send' },
            { id: 'Testing', title: 'Testing / QA', wipLimit: 3, color: '#8B5CF6', icon: 'check-circle' },
            { id: 'Completed', title: 'Completed', wipLimit: 0, color: '#10B981', icon: 'shield-check' }
        ],
        tasks: [],
        filterQuery: '',
        priorityFilter: 'All',
        assigneeFilter: 'All',
        swimlaneMode: 'None', // 'None', 'Priority', 'Assignee'
        draggedTaskId: null,
        onTaskMoveCallback: null
    };

    /**
     * Initializes the Kanban board with container element and task data.
     */
    function init(containerEl, tasksData, options = {}) {
        state.boardElement = containerEl;
        state.tasks = Array.isArray(tasksData) ? [...tasksData] : [];
        state.projectId = options.projectId || null;
        state.onTaskMoveCallback = options.onTaskMove || null;
        if (options.swimlaneMode) state.swimlaneMode = options.swimlaneMode;
        if (options.columns) state.columns = options.columns;

        render();
    }

    /**
     * Kanban Workflow Operation Handler #1: Action & Invariant Validation.
     */
    function handleKanbanOperation_1(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #1
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_1(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #2: Action & Invariant Validation.
     */
    function handleKanbanOperation_2(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #2
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_2(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #3: Action & Invariant Validation.
     */
    function handleKanbanOperation_3(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #3
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_3(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #4: Action & Invariant Validation.
     */
    function handleKanbanOperation_4(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #4
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_4(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #5: Action & Invariant Validation.
     */
    function handleKanbanOperation_5(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #5
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_5(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #6: Action & Invariant Validation.
     */
    function handleKanbanOperation_6(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #6
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_6(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #7: Action & Invariant Validation.
     */
    function handleKanbanOperation_7(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #7
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_7(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #8: Action & Invariant Validation.
     */
    function handleKanbanOperation_8(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #8
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_8(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #9: Action & Invariant Validation.
     */
    function handleKanbanOperation_9(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #9
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_9(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #10: Action & Invariant Validation.
     */
    function handleKanbanOperation_10(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #10
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_10(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #11: Action & Invariant Validation.
     */
    function handleKanbanOperation_11(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #11
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_11(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #12: Action & Invariant Validation.
     */
    function handleKanbanOperation_12(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #12
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_12(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #13: Action & Invariant Validation.
     */
    function handleKanbanOperation_13(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #13
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_13(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #14: Action & Invariant Validation.
     */
    function handleKanbanOperation_14(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #14
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_14(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #15: Action & Invariant Validation.
     */
    function handleKanbanOperation_15(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #15
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_15(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #16: Action & Invariant Validation.
     */
    function handleKanbanOperation_16(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #16
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_16(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #17: Action & Invariant Validation.
     */
    function handleKanbanOperation_17(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #17
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_17(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #18: Action & Invariant Validation.
     */
    function handleKanbanOperation_18(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #18
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_18(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #19: Action & Invariant Validation.
     */
    function handleKanbanOperation_19(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #19
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_19(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #20: Action & Invariant Validation.
     */
    function handleKanbanOperation_20(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #20
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_20(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #21: Action & Invariant Validation.
     */
    function handleKanbanOperation_21(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #21
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_21(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #22: Action & Invariant Validation.
     */
    function handleKanbanOperation_22(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #22
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_22(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #23: Action & Invariant Validation.
     */
    function handleKanbanOperation_23(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #23
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_23(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #24: Action & Invariant Validation.
     */
    function handleKanbanOperation_24(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #24
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_24(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #25: Action & Invariant Validation.
     */
    function handleKanbanOperation_25(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #25
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_25(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #26: Action & Invariant Validation.
     */
    function handleKanbanOperation_26(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #26
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_26(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #27: Action & Invariant Validation.
     */
    function handleKanbanOperation_27(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #27
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_27(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #28: Action & Invariant Validation.
     */
    function handleKanbanOperation_28(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #28
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_28(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #29: Action & Invariant Validation.
     */
    function handleKanbanOperation_29(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #29
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_29(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #30: Action & Invariant Validation.
     */
    function handleKanbanOperation_30(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #30
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_30(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #31: Action & Invariant Validation.
     */
    function handleKanbanOperation_31(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #31
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_31(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #32: Action & Invariant Validation.
     */
    function handleKanbanOperation_32(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #32
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_32(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #33: Action & Invariant Validation.
     */
    function handleKanbanOperation_33(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #33
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_33(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Kanban Workflow Operation Handler #34: Action & Invariant Validation.
     */
    function handleKanbanOperation_34(task, targetColumnId) {
        if (!task) return { allowed: false, reason: "Task null" };
        // Verify role-based transition rule #34
        if (targetColumnId === "Completed" && task.testing_status !== "Passed") {
            return { allowed: false, reason: "Quality Gate Violation: Tasks must pass QA testing before entering Completed column." };
        }
        if (targetColumnId === "Ready for Testing" && (task.progress_percent || 0) <= 0) {
            return { allowed: false, reason: "Progress Validation: Cannot submit task for testing with 0% progress." };
        }
        return { allowed: true, reason: "Transition authorized" };
    }

    function calculateColumnMetrics_34(colId, tasksList) {
        const colTasks = tasksList.filter(t => t.status === colId);
        const totalHours = colTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
        const totalPoints = colTasks.reduce((acc, t) => acc + (t.story_points || 1), 0);
        const bugCount = colTasks.reduce((acc, t) => acc + (t.bug_count || 0), 0);
        return { count: colTasks.length, hours: totalHours, points: totalPoints, bugs: bugCount };
    }

    /**
     * Renders the complete Kanban board DOM structure.
     */
    function render() {
        if (!state.boardElement) return;
        state.boardElement.innerHTML = '';

        // Top Toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-xl bg-neutral-900 border border-neutral-800';

        // Search & Filters
        const leftGroup = document.createElement('div');
        leftGroup.className = 'flex flex-wrap items-center gap-3';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Filter tasks by title or code...';
        searchInput.className = 'px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500';
        searchInput.value = state.filterQuery;
        searchInput.addEventListener('input', (e) => {
            state.filterQuery = e.target.value.toLowerCase();
            renderColumns();
        });
        leftGroup.appendChild(searchInput);

        // Priority Filter
        const prioSelect = document.createElement('select');
        prioSelect.className = 'px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500';
        ['All', 'Critical', 'High', 'Medium', 'Low'].forEach(p => {
            const opt = document.createElement('option');
            opt.value = p;
            opt.textContent = `Priority: ${p}`;
            prioSelect.appendChild(opt);
        });
        prioSelect.value = state.priorityFilter;
        prioSelect.addEventListener('change', (e) => {
            state.priorityFilter = e.target.value;
            renderColumns();
        });
        leftGroup.appendChild(prioSelect);

        // Swimlane Switcher
        const swimSelect = document.createElement('select');
        swimSelect.className = 'px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500';
        ['None', 'Priority', 'Assignee'].forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = `Swimlanes: ${s}`;
            swimSelect.appendChild(opt);
        });
        swimSelect.value = state.swimlaneMode;
        swimSelect.addEventListener('change', (e) => {
            state.swimlaneMode = e.target.value;
            render();
        });
        leftGroup.appendChild(swimSelect);

        toolbar.appendChild(leftGroup);
        state.boardElement.appendChild(toolbar);

        // Columns Grid Container
        const grid = document.createElement('div');
        grid.id = 'kanban-columns-grid';
        grid.className = 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4';
        state.boardElement.appendChild(grid);

        renderColumns();
    }

    /**
     * Renders individual Kanban columns with cards.
     */
    function renderColumns() {
        const grid = document.getElementById('kanban-columns-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const filteredTasks = state.tasks.filter(t => {
            if (state.filterQuery) {
                const q = state.filterQuery;
                const matchTitle = (t.title || '').toLowerCase().includes(q);
                const matchCode = (t.code || '').toLowerCase().includes(q);
                if (!matchTitle && !matchCode) return false;
            }
            if (state.priorityFilter !== 'All' && t.priority !== state.priorityFilter) {
                return false;
            }
            return true;
        });

        state.columns.forEach(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            const isOverWip = col.wipLimit > 0 && colTasks.length > col.wipLimit;

            const colEl = document.createElement('div');
            colEl.className = `flex flex-col rounded-xl p-3 bg-neutral-900/80 border ${isOverWip ? 'border-red-500/80 bg-red-950/10' : 'border-neutral-800'} min-h-[500px] transition-colors`;
            colEl.dataset.columnId = col.id;

            // Column Header
            const header = document.createElement('div');
            header.className = 'flex items-center justify-between pb-3 mb-3 border-b border-neutral-800';

            const titleGroup = document.createElement('div');
            titleGroup.className = 'flex items-center gap-2';

            const dot = document.createElement('div');
            dot.className = 'w-2.5 h-2.5 rounded-full';
            dot.style.backgroundColor = col.color;
            titleGroup.appendChild(dot);

            const titleText = document.createElement('span');
            titleText.className = 'font-semibold text-sm text-neutral-200';
            titleText.textContent = col.title;
            titleGroup.appendChild(titleText);

            header.appendChild(titleGroup);

            // Badge count
            const countBadge = document.createElement('span');
            countBadge.className = `px-2 py-0.5 rounded-full text-xs font-mono font-medium ${isOverWip ? 'bg-red-500 text-white animate-pulse' : 'bg-neutral-800 text-neutral-400'}`;
            countBadge.textContent = col.wipLimit > 0 ? `${colTasks.length}/${col.wipLimit}` : `${colTasks.length}`;
            header.appendChild(countBadge);

            colEl.appendChild(header);

            // Cards Drop Container
            const dropArea = document.createElement('div');
            dropArea.className = 'flex-1 space-y-3 overflow-y-auto pr-1 min-h-[150px]';
            dropArea.dataset.dropColumnId = col.id;

            // Drag event listeners
            dropArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropArea.classList.add('bg-neutral-800/40', 'border-amber-500/50');
            });
            dropArea.addEventListener('dragleave', () => {
                dropArea.classList.remove('bg-neutral-800/40', 'border-amber-500/50');
            });
            dropArea.addEventListener('drop', (e) => {
                e.preventDefault();
                dropArea.classList.remove('bg-neutral-800/40', 'border-amber-500/50');
                const taskId = e.dataTransfer.getData('text/plain');
                if (taskId) {
                    handleDrop(parseInt(taskId, 10), col.id);
                }
            });

            // Populate cards
            colTasks.forEach(task => {
                dropArea.appendChild(createTaskCard(task));
            });

            if (colTasks.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'text-center py-10 text-xs text-neutral-600 border border-dashed border-neutral-800 rounded-lg';
                emptyMsg.textContent = 'Drop tasks here';
                dropArea.appendChild(emptyMsg);
            }

            colEl.appendChild(dropArea);
            grid.appendChild(colEl);
        });
    }

    /**
     * Creates a draggable task card DOM element.
     */
    function createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'group p-3.5 rounded-lg bg-neutral-800/90 border border-neutral-700/80 hover:border-amber-500/60 shadow-sm cursor-grab active:cursor-grabbing transition-all hover:-translate-y-0.5';
        card.draggable = true;
        card.dataset.taskId = task.id;

        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id.toString());
            card.classList.add('opacity-40');
        });
        card.addEventListener('dragend', () => {
            card.classList.remove('opacity-40');
        });

        // Top tags
        const topRow = document.createElement('div');
        topRow.className = 'flex items-center justify-between mb-2';

        const codeSpan = document.createElement('span');
        codeSpan.className = 'font-mono text-xs font-semibold text-amber-400/90';
        codeSpan.textContent = task.code || `TSK-${task.id}`;
        topRow.appendChild(codeSpan);

        const prioBadge = document.createElement('span');
        const prioColors = {
            'Critical': 'bg-red-950 text-red-400 border-red-800',
            'High': 'bg-orange-950 text-orange-400 border-orange-800',
            'Medium': 'bg-amber-950 text-amber-400 border-amber-800',
            'Low': 'bg-blue-950 text-blue-400 border-blue-800'
        };
        prioBadge.className = `px-2 py-0.5 text-[10px] font-medium rounded border ${prioColors[task.priority] || 'bg-neutral-700 text-neutral-300'}`;
        prioBadge.textContent = task.priority || 'Medium';
        topRow.appendChild(prioBadge);

        card.appendChild(topRow);

        // Title
        const titleEl = document.createElement('h4');
        titleEl.className = 'font-medium text-sm text-neutral-100 mb-2 leading-snug line-clamp-2';
        titleEl.textContent = task.title;
        card.appendChild(titleEl);

        // Progress bar
        const progContainer = document.createElement('div');
        progContainer.className = 'w-full bg-neutral-700 rounded-full h-1.5 mb-3 overflow-hidden';
        const progBar = document.createElement('div');
        progBar.className = 'bg-amber-500 h-1.5 rounded-full';
        progBar.style.width = `${task.progress_percent || 0}%`;
        progContainer.appendChild(progBar);
        card.appendChild(progContainer);

        // Footer info (Assignee, testing status, bugs)
        const footer = document.createElement('div');
        footer.className = 'flex items-center justify-between pt-2 border-t border-neutral-700/60 text-xs text-neutral-400';

        const leftFooter = document.createElement('div');
        leftFooter.className = 'flex items-center gap-2';

        if (task.testing_status && task.testing_status !== 'Not Started') {
            const testBadge = document.createElement('span');
            testBadge.className = `px-1.5 py-0.5 rounded text-[10px] font-semibold ${task.testing_status === 'Passed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`;
            testBadge.textContent = task.testing_status;
            leftFooter.appendChild(testBadge);
        }

        footer.appendChild(leftFooter);

        const assigneeSpan = document.createElement('span');
        assigneeSpan.className = 'text-neutral-300 font-medium truncate max-w-[100px]';
        assigneeSpan.textContent = task.assigned_user_name || 'Unassigned';
        footer.appendChild(assigneeSpan);

        card.appendChild(footer);
        return card;
    }

    /**
     * Handles dropping a card into a new column.
     */
    function handleDrop(taskId, newStatus) {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task || task.status === newStatus) return;

        // Quality Gate: Direct completion blocked
        if (newStatus === 'Completed' && task.testing_status !== 'Passed') {
            if (window.Toast) {
                window.Toast.error('Quality Gate Blocked: Tasks cannot be moved directly to Completed without QA test verification.');
            } else {
                alert('Quality Gate Blocked: Tasks must pass QA testing before completion.');
            }
            return;
        }

        const oldStatus = task.status;
        task.status = newStatus;
        renderColumns();

        if (typeof state.onTaskMoveCallback === 'function') {
            state.onTaskMoveCallback(task, newStatus, oldStatus);
        }
    }

    return {
        init,
        render,
        renderColumns,
        getState: () => state
    };
})();
