import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingCart, X } from 'lucide-react'

const PopupMessage = ({ title, subtitle, content, bgcolor, onclick, path }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        aria-live="polite"
        className={`fixed z-[80] w-[calc(100vw-2rem)] max-w-md sm:max-w-md lg:max-w-md
        ${bgcolor === "success" ? "bg-green-500" : "bg-red-500"}
        text-white rounded-xl sm:rounded-2xl shadow-xl
        bottom-4 left-1/2 -translate-x-1/2
        sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0
        md:bottom-8 md:right-8
        lg:bottom-10 lg:right-10`}
      >
        <div className="flex items-start sm:items-center gap-3 p-3 sm:p-4 md:p-5 break-words">
          
          {/* Icon */}
          <div className={`flex-shrink-0 p-2 rounded-lg
            ${bgcolor === "success" ? "bg-green-400/30" : "bg-red-400/30"}`}>
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-md sm:text-base md:text-lg lg:text-xl mb-0.5">
              {title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base opacity-90">
              <button onClick={path} className="underline hover:no-underline">
                {subtitle}
              </button>
              <span className="ml-1">{content}</span>
            </p>
          </div>

          {/* Close */}
          <button onClick={onclick} className="p-2">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PopupMessage
