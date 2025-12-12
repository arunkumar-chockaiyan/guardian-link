import React, { useState } from 'react';
import { UserProfile, Contact } from '../types';
import { Save, Plus, Trash2, User, Phone, MapPin, Activity, Mail, Radio } from 'lucide-react';

interface Props {
  profile: UserProfile;
  contacts: Contact[];
  onSaveProfile: (p: UserProfile) => void;
  onSaveContacts: (c: Contact[]) => void;
  onClose: () => void;
}

export const Settings: React.FC<Props> = ({ profile, contacts, onSaveProfile, onSaveContacts, onClose }) => {
  const [localProfile, setLocalProfile] = useState(profile);
  const [localContacts, setLocalContacts] = useState(contacts);

  const handleAddContact = () => {
    setLocalContacts([...localContacts, { id: Date.now().toString(), name: '', phone: '', email: '', relation: '' }]);
  };

  const updateContact = (id: string, field: keyof Contact, value: string) => {
    setLocalContacts(localContacts.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeContact = (id: string) => {
    setLocalContacts(localContacts.filter(c => c.id !== id));
  };

  const handleSave = () => {
    onSaveProfile(localProfile);
    onSaveContacts(localContacts);
    onClose();
  };

  return (
    <div className="bg-white h-full w-full overflow-y-auto pb-24">
      <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center z-10">
        <h2 className="text-2xl font-bold text-slate-800">Configuration</h2>
        <button onClick={handleSave} className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
          <Save size={18} /> Save
        </button>
      </div>

      <div className="p-6 space-y-8 max-w-3xl mx-auto">
        {/* Profile Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 border-b pb-2">
            <User className="text-blue-600" />
            <h3 className="text-xl font-bold">My Information</h3>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={localProfile.name}
                onChange={e => setLocalProfile({ ...localProfile, name: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg text-lg"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Medical Conditions (For First Responders)</label>
              <textarea
                value={localProfile.medicalConditions}
                onChange={e => setLocalProfile({ ...localProfile, medicalConditions: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg text-lg h-24"
                placeholder="e.g. Asthma, Diabetes Type 2, Heart Condition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Home Address</label>
              <input
                type="text"
                value={localProfile.address}
                onChange={e => setLocalProfile({ ...localProfile, address: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg text-lg"
                placeholder="123 Main St, Springfield"
              />
            </div>
          </div>
        </section>

        {/* Contacts Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-slate-800 border-b pb-2">
            <div className="flex items-center gap-2">
              <Phone className="text-green-600" />
              <h3 className="text-xl font-bold">Emergency Contacts</h3>
            </div>
            <button onClick={handleAddContact} className="text-blue-600 font-bold flex items-center gap-1 text-sm bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
              <Plus size={16} /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {localContacts.map((contact) => (
              <div key={contact.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                <button 
                  onClick={() => removeContact(contact.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-2"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Name</label>
                    <input
                      placeholder="Jane Doe"
                      value={contact.name}
                      onChange={e => updateContact(contact.id, 'name', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Relation</label>
                    <input
                      placeholder="e.g. Daughter"
                      value={contact.relation}
                      onChange={e => updateContact(contact.id, 'relation', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1"><Phone size={12}/> Phone</label>
                    <input
                      placeholder="555-0123"
                      value={contact.phone}
                      onChange={e => updateContact(contact.id, 'phone', e.target.value)}
                      className="w-full p-2 border rounded"
                      type="tel"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1"><Mail size={12}/> Email</label>
                    <input
                      placeholder="jane@example.com"
                      value={contact.email}
                      onChange={e => updateContact(contact.id, 'email', e.target.value)}
                      className="w-full p-2 border rounded"
                      type="email"
                    />
                  </div>
                </div>
              </div>
            ))}
            {localContacts.length === 0 && (
              <p className="text-slate-400 italic text-center py-4">No contacts added yet.</p>
            )}
          </div>
        </section>

        {/* Responder Network Section */}
        <section className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 border-b pb-2">
            <Radio className="text-purple-600" />
            <h3 className="text-xl font-bold">Community Network</h3>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-purple-900">Volunteer Responder</h4>
                <p className="text-xs text-purple-700 max-w-[250px] mt-1">
                  Opt-in to receive alerts when neighbors within 2 miles trigger an emergency.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localProfile.isResponder}
                  onChange={e => setLocalProfile({...localProfile, isResponder: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {localProfile.isResponder && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold text-purple-800 mb-1">
                  Certifications / Skills
                </label>
                <input
                  type="text"
                  value={localProfile.responderSkills}
                  onChange={e => setLocalProfile({ ...localProfile, responderSkills: e.target.value })}
                  className="w-full p-3 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="e.g. CPR Certified, EMT, Nurse, Strong swimmer"
                />
                <p className="text-xs text-purple-500 mt-2 flex items-center gap-1">
                  <Activity size={12} />
                  Your location will be anonymously monitored for nearby alerts.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};