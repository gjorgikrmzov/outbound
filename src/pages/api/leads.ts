// pages/api/leads.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const gid = (req.query.gid as string) ?? "0";

  const BASE =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRcTeBJ8L_WLJXYfkoWKOtETOM2yZjKmS91_Ufd6m21JHuWyjNmYvE0wDVDGqLj-s7mQ2VtKv0TUJFQ";
  const url = `${BASE}/pub?gid=${gid}&single=true&output=csv`;

  const r = await fetch(url);
  if (!r.ok) return res.status(502).send("Failed to fetch sheet");

  const csv = await r.text();
  const rows = csv.split(/\r?\n/).filter(Boolean).map(l => l.split(","));
  if (!rows.length) return res.status(200).json({ leads: [], gid });

  const [header, ...body] = rows;
  const leads = body.map(r =>
    Object.fromEntries(header.map((h, i) => [h.trim(), r[i] ?? ""]))
  );

  res.status(200).json({ leads, gid });
}
