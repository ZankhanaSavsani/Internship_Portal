const ExcelJS = require('exceljs');
const Admin = require("../models/AdminModel");
const Guide = require("../models/GuideModel");
const Student = require("../models/StudentModel");
const TokenBlacklist = require("../models/TokenBlacklist");
const CompanyApprovalDetails = require("../models/CompanyApprovalFormModel");
const SummerInternshipStatus = require("../models/SummerInternshipStatusFormModel");
const SummerInternshipCompletionStatus = require("../models/SummerInternshipCompletionFormModel");
const WeeklyReport = require("../models/WeeklyProgressReportModel");

// Model mapping with display names for better worksheet naming
const modelMapping = {
    student: { model: Student, displayName: 'Student' },
    admin: { model: Admin, displayName: 'Admin' },
    guide: { model: Guide, displayName: 'Guide' },
    tokenBlacklist: { model: TokenBlacklist, displayName: 'Token Blacklist' },
    companyApprovalDetails: { model: CompanyApprovalDetails, displayName: 'Company Approval Details' },
    summerInternshipStatus: { model: SummerInternshipStatus, displayName: 'Summer Internship Status' },
    summerInternshipCompletionStatus: { model: SummerInternshipCompletionStatus, displayName: 'Summer Internship Completion' },
    weeklyReport: { model: WeeklyReport, displayName: 'Weekly Report' }
};

// Custom error class for validation errors
class ValidationError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

// Helper functions for better code organization
const validateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!startDate || !endDate) {
        throw new ValidationError("Start date and end date are required");
    }

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new ValidationError("Invalid date format");
    }

    if (start > end) {
        throw new ValidationError("Start date must be before end date");
    }

    return { start, end };
};

const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
        const prefixedKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(acc, flattenObject(obj[key], prefixedKey));
        } else {
            acc[prefixedKey] = obj[key];
        }
        return acc;
    }, {});
};

const formatColumnHeaders = (data) => {
    if (!data || !data.length) return [];

    const flattenedData = data.map(item => flattenObject(item));
    return Object.keys(flattenedData[0]).map(key => ({
        header: key.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to Title Case
        key: key,
        width: 15 // Default width for better readability
    }));
};

const configureWorksheet = (worksheet, columns) => {
    worksheet.columns = columns;

    // Apply formatting to specific column types
    worksheet.columns.forEach(column => {
        if (column.header.toLowerCase().includes('date')) {
            column.numFmt = 'yyyy-mm-dd hh:mm:ss';
            column.width = 20;
        } else if (column.header.toLowerCase().includes('id')) {
            column.width = 25;
        } else if (typeof column.values?.[0] === 'number') {
            column.numFmt = '#,##0.00';
        }
    });

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };
};

const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-zA-Z0-9-_\.]/g, '_');
};

const downloadData = async (req, res) => {
    try {
        const { model } = req.params;
        const { startDate, endDate } = req.query;

        // Validate model type
        if (!modelMapping[model]) {
            return res.status(400).json({ 
                error: "Invalid model type",
                validModels: Object.keys(modelMapping)
            });
        }

        // Validate date range
        const { start, end } = validateDateRange(startDate, endDate);

        // Fetch data with pagination to handle large datasets
        const batchSize = 1000;
        let data = [];
        let skip = 0;
        let batch;

        do {
            batch = await modelMapping[model].model
                .find({
                    createdAt: { $gte: start, $lte: end }
                })
                .skip(skip)
                .limit(batchSize)
                .lean();

            data = data.concat(batch);
            skip += batchSize;
        } while (batch.length === batchSize);

        if (!data.length) {
            return res.status(404).json({ 
                error: "No data found",
                dateRange: { startDate, endDate }
            });
        }

        // Create workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Your Application Name';
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet(modelMapping[model].displayName);
        const columns = formatColumnHeaders(data);
        configureWorksheet(worksheet, columns);

        // Add data rows with progress tracking for large datasets
        const rowsPerBatch = 100;
        for (let i = 0; i < data.length; i += rowsPerBatch) {
            const batch = data.slice(i, i + rowsPerBatch);
            worksheet.addRows(batch);
        }

        // Auto-filter for all columns
        worksheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: 1, column: columns.length }
        };

        // Set response headers
        const filename = sanitizeFilename(`${model}_data_${startDate}_to_${endDate}.xlsx`);
        res.setHeader(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition', 
            `attachment; filename=${filename}`
        );

        // Write to response stream
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Error generating Excel:", error);
        res.status(error.status || 500).json({ 
            error: error.message || "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

module.exports = { downloadData };