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

  // Refs for scrolling (tidak berubah)
  const sectionRefs = {
    beranda: useRef<HTMLDivElement>(null),
    tentang: useRef<HTMLDivElement>(null),
    fitur: useRef<HTMLDivElement>(null),
    pengaduan: useRef<HTMLDivElement>(null),
  };

  // Status mapping konsisten dengan smart contract
  const statusMap: { [key: string]: string } = {
    '0': 'Terkirim',
    '1': 'Diverifikasi',
    '2': 'Diproses',
    '3': 'Selesai',
  };

  // Scroll to section function (tidak berubah)
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

  // Connect wallet (tidak berubah)
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
  // Mengubah parameter agar sesuai dengan fungsi buatPengaduan di smart contract
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

  // Change complaint status (Owner only)
  // Menggunakan tipe number untuk ID dan status sesuai dengan solidity
  const changeComplaintStatus = async (complaintId: number, newStatus: number) => {
    if (!signer) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }

    if (walletAddress.toLowerCase() !== contractOwner.toLowerCase()) {
      setErrorMessage('Anda bukan pemilik kontrak.');
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

  // Add government follow-up (Owner only)
  // Fungsi baru untuk menambahkan tindak lanjut
  const addGovernmentFollowUp = async (complaintId: number, tindakLanjut: string) => {
    if (!signer || !tindakLanjut.trim()) {
      setErrorMessage('Mohon hubungkan wallet dan isi deskripsi tindak lanjut.');
      return;
    }

    if (walletAddress.toLowerCase() !== contractOwner.toLowerCase()) {
      setErrorMessage('Anda bukan pemilik kontrak.');
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
        });
      }
      
      setComplaints(fetchedComplaints);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      setErrorMessage('Gagal memuat pengaduan. Silakan refresh halaman.');
    }
  };

  // Set up blockchain event listeners for real-time updates (tidak berubah)
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

  // Enhanced fetch with retry mechanism (tidak berubah)
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

  // Check if user is owner (tidak berubah)
  const isOwner = walletAddress && contractOwner && walletAddress.toLowerCase() === contractOwner.toLowerCase();

  // Initialize and refresh on status change
  useEffect(() => {
    fetchComplaintsWithRetry();
  }, []);

  useEffect(() => {
    if (status === 'Connected') {
      fetchComplaintsWithRetry();
    }
  }, [status]);

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
          changeComplaintStatus={changeComplaintStatus}
          addGovernmentFollowUp={addGovernmentFollowUp}
          fetchComplaints={fetchComplaints}
        />
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default App;