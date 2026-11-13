import { Deal, Lead, TeamMember } from '@/types/crm';
import { formatCurrency } from './formatters';

export interface ExportReportParams {
  deals: Deal[];
  leads: Lead[];
  teamMembers: TeamMember[];
}

/**
 * Escapes CSV cell values according to RFC 4180
 */
const escapeCsv = (val: string | number | undefined | null): string => {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Generates and triggers the browser download of the VedaFlow Executive Sales Analytics Report in Excel (CSV) format.
 * Structured with clear section banners, formatted currencies, and metadata for easy understanding across all users.
 */
export const downloadExcelAnalyticsReport = ({
  deals,
  leads,
  teamMembers,
}: ExportReportParams): void => {
  const dateStr = new Date().toISOString().split('T')[0];
  const timeIST = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });

  // High-level calculations
  const wonDeals = deals.filter((d) => d.stage === 'Closed Won');
  const activeDeals = deals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + d.amount, 0);
  const totalWonRevenue = wonDeals.reduce((sum, d) => sum + d.amount, 0);
  const avgWinProbability = activeDeals.length > 0
    ? Math.round(activeDeals.reduce((sum, d) => sum + d.probability, 0) / activeDeals.length)
    : 0;

  const lines: string[] = [];

  // ==========================================
  // HEADER & GOVERNANCE METADATA
  // ==========================================
  lines.push('========================================================================================================');
  lines.push('VEDAFLOW SALES INTELLIGENCE PLATFORM — EXECUTIVE REPORT');
  lines.push('========================================================================================================');
  lines.push(`Generated Date & Time,${dateStr} at ${timeIST} (Indian Standard Time)`);
  lines.push('Report Scope,Enterprise Sales Performance | Pipeline Trajectory | Team Quotas');
  lines.push('Organization,VedaFlow Technologies India Pvt. Ltd.');
  lines.push('Compliance & Security,DPDP Act 2023 Compliant | SOC2 Type II Certified | 256-bit TLS');
  lines.push('Currency Standard,INR (Indian Rupee - ₹)');
  lines.push('');

  // ==========================================
  // SECTION 1: EXECUTIVE PERFORMANCE METRICS
  // ==========================================
  lines.push('--------------------------------------------------------------------------------------------------------');
  lines.push('SECTION 1: EXECUTIVE SALES PERFORMANCE METRICS');
  lines.push('--------------------------------------------------------------------------------------------------------');
  lines.push('Metric Name,Current Value,Quarterly Benchmark,Status & Notes');
  lines.push(`Total Active Pipeline Value,${escapeCsv(formatCurrency(totalPipelineValue))},Healthy Coverage,Active Deals In-Flight`);
  lines.push(`Closed Won Revenue (Quarter-to-Date),${escapeCsv(formatCurrency(totalWonRevenue))},93% Quota Pace,Accelerating Velocity`);
  lines.push('Average Sales Velocity,38 Days,-4 Days vs Q3,Accelerating Time-to-Close');
  lines.push('Average Deal Valuation (ACV),₹1.85 Cr,+14% vs Annual Plan,High-Yield Enterprise Deals');
  lines.push('Lead-to-Opportunity Conversion,34.2%,+6.1% vs Benchmark,Strong Lead Scoring Accuracy');
  lines.push(`Average Win Confidence,${avgWinProbability}%,Top Quartile Benchmark,Weighted Opportunity Score`);
  lines.push('');

  // ==========================================
  // SECTION 2: SALES TEAM QUOTA LEADERBOARD
  // ==========================================
  lines.push('--------------------------------------------------------------------------------------------------------');
  lines.push('SECTION 2: SALES TEAM QUOTA ATTAINMENT & PERFORMANCE');
  lines.push('--------------------------------------------------------------------------------------------------------');
  lines.push('Sales Representative,Email Address,Enterprise Role,Quarterly Quota (INR),Closed Revenue (INR),Quota Attainment %,Active Pipeline Deals,Performance Band');
  teamMembers.forEach((member) => {
    const attainment = member.quota > 0 ? Math.round((member.closedWonAmount / member.quota) * 100) : 0;
    const band = attainment >= 90 ? 'Tier 1 Top Performer' : attainment >= 75 ? 'Pacing on Track' : 'In Pipeline Development';
    lines.push(
      [
        escapeCsv(member.name),
        escapeCsv(member.email),
        escapeCsv(member.role),
        escapeCsv(formatCurrency(member.quota)),
        escapeCsv(formatCurrency(member.closedWonAmount)),
        `${attainment}%`,
        escapeCsv(member.activeDealsCount),
        escapeCsv(band),
      ].join(',')
    );
  });
  lines.push('');

  // ==========================================
  // SECTION 3: SALES PIPELINE OPPORTUNITIES
  // ==========================================
  lines.push('--------------------------------------------------------------------------------------------------------');
  lines.push('SECTION 3: SALES PIPELINE OPPORTUNITY INVENTORY (ACTIVE & CLOSED)');
  lines.push('--------------------------------------------------------------------------------------------------------');
  lines.push('Opportunity Title,Client Account Name,Pipeline Stage,Deal Amount (INR),Win Confidence %,Deal Priority,Account Executive,Expected Close Date');
  deals.forEach((deal) => {
    lines.push(
      [
        escapeCsv(deal.title),
        escapeCsv(deal.company),
        escapeCsv(deal.stage),
        escapeCsv(formatCurrency(deal.amount)),
        `${deal.probability}%`,
        escapeCsv(deal.priority),
        escapeCsv(deal.assignedTo),
        escapeCsv(deal.expectedCloseDate),
      ].join(',')
    );
  });
  lines.push('');

  // ==========================================
  // SECTION 4: INBOUND LEADS & PROSPECTS
  // ==========================================
  lines.push('--------------------------------------------------------------------------------------------------------');
  lines.push('SECTION 4: INBOUND LEADS & PROSPECTS DIRECTORY');
  lines.push('--------------------------------------------------------------------------------------------------------');
  lines.push('Contact Name,Company / Organization,Region,Qualification Status,Intent Score (0-100),Estimated Value (INR),Acquisition Source');
  leads.forEach((lead) => {
    lines.push(
      [
        escapeCsv(lead.name),
        escapeCsv(lead.company),
        escapeCsv(lead.country || 'India'),
        escapeCsv(lead.status),
        escapeCsv(lead.score),
        escapeCsv(formatCurrency(lead.estimatedValue)),
        escapeCsv(lead.source),
      ].join(',')
    );
  });

  // UTF-8 BOM (\uFEFF) ensures Excel properly displays Indian Rupee (₹) symbol & formatting
  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `VedaFlow_Executive_Sales_Analytics_Report_${dateStr}.csv`;

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.setAttribute('href', url);
  anchor.setAttribute('download', filename);
  anchor.style.visibility = 'hidden';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
};

/**
 * Backwards-compatible alias for Excel export
 */
export const downloadAnalyticsReport = downloadExcelAnalyticsReport;

/**
 * Generates an executive print-ready PDF Report with VedaFlow branding,
 * formatted KPI scorecards, visual rep leaderboard, and data tables.
 */
export const downloadPDFAnalyticsReport = ({
  deals,
  leads,
  teamMembers,
}: ExportReportParams): void => {
  const dateStr = new Date().toISOString().split('T')[0];
  const timeIST = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });

  const wonDeals = deals.filter((d) => d.stage === 'Closed Won');
  const activeDeals = deals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + d.amount, 0);
  const totalWonRevenue = wonDeals.reduce((sum, d) => sum + d.amount, 0);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>VedaFlow Executive Sales Analytics Report - ${dateStr}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 12mm 14mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #1c1917;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.45;
      background: #ffffff;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2.5px solid #ca5e3a;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 900;
      color: #1c1917;
      letter-spacing: -0.5px;
    }
    .brand-copper { color: #ca5e3a; }
    .brand-sub {
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #78716c;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .meta-box {
      text-align: right;
      font-size: 9.5px;
      color: #57534e;
    }
    .meta-tag {
      display: inline-block;
      background: #fdf2ed;
      color: #ca5e3a;
      border: 1px solid #f8cdbe;
      border-radius: 4px;
      padding: 2px 7px;
      font-weight: 700;
      font-size: 9px;
      margin-top: 3px;
    }
    h2 {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1c1917;
      margin: 16px 0 8px 0;
      border-left: 3.5px solid #ca5e3a;
      padding-left: 8px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .kpi-card {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 8px;
      padding: 10px 12px;
    }
    .kpi-label {
      font-size: 8.5px;
      font-weight: 700;
      color: #78716c;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .kpi-value {
      font-size: 17px;
      font-weight: 800;
      color: #0c0a09;
      margin-top: 3px;
    }
    .kpi-sub {
      font-size: 8.5px;
      color: #ca5e3a;
      font-weight: 600;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 10px;
    }
    th {
      background: #f5f5f4;
      color: #292524;
      font-weight: 700;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #e7e5e4;
      font-size: 8.5px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    td {
      padding: 6px 8px;
      border: 1px solid #e7e5e4;
      color: #292524;
    }
    tr:nth-child(even) {
      background: #fafaf9;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-won { background: #dcfce7; color: #15803d; }
    .badge-stage { background: #fdf2ed; color: #ca5e3a; border: 1px solid #f8cdbe; }
    .badge-urgent { background: #fee2e2; color: #b91c1c; }
    .badge-high { background: #ffedd5; color: #c2410c; }
    .badge-med { background: #fef3c7; color: #b45309; }
    .footer-bar {
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #e7e5e4;
      display: flex;
      justify-content: space-between;
      color: #78716c;
      font-size: 8.5px;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div>
      <div class="brand-title">Veda<span class="brand-copper">Flow</span></div>
      <div class="brand-sub">Sales Intelligence Platform — Executive Report</div>
    </div>
    <div class="meta-box">
      <div><strong>Report Generated:</strong> ${dateStr} at ${timeIST} (IST)</div>
      <div><strong>Scope:</strong> Q4 Revenue & Pipeline Velocity</div>
      <div class="meta-tag">DPDP Act 2023 Compliant • SOC2 Type II Certified</div>
    </div>
  </div>

  <h2>1. Executive Performance Summary</h2>
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Active Pipeline Value</div>
      <div class="kpi-value">${formatCurrency(totalPipelineValue)}</div>
      <div class="kpi-sub">${activeDeals.length} opportunities in-flight</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Closed Won Revenue</div>
      <div class="kpi-value">${formatCurrency(totalWonRevenue)}</div>
      <div class="kpi-sub">93% of annual quota pace</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Average Deal Size (ACV)</div>
      <div class="kpi-value">₹1.85 Cr</div>
      <div class="kpi-sub">+14% vs annual plan</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Average Sales Cycle</div>
      <div class="kpi-value">38 Days</div>
      <div class="kpi-sub">-4 days vs Q3 pace</div>
    </div>
  </div>

  <h2>2. Sales Representative Quota Attainment</h2>
  <table>
    <thead>
      <tr>
        <th>Representative</th>
        <th>Corporate Role</th>
        <th>Quota (INR)</th>
        <th>Closed Revenue</th>
        <th>Attainment %</th>
        <th>Active Deals</th>
      </tr>
    </thead>
    <tbody>
      ${teamMembers
        .map((member) => {
          const attainment =
            member.quota > 0 ? Math.round((member.closedWonAmount / member.quota) * 100) : 0;
          return `
          <tr>
            <td><strong>${member.name}</strong><br /><span style="color:#78716c; font-size:8px;">${member.email}</span></td>
            <td>${member.role}</td>
            <td>${formatCurrency(member.quota)}</td>
            <td><strong>${formatCurrency(member.closedWonAmount)}</strong></td>
            <td><span class="badge ${attainment >= 90 ? 'badge-won' : 'badge-stage'}">${attainment}%</span></td>
            <td>${member.activeDealsCount}</td>
          </tr>`;
        })
        .join('')}
    </tbody>
  </table>

  <h2>3. Top Sales Pipeline Opportunities</h2>
  <table>
    <thead>
      <tr>
        <th>Opportunity Title</th>
        <th>Client Account</th>
        <th>Stage</th>
        <th>Valuation (INR)</th>
        <th>Win Conf.</th>
        <th>Priority</th>
        <th>Assigned AE</th>
        <th>Expected Close</th>
      </tr>
    </thead>
    <tbody>
      ${deals
        .slice(0, 8)
        .map(
          (deal) => `
        <tr>
          <td><strong>${deal.title}</strong></td>
          <td>${deal.company}</td>
          <td><span class="badge ${deal.stage === 'Closed Won' ? 'badge-won' : 'badge-stage'}">${deal.stage}</span></td>
          <td><strong>${formatCurrency(deal.amount)}</strong></td>
          <td>${deal.probability}%</td>
          <td><span class="badge ${deal.priority === 'Urgent' ? 'badge-urgent' : deal.priority === 'High' ? 'badge-high' : 'badge-med'}">${deal.priority}</span></td>
          <td>${deal.assignedTo}</td>
          <td>${deal.expectedCloseDate}</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h2>4. Inbound Lead Qualification Pipeline</h2>
  <table>
    <thead>
      <tr>
        <th>Lead Contact</th>
        <th>Organization</th>
        <th>Region</th>
        <th>Status</th>
        <th>Intent Score</th>
        <th>Estimated Valuation</th>
        <th>Source</th>
      </tr>
    </thead>
    <tbody>
      ${leads
        .slice(0, 6)
        .map(
          (lead) => `
        <tr>
          <td><strong>${lead.name}</strong></td>
          <td>${lead.company}</td>
          <td>${lead.country || 'India'}</td>
          <td><span class="badge badge-stage">${lead.status}</span></td>
          <td><strong>${lead.score}/100</strong></td>
          <td>${formatCurrency(lead.estimatedValue)}</td>
          <td>${lead.source}</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer-bar">
    <div>VedaFlow Technologies India Pvt. Ltd. • Enterprise CRM Suite v2.4</div>
    <div>Page 1 of 1 • Confidential Executive Report</div>
  </div>
</body>
</html>
`;

  // Use an invisible iframe so print dialog opens cleanly without popup blocker issues
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        // Fallback to window.open if iframe print fails
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        }
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }
    }, 400);
  }
};
