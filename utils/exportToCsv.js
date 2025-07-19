// Helper function to export any data to CSV
export const exportToCSV = (res, data, filename) => {
  try {
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header("Content-Type", "text/csv");
    res.attachment(`${filename}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error(`❌ Failed to export ${filename}:`, err);
    res.status(500).json({ error: `Failed to export ${filename}` });
  }
};
