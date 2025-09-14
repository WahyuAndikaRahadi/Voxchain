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

interface Complaint {
  id: string;
  deskripsi: string;
  pengirim: string;
  timestamp: string;
  status: string;
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

  // Refs for scrolling
  const sectionRefs = {
    beranda: useRef<HTMLDivElement>(null),
    tentang: useRef<HTMLDivElement>(null),
    fitur: useRef<HTMLDivElement>(null),
    pengaduan: useRef<HTMLDivElement>(null),
  };

  // Status mapping consistent with blockchain contract
  const statusMap: { [key: string]: string } = {
    '0': 'Terkirim',          // Sent
    '1': 'Diverifikasi',      // Verified
    '2': 'Diproses',          // Processing
    '3': 'Ditindaklanjuti',   // Under Action
    '4': 'Selesai',           // Completed
    '5': 'Ditolak'            // Rejected
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
  const submitComplaint = async (description: string) => {
    if (!signer) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Complaint description cannot be empty.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const contract = getContract(signer);
      const tx = await contract.buatPengaduan(description);
      await tx.wait();
      
      fetchComplaints();
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      setErrorMessage('Failed to submit complaint. Please ensure you have sufficient balance.');
    } finally {
      setIsLoading(false);
    }
  };

  // Change complaint status (Owner only)
  const changeComplaintStatus = async (complaintId: string, newStatus: string) => {
    if (!signer) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }

    if (!complaintId) {
      setErrorMessage('Please enter complaint ID.');
      return;
    }

    if (walletAddress.toLowerCase() !== contractOwner.toLowerCase()) {
      setErrorMessage('You are not the contract owner.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const contract = getContract(signer);
      const tx = await contract.ubahStatus(complaintId, parseInt(newStatus, 10));
      await tx.wait();
      
      fetchComplaints();
    } catch (error) {
      console.error('Failed to change status:', error);
      setErrorMessage('Failed to change status. Please ensure the complaint ID is correct and you are the owner.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      // Use existing provider or create new one for read operations
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
      
      // Fetch complaints with better error handling
      for (let i = 0; i < 100; i++) {
        try {
          const complaint = await readOnlyContract.daftarPengaduan(i);
          
          // Check if complaint exists (non-zero address indicates valid complaint)
          if (complaint.pengirim !== "0x0000000000000000000000000000000000000000") {
            fetchedComplaints.push({
              id: complaint.id.toString(),
              deskripsi: complaint.deskripsi,
              pengirim: complaint.pengirim,
              timestamp: new Date(Number(complaint.timestamp) * 1000).toLocaleString(),
              // Ensure proper status mapping with fallback
              status: complaint.status.toString()
            });
          }
        } catch (error) {
          // Break loop when we reach non-existent complaints
          break;
        }
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
        
        // Listen for new complaints
        const complaintFilter = contract.filters.PengaduanBaru?.();
        if (complaintFilter) {
          contract.on(complaintFilter, (id, pengirim, deskripsi, timestamp) => {
            console.log('New complaint detected:', { id, pengirim, deskripsi, timestamp });
            fetchComplaints(); // Refresh complaints list
          });
        }
        
        // Listen for status changes
        const statusFilter = contract.filters.StatusDiubah?.();
        if (statusFilter) {
          contract.on(statusFilter, (id, statusBaru) => {
            console.log('Status change detected:', { id, statusBaru });
            fetchComplaints(); // Refresh complaints list
          });
        }
        
        // Fallback: Poll for updates every 10 seconds
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
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  // Check if user is owner
  const isOwner = walletAddress && contractOwner && walletAddress.toLowerCase() === contractOwner.toLowerCase();

  // Initialize
  useEffect(() => {
    fetchComplaintsWithRetry();
  }, []);

  // Refresh complaints when wallet connects
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
        />
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default App;