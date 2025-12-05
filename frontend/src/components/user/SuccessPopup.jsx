import { AnimatePresence } from 'framer-motion'
import { ShoppingCart,X } from 'lucide-react'
import { motion } from 'framer-motion'

const PopupMessage = ({title,subtitle,content,bgcolor,onclick,path}) => {


  return (
    <AnimatePresence>
     <motion.div initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed ${bgcolor === "success" ? "bg-green-500" : "bg-red-500"} opacity-50 bottom-4 right-4 text-white px-6 py-4 rounded-lg shadow-lg z-80`}
        >
          <div className='flex items-center space-x-3'>
            <ShoppingCart className='w-5 h-5' />
            <div>
              <h1 className='font-semibold'>
                {title}
              </h1>
              <p className='text-sm opacity-90'>
                <button onClick={path} className='underline hover:no-underline'>
                  {subtitle}
                </button>
                {content}
              </p>
            </div>
            <button onClick={onclick}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

    </AnimatePresence>
  )
}

export default PopupMessage