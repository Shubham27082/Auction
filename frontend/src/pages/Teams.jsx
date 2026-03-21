import { useState } from 'react'
import { getTeams, createTeam, uploadLogo } from '../api/teams'
import useFetch from '../hooks/useFetch'
import TeamCard from '../components/TeamCard'
import toast from 'react-hot-toast'
import { FiPlus } from 'react-icons/fi'

const emptyForm = { teamName: '', ownerName: '', totalPurse: '' }

export default function Teams() {
  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState(emptyForm)
  const [logoFile, setLogoFile] = useState(null)
  const [saving,   setSaving]   = useState(false)

  const { data: teams, loading, refetch } = useFetch(getTeams)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.teamName || !form.ownerName || !form.totalPurse) return toast.error('Fill all required fields')
    setSaving(true)
    try {
      const res = await createTeam({ ...form, totalPurse: Number(form.totalPurse) })
      const newId = res.data.data.id
      if (logoFile) await uploadLogo(newId, logoFile)
      toast.success('Team created!')
      setForm(emptyForm); setLogoFile(null); setShowForm(false)
      refetch()
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to create team')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Teams</h1>
          <p className="text-gray-400 text-sm">{teams?.length || 0} teams registered</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setShowForm(f => !f)}>
          <FiPlus size={14} /> Add Team
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="col-span-full font-semibold text-white">Add New Team</h3>
          <div>
            <label className="label">Team Name *</label>
            <input className="input" placeholder="Mumbai Indians"
              value={form.teamName} onChange={e => setForm(f => ({ ...f, teamName: e.target.value }))} />
          </div>
          <div>
            <label className="label">Owner Name *</label>
            <input className="input" placeholder="Mukesh Ambani"
              value={form.ownerName} onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))} />
          </div>
          <div>
            <label className="label">Total Purse (₹) *</label>
            <input type="number" className="input" placeholder="900000000"
              value={form.totalPurse} onChange={e => setForm(f => ({ ...f, totalPurse: e.target.value }))} />
          </div>
          <div>
            <label className="label">Team Logo</label>
            <input type="file" accept="image/*" className="input py-1.5 text-sm"
              onChange={e => setLogoFile(e.target.files[0])} />
          </div>
          <div className="col-span-full flex gap-3">
            <button type="submit" className="btn-success" disabled={saving}>{saving ? 'Saving...' : 'Save Team'}</button>
            <button type="button" className="btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="card animate-pulse h-36 bg-gray-800" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams?.map(t => <TeamCard key={t.id} team={t} />)}
          {teams?.length === 0 && <p className="col-span-full text-center text-gray-500 py-12">No teams yet</p>}
        </div>
      )}
    </div>
  )
}
