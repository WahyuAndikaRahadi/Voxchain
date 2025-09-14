import { ethers } from 'ethers';

// Placeholder contract configuration - replace with your actual contract details
export const CONTRACT_ADDRESS = "0x..."; // Your contract address
export const CONTRACT_ABI = [
  // Basic contract functions
  {
    "inputs": [{"name": "description", "type": "string"}],
    "name": "buatPengaduan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "id", "type": "uint256"}, {"name": "newStatus", "type": "uint8"}],
    "name": "ubahStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "daftarPengaduan",
    "outputs": [
      {"name": "id", "type": "uint256"},
      {"name": "deskripsi", "type": "string"},
      {"name": "pengirim", "type": "address"},
      {"name": "timestamp", "type": "uint256"},
      {"name": "status", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Events for real-time updates
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "id", "type": "uint256"},
      {"indexed": true, "name": "pengirim", "type": "address"},
      {"indexed": false, "name": "deskripsi", "type": "string"},
      {"indexed": false, "name": "timestamp", "type": "uint256"}
    ],
    "name": "PengaduanBaru",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "id", "type": "uint256"},
      {"indexed": false, "name": "statusBaru", "type": "uint8"}
    ],
    "name": "StatusDiubah",
    "type": "event"
  }
];

export const getContract = (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const getContractReadOnly = (provider: ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};