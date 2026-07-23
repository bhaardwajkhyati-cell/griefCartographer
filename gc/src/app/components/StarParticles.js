export default function StarParticles() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {[
        { top: '10%', left: '20%', duration: '3s', delay: '0s' },
        { top: '25%', left: '50%', duration: '4.5s', delay: '2s' },
        { top: '15%', left: '70%', duration: '3.5s', delay: '4s' },
        { top: '40%', left: '10%', duration: '5s', delay: '1s' },
        { top: '5%', left: '40%', duration: '4s', delay: '3s' },
        { top: '50%', left: '80%', duration: '3s', delay: '5s' },
      ].map((star, i) => (
        <div
          key={i}
          className="shooting-star"
          style={{
            top: star.top,
            left: star.left,
            animationDuration: star.duration,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  )
}