const orbs = [
  {
    className: 'bg-lavender-400',
    size: '28rem',
    top: '-5rem',
    left: '-4rem',
    duration: '26s',
    delay: '0s',
  },
  {
    className: 'bg-mint-300',
    size: '22rem',
    top: '10%',
    left: '60%',
    duration: '30s',
    delay: '4s',
  },
  {
    className: 'bg-sunny-200',
    size: '18rem',
    top: '60%',
    left: '10%',
    duration: '22s',
    delay: '2s',
  },
  {
    className: 'bg-peach-200',
    size: '20rem',
    top: '70%',
    left: '65%',
    duration: '28s',
    delay: '6s',
  },
];

export default function AnimatedBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-lavender-50/70 to-mint-50/80" />
      {orbs.map((orb, index) => (
        <div
          key={index}
          className={`absolute rounded-full blur-3xl opacity-40 mix-blend-multiply animate-soft-float ${orb.className}`}
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            animationDelay: orb.delay,
            animationDuration: orb.duration,
          }}
        />
      ))}

      <div className="absolute inset-x-0 bottom-12 flex justify-center">
        <div className="h-14 w-[30rem] animate-glow-pulse rounded-full bg-gradient-to-r from-lavender-200 via-white to-mint-200 opacity-60 blur-3xl" />
      </div>
    </div>
  );
}

