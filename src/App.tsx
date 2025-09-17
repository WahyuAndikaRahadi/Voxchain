import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { getContract, getContractReadOnly } from './utils/contract';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import ComplaintForm from './components/ComplaintForm';
import Footer from './components/Footer';

// Definisikan ulang interface Complaint agar sesuai dengan struct Solidity
interface Complaint {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  lokasi: string;
  tanggalKejadian: string;
  pengirim: string;
  timestampPengiriman: string;
  status: string;
  tindakLanjutPemerintah: string;
  upvoteCount: number;
}

// Interface baru untuk Komentar
interface Comment {
  pengirim: string;
  isi: string;
  timestamp: string;
}

const App: React.FC = () => {
  // Blockchain state
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState('Disconnected');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [contractOwner, setContractOwner] = useState('');
  
  // State baru untuk komentar
  const [comments, setComments] = useState<Comment[]>([]);

  // State baru untuk admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Refs for scrolling
  const sectionRefs = {
    beranda: useRef<HTMLDivElement>(null),
    tentang: useRef<HTMLDivElement>(null),
    fitur: useRef<HTMLDivElement>(null),
    pengaduan: useRef<HTMLDivElement>(null),
  };



  // Scroll to section function
  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch contract owner
  const fetchContractOwner = async (providerInstance: ethers.BrowserProvider) => {
    try {
      const contract = getContractReadOnly(providerInstance);
      const ownerAddress = await contract.owner();
      setContractOwner(ownerAddress);
    } catch (error) {
      console.error('Failed to fetch contract owner:', error);
    }
  };

  // Check if connected wallet is an admin
  const checkIfAdmin = async (providerInstance: ethers.BrowserProvider, address: string) => {
    try {
      const contract = getContractReadOnly(providerInstance);
      const isAdminAddress = await contract.admins(address);
      setIsAdmin(isAdminAddress);
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdmin(false);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        setIsLoading(true);
        setErrorMessage('');
        
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        
        const providerInstance = new ethers.BrowserProvider((window as any).ethereum);
        setProvider(providerInstance);
        
        const signerInstance = await providerInstance.getSigner();
        setSigner(signerInstance);
        
        const address = await signerInstance.getAddress();
        setWalletAddress(address);
        setStatus('Connected');
        
        fetchContractOwner(providerInstance);
        checkIfAdmin(providerInstance, address);
      } else {
        setErrorMessage('Please install MetaMask or another Ethereum wallet.');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setErrorMessage('Failed to connect wallet. Please try again.');
      setStatus('Disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit complaint
  const submitComplaint = async (judul: string, deskripsi: string, kategori: string, lokasi: string, tanggalKejadian: number) => {
    if (!signer) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }

    if (!judul.trim() || !deskripsi.trim() || !kategori.trim() || !lokasi.trim() || !tanggalKejadian) {
      setErrorMessage('Semua field pengaduan harus diisi.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const contract = getContract(signer);
      const tx = await contract.buatPengaduan(judul, deskripsi, kategori, lokasi, tanggalKejadian);
      await tx.wait();
      
      fetchComplaints();
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      setErrorMessage('Gagal mengirim pengaduan. Pastikan Anda memiliki saldo yang cukup.');
    } finally {
      setIsLoading(false);
    }
  };

  // Change complaint status (Owner or Admin)
  const changeComplaintStatus = async (complaintId: number, newStatus: number) => {
    if (!signer) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }

    if (!isOwner && !isAdmin) {
      setErrorMessage('Anda tidak memiliki hak akses.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const contract = getContract(signer);
      const tx = await contract.ubahStatus(complaintId, newStatus);
      await tx.wait();
      
      fetchComplaints();
    } catch (error) {
      console.error('Failed to change status:', error);
      setErrorMessage('Gagal mengubah status. Pastikan ID pengaduan benar.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add government follow-up (Owner or Admin)
  const addGovernmentFollowUp = async (complaintId: number, tindakLanjut: string) => {
    if (!signer || !tindakLanjut.trim()) {
      setErrorMessage('Mohon hubungkan wallet dan isi deskripsi tindak lanjut.');
      return;
    }

    if (!isOwner && !isAdmin) {
      setErrorMessage('Anda tidak memiliki hak akses.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const contract = getContract(signer);
      const tx = await contract.tambahTindakLanjut(complaintId, tindakLanjut);
      await tx.wait();

      fetchComplaints();
    } catch (error) {
      console.error('Failed to add follow-up:', error);
      setErrorMessage('Gagal menambahkan tindak lanjut.');
    } finally {
      setIsLoading(false);
    }
  };

  // Upvote complaint function
  const upvoteComplaint = async (complaintId: number) => {
    if (!signer) {
      setErrorMessage('Mohon hubungkan wallet Anda terlebih dahulu.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const contract = getContract(signer);
      const tx = await contract.upvotePengaduan(complaintId);
      await tx.wait();

      fetchComplaints();
    } catch (error) {
      console.error('Failed to upvote complaint:', error);
      setErrorMessage('Gagal memberikan upvote. Pastikan Anda belum pernah upvote pengaduan ini.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a comment
  const addComment = async (complaintId: number, comment: string) => {
    if (!signer || !comment.trim()) {
      setErrorMessage('Mohon hubungkan wallet dan isi komentar.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const contract = getContract(signer);
      const tx = await contract.tambahKomentar(complaintId, comment);
      await tx.wait();
      
      await fetchComments(complaintId);
    } catch (error) {
      console.error('Failed to add comment:', error);
      setErrorMessage('Gagal menambahkan komentar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch comments for a specific complaint
  const fetchComments = async (complaintId: number) => {
    try {
      let readOnlyProvider = provider;
      if (!readOnlyProvider && typeof window !== 'undefined' && (window as any).ethereum) {
        readOnlyProvider = new ethers.BrowserProvider((window as any).ethereum);
      }
      
      if (!readOnlyProvider) {
        console.warn('No provider available for fetching comments');
        return;
      }

      const readOnlyContract = getContractReadOnly(readOnlyProvider);
      const fetchedComments = await readOnlyContract.getKomentarPengaduan(complaintId);
      
      const formattedComments = fetchedComments.map((comment: any) => ({
        pengirim: comment.pengirim,
        isi: comment.isi,
        timestamp: new Date(Number(comment.timestamp) * 1000).toLocaleString(),
      }));
      setComments(formattedComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setErrorMessage('Gagal memuat komentar. Silakan coba lagi.');
    }
  };

  // Function to add a new admin (Owner only)
  const addAdmin = async (adminAddress: string) => {
    if (!signer) {
      setErrorMessage('Mohon hubungkan wallet Anda terlebih dahulu.');
      return;
    }
    if (walletAddress.toLowerCase() !== contractOwner.toLowerCase()) {
      setErrorMessage('Hanya pemilik kontrak yang dapat menambahkan admin.');
      return;
    }
    try {
      setIsLoading(true);
      const contract = getContract(signer);
      const tx = await contract.addAdmin(adminAddress);
      await tx.wait();
      setErrorMessage('Admin berhasil ditambahkan!');
    } catch (error) {
      console.error('Failed to add admin:', error);
      setErrorMessage('Gagal menambahkan admin. Pastikan alamat valid dan belum menjadi admin.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to remove an admin (Owner only)
  const removeAdmin = async (adminAddress: string) => {
    if (!signer) {
      setErrorMessage('Mohon hubungkan wallet Anda terlebih dahulu.');
      return;
    }
    if (walletAddress.toLowerCase() !== contractOwner.toLowerCase()) {
      setErrorMessage('Hanya pemilik kontrak yang dapat menghapus admin.');
      return;
    }
    try {
      setIsLoading(true);
      const contract = getContract(signer);
      const tx = await contract.removeAdmin(adminAddress);
      await tx.wait();
      setErrorMessage('Admin berhasil dihapus!');
    } catch (error) {
      console.error('Failed to remove admin:', error);
      setErrorMessage('Gagal menghapus admin. Pastikan alamat valid dan merupakan admin.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to cancel a complaint
  const cancelComplaint = async (complaintId: number) => {
    if (!signer) {
      setErrorMessage('Mohon hubungkan wallet Anda terlebih dahulu.');
      return;
    }
    try {
      setIsLoading(true);
      const contract = getContract(signer);
      const tx = await contract.batalkanPengaduan(complaintId);
      await tx.wait();
      setErrorMessage('Pengaduan berhasil dibatalkan!');
      fetchComplaints();
    } catch (error) {
      console.error('Failed to cancel complaint:', error);
      setErrorMessage('Gagal membatalkan pengaduan. Hanya pengirim asli yang bisa membatalkannya dan status harus Terkirim.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      let readOnlyProvider = provider;
      if (!readOnlyProvider && typeof window !== 'undefined' && (window as any).ethereum) {
        readOnlyProvider = new ethers.BrowserProvider((window as any).ethereum);
      }
      
      if (!readOnlyProvider) {
        console.warn('No provider available for fetching complaints');
        return;
      }
      
      const readOnlyContract = getContractReadOnly(readOnlyProvider);
      
      const fetchedComplaints: Complaint[] = [];
      const totalPengaduan = await readOnlyContract.getTotalPengaduan();

      for (let i = 1; i <= Number(totalPengaduan); i++) {
        const complaint = await readOnlyContract.getPengaduan(i);
        
        fetchedComplaints.push({
          id: complaint.id.toString(),
          judul: complaint.judul,
          deskripsi: complaint.deskripsi,
          kategori: complaint.kategori,
          lokasi: complaint.lokasi,
          tanggalKejadian: new Date(Number(complaint.tanggalKejadian) * 1000).toLocaleString(),
          pengirim: complaint.pengirim,
          timestampPengiriman: new Date(Number(complaint.timestampPengiriman) * 1000).toLocaleString(),
          status: complaint.status.toString(),
          tindakLanjutPemerintah: complaint.tindakLanjutPemerintah,
          upvoteCount: Number(complaint.upvoteCount)
        });
      }
      
      setComplaints(fetchedComplaints);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      setErrorMessage('Gagal memuat pengaduan. Silakan refresh halaman.');
    }
  };

  // Set up blockchain event listeners for real-time updates
  useEffect(() => {
    if (!provider) return;

    const setupEventListeners = async () => {
      try {
        const contract = getContractReadOnly(provider);
        
        contract.on('PengaduanBaru', () => {
          fetchComplaints();
        });
        
        contract.on('StatusDiubah', () => {
          fetchComplaints();
        });

        contract.on('TindakLanjutDitambahkan', () => {
          fetchComplaints();
        });

        contract.on('UpvoteDitambahkan', () => {
          fetchComplaints();
        });

        // Event listener baru untuk komentar
        contract.on('KomentarDitambahkan', (complaintId: any) => {
          fetchComments(Number(complaintId));
        });
        
        // Event listener baru untuk admin
        contract.on('AdminDitambahkan', () => {
          if (provider && walletAddress) {
            checkIfAdmin(provider, walletAddress);
          }
        });
        
        contract.on('AdminDihapus', () => {
          if (provider && walletAddress) {
            checkIfAdmin(provider, walletAddress);
          }
        });
        
        // Event listener baru untuk pembatalan
        contract.on('PengaduanDibatalkan', () => {
            fetchComplaints();
        });

        const pollInterval = setInterval(() => {
          fetchComplaints();
        }, 10000);
        
        return () => {
          contract.removeAllListeners();
          clearInterval(pollInterval);
        };
      } catch (error) {
        console.error('Failed to setup event listeners:', error);
      }
    };

    const cleanup = setupEventListeners();
    
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [provider]);

  // Enhanced fetch with retry mechanism
  const fetchComplaintsWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        await fetchComplaints();
        break;
      } catch (error) {
        console.error(`Fetch attempt ${i + 1} failed:`, error);
        if (i === retries - 1) {
          setErrorMessage('Gagal memuat pengaduan setelah beberapa percobaan. Silakan refresh halaman.');
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  // Check if user is owner
  const isOwner = walletAddress && contractOwner && walletAddress.toLowerCase() === contractOwner.toLowerCase();
  
  // Initialize and refresh on status change
  useEffect(() => {
    fetchComplaintsWithRetry();
  }, []);

  useEffect(() => {
    if (status === 'Connected') {
      fetchComplaintsWithRetry();
      if (provider && walletAddress) {
        checkIfAdmin(provider, walletAddress);
      }
    }
  }, [status, provider, walletAddress]);

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header scrollToSection={scrollToSection} />
      
      <main>
        <Hero scrollToSection={scrollToSection} />
        <About />
        <Features />
        <ComplaintForm
          provider={provider}
          signer={signer}
          walletAddress={walletAddress}
          status={status}
          connectWallet={connectWallet}
          submitComplaint={submitComplaint}
          complaints={complaints}
          isLoading={isLoading}
          errorMessage={errorMessage}
          isOwner={isOwner}
          isAdmin={isAdmin}
          changeComplaintStatus={changeComplaintStatus}
          addGovernmentFollowUp={addGovernmentFollowUp}
          upvoteComplaint={upvoteComplaint}
          fetchComplaints={fetchComplaints}
          comments={comments}
          fetchComments={fetchComments}
          addComment={addComment}
          addAdmin={addAdmin}
          removeAdmin={removeAdmin}
          // Tambahkan prop baru
          cancelComplaint={cancelComplaint}
        />
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default App;