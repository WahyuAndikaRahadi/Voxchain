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

  const statusMap: { [key: string]: string } = {
    '0': 'Terkirim',
    '1': 'Diverifikasi',
    '2': 'Diproses',
    '3': 'Ditindaklanjuti',
    '4': 'Selesai',
    '5': 'Ditolak'
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
      const readOnlyProvider = provider || new ethers.BrowserProvider((window as any).ethereum);
      const readOnlyContract = getContractReadOnly(readOnlyProvider);
      
      const fetchedComplaints: Complaint[] = [];
      
      for (let i = 0; i < 100; i++) {
        try {
          const complaint = await readOnlyContract.daftarPengaduan(i);
          
          if (complaint.pengirim !== "0x0000000000000000000000000000000000000000") {
            fetchedComplaints.push({
              id: complaint.id.toString(),
              deskripsi: complaint.deskripsi,
              pengirim: complaint.pengirim,
              timestamp: new Date(Number(complaint.timestamp) * 1000).toLocaleString(),
              status: statusMap[complaint.status.toString()] || `Status ${complaint.status.toString()}`
            });
          }
        } catch (e) {
          break;
        }
      }
      
      setComplaints(fetchedComplaints);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      setErrorMessage('Failed to load complaints. Please refresh the page.');
    }
  };

  // Check if user is owner
  const isOwner = walletAddress && contractOwner && walletAddress.toLowerCase() === contractOwner.toLowerCase();

  // Initialize
  useEffect(() => {
    fetchComplaints();
  }, []);

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