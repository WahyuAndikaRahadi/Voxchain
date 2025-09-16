import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Send, AlertCircle, CheckCircle, Clock, FileText, User, Calendar, Tag, MapPin, Sparkles, XCircle } from 'lucide-react';

// Perbarui interface props agar sesuai dengan App.tsx
interface ComplaintFormProps {
  provider: any;
  signer: any;
  walletAddress: string;
  status: string;
  connectWallet: () => void;
  // Perbarui props submitComplaint
  submitComplaint: (judul: string, deskripsi: string, kategori: string, lokasi: string, tanggalKejadian: number) => void;
  complaints: any[];
  isLoading: boolean;
  errorMessage: string;
  isOwner: boolean;
  // Perbarui props changeComplaintStatus
  changeComplaintStatus: (id: number, newStatus: number) => void;
  // Tambahkan props baru untuk tindak lanjut
  addGovernmentFollowUp: (id: number, tindakLanjut: string) => void;
  fetchComplaints: () => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({
  provider,
  signer,
  walletAddress,
  status,
  connectWallet,
  submitComplaint,
  complaints,
  isLoading,
  errorMessage,
  isOwner,
  changeComplaintStatus,
  addGovernmentFollowUp,
  fetchComplaints,
}) => {
  // State untuk form pengaduan baru
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [tanggal, setTanggal] = useState('');

  // State untuk panel admin
  const [selectedComplaintId, setSelectedComplaintId] = useState('');
  const [newStatus, setNewStatus] = useState('0');
  const [tindakLanjut, setTindakLanjut] = useState('');
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Status mapping konsisten dengan smart contract
  const statusMap = {
    '0': { label: 'Terkirim', color: 'bg-gray-100 text-gray-800', icon: Send },
    '1': { label: 'Diverifikasi', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    '2': { label: 'Diproses', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    '3': { label: 'Ditindaklanjuti', color: 'bg-purple-100 text-purple-800', icon: FileText },
    '4': { label: 'Selesai', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    '5': { label: 'Ditolak', color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  const handleSubmitComplaint = async () => {
    // Periksa validasi form
    if (!judul.trim() || !deskripsi.trim() || !kategori.trim() || !lokasi.trim() || !tanggal.trim()) {
      return;
    }

    // Konversi tanggal ke timestamp
    const timestamp = Math.floor(new Date(tanggal).getTime() / 1000);

    await submitComplaint(judul, deskripsi, kategori, lokasi, timestamp);
    
    // Reset form dan tampilkan modal sukses
    setJudul('');
    setDeskripsi('');
    setKategori('');
    setLokasi('');
    setTanggal('');
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
  };

  const handleStatusChange = async () => {
    if (selectedComplaintId && newStatus) {
      await changeComplaintStatus(Number(selectedComplaintId), Number(newStatus));
      setSelectedComplaintId('');
      setNewStatus('0');
    }
  };

  const handleTindakLanjut = async () => {
    if (selectedComplaintId && tindakLanjut.trim()) {
      await addGovernmentFollowUp(Number(selectedComplaintId), tindakLanjut);
      setSelectedComplaintId('');
      setTindakLanjut('');
    }
  };

  return (
    <section id="pengaduan" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Platform Pengaduan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sampaikan aspirasi dan keluhan Anda dengan sistem yang transparan dan aman
          </p>
        </motion.div>

        {/* Wallet Connection (tidak ada perubahan) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
            <div className="text-center mb-6">
              <Wallet className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Status Koneksi Wallet</h3>
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${status === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-semibold ${status === 'Connected' ? 'text-green-700' : 'text-red-700'}`}>
                  {status === 'Connected' ? 'Terhubung' : 'Tidak Terhubung'}
                </span>
              </div>
            </div>

            {walletAddress && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-white rounded-xl border border-gray-200"
              >
                <p className="text-sm text-gray-600 mb-1">Alamat Wallet:</p>
                <p className="font-mono text-sm text-gray-800 break-all">{walletAddress}</p>
              </motion.div>
            )}

            <motion.button
              onClick={connectWallet}
              disabled={status === 'Connected' || isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: status === 'Connected' ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Clock className="animate-spin h-5 w-5 mr-2" />
                  Menghubungkan...
                </span>
              ) : status === 'Connected' ? (
                <span className="flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Wallet Terhubung
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Hubungkan Wallet
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Complaint Form Baru */}
        {!isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Buat Pengaduan Baru</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Pengaduan
                  </label>
                  <input
                    type="text"
                    id="judul"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Contoh: Lampu jalan mati di Jalan Sudirman"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Pengaduan
                  </label>
                  <textarea
                    id="deskripsi"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    rows={4}
                    placeholder="Tulis detail pengaduan Anda di sini..."
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <input
                      type="text"
                      id="kategori"
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Contoh: Infrastruktur"
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      id="lokasi"
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Contoh: Jakarta Pusat"
                      value={lokasi}
                      onChange={(e) => setLokasi(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Kejadian
                    </label>
                    <input
                      type="date"
                      id="tanggal"
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                    />
                  </div>
                </div>

                <motion.button
                  onClick={handleSubmitComplaint}
                  disabled={isLoading || !signer || !judul || !deskripsi || !kategori || !lokasi || !tanggal}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Clock className="animate-spin h-5 w-5 mr-2" />
                      Mengirim...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Send className="h-5 w-5 mr-2" />
                      Kirim Pengaduan
                    </span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Owner Panel */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16 space-y-8"
          >
            {/* Panel Ubah Status */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200">
              <h3 className="text-2xl font-bold text-orange-900 mb-6 text-center">Panel Administrator</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="ID Pengaduan"
                  className="p-4 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={selectedComplaintId}
                  onChange={(e) => setSelectedComplaintId(e.target.value)}
                />
                <select
                  className="p-4 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {Object.entries(statusMap).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
                <motion.button
                  onClick={handleStatusChange}
                  disabled={isLoading || !selectedComplaintId}
                  className="px-6 py-4 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Ubah Status
                </motion.button>
              </div>
            </div>

            {/* Panel Tindak Lanjut */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200">
              <h3 className="text-2xl font-bold text-purple-900 mb-6 text-center">Tambah Tindak Lanjut Pemerintah</h3>
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="ID Pengaduan"
                  className="w-full p-4 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={selectedComplaintId}
                  onChange={(e) => setSelectedComplaintId(e.target.value)}
                />
                <textarea
                  placeholder="Deskripsi tindak lanjut dari pemerintah"
                  className="w-full p-4 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  value={tindakLanjut}
                  onChange={(e) => setTindakLanjut(e.target.value)}
                />
                <motion.button
                  onClick={handleTindakLanjut}
                  disabled={isLoading || !selectedComplaintId || !tindakLanjut}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Tambah Tindak Lanjut
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Complaints List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Daftar Pengaduan Publik</h3>
          
          {complaints.length > 0 ? (
            <div className="grid gap-6">
              {complaints.map((complaint: any, index: number) => {
                const statusInfo = statusMap[complaint.status] || { 
                  label: `Status ${complaint.status}`, 
                  color: 'bg-gray-100 text-gray-800', 
                  icon: AlertCircle 
                };
                const StatusIcon = statusInfo.icon;
                
                return (
                  <motion.div
                    key={complaint.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center space-x-3 mb-2 md:mb-0">
                        <span className="font-mono text-sm text-gray-600">ID: {complaint.id}</span>
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-2">{complaint.judul}</h4>
                    <p className="text-gray-900 font-medium mb-4 leading-relaxed">{complaint.deskripsi}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span className="font-mono text-xs">{complaint.pengirim.slice(0, 6)}...{complaint.pengirim.slice(-4)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4" />
                        <span>{complaint.kategori}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{complaint.lokasi}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{complaint.tanggalKejadian}</span>
                      </div>
                    </div>

                    {complaint.tindakLanjutPemerintah && (
                      <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mt-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                          <h5 className="font-semibold text-blue-800">Tindak Lanjut Pemerintah:</h5>
                        </div>
                        <p className="text-gray-700 italic">{complaint.tindakLanjutPemerintah}</p>
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Pengaduan dibuat pada: {complaint.timestampPengiriman}</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>Live dari Blockchain</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada pengaduan yang tercatat</p>
              <p className="text-gray-400 text-sm mt-2">Pengaduan pertama akan muncul di sini</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Success Modal (tidak ada perubahan) */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
            >
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pengaduan Berhasil Dikirim!</h3>
              <p className="text-gray-600">Pengaduan Anda telah tercatat di blockchain dan akan diproses sesuai prosedur.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ComplaintForm;