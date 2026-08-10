import { motion } from 'framer-motion'
export default function Botanical(){
    return(
    <motion.div
     initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 2 }}
      className="mt-8"     
    >
      <svg width="300" height="60" viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Main stem */}
        <path d="M 20 30 Q 150 30 280 30" stroke="#fafdff" strokeWidth="0.8" fill="none"/>
    
    {/* Left branches */}
        <path d="M 80 30 Q 70 20 60 15" stroke="#8c96a7" strokeWidth="0.6" fill="none"/>
        <path d="M 80 30 Q 70 40 62 44" stroke="#8c96a7" strokeWidth="0.6" fill="none"/>
        <path d="M 110 30 Q 100 18 92 12" stroke="#8c96a7" strokeWidth="0.6" fill="none"/>
    
    {/* Right branches */}
    <path d="M 220 30 Q 230 20 240 15" stroke="#8c96a7" strokeWidth="0.6" fill="none"/>
        <path d="M 220 30 Q 230 40 238 44" stroke="#8c96a7" strokeWidth="0.6" fill="none"/>
        <path d="M 190 30 Q 200 18 208 12" stroke="#8c96a7" strokeWidth="0.6" fill="none"/>
    
    {/* Centre dot */}
        <circle cx="150" cy="30" r="2" fill="#dde9ff"/>
    
    {/* Small leaves - left */}
        <ellipse cx="58" cy="14" rx="4" ry="2" transform="rotate(-30 58 14)" fill="#8c96a7" opacity="0.6"/>
        <ellipse cx="60" cy="45" rx="4" ry="2" transform="rotate(30 60 45)" fill="#8c96a7" opacity="0.6"/>
        <ellipse cx="90" cy="11" rx="4" ry="2" transform="rotate(-40 90 11)" fill="#8c96a7" opacity="0.6"/>
    
    {/* Small leaves - right */}
        <ellipse cx="242" cy="14" rx="4" ry="2" transform="rotate(30 242 14)" fill="#8c96a7" opacity="0.6"/>
        <ellipse cx="240" cy="45" rx="4" ry="2" transform="rotate(-30 240 45)" fill="#8c96a7" opacity="0.6"/>
        <ellipse cx="210" cy="11" rx="4" ry="2" transform="rotate(40 210 11)" fill="#8c96a7" opacity="0.6"/>
      </svg>
      </motion.div>
   )}