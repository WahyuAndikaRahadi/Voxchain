import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Github, Mail, Phone, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid untuk Logo/Deskripsi dan Kontak */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo dan Deskripsi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left" // Mengatur alignment
          >
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                VoxChain
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Platform pengaduan pemerintah berbasis blockchain yang mengutamakan transparansi, keamanan, dan akuntabilitas. 
              Membangun kepercayaan publik melalui teknologi terdesentralisasi.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start"> {/* Menengahkan ikon sosial */}
              <motion.a
                href="https://github.com/WahyuAndikaRahadi/"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://instagram.com/andika.rwahyu"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Kontak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start text-center md:text-left" // Mengatur alignment
          >
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 justify-center md:justify-start"> {/* Menengahkan item kontak */}
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">wahyundikarahadi19@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3 justify-center md:justify-start"> {/* Menengahkan item kontak */}
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">+62 838-1692-7804</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Kolom Kosong Tambahan untuk Rata Tengah */}
          {/* Kolom ini akan menjadi placeholder untuk memastikan konten utama berada di tengah pada layar lebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }} 
            viewport={{ once: true }}
            className="hidden md:block" // Sembunyikan pada ukuran layar kecil
          >
            {/* Konten di sini opsional, hanya untuk menjaga struktur grid */}
          </motion.div>
        </div>

        {/* Bagian Bawah */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0 text-center w-full md:w-auto"> {/* Menengahkan teks hak cipta */}
              © 2025 VoxChain Made By Wahyu Andika Rahadi.
            </div>
          </div>
        </motion.div>

        {/* Lencana Teknologi */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xs font-medium">
            <Shield className="h-3 w-3 mr-2" />
            Secured by Blockchain Technology
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;