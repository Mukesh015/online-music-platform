"use client"
import { cn } from "@/lib/utils";
import { Boxes } from "@/components/ui/background-boxes";
import WordPullUp from "@/components/ui/word-pull-up";
import { motion } from "framer-motion";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import dynamic from "next/dynamic";
import musicAnimation from "@/lottie/Animation - 1724250266064.json"
import Link from "next/link";

export default function Home() {

  return (
    <>
      <div className="pt-32 md:pt-10 h-screen overflow-hidden md:pl-14 md:pr-10 md:space-x-16 font-Montserrat relative w-full bg-slate-900 flex-col flex md:flex-row items-center">
        <div className="md:w-[60vw] space-y-7 md:items-center md:justify-center md:flex md:flex-col">
          <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)]     pointer-events-none" >
          </div>/
          <Boxes />
          <div className={cn("text-white text-center justify-center relative z-20 flex mr-3 ml-3")}>
            <WordPullUp className="text-xl md:text-5xl text-sky-500" words="Feel Your Music with Musically" />
          </div>
          <motion.p className="text-center text-sky-300 mt-5 relative z-20 ml-4 mr-4 md:max-w-[50vw]">
            Create albums with your favourite songs, then upload them to enjoy them for a lifetime. and take in the newest headlines while listening to music. Your interests with us may be easily categorised, and you will receive recommendations in your feeds.
          </motion.p>
          <section className="mt-5 flex flex-row justify-center w-full">
            <Link href={"/music"}>
              <button className="play-song">
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">PLAY SONGS</span>
              </button>
            </Link>
          </section>
        </div>
        <div className="">
          <Lottie className="h-80 md:h-96" animationData={musicAnimation} />
        </div>
      </div>
    </>
  );
}