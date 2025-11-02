import { motion } from "motion/react"

import { IconAvatar } from "../icon-avatar"

export default function AvatarBox({ checked }: { checked?: boolean }) {


  if (!checked) {
    return (
      <div
        className="relative mb-4 flex h-[50px] w-[250px] items-center justify-center rounded-xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="200" viewBox="0 0 750 200">
          <defs>
            <linearGradient id="gradMach" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>

          </defs>
          <text x="0" y="140" fontFamily="Roboto, Helvetica, Arial, sans-serif" fontSize="120" fill="url(#gradMach)">Mach</text>
          <polygon points="320,50 360,100 320,150 340,150 380,100 340,50" fill="url(#gradMach)" />
          <polygon points="375,50 415,100 375,150 395,150 435,100 395,50" fill="url(#gradMach)" />
          <text x="455" y="140" fontFamily="Roboto, Helvetica, Arial, sans-serif" fontSize="120" fill="#0b0f19">Tech</text>
        </svg>
      </div>
    )
  }


  return (
    <IconAvatar
      size="large"
      className="bg-ui-button-neutral shadow-buttons-neutral after:button-neutral-gradient relative mb-4 flex h-[50px] w-[250px] items-center justify-center rounded-xl after:inset-0 after:content-['']"
    >
      {checked && (
        <motion.div
          className="absolute -right-[5px] -top-1 flex size-5 items-center justify-center rounded-full border-[0.5px] border-[rgba(3,7,18,0.2)] bg-[#3B82F6] bg-gradient-to-b from-white/0 to-white/20 shadow-[0px_1px_2px_0px_rgba(3,7,18,0.12),0px_1px_2px_0px_rgba(255,255,255,0.10)_inset,0px_-1px_5px_0px_rgba(255,255,255,0.10)_inset,0px_0px_0px_0px_rgba(3,7,18,0.06)_inset]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="200" viewBox="0 0 750 200">

            <defs>
              <linearGradient id="gradMach" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>

            </defs>
            <text x="0" y="140" fontFamily="Roboto, Helvetica, Arial, sans-serif" fontSize="120" fill="url(#gradMach)">Mach</text>
            <polygon points="320,50 360,100 320,150 340,150 380,100 340,50" fill="url(#gradMach)" />
            <polygon points="375,50 415,100 375,150 395,150 435,100 395,50" fill="url(#gradMach)" />
            <text x="455" y="140" fontFamily="Roboto, Helvetica, Arial, sans-serif" fontSize="120" fill="#0b0f19">Tech</text>
          </svg>
        </motion.div>
      )}
    </IconAvatar>
  )
}
