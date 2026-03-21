import { useState } from 'react'
import { getPlayers, createPlayer, uploadImage, importExcel } from '../api/players'
import useFetch from '../hooks/useFetch'
import PlayerCard from '../components/PlayerCard'
import toast from 'react-hot-toast'
import { FiPlus, FiUpload, FiFilter } from 'react-icons/fi'

const STATUSES = ['ALL', 'AVAILABLE', 'SOLD', 'UNSOLD']

const emptyForm = {
  playerName: '', age: '', role: '', nativePlace: '',
  currentAddress: '', teamRepresented: '', phoneNumber: '', basePrice: ''
}

export default function Players() {
  const [status,    setStatus]    = useState('ALL')
  const [showForm,  setShowForm]  = useState(false)
  const [form,      setForm]      = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [excelFile, setExcelFile] = useState(null)
  const [saving,    setSaving]    = useState(false)

  const { data: players, loading, refetch } = useFetch(
    () => getPlayers(status === 'ALL' ? null : status),
    [status]
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.playerName || !form.basePrice || !form.role || !form.age) return toast.error('Fill required fields')
    setSaving(true)
    try {
      const res = await createPlayer({ ...form, age: Number(form.age), basePrice: Number(form.basePrice) })
      const newId = res.data.data.id
      if (imageFile) await uploadImage(newId, imageFile)
      toast.success('Player added!')
      setForm(emptyForm); setImageFile(null); setShowForm(false)
      refetch()
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to add player')
    } finally { setSaving(false) }
  }

  const handleExcel = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const res = await importExcel(file)
      toast.success(`Imported ${res.data.data.length} players!`)
      refetch()
    } catch { toast.error('Import failed') }
    e.target.value = ''
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Players</h1>
          <p className="text-gray-400 text-sm">{players?.length || 0} players</p>
        </div>
        <div className="flex gap-2">
          <label className="btn-primary flex items-center gap-2 cursor-pointer text-sm">
            <FiUpload size={14} /> Import Excel
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />
          </label>
          <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setShowForm(f => !f)}>
            <FiPlus size={14} /> Add Player
          </button>
        </div>
      </div>

      {/* Add Player Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <h3 className="col-span-full font-semibold text-white">Add New Player</h3>
          {[
            { key: 'playerName', label: 'Player Name *', placeholder: 'Virat Kohli' },
            { key: 'age',        label: 'Age *',         placeholder: '35', type: 'number' },
            { key: 'role',       label: 'Role *',        placeholder: 'Batsman' },
            { key: 'basePrice',  label: 'Base Price (₹) *', placeholder: '2000000', type: 'number' },
            { key: 'phoneNumber',label: 'Phone',         placeholder: '9999999999' },
            { key: 'nativePlace',label: 'Native Place',  placeholder: 'Delhi' },
            { key: 'teamRepresented', label: 'Team Represented', placeholder: 'India' },
          ].map(({ key, label, placeholder, type = 'text' }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input type={type} className="input" placeholder={placeholder}
                value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="label">Player Image</label>
            <input type="file" accept="image/*" className="input py-1.5 text-sm"
              onChange={e => setImageFile(e.target.files[0])} />
          </div>
          <div className="col-span-full flex gap-3">
            <button type="submit" className="btn-success" disabled={saving}>{saving ? 'Saving...' : 'Save Player'}</button>
            <button type="button" className="btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <FiFilter className="text-gray-400 self-center" />
        {STATUSES.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${status === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Players Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card animate-pulse h-24 bg-gray-800" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players?.map(p => <PlayerCard key={p.id} player={p} />)}
          {players?.length === 0 && <p className="col-span-full text-center text-gray-500 py-12">No players found</p>}
        </div>
      )}
    </div>
  )
}
