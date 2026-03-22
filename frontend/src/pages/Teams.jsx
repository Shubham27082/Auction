import { useState } from 'react'
import { getTeams, createTeam, uploadLogo } from '../api/teams'
import { deleteTeam } from '../services/api'
import useFetch from '../hooks/useFetch'
import TeamCard from '../components/TeamCard'
import toast from 'react-hot-toast'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { imgUrl } from '../utils/format'
import { MdGroups } from 'react-icons/md'

const emptyForm = { teamName: '', ownerName: '', totalPurse: '' }

function TeamCardWithDelete({ team, onDeleted }) {
  const [confirming, setConfirming] = useState(false)
  const [loading,    setLoading]    = useState(false)

  const pct = team.totalPurse > 0
    ? Math.round((team.remainingPurse / team.totalPurse) * 100) : 0

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteTeam(team.id)
      toast.success(`${team.teamName} deleted`)
      onDeleted()
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete team')
    } finally { setLoading(false); setConfirming(false) }
  }

  return (
    <div className="card relative group">
      {/* Delete button */}
      <button
        onClick={() => setConfirming(true)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 p-1.5 rounded-full transition-all"
        title="Delete team"
      >
        <FiTrash2 size={13} />
      </button>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden shrink-0">
          {imgUrl(team.teamLogo)
            ? <img src={imgUrl(team.teamLogo)} alt={team.teamName} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-500"><MdGroups size={22} /></div>
          }
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{team.teamName}</p>
          <p className="text-xs text-gray-400">{team.ownerName}</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Remaining Purse</span>
          <span className="text-green-400 font-medium">₹{Number(team.remainingPurse).toLocaleString('en-IN')}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Total: ₹{Number(team.totalPurse).toLocaleString('en-IN')}</span>
          <span>{pct}% left</span>
        </div>
      </div>

      {/* Confirm delete overlay */}
      {confirming && (
        <div className="absolute inset-0 bg-gray-900/90 rounded-xl flex flex-col items-center justify-center gap-3 p-4">
          <p className="text-white text-sm font-semibold text-center">Delete "{team.teamName}"?</p>
          <div className="flex gap-2 w-full">
            <button onClick={handleDelete} disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button onClick={() => setConfirming(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

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
          {teams?.map(t => <TeamCardWithDelete key={t.id} team={t} onDeleted={refetch} />)}
          {teams?.length === 0 && <p className="col-span-full text-center text-gray-500 py-12">No teams yet</p>}
        </div>
      )}
    </div>
  )
}
