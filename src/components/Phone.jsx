export default function Phone({ label, children, dark, bleed }) {
  return (
    <figure className="phone-fig">
      <div className={`phone ${dark ? 'dark' : ''}`}>
        <div className="phone-notch" />
        <div className={`phone-screen ${bleed ? 'bleed' : ''}`}>{children}</div>
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  )
}
