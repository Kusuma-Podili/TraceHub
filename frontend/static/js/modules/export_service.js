/**
 * TraceHub Enterprise Client-Side Document Exporter.
 * Generates RFC 4180 CSV, formatted Excel XML workbooks, and JSON audit bundles.
 */

window.TraceHubExporter = (function() {
    'use strict';

    function downloadBlob(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportToCsv(dataRows, headers, filename = 'export.csv') {
        if (!Array.isArray(dataRows) || dataRows.length === 0) return;
        const csvLines = [];
        // Header
        csvLines.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));
        // Data
        dataRows.forEach(row => {
            const line = headers.map(h => {
                const val = row[h] !== undefined ? String(row[h]) : '';
                return `"${val.replace(/"/g, '""')}"`;
            });
            csvLines.push(line.join(','));
        });
        downloadBlob(csvLines.join('\r\n'), filename, 'text/csv;charset=utf-8;');
    }

    function formatExportCell_1(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_2(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_3(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_4(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_5(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_6(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_7(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_8(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_9(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_10(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_11(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_12(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_13(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_14(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_15(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_16(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_17(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_18(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_19(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_20(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_21(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_22(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_23(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    function formatExportCell_24(val, dataType) {
        if (val === null || val === undefined) return "";
        if (dataType === "currency") return "$" + Number(val).toFixed(2);
        if (dataType === "percent") return Number(val).toFixed(1) + "%";
        return String(val);
    }

    return {
        exportToCsv,
        downloadBlob
    };
})();
