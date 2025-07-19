import { Parser } from "json2csv";

export const exportToCSV = (res, data, filename, fields = null) => {
  try {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: "Aucune donnée à exporter." });
    }

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`${filename}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error(`❌ Failed to export ${filename}:`, err);
    return res.status(500).json({ error: `Erreur export ${filename}` });
  }
};
