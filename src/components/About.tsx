import React from 'react';
import { motion } from 'framer-motion';
import { Database, Lock, Eye, Zap } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Database,
      title: 'Penyimpanan Data yang Tak Terubah (Immutable)',
      description: 'Setiap pengaduan dicatat dalam blok yang terhubung secara kriptografis. Begitu data masuk ke blockchain, data tersebut tidak dapat diubah, dihapus, atau dimanipulasi oleh siapa pun, termasuk administrator sistem. Ini menjamin integritas historis setiap pengaduan.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Lock,
      title: 'Keamanan Tingkat Lanjut',
      description: 'Blockchain menggunakan mekanisme konsensus terdistribusi dan enkripsi canggih yang setara dengan standar keamanan militer. Hal ini membuat peretasan atau upaya pengubahan data menjadi sangat sulit dan mahal, sehingga data pengaduan Anda benar-benar aman.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Eye,
      title: 'Transparansi yang Dapat Diverifikasi Publik',
      description: 'Semua transaksi (pengaduan, pembaruan status) yang terjadi di blockchain dapat dilihat dan diverifikasi oleh siapa saja. Namun, identitas pribadi pelapor tetap terjaga karena menggunakan alamat dompet digital yang bersifat pseudonim, memberikan transparansi tanpa mengorbankan privasi.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Otomatisasi Proses dengan Smart Contract',
      description: 'Smart contract adalah program yang berjalan di blockchain dan mengeksekusi tindakan secara otomatis ketika kondisi tertentu terpenuhi. Ini memungkinkan alur kerja pengaduan (mulai dari penerimaan, verifikasi, hingga pembaruan status) berjalan tanpa campur tangan manusia yang bisa bias, memastikan proses yang adil dan efisien.',
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
            Teknologi blockchain menawarkan fondasi yang kuat untuk membangun sistem pengaduan pemerintah yang lebih dapat dipercaya, transparan, dan efisien, mengatasi banyak kelemahan sistem konvensional.
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
              Permasalahan dalam Sistem Pengaduan Tradisional
            </h3>
            <div className="space-y-4">
              {[
                'Data mudah dimanipulasi atau bahkan dihapus karena terpusat pada satu entitas.',
                'Proses penanganan yang seringkali tertutup, sehingga publik sulit memantau status dan perkembangannya.',
                'Rentan terhadap praktik korupsi, nepotisme, atau perlakuan tidak adil karena kurangnya pengawasan publik yang independen.',
                'Sulit untuk melakukan audit dan verifikasi independen terhadap seluruh proses penanganan pengaduan.',
                'Rendahnya tingkat kepercayaan masyarakat terhadap keadilan dan efektivitas sistem pengaduan yang ada.'
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
                  <p className="text-gray-600"><strong>{problem.split(' - ')[0]}</strong> {problem.split(' - ')[1] || ''}</p>
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
              Solusi yang Ditawarkan oleh VoxChain Berbasis Blockchain
            </h3>
            <div className="space-y-4">
              {[
                'Data yang Tidak Dapat Diubah (Immutable): Setiap pengaduan dan pembaruannya dicatat secara permanen di blockchain, tidak bisa diubah atau dihapus, memastikan keaslian dan integritas.',
                'Transparansi Penuh & Audit Trail: Seluruh riwayat pengaduan dapat dilihat dan diverifikasi publik. Sistem blockchain mencatat setiap langkah, menciptakan jejak audit yang lengkap dan terpercaya.',
                'Desentralisasi untuk Keandalan: Data tidak disimpan di satu server, melainkan didistribusi ke banyak komputer. Ini menghilangkan satu titik kegagalan (single point of failure) dan membuatnya tahan terhadap serangan atau manipulasi.',
                'Pelacakan Real-time & Efisiensi: Dengan smart contract, status pengaduan dapat diperbarui secara otomatis dan cepat. Pengguna dan publik dapat memantau progres secara langsung.',
                'Membangun Kepercayaan Publik: Dengan adanya transparansi, keamanan, dan akuntabilitas yang inheren pada blockchain, masyarakat dapat lebih yakin bahwa pengaduan mereka ditangani secara adil dan transparan.'
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
                  <p className="text-gray-600"><strong>{solution.split(': ')[0]}:</strong> {solution.split(': ')[1]}</p>
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