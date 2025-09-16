import React from 'react';
import { motion } from 'framer-motion';
import { Database, Lock, Eye, Zap } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Database,
      title: 'Data yang Tak Terubah (Immutable)',
      description: 'Setiap pengaduan dicatat secara permanen di blockchain. Begitu data terkirim, tidak ada pihak yang bisa mengubah, menghapus, atau memanipulasinya. Ini menjamin integritas dan keaslian setiap pengaduan.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Lock,
      title: 'Keamanan Mutlak',
      description: 'Blockchain menggunakan enkripsi canggih dan mekanisme konsensus terdistribusi yang membuat data sangat sulit diretas. Pengaduan Anda aman dari serangan siber dan perubahan yang tidak sah.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Eye,
      title: 'Transparansi Penuh',
      description: 'Semua riwayat pengaduan dan pembaruan status dapat dilihat oleh publik. Identitas Anda tetap terjaga dengan alamat dompet anonim, menciptakan transparansi tanpa mengorbankan privasi.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Otomatisasi & Efisiensi',
      description: 'Smart contract menjalankan aturan pengaduan secara otomatis dan tanpa bias. Proses mulai dari penerimaan hingga pembaruan status berjalan efisien dan adil, mengurangi campur tangan manual.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="tentang" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Blockchain untuk Pengaduan?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Blockchain menawarkan fondasi yang kuat untuk sistem pengaduan pemerintah yang lebih dapat dipercaya, transparan, dan efisien.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Permasalahan Sistem Tradisional
            </h3>
            <div className="space-y-4">
              {[
                'Data terpusat dan rentan dimanipulasi atau dihapus.',
                'Proses tertutup, sulit dimonitor oleh publik.',
                'Rentan terhadap korupsi dan perlakuan tidak adil.',
                'Sulitnya melakukan audit dan verifikasi independen.',
                'Rendahnya kepercayaan masyarakat terhadap sistem yang ada.'
              ].map((problem, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">{problem}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Solusi VoxChain Berbasis Blockchain
            </h3>
            <div className="space-y-4">
              {[
                'Data Tidak Dapat Diubah: Pengaduan dicatat permanen, tidak bisa dimanipulasi.',
                'Transparansi Penuh: Seluruh riwayat pengaduan dapat dilihat publik.',
                'Desentralisasi: Menghilangkan satu titik kegagalan dan tahan serangan.',
                'Pelacakan Real-time: Smart contract memastikan proses berjalan efisien.',
                'Membangun Kepercayaan: Akuntabilitas dan transparansi meningkatkan kepercayaan masyarakat.'
              ].map((solution, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">{solution}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative p-6 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`}></div>
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;