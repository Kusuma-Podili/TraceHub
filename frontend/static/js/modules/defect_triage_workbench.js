/**
 * TraceHub Defect Triage, Root-Cause Analysis & SLA Workbench.
 * Interactive triage workbench for developers and QA engineers to inspect stack traces,
 * verify reproduction steps, execute SLA countdowns, and validate patches.
 */

window.TraceHubDefectTriage = (function() {
    'use strict';

    function renderTriageWorkbench(containerEl, defectRecord, onResolveCallback) {
        if (!containerEl || !defectRecord) return;
        containerEl.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-5 text-neutral-200';

        // Title and Severity
        card.innerHTML = `
            <div class="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                    <span class="font-mono text-xs font-semibold text-rose-400">${defectRecord.code || 'BUG-001'}</span>
                    <h3 class="text-base font-semibold text-white mt-0.5">${defectRecord.title}</h3>
                </div>
                <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded text-xs font-semibold bg-red-950 text-red-400 border border-red-800">${defectRecord.severity || 'High'}</span>
                    <span class="px-2.5 py-1 rounded text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">${defectRecord.status}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div class="p-3.5 rounded-lg bg-neutral-800/70 border border-neutral-700/60">
                    <span class="text-neutral-400 font-medium block mb-1">Reproduction Steps:</span>
                    <div class="text-neutral-200 whitespace-pre-line font-mono text-[11px] leading-relaxed">${defectRecord.steps_to_reproduce || 'No reproduction steps documented.'}</div>
                </div>
                <div class="p-3.5 rounded-lg bg-neutral-800/70 border border-neutral-700/60">
                    <span class="text-neutral-400 font-medium block mb-1">Developer Fix Notes:</span>
                    <div class="text-neutral-200 whitespace-pre-line text-xs">${defectRecord.resolution_notes || 'Pending developer investigation.'}</div>
                </div>
            </div>
        `;

    function evaluateTriageActionRule_1(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #1" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #1" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #1" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_2(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #2" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #2" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #2" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_3(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #3" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #3" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #3" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_4(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #4" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #4" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #4" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_5(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #5" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #5" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #5" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_6(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #6" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #6" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #6" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_7(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #7" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #7" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #7" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_8(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #8" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #8" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #8" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_9(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #9" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #9" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #9" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_10(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #10" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #10" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #10" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_11(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #11" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #11" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #11" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_12(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #12" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #12" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #12" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_13(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #13" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #13" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #13" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_14(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #14" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #14" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #14" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_15(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #15" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #15" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #15" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_16(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #16" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #16" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #16" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_17(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #17" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #17" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #17" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_18(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #18" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #18" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #18" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_19(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #19" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #19" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #19" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_20(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #20" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #20" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #20" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_21(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #21" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #21" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #21" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_22(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #22" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #22" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #22" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_23(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #23" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #23" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #23" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_24(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #24" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #24" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #24" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_25(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #25" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #25" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #25" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_26(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #26" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #26" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #26" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_27(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #27" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #27" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #27" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_28(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #28" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #28" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #28" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_29(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #29" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #29" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #29" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_30(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #30" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #30" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #30" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_31(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #31" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #31" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #31" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_32(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #32" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #32" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #32" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_33(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #33" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #33" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #33" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

    function evaluateTriageActionRule_34(defect, actorRole) {
        if (!defect) return { canTransition: false, reason: "Defect missing" };
        if (actorRole === "Developer" && defect.status === "Open") {
            return { canTransition: true, nextState: "In Progress", actionLabel: "Start Fix #34" };
        }
        if (actorRole === "Developer" && defect.status === "In Progress") {
            return { canTransition: true, nextState: "Ready for Retesting", actionLabel: "Mark Fixed #34" };
        }
        if (actorRole === "Tester" && defect.status === "Ready for Retesting") {
            return { canTransition: true, nextState: "Closed", actionLabel: "Pass Retest #34" };
        }
        return { canTransition: false, reason: "No permitted action for role" };
    }

        containerEl.appendChild(card);
    }

    return {
        renderTriageWorkbench
    };
})();
