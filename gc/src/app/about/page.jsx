'use client';
import { useRouter } from "next/navigation";
import Botanical from "../components/Botanical";
export default function About() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center px-8 py-20">
      <div className="w-full max-w-2xl mb-10">
        <button
          onClick={() => router.push("/theme")}
          className="text-gray-500 hover:text-white transition"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-2xl flex flex-col gap-10 text-center">
        <div>
          <p className="text-gray-600 text-sm tracking-widest mb-3">ABOUT THE PROJECT</p>
          <h1 className="text-3xl font-light tracking-wide mb-6">Grief Cartographer</h1>
                    <p className="text-gray-400 leading-relaxed text-lg">
            This is a reflective space for expressing grief through drawing.
            There's no right way to do it — just an object drawn, or a few
            words written, in whatever shape feels true to what you're
            carrying. Its main design principle is to let go of control, and to
            release something without knowing what will happen to it next.
          </p>
        </div>

        <div>
          <p className="text-gray-400 leading-relaxed text-lg">
            Grief doesn't always fit into words, and it doesn't look the same for everyone.
            This project draws on William Odom's research on Photobox, a device that slowly
            prints a few randomly chosen photographs from a person's online collection at
            unpredictable intervals, resisting the instant, always-accessible nature of most
            technology. Grief Cartographer keeps that slowness and unpredictability but turns
            the idea around: instead of bringing the past back, it asks you to let something
            go, with no guarantee of ever seeing it again.
          </p>
        </div>

        <div>
          <p className="text-gray-400 leading-relaxed text-lg">
            Once released, a drawing can't be edited or taken back. It becomes part of a shared
            gallery — visible to others, but not linked to your name, and not visible to you
            again either. Just like in life, we don't always get things back.
          </p>
        </div>

        <div>
          <p className="text-gray-400 leading-relaxed text-lg">
            This is a reflective space, not a therapy or support service. If you're struggling,
            please reach out to someone you trust or a local helpline.
          </p>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-gray-200 text-lg tracking-widest mb-3">ABOUT ME</p>
          <p className="text-gray-400 leading-relaxed text-lg">
            I'm Khyati Bhaardwaj, a B.Tech Computer Science student at CGC University, Mohali,
            building this independently out of interest in how design can hold something as
            difficult as grief without needing words. It is an HCI research project, grounded in
            five academic papers on reflective and slow technology and informed by a small pilot
            study with university students.
          </p>
        </div>

        <p className="text-gray-300 leading-relaxed pt-2 text-lg" style={{ fontFamily: "var(--font-dancing)", fontSize: "1.5rem" }}>
          a quiet place to let something go
        </p>
        <Botanical/>
      </div>
    </main>
  );
}
