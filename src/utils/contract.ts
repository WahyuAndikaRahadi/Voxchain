import { ethers } from 'ethers';

// Placeholder contract configuration - replace with your actual contract details
export const CONTRACT_ADDRESS = "0x7fEB209d6B8E5988d732ba31F496032859C38243" // Your contract address
export const CONTRACT_ABI =  [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "pengirim",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "judul",
          "type": "string"
        }
      ],
      "name": "PengaduanBaru",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "statusBaru",
          "type": "uint8"
        }
      ],
      "name": "StatusDiubah",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "tindakLanjut",
          "type": "string"
        }
      ],
      "name": "TindakLanjutDitambahkan",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_judul",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_deskripsi",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_kategori",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_lokasi",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_tanggalKejadian",
          "type": "uint256"
        }
      ],
      "name": "buatPengaduan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "daftarPengaduan",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "judul",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "deskripsi",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "kategori",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "lokasi",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "tanggalKejadian",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "pengirim",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestampPengiriman",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "tindakLanjutPemerintah",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllPengaduanIds",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getPengaduan",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "judul",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "deskripsi",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "kategori",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "lokasi",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "tanggalKejadian",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "pengirim",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestampPengiriman",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "tindakLanjutPemerintah",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalPengaduan",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_tindakLanjut",
          "type": "string"
        }
      ],
      "name": "tambahTindakLanjut",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "_statusBaru",
          "type": "uint8"
        }
      ],
      "name": "ubahStatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

export const getContract = (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const getContractReadOnly = (provider: ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};