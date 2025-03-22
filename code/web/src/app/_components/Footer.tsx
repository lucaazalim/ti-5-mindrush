import * as motion from "motion/react-client"

const Footer = () => {
  return (
    <div className="bg-secondary text-background mx-auto flex mt-20 py-10 gap-10 justify-center items-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 0.8, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }} 
        className="flex w-3/4 mx-auto gap-10 items-center"
        >  
        <div>
          <h1 className="font-semibold text-2xl">Mind<span className="italic">Rush</span></h1>
        </div>

        <div className="font-semibold text-lg">
          © 2025 - MindRush. Este é um projeto interdisciplinar. Todas as informações utilizadas foram criadas por IA.
        </div>
      </motion.div >

    </div>
  )
}

export default Footer