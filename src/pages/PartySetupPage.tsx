import React, { useState } from 'react';
import { Party, PartyMember } from '../types';
import { Users, UserPlus, Trash2, Heart, Shield, Sparkles, Check, Baby, Award } from 'lucide-react';

interface PartySetupPageProps {
  party: Party;
  onUpdateParty: (party: Party) => void;
  onNavigateNext: () => void;
  onNavigateBack: () => void;
}

export const PartySetupPage: React.FC<PartySetupPageProps> = ({
  party,
  onUpdateParty,
  onNavigateNext,
  onNavigateBack,
}) => {
  const [members, setMembers] = useState<PartyMember[]>([...party.members]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAge, setNewMemberAge] = useState('8');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const ageNum = parseInt(newMemberAge, 10) || 8;
    const newMember: PartyMember = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      ageGroup: ageNum < 13 ? 'CHILD' : ageNum < 18 ? 'TEEN' : 'ADULT',
      age: ageNum,
      role: 'PARTY_MEMBER',
      interests: ['Family Coasters', 'Character Photo Spots'],
    };
    const updated = [...members, newMember];
    setMembers(updated);
    onUpdateParty({
      ...party,
      members: updated,
      compositionSummary: `${updated.filter((m) => m.ageGroup === 'ADULT').length} Adults, ${
        updated.filter((m) => m.ageGroup !== 'ADULT').length
      } Children`,
    });
    setNewMemberName('');
    setIsAdding(false);
  };

  const handleRemoveMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    onUpdateParty({
      ...party,
      members: updated,
      compositionSummary: `${updated.filter((m) => m.ageGroup === 'ADULT').length} Adults, ${
        updated.filter((m) => m.ageGroup !== 'ADULT').length
      } Children`,
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-[#0B2147] text-[#00D1FF] flex items-center justify-center font-bold shadow-lg border-2 border-cyan-400/30">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0B2147]">{party.name}</h1>
              <span className="text-[10px] uppercase font-bold bg-[#FFD700]/20 text-[#0B2147] px-2 py-0.5 rounded-md border border-[#FFD700]/40">
                {members.length} Traveling Guests
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{party.compositionSummary}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateBack}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            &larr; Back
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#0B2147] text-[#00D1FF] font-bold text-xs hover:bg-[#0D2A5B] transition-colors flex items-center gap-1.5 shadow-md"
          >
            <UserPlus className="w-4 h-4" /> Add Member
          </button>
          <button
            onClick={onNavigateNext}
            className="px-5 py-2.5 rounded-2xl bg-[#FFD700] text-[#0B2147] font-bold text-xs hover:bg-amber-300 transition-colors shadow-md"
          >
            Configure Trip Setup &rarr;
          </button>
        </div>
      </div>

      {/* AI Multi-Generational Balancing Notice */}
      <div className="bg-gradient-to-r from-[#0B2147] to-slate-900 rounded-2xl p-5 text-white shadow-md border border-white/10 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#FFD700] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Multi-Generational Optimization:</strong> JourneyIQ treats the party as an interconnected whole. Height requirements (e.g. 48&quot; for Cosmic Velocity vs 38&quot; for Mine Train) and endurance profiles for younger guests (Maya, Age 7) are factored into route pacing so no family member is left exhausted or waiting in unshaded heat.
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#0B2147] flex items-center justify-center font-bold text-base border border-slate-200">
                  {member.ageGroup === 'CHILD' ? <Baby className="w-6 h-6 text-amber-500" /> : <Award className="w-6 h-6 text-blue-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#0B2147]">{member.name}</h3>
                    {member.age && (
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        Age {member.age}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {member.role.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {member.role !== 'PRIMARY_PLANNER' && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove party member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Interests & Special Notes */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Priority Interests
              </div>
              <div className="flex flex-wrap gap-1.5">
                {member.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              {member.mobilityConsiderations && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 mt-2">
                  <span className="font-bold block text-amber-800">Mobility / Comfort Requirement:</span>
                  {member.mobilityConsiderations}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Member Card / Modal */}
        {isAdding && (
          <div className="bg-cyan-50/40 rounded-[32px] p-6 border-2 border-dashed border-[#00D1FF] flex flex-col justify-between space-y-4">
            <h3 className="text-sm font-bold text-[#0B2147] flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#00D1FF]" /> Add New Traveling Member
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Sam Morgan"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-[#00D1FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Age</label>
                <input
                  type="number"
                  value={newMemberAge}
                  onChange={(e) => setNewMemberAge(e.target.value)}
                  min="1"
                  max="99"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-[#00D1FF]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:bg-slate-200/60"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-1.5 rounded-xl bg-[#0B2147] text-[#FFD700] text-xs font-bold shadow-sm"
              >
                Save Member
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
