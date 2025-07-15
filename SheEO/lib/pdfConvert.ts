import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export interface BusinessReport{
  date: Date,
  totalSales: number,
  COGS: number,
  platformFee: number,
  adsNPromotion: number,
  netProfit: number,
  netMargin: number,
}

export const businessReportPDF = async (prop: BusinessReport) => {

 const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { color: #333; }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          td, th {
            border: 1px solid #ddd;
            padding: 8px;
          }
        </style>
      </head>
      <body>
        <h1>Business Report</h1>
        <table>
          <tr><th>Description</th><th>Amount (₱)</th></tr>
          <tr><td>Total Sales</td><td>${prop.totalSales}</td></tr>
          <tr><td>COGS</td><td>${prop.COGS}</td></tr>
          <tr><td>Platform Fee</td><td>${prop.platformFee}</td></tr>
          <tr><td>Ads & Promotion</td><td>${prop.adsNPromotion}</td></tr>
          <tr><td><strong>Net Profit</strong></td><td><strong>${prop.netProfit}</strong></td></tr>
        </table>
      </body>
    </html>
  `;
  const { uri } = await Print.printToFileAsync({ html: htmlContent });

  const fileName = `Business_Report_${Date.now()}.pdf`;
  const newPath = FileSystem.documentDirectory + fileName;

  await FileSystem.moveAsync({
    from: uri,
    to: newPath,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(newPath);
  } else {
    alert('Sharing not available on this device');
  }

  return newPath;
  };

