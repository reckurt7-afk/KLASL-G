"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function PuanDurumuAdminPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    const { data } = await supabase.from("teams").select("*").order("points", { ascending: false });
    setTeams(data || []);
    setLoading(false);
  }

  async function handleUpdate(id: number, field: string, value: string) {
    const num = parseInt(value) || 0;
    const { error } = await supabase.from("teams").update({ [field]: num }).eq("id", id);
    if (error) alert("Hata: " + error.message);
    else fetchTeams();
  }

  if (loading) return <div className="text-white p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h1 className="text-3xl font-black text-[#ceaa52]">Puan Durumu Yönetimi (Manuel Müdahale)</h1>
          <Link href="/admin" className="px-4 py-2 bg-white/10 rounded-xl">Geri Dön</Link>
        </div>
        <div className="bg-[#121212] rounded-xl overflow-hidden border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1a] text-gray-400">
              <tr>
                <th className="p-3">Takım</th>
                <th className="p-3">O</th>
                <th className="p-3">G</th>
                <th className="p-3">B</th>
                <th className="p-3">M</th>
                <th className="p-3">AG</th>
                <th className="p-3">YG</th>
                <th className="p-3">P</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.id} className="border-t border-white/5">
                  <td className="p-3 font-bold">{t.name}</td>
                  <td className="p-3"><input type="number" defaultValue={t.played} onBlur={(e) => handleUpdate(t.id, 'played', e.target.value)} className="w-16 bg-[#1a1a1a] p-1 rounded border border-white/20 text-center" /></td>
                  <td className="p-3"><input type="number" defaultValue={t.won} onBlur={(e) => handleUpdate(t.id, 'won', e.target.value)} className="w-16 bg-[#1a1a1a] p-1 rounded border border-white/20 text-center" /></td>
                  <td className="p-3"><input type="number" defaultValue={t.drawn} onBlur={(e) => handleUpdate(t.id, 'drawn', e.target.value)} className="w-16 bg-[#1a1a1a] p-1 rounded border border-white/20 text-center" /></td>
                  <td className="p-3"><input type="number" defaultValue={t.lost} onBlur={(e) => handleUpdate(t.id, 'lost', e.target.value)} className="w-16 bg-[#1a1a1a] p-1 rounded border border-white/20 text-center" /></td>
                  <td className="p-3"><input type="number" defaultValue={t.goals_for} onBlur={(e) => handleUpdate(t.id, 'goals_for', e.target.value)} className="w-16 bg-[#1a1a1a] p-1 rounded border border-white/20 text-center" /></td>
                  <td className="p-3"><input type="number" defaultValue={t.goals_against} onBlur={(e) => handleUpdate(t.id, 'goals_against', e.target.value)} className="w-16 bg-[#1a1a1a] p-1 rounded border border-white/20 text-center" /></td>
                  <td className="p-3"><input type="number" defaultValue={t.points} onBlur={(e) => handleUpdate(t.id, 'points', e.target.value)} className="w-16 bg-[#1a1a1a] p-1 rounded border border-white/20 text-center font-bold text-[#ceaa52]" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
