import { useState, useEffect, useRef } from 'react'
import { FiX, FiUpload, FiUser, FiAlertCircle } from 'react-icons/fi'
import { updatePlayer, uploadPlayerImage } from '../services/api'
import { resolveImage } from '../utils/format'
import toast from 'react-hot-toast'

const ROLES          = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper']
const BATTING_STYLES = ['Right-Hand Bat', 'Left-Hand Bat']
const BOWLING_STYLES = ['Right-Arm Fast', 'Right-Arm Medium', 'Right-Arm Spin', 'Left-Arm Fast', 'Left-Arm Medium', 'Left-Arm Spin', 'N/A']
const JERSEY_SIZES   = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const inp = 'w-full border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all border-gray-200 bg-gray-50'
const inpErr = 'w-full border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all border-red-400 bg-red-50'

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle size={11} />{error}</p>}
  </div>
)

export default function EditPlayerModal({ player, onClose, onSaved }) {
  const [form,    setForm]    = useState({})
  const [preview, setPreview] = useState(null)
  const [imgFile, setImgFile] = useState(null)
  const [errors,  setErrors]  = useState({})
  const [saving,  setSaving]  = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    if (!player) return
    setForm({
      playerName:    player.playerName    || '',
      age:           player.age           || '',
      role:          player.role          || 'Batsman',
      village:       player.village       || player.nativePlace || '',
      contactNo:     player.contactNo     || player.phoneNumber || '',
      battingStyle:  player.battingStyle  || '',
      bowlingStyle:  player.bowlingStyle  || '',
      jerseyName:    player.jerseyName    || '',
      jerseyNumber:  player.jerseyNumber  || '',
      jerseySize:    player.jerseySize    || '',
    })
    setPreview(null)
    setImgFile(null)
    setErrors({})
  }, [player])

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.playerName?.trim()) e.playerName = 'Name is required'
    if (!form.age || form.age < 5 || form.age > 70) e.age = 'Enter a valid age'
    if (!form.role) e.role = 'Role is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleImage = e => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Select an image file')
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB')
    setImgFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await updatePlayer(player.id, {
        playerName:    form.playerName,
        age:           Number(form.age),
        role:          form.role,
        nativePlace:   form.village,
        village:       form.village,
        contactNo:     form.contactNo,
        phoneNumber:   form.contactNo,
        battingStyle:  form.battingStyle,
        bowlingStyle:  form.bowlingStyle,
        jerseyName:    form.jerseyName,
        jerseyNumber:  form.jerseyNumber,
        jerseySize:    form.jerseySize,
        basePrice:     player.basePrice || 0,
      })
      if (imgFile) await uploadPlayerImage(player.id, imgFile)
      toast.success('Player updated!')
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (!player) return null
  const currentImg = resolveImage(player.playerImage)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in py-6 px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-auto animate-slide-up">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Edit Player</h2>
            <p className="text-xs text-gray-400">{player.playerName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
            <FiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 overflow-hidden border-4 border-orange-100 bg-orange-50 shadow-md">
              {preview || currentImg ? (
                <img src={preview || currentImg} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiUser size={36} className="text-orange-300" />
                </div>
              )}
            </div>
            <button type="button" onClick={() => fileRef.current.click()}
              className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-1.5 rounded-full transition-colors font-medium">
              <FiUpload size={13} /> Change Photo
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            {preview && <p className="text-xs text-green-600 font-medium">✓ New image selected</p>}
          </div>

          {/* Fields */}
          <Field label="Full Name *" error={errors.playerName}>
            <input className={errors.playerName ? inpErr : inp}
              value={form.playerName || ''} onChange={e => set('playerName', e.target.value)} placeholder="Virat Kohli" />
          </Field>

          <Field label="Age *" error={errors.age}>
            <input type="number" min="5" max="70" className={errors.age ? inpErr : inp}
              value={form.age || ''} onChange={e => set('age', e.target.value)} placeholder="25" />
          </Field>

          <Field label="Role *" error={errors.role}>
            <select className={inp} value={form.role || ''} onChange={e => set('role', e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>

          <Field label="Village / Area">
            <input className={inp} value={form.village || ''} onChange={e => set('village', e.target.value)} placeholder="Majali" />
          </Field>

          <Field label="Contact No.">
            <input className={inp} value={form.contactNo || ''} onChange={e => set('contactNo', e.target.value)} placeholder="9999999999" />
          </Field>

          <Field label="Batting Style">
            <select className={inp} value={form.battingStyle || ''} onChange={e => set('battingStyle', e.target.value)}>
              <option value="">Select...</option>
              {BATTING_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Bowling Style">
            <select className={inp} value={form.bowlingStyle || ''} onChange={e => set('bowlingStyle', e.target.value)}>
              <option value="">Select...</option>
              {BOWLING_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Jersey Name">
            <input className={inp} value={form.jerseyName || ''} onChange={e => set('jerseyName', e.target.value)} placeholder="KING" />
          </Field>

          <Field label="Jersey Number">
            <input className={inp} value={form.jerseyNumber || ''} onChange={e => set('jerseyNumber', e.target.value)} placeholder="18" />
          </Field>

          <Field label="Jersey Size">
            <select className={inp} value={form.jerseySize || ''} onChange={e => set('jerseySize', e.target.value)}>
              <option value="">Select...</option>
              {JERSEY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-orange-200 disabled:opacity-60 text-sm">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
