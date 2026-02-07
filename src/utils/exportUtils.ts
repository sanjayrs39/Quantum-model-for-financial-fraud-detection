import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// PDF Export Functions
export const exportToPDF = (title: string, data: any, filename: string) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
  
  let yPosition = 50;
  
  // Handle different types of data
  if (Array.isArray(data)) {
    // If data is an array, create a table
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      const rows = data.map(item => headers.map(header => {
        const value = item[header];
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value);
        }
        return String(value);
      }));
      
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: yPosition,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [65, 105, 225] }
      });
    }
  } else if (typeof data === 'object') {
    // If data is an object, create key-value pairs
    Object.entries(data).forEach(([key, value], index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`${key}:`, 20, yPosition);
      
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          doc.setFontSize(10);
          doc.text(JSON.stringify(value, null, 2), 60, yPosition);
        } else {
          // Handle nested objects
          Object.entries(value).forEach(([subKey, subValue], subIndex) => {
            yPosition += 10;
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.setFontSize(10);
            doc.text(`  ${subKey}: ${String(subValue)}`, 30, yPosition);
          });
        }
      } else {
        doc.setFontSize(10);
        doc.text(String(value), 60, yPosition);
      }
      
      yPosition += 15;
    });
  }
  
  // Save the PDF
  doc.save(`${filename}.pdf`);
};

// Excel Export Functions
export const exportToExcel = (data: any, filename: string, sheetName: string = 'Sheet1') => {
  let worksheet: XLSX.WorkSheet;
  
  if (Array.isArray(data)) {
    // If data is an array, convert directly
    worksheet = XLSX.utils.json_to_sheet(data);
  } else if (typeof data === 'object') {
    // If data is an object, flatten it for Excel
    const flattenedData = flattenObject(data);
    worksheet = XLSX.utils.json_to_sheet([flattenedData]);
  } else {
    // If data is primitive, create a simple sheet
    worksheet = XLSX.utils.json_to_sheet([{ Data: data }]);
  }
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Save the Excel file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Helper function to flatten nested objects for Excel export
const flattenObject = (obj: any, prefix: string = ''): any => {
  const flattened: any = {};
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      flattened[newKey] = value.join(', ');
    } else {
      flattened[newKey] = value;
    }
  });
  
  return flattened;
};

// Specific export functions for different report types
export const exportFraudDetectionReport = (reportData: any) => {
  const filename = `fraud-detection-report-${new Date().toISOString().split('T')[0]}`;
  
  // Check if the data contains tabular information
  if (reportData.alerts && Array.isArray(reportData.alerts)) {
    exportToExcel(reportData, filename, 'Fraud Detection Report');
  } else {
    exportToPDF('Fraud Detection Report', reportData, filename);
  }
};

export const exportDarkWebReport = (reportData: any) => {
  const filename = `dark-web-monitoring-report-${new Date().toISOString().split('T')[0]}`;
  
  // Dark web reports typically have tabular breach data
  if (reportData.breaches && Array.isArray(reportData.breaches)) {
    exportToExcel(reportData.breaches, filename, 'Dark Web Breaches');
  } else {
    exportToPDF('Dark Web Monitoring Report', reportData, filename);
  }
};

export const exportComplianceReport = (reportData: any) => {
  const filename = `compliance-report-${new Date().toISOString().split('T')[0]}`;
  
  // Compliance reports work well as PDF summaries
  exportToPDF('Compliance Report', reportData, filename);
};

export const exportTransactionAnalysis = (reportData: any) => {
  const filename = `transaction-analysis-${new Date().toISOString().split('T')[0]}`;
  
  // Transaction data is typically tabular
  if (Array.isArray(reportData)) {
    exportToExcel(reportData, filename, 'Transaction Analysis');
  } else {
    exportToExcel(reportData, filename, 'Transaction Analysis');
  }
};

export const exportRiskScoreReport = (reportData: any) => {
  const filename = `risk-score-report-${new Date().toISOString().split('T')[0]}`;
  
  // Risk scores work well in both formats, prefer PDF for summaries
  exportToPDF('Risk Score Analysis', reportData, filename);
};

export const exportBiometricsReport = (reportData: any) => {
  const filename = `biometrics-report-${new Date().toISOString().split('T')[0]}`;
  
  // Biometrics data is often tabular
  if (reportData.sessions && Array.isArray(reportData.sessions)) {
    exportToExcel(reportData.sessions, filename, 'Biometric Sessions');
  } else {
    exportToPDF('Biometrics Analysis Report', reportData, filename);
  }
};

export const exportHeatmapReport = (reportData: any) => {
  const filename = `fraud-heatmap-report-${new Date().toISOString().split('T')[0]}`;
  
  // Heatmap data is typically geographical/tabular
  if (reportData.regions && Array.isArray(reportData.regions)) {
    exportToExcel(reportData.regions, filename, 'Fraud Heatmap Data');
  } else {
    exportToPDF('Fraud Heatmap Report', reportData, filename);
  }
};

export const exportAIExplanationReport = (reportData: any) => {
  const filename = `ai-explanation-report-${new Date().toISOString().split('T')[0]}`;
  
  // AI explanations are typically textual, perfect for PDF
  exportToPDF('AI Explanation Report', reportData, filename);
};

export const exportAIInvestigationReport = (reportData: any) => {
  const filename = `ai-investigation-report-${new Date().toISOString().split('T')[0]}`;
  
  // AI investigation reports contain detailed textual analysis, best for PDF
  exportToPDF('AI Fraud Investigation Report', reportData, filename);
};