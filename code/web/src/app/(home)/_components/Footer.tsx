import * as motion from "motion/react-client";

const Footer = () => {
  return (
    <div className="mx-auto mt-20 flex items-center justify-center gap-10 bg-secondary py-10 text-background">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 0.8, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto flex w-3/4 items-center gap-10"
      >
        <div>
          <h1 className="text-2xl font-semibold">
            Mind<span className="italic">Rush</span>
          </h1>
        </div>

        <div className="text-lg font-semibold">
          © 2025 - MindRush. Este site é um projeto acadêmico fictício desenvolvido para fins
          educacionais. Nenhuma informação aqui representa uma entidade real. Todas as informações
          foram geradas por IA.
        </div>
      </motion.div>
    </div>
  );
};

export default Footer;
