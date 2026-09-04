export default function About() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center px-8 py-20">
      <div className="max-w-2xl flex flex-col gap-10 text-center">
        <div>
          <p className="text-gray-600 text-sm tracking-widest mb-3">ABOUT THE PROJECT</p>
          <h1 className="text-3xl font-light tracking-wide mb-6">Grief Cartographer</h1>
          <p className="text-gray-400 leading-relaxed text-lg">
            This is a reflective, language-free space for expressing grief through drawing.
            There's nothing to write, no right way to do it — just an object, a room, or a path,
            drawn in whatever shape feels true to what you're carrying.
          </p>
        </div>

        <div>
          <p className="text-gray-400 leading-relaxed text-lg">
            Grief doesn't always fit into words, and it doesn't look the same for everyone.
            This project is grounded in Dark HCI and reflective technology principles — design
            that makes room for discomfort and ambiguity, instead of trying to resolve or fix it.
            It's built to be understood without language, so it can hold space for anyone,
            anywhere.
          </p>
        </div>

        <div>
          <p className="text-gray-400 leading-relaxed text-lg">
            Once released, a drawing can't be edited or taken back. It becomes part of a shared
            gallery — visible to others, but not traceable back to you, and not visible to you
            again either. Just like in life, we don't always get things back.
          </p>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-gray-600 text-sm tracking-widest mb-3">ABOUT ME</p>
          <p className="text-gray-400 leading-relaxed text-lg">
            I'm Khyati — a student building this independently, out of interest in how design
            can hold something as difficult as grief without needing words. This project started
            as an application for an internship at ETH Zurich, built on research into reflective
            technology and grounded in five academic papers on the subject.
          </p>
        </div>

        <p className="text-gray-500 leading-relaxed pt-2" style={{ fontFamily: "var(--font-dancing)", fontSize: "1.5rem" }}>
          a quiet place to let something go
        </p>
      </div>
    </main>
  );
}