import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, BookOpen, Users, Star } from 'lucide-react';

export default function Home() {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 pt-20 pb-32 lg:pt-32 lg:pb-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-medical-400/20 dark:bg-medical-600/10 blur-3xl"
          />
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-3xl"
          />
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl z-10">
          
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-50 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 text-sm font-semibold mb-6 border border-medical-200 dark:border-medical-800/50">
            <span className="flex h-2 w-2 rounded-full bg-medical-500 animate-pulse"></span>
            The Future of Medical Education
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-8">
              Elevate your clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-500 to-blue-500">expertise.</span>
            </h1>
          </motion.div>

          <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals attending elite virtual workshops, reading peer-reviewed insights, and advancing their careers on the IndriyaX platform.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/events" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-medical-500 text-white font-bold text-lg shadow-xl shadow-medical-500/30 hover:bg-medical-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Browse Events <ArrowRight size={20} />
            </Link>
            <Link to="/posts" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-lg shadow-lg border border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition-all">
              Read the Blog
            </Link>
          </motion.div>

        </motion.div>
      </section>

      {/* FEATURE GRID SECTION */}
      <section className="bg-white dark:bg-slate-900 py-24 px-4 sm:px-6 lg:px-8 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why join IndriyaX?</h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">Everything you need to stay at the cutting edge of modern medicine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center sm:text-left transition-all">
              <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Live Workshops</h3>
              <p className="text-slate-600 dark:text-slate-400">Attend exclusive, interactive online and offline events hosted by industry-leading practitioners.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center sm:text-left transition-all">
              <div className="w-14 h-14 rounded-xl bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Curated Insights</h3>
              <p className="text-slate-600 dark:text-slate-400">Read high-quality, peer-reviewed articles discussing the latest technologies and clinical trials.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center sm:text-left transition-all">
              <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Verified Network</h3>
              <p className="text-slate-600 dark:text-slate-400">Connect with a verified community of medical students, doctors, and healthcare administrators.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-slate-900 dark:bg-medical-900/20 border border-slate-800 dark:border-medical-800/50 rounded-3xl p-10 sm:p-16 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex justify-center text-yellow-400 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={24} className="mx-1" />)}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to accelerate your learning?</h2>
            <p className="text-slate-300 mb-10 text-lg max-w-2xl mx-auto">Create your free account today to start reading premium articles and registering for upcoming medical events.</p>
            <Link to="/register" className="inline-block px-8 py-4 rounded-xl bg-medical-500 text-white font-bold text-lg hover:bg-medical-400 transition-colors shadow-lg">
              Create Free Account
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}