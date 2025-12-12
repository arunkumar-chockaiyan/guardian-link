import React, { useState } from 'react';
import { UserProfile, Contact } from '../types';
import { Save, Plus, Trash2, User, Phone, MapPin, Activity } from 'lucide-react';

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
    setLocalContacts([...localContacts, { id: Date.now().toString(), name: '', phone: '', relation: '' }]);
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
        <button onClick={handleSave} className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2">
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
            <button onClick={handleAddContact} className="text-blue-600 font-bold flex items-center gap-1 text-sm bg-blue-50 px-3 py-1 rounded-full">
              <Plus size={16} /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {localContacts.map((contact, index) => (
              <div key={contact.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                <button 
                  onClick={() => removeContact(contact.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-2"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                  <input
                    placeholder="Name"
                    value={contact.name}
                    onChange={e => updateContact(contact.id, 'name', e.target.value)}
                    className="p-2 border rounded"
                  />
                  <input
                    placeholder="Phone Number"
                    value={contact.phone}
                    onChange={e => updateContact(contact.id, 'phone', e.target.value)}
                    className="p-2 border rounded"
                    type="tel"
                  />
                  <input
                    placeholder="Relation (e.g. Son)"
                    value={contact.relation}
                    onChange={e => updateContact(contact.id, 'relation', e.target.value)}
                    className="p-2 border rounded sm:col-span-2"
                  />
                </div>
              </div>
            ))}
            {localContacts.length === 0 && (
              <p className="text-slate-400 italic text-center py-4">No contacts added yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};