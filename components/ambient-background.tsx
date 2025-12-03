export function AmbientBackground() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-celadon/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-peach-light/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-celadon-2/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
    </div>
  )
}
