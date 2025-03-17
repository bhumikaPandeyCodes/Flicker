import { motion } from "framer-motion";

const Loading = () => {
  const dotVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i:number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.2, duration: 0.2, repeat: Infinity, repeatDelay: 1 },
    }),
  };

  return (
    <div className="flex justify-center items-center h-screen bg-pinkbg1">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={dotVariants}
          initial="hidden"
          animate="visible"
          className="w-2 h-2 bg-gray-400 rounded-full ml-1"
        />
      ))}
    </div>
  );
};

export default Loading;
