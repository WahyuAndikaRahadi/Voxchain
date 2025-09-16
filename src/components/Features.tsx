import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Sparkles, Shield } from 'lucide-react';

const Features: React.FC = () => {
  const processSteps = [
    {
      number: '01',
      title: 'Buat Pengaduan',
      description: 'Sampaikan keluhan Anda secara anonim atau terverifikasi. Setiap pengaduan dicatat secara permanen di blockchain.',
      icon: FileText
    },
    {
      number: '02',
      title: 'Verifikasi & Tindak Lanjut',
      description: 'Pemerintah memverifikasi keabsahan pengaduan dan menambahkan deskripsi tindak lanjut secara on-chain.',
      icon: Users
    },
    {
      number: '03',
      title: 'Perbarui Status',
      description: 'Pemerintah dapat mengubah status pengaduan menjadi "Diproses", "Selesai", atau "Ditolak" untuk melacak perkembangannya.',
      icon: Sparkles
    },
    {
      number: '04',
      title: 'Transparansi Penuh',
      description: 'Setiap tahapan dan riwayat pengaduan, termasuk tindak lanjut, dapat diaudit dan dilihat oleh publik secara transparan.',
      icon: Shield
    }
  ];

  return (
    <section id="fitur" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cara Kerja VoxChain
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Proses pengaduan yang sederhana namun didukung teknologi blockchain yang canggih
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step Number Circle */}
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-6 relative z-10"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {step.number}
                </motion.div>
                
                {/* Content */}
                <motion.div
                  className="text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="inline-flex p-3 bg-blue-50 rounded-xl mb-4">
                    <step.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
                
                {/* Arrow for desktop */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-8 w-16 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-purple-300 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Manfaat untuk Semua Stakeholder
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-blue-50 rounded-2xl"
            >
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Untuk Masyarakat</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>✓ Kepastian pengaduan tersampaikan</li>
                <li>✓ Transparansi penuh proses</li>
                <li>✓ Perlindungan data pribadi</li>
                <li>✓ Akses 24/7</li>
              </ul>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-purple-50 rounded-2xl"
            >
              <h4 className="text-lg font-semibold text-purple-900 mb-3">Untuk Pemerintah</h4>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>✓ Meningkatkan kepercayaan publik</li>
                <li>✓ Efisiensi operasional</li>
                <li>✓ Audit trail yang lengkap</li>
                <li>✓ Analitik data yang akurat</li>
              </ul>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-green-50 rounded-2xl"
            >
              <h4 className="text-lg font-semibold text-green-900 mb-3">Untuk Demokrasi</h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li>✓ Akuntabilitas yang lebih baik</li>
                <li>✓ Partisipasi masyarakat aktif</li>
                <li>✓ Tata kelola yang transparan</li>
                <li>✓ Demokrasi yang lebih sehat</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;