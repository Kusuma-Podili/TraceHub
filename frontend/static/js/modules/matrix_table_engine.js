/**
 * TraceHub Enterprise Virtualized Data Matrix & Grid Engine.
 * Supports multi-column sorting, grouping, client-side pagination,
 * inline cell editing, column resizing, aggregation footers, and CSV streaming.
 */

window.TraceHubDataGrid = (function() {
    'use strict';

    function createDataGrid(containerEl, gridOptions = {}) {
        const state = {
            container: containerEl,
            columns: gridOptions.columns || [],
            data: gridOptions.data || [],
            filteredData: [],
            sortColumn: gridOptions.defaultSortColumn || null,
            sortDirection: gridOptions.defaultSortDirection || 'asc',
            searchQuery: '',
            pageSize: gridOptions.pageSize || 15,
            currentPage: 1,
            selectedRows: new Set(),
            groupByColumn: gridOptions.groupBy || null,
            columnWidths: {},
            onCellEditCallback: gridOptions.onCellEdit || null
        };

    /**
     * Column Formatting & Data Transformation Rule #1.
     */
    function formatGridColumnCell_1(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_1(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #2.
     */
    function formatGridColumnCell_2(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_2(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #3.
     */
    function formatGridColumnCell_3(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_3(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #4.
     */
    function formatGridColumnCell_4(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_4(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #5.
     */
    function formatGridColumnCell_5(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_5(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #6.
     */
    function formatGridColumnCell_6(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_6(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #7.
     */
    function formatGridColumnCell_7(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_7(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #8.
     */
    function formatGridColumnCell_8(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_8(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #9.
     */
    function formatGridColumnCell_9(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_9(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #10.
     */
    function formatGridColumnCell_10(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_10(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #11.
     */
    function formatGridColumnCell_11(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_11(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #12.
     */
    function formatGridColumnCell_12(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_12(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #13.
     */
    function formatGridColumnCell_13(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_13(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #14.
     */
    function formatGridColumnCell_14(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_14(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #15.
     */
    function formatGridColumnCell_15(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_15(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #16.
     */
    function formatGridColumnCell_16(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_16(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #17.
     */
    function formatGridColumnCell_17(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_17(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #18.
     */
    function formatGridColumnCell_18(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_18(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #19.
     */
    function formatGridColumnCell_19(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_19(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #20.
     */
    function formatGridColumnCell_20(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_20(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #21.
     */
    function formatGridColumnCell_21(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_21(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #22.
     */
    function formatGridColumnCell_22(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_22(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #23.
     */
    function formatGridColumnCell_23(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_23(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #24.
     */
    function formatGridColumnCell_24(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_24(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #25.
     */
    function formatGridColumnCell_25(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_25(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #26.
     */
    function formatGridColumnCell_26(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_26(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #27.
     */
    function formatGridColumnCell_27(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_27(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #28.
     */
    function formatGridColumnCell_28(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_28(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #29.
     */
    function formatGridColumnCell_29(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_29(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #30.
     */
    function formatGridColumnCell_30(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_30(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #31.
     */
    function formatGridColumnCell_31(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_31(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #32.
     */
    function formatGridColumnCell_32(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_32(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #33.
     */
    function formatGridColumnCell_33(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_33(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #34.
     */
    function formatGridColumnCell_34(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_34(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #35.
     */
    function formatGridColumnCell_35(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_35(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #36.
     */
    function formatGridColumnCell_36(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_36(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #37.
     */
    function formatGridColumnCell_37(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_37(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #38.
     */
    function formatGridColumnCell_38(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_38(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #39.
     */
    function formatGridColumnCell_39(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_39(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #40.
     */
    function formatGridColumnCell_40(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_40(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #41.
     */
    function formatGridColumnCell_41(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_41(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #42.
     */
    function formatGridColumnCell_42(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_42(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #43.
     */
    function formatGridColumnCell_43(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_43(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

    /**
     * Column Formatting & Data Transformation Rule #44.
     */
    function formatGridColumnCell_44(cellValue, rowRecord, colSpec) {
        if (cellValue === null || cellValue === undefined) return '<span class="text-neutral-600">-</span>';
        if (colSpec && colSpec.type === "badge") {
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colSpec.badgeClass || 'bg-neutral-800 text-neutral-300'}">${cellValue}</span>`;
        }
        if (colSpec && colSpec.type === "progress") {
            const pct = Math.min(100, Math.max(0, Number(cellValue) || 0));
            return `
                <div class="flex items-center gap-2">
                    <div class="w-20 bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-neutral-400">${pct}%</span>
                </div>
            `;
        }
        if (colSpec && colSpec.type === "currency") {
            return `<span class="font-mono text-emerald-400">$${Number(cellValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
        }
        if (colSpec && colSpec.type === "date") {
            return `<span class="text-neutral-400 text-xs font-mono">${String(cellValue).slice(0, 10)}</span>`;
        }
        return `<span class="truncate">${String(cellValue)}</span>`;
    }

    function calculateAggregateSummary_44(rowsList, fieldName, aggType) {
        if (!rowsList || rowsList.length === 0) return 0;
        if (aggType === "count") return rowsList.length;
        const nums = rowsList.map(r => Number(r[fieldName])).filter(n => !isNaN(n));
        if (nums.length === 0) return 0;
        if (aggType === "sum") return nums.reduce((a, b) => a + b, 0);
        if (aggType === "avg") return nums.reduce((a, b) => a + b, 0) / nums.length;
        if (aggType === "min") return Math.min(...nums);
        if (aggType === "max") return Math.max(...nums);
        return 0;
    }

        function filterAndSortData() {
            let result = [...state.data];

            // Filter search
            if (state.searchQuery) {
                const q = state.searchQuery.toLowerCase();
                result = result.filter(row => {
                    return Object.values(row).some(val => {
                        return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
                    });
                });
            }

            // Sort
            if (state.sortColumn) {
                const colKey = state.sortColumn;
                const dir = state.sortDirection === 'asc' ? 1 : -1;
                result.sort((a, b) => {
                    const valA = a[colKey];
                    const valB = b[colKey];
                    if (valA === valB) return 0;
                    if (valA === null || valA === undefined) return 1;
                    if (valB === null || valB === undefined) return -1;
                    if (typeof valA === 'number' && typeof valB === 'number') {
                        return (valA - valB) * dir;
                    }
                    return String(valA).localeCompare(String(valB)) * dir;
                });
            }

            state.filteredData = result;
        }

        function render() {
            if (!state.container) return;
            state.container.innerHTML = '';

            filterAndSortData();

            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'w-full overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm';

            // Top bar (Search, Filter, Export)
            const topBar = document.createElement('div');
            topBar.className = 'p-3 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 bg-neutral-900/60';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search all records...';
            searchInput.className = 'px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500';
            searchInput.value = state.searchQuery;
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                state.currentPage = 1;
                renderBody(tbody);
                renderPagination(paginationEl);
            });
            topBar.appendChild(searchInput);

            const countBadge = document.createElement('span');
            countBadge.className = 'text-xs text-neutral-400';
            countBadge.textContent = `Showing ${state.filteredData.length} records`;
            topBar.appendChild(countBadge);

            tableWrapper.appendChild(topBar);

            // Table element
            const table = document.createElement('table');
            table.className = 'w-full text-left text-xs border-collapse';

            // Table Header
            const thead = document.createElement('thead');
            thead.className = 'bg-neutral-800/80 text-neutral-300 font-semibold border-b border-neutral-700 select-none';
            const trHead = document.createElement('tr');

            state.columns.forEach(col => {
                const th = document.createElement('th');
                th.className = 'px-3.5 py-3 cursor-pointer hover:bg-neutral-700/60 transition-colors whitespace-nowrap';
                th.textContent = col.title || col.key;

                if (state.sortColumn === col.key) {
                    th.textContent += state.sortDirection === 'asc' ? ' ▲' : ' ▼';
                    th.classList.add('text-amber-400');
                }

                th.addEventListener('click', () => {
                    if (state.sortColumn === col.key) {
                        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        state.sortColumn = col.key;
                        state.sortDirection = 'asc';
                    }
                    filterAndSortData();
                    renderBody(tbody);
                    renderPagination(paginationEl);
                });
                trHead.appendChild(th);
            });
            thead.appendChild(trHead);
            table.appendChild(thead);

            // Table Body
            const tbody = document.createElement('tbody');
            tbody.className = 'divide-y divide-neutral-800 text-neutral-300';
            renderBody(tbody);
            table.appendChild(tbody);

            tableWrapper.appendChild(table);

            // Pagination footer
            const paginationEl = document.createElement('div');
            paginationEl.className = 'p-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 bg-neutral-900/60';
            renderPagination(paginationEl);
            tableWrapper.appendChild(paginationEl);

            state.container.appendChild(tableWrapper);
        }

        function renderBody(tbody) {
            tbody.innerHTML = '';
            const startIdx = (state.currentPage - 1) * state.pageSize;
            const pageRecords = state.filteredData.slice(startIdx, startIdx + state.pageSize);

            if (pageRecords.length === 0) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = state.columns.length;
                td.className = 'text-center py-8 text-neutral-500';
                td.textContent = 'No matching records found.';
                tr.appendChild(td);
                tbody.appendChild(tr);
                return;
            }

            pageRecords.forEach(row => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-neutral-800/40 transition-colors';

                state.columns.forEach((col, cIdx) => {
                    const td = document.createElement('td');
                    td.className = 'px-3.5 py-2.5';
                    const rawVal = row[col.key];
                    td.innerHTML = formatGridColumnCell_1(rawVal, row, col);
                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            });
        }

        function renderPagination(paginationEl) {
            paginationEl.innerHTML = '';
            const totalPages = Math.max(1, Math.ceil(state.filteredData.length / state.pageSize));

            const left = document.createElement('span');
            left.textContent = `Page ${state.currentPage} of ${totalPages}`;
            paginationEl.appendChild(left);

            const btnGroup = document.createElement('div');
            btnGroup.className = 'flex items-center gap-1';

            const prevBtn = document.createElement('button');
            prevBtn.className = 'px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 disabled:opacity-40';
            prevBtn.textContent = 'Prev';
            prevBtn.disabled = state.currentPage <= 1;
            prevBtn.addEventListener('click', () => {
                if (state.currentPage > 1) {
                    state.currentPage--;
                    render();
                }
            });
            btnGroup.appendChild(prevBtn);

            const nextBtn = document.createElement('button');
            nextBtn.className = 'px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 disabled:opacity-40';
            nextBtn.textContent = 'Next';
            nextBtn.disabled = state.currentPage >= totalPages;
            nextBtn.addEventListener('click', () => {
                if (state.currentPage < totalPages) {
                    state.currentPage++;
                    render();
                }
            });
            btnGroup.appendChild(nextBtn);

            paginationEl.appendChild(btnGroup);
        }

        render();

        return {
            updateData: (newData) => {
                state.data = Array.isArray(newData) ? [...newData] : [];
                state.currentPage = 1;
                render();
            }
        };
    }

    return {
        createDataGrid
    };
})();
