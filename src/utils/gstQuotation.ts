import { Deal } from '@/types/crm';
import { formatCurrency } from './formatters';

export interface GstQuotationDetails {
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  clientCompany: string;
  clientGstin: string;
  clientAddress: string;
  isInterstate: boolean;
  baseAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalGst: number;
  grandTotal: number;
  sacCode: string;
}

export const calculateGstQuotation = (deal: Deal, isInterstate = false): GstQuotationDetails => {
  const baseAmount = deal.amount;
  const sacCode = '998313'; // IT and Software SaaS services

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isInterstate) {
    igstAmount = Math.round(baseAmount * 0.18);
  } else {
    cgstAmount = Math.round(baseAmount * 0.09);
    sgstAmount = Math.round(baseAmount * 0.09);
  }

  const totalGst = isInterstate ? igstAmount : cgstAmount + sgstAmount;
  const grandTotal = baseAmount + totalGst;

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const validDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return {
    quotationNumber: `VF-QUO-2026-${deal.id.replace('deal-', '').toUpperCase()}`,
    quotationDate: dateStr,
    validUntil: validDate,
    clientCompany: deal.company,
    clientGstin: '27AABCT4321D1Z9',
    clientAddress: `${deal.company} Enterprise Campus, Tech Hub, India`,
    isInterstate,
    baseAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalGst,
    grandTotal,
    sacCode,
  };
};

export const printGstQuotation = (deal: Deal, isInterstate = false): void => {
  const q = calculateGstQuotation(deal, isInterstate);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>GST Quotation - ${q.quotationNumber}</title>
  <style>
    @page { size: A4; margin: 14mm 14mm 14mm 14mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #1c1917;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.4;
      background: #ffffff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #ca5e3a;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .brand { font-size: 22px; font-weight: 900; color: #1c1917; }
    .brand span { color: #ca5e3a; }
    .badge {
      display: inline-block;
      background: #fdf2ed;
      color: #ca5e3a;
      border: 1px solid #f8cdbe;
      border-radius: 4px;
      padding: 2px 6px;
      font-weight: 700;
      font-size: 9px;
      margin-top: 4px;
    }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .box { background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 6px; padding: 10px; }
    .box-title { font-size: 9px; font-weight: 700; color: #78716c; text-transform: uppercase; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 10px; }
    th { background: #f5f5f4; padding: 6px 8px; border: 1px solid #e7e5e4; text-align: left; font-size: 9px; text-transform: uppercase; }
    td { padding: 6px 8px; border: 1px solid #e7e5e4; }
    .right { text-align: right; }
    .total-box { margin-left: auto; width: 300px; border-collapse: collapse; }
    .total-box td { padding: 4px 8px; }
    .grand-total { font-size: 13px; font-weight: 800; color: #ca5e3a; border-top: 2px solid #ca5e3a !important; }
    .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #e7e5e4; font-size: 9px; color: #78716c; display: flex; justify-content: space-between; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Veda<span>Flow</span></div>
      <div style="font-size: 9px; color: #78716c; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
        Sales Intelligence & Enterprise Commercial Solutions
      </div>
      <div style="margin-top: 4px; font-size: 9.5px; color: #44403c;">
        <strong>VedaFlow Technologies India Pvt. Ltd.</strong><br />
        Prestige Tech Park, Outer Ring Road, Bengaluru, Karnataka 560103<br />
        <strong>GSTIN:</strong> 29AAACV1234F1Z5 | <strong>PAN:</strong> AAACV1234F
      </div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 16px; font-weight: 800; color: #ca5e3a;">TAX QUOTATION</div>
      <div style="font-size: 10px; color: #44403c; margin-top: 4px;">
        <strong>Quotation #:</strong> ${q.quotationNumber}<br />
        <strong>Date:</strong> ${q.quotationDate}<br />
        <strong>Valid Until:</strong> ${q.validUntil}
      </div>
      <div class="badge">Official Proforma Estimate</div>
    </div>
  </div>

  <div class="grid">
    <div class="box">
      <div class="box-title">Client Billing Account</div>
      <div style="font-size: 11px; font-weight: 700; color: #0c0a09;">${q.clientCompany}</div>
      <div style="color: #44403c; margin-top: 2px;">
        ${q.clientAddress}<br />
        <strong>Client GSTIN:</strong> ${q.clientGstin}
      </div>
    </div>
    <div class="box">
      <div class="box-title">Commercial Summary</div>
      <div><strong>Opportunity:</strong> ${deal.title}</div>
      <div><strong>Account AE:</strong> ${deal.assignedTo}</div>
      <div><strong>Payment Terms:</strong> Net 30 Days from Contract Signing</div>
      <div><strong>Supply Type:</strong> ${isInterstate ? 'Inter-State (IGST 18%)' : 'Intra-State (CGST 9% + SGST 9%)'}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 40px;">#</th>
        <th>Service Description</th>
        <th style="width: 80px;">SAC Code</th>
        <th style="width: 60px;" class="right">Term</th>
        <th style="width: 120px;" class="right">Base Amount (INR)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>
          <strong>${deal.title}</strong><br />
          <span style="color: #78716c; font-size: 9px;">Enterprise deployment, multi-tenant cloud instance, 256-bit encryption, dedicated CSM & SLA guarantee.</span>
        </td>
        <td>${q.sacCode}</td>
        <td class="right">12 Months</td>
        <td class="right"><strong>${formatCurrency(q.baseAmount)}</strong></td>
      </tr>
    </tbody>
  </table>

  <table class="total-box">
    <tr>
      <td>Subtotal (Base Value):</td>
      <td class="right"><strong>${formatCurrency(q.baseAmount)}</strong></td>
    </tr>
    ${
      isInterstate
        ? `<tr>
             <td>Integrated GST (IGST @ 18%):</td>
             <td class="right">${formatCurrency(q.igstAmount)}</td>
           </tr>`
        : `<tr>
             <td>Central GST (CGST @ 9%):</td>
             <td class="right">${formatCurrency(q.cgstAmount)}</td>
           </tr>
           <tr>
             <td>State GST (SGST @ 9%):</td>
             <td class="right">${formatCurrency(q.sgstAmount)}</td>
           </tr>`
    }
    <tr class="grand-total">
      <td><strong>Total Quotation (Incl. GST):</strong></td>
      <td class="right"><strong>${formatCurrency(q.grandTotal)}</strong></td>
    </tr>
  </table>

  <div style="margin-top: 24px; display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
    <div style="font-size: 9px; color: #57534e;">
      <strong>Terms & Conditions:</strong><br />
      1. This quotation is valid for 30 calendar days from the date of issue.<br />
      2. Prices are subject to applicable Indian Goods & Services Tax (GST).<br />
      3. Bank transfers to be made to VedaFlow Technologies India Pvt. Ltd. HDFC Current A/c #50200012345678, IFSC: HDFC0000123.
    </div>
    <div style="text-align: center; border-top: 1px solid #78716c; padding-top: 6px; font-size: 9px;">
      <strong>Authorized Signatory</strong><br />
      VedaFlow Commercial Legal Team
    </div>
  </div>

  <div class="footer">
    <div>VedaFlow Technologies India Pvt. Ltd. • GST Registered Enterprise SaaS</div>
    <div>Computer Generated Document • No Physical Signature Required</div>
  </div>
</body>
</html>
  `;

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
        window.open('', '_blank')?.document.write(htmlContent);
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }
    }, 350);
  }
};

