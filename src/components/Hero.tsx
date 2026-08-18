import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/bakery_hero/1920/1080" 
          alt="Artisanal Bakery" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-bakery-ink/40"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block text-white/80 uppercase tracking-[0.3em] text-xs font-semibold mb-4">Crafted with Love</span>
          <h1 className="serif text-5xl md:text-8xl text-white leading-tight mb-8">
            Artisanal Cakes & <br />
            <span className="italic">Fresh Bakery</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the magic of hand-crafted sweetness. From bespoke celebration cakes 
            to daily fresh-baked treasures, we bake your moments special.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#cakes" 
              className="px-10 py-4 bg-bakery-olive text-white rounded-full hover:bg-bakery-olive/90 transition-all font-medium min-w-[200px]"
            >
              Shop Cakes
            </a>
            <a 
              href="#bakery" 
              className="px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-full hover:bg-white/20 transition-all font-medium min-w-[200px]"
            >
              Our Bakery
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-px h-12 bg-white/30 relative">
          <div className="w-1.5 h-1.5 bg-white rounded-full absolute -left-[2.5px] top-0"></div>
        </div>
      </motion.div>
    </section>
  );
}
