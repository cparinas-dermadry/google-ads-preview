import { useLayoutEffect, useRef } from 'react'

export function Counter({ value, limit }) {
  const len = value.length
  return <span className={`counter ${len > limit ? 'over' : ''}`}>{len}/{limit}</span>
}

// Textarea that grows to fit its text so nothing gets cut off. It never shrinks on its own,
// so a size set with the resize corner sticks.
function AutoTextarea({ value, ...props }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!value) el.style.height = ''
    else if (el.scrollHeight > el.clientHeight) el.style.height = `${el.scrollHeight + 2}px`
  }, [value])
  return <textarea ref={ref} rows={1} value={value} {...props} />
}

function Input({ multiline, ...props }) {
  return multiline ? <AutoTextarea {...props} /> : <input {...props} />
}

export function TextField({ label, value, onChange, limit, multiline, placeholder }) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {limit && <Counter value={value} limit={limit} />}
      </span>
      <Input
        multiline={multiline}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function ListField({ label, items, onChange, limit, max, multiline }) {
  const update = (i, v) => onChange(items.map((it, j) => (j === i ? v : it)))
  const remove = (i) => onChange(items.filter((_, j) => j !== i))
  return (
    <div className="field">
      <span className="field-label">
        {label}
        <span className="muted">{items.length}/{max}</span>
      </span>
      {items.map((item, i) => (
        <div className="list-item" key={i}>
          <div className="list-row">
            <Input
              multiline={multiline}
              value={item}
              placeholder={`${label.replace(/s$/, '')} ${i + 1}`}
              onChange={(e) => update(i, e.target.value)}
            />
            <button type="button" className="icon-btn" title="Remove" onClick={() => remove(i)}>×</button>
          </div>
          <div className="list-meta"><Counter value={item} limit={limit} /></div>
        </div>
      ))}
      {items.length < max && (
        <button type="button" className="add-btn" onClick={() => onChange([...items, ''])}>
          + Add {label.toLowerCase().replace(/s$/, '')}
        </button>
      )}
    </div>
  )
}

export function MediaField({ label, hint, value, onChange, accept = 'image/*' }) {
  const ref = useRef(null)
  const pick = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (value?.url) URL.revokeObjectURL(value.url)
    onChange({ url: URL.createObjectURL(file), type: file.type.startsWith('video') ? 'video' : 'image', name: file.name })
    e.target.value = ''
  }
  const clear = () => {
    if (value?.url) URL.revokeObjectURL(value.url)
    onChange(null)
  }
  return (
    <div className="field">
      <span className="field-label">
        {label}
        {hint && <span className="muted">{hint}</span>}
      </span>
      <div className="media-row">
        <div className="media-thumb">
          {value ? (
            value.type === 'video' ? <video src={value.url} muted /> : <img src={value.url} alt="" />
          ) : (
            <span>None</span>
          )}
        </div>
        <button type="button" className="btn" onClick={() => ref.current?.click()}>
          {value ? 'Replace' : 'Upload'}
        </button>
        {value && (
          <button type="button" className="btn ghost" onClick={clear}>Remove</button>
        )}
        <input ref={ref} type="file" accept={accept} hidden onChange={pick} />
      </div>
    </div>
  )
}

export function Media({ media, className, placeholder }) {
  if (!media) return <div className={`ph ${className || ''}`}><span>{placeholder}</span></div>
  if (media.type === 'video') {
    return <video className={className} src={media.url} muted loop autoPlay playsInline />
  }
  return <img className={className} src={media.url} alt="" />
}

export function Logo({ logo, name, size = 18 }) {
  if (logo) return <img className="logo" src={logo.url} alt="" style={{ width: size, height: size }} />
  return (
    <span className="logo logo-fallback" style={{ width: size, height: size, fontSize: size * 0.5 }}>
      {(name || '?').charAt(0).toUpperCase()}
    </span>
  )
}
