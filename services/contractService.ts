import {
  createPublicClient,
  formatEther,
  http,
  type Address,
  type PublicClient,
  type WalletClient,
} from "viem";
import { arbitrum, mainnet, polygon } from "viem/chains";

// CoPass Smart Contract ABI
export const COPASS_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "counterparty",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "createSharedBooking",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bookingId",
        type: "uint256",
      },
    ],
    name: "acceptBooking",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bookingId",
        type: "uint256",
      },
    ],
    name: "cancelBooking",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bookingId",
        type: "uint256",
      },
    ],
    name: "getBooking",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "address",
            name: "counterparty",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "enum CoPass.SharedBookingStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
        ],
        internalType: "struct CoPass.SharedBooking",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserBookings",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export interface SharedBooking {
  id: number;
  creator: string;
  counterparty: string;
  amount: string;
  description: string;
  status: "pending" | "accepted" | "cancelled" | "completed";
  createdAt: number;
}

export interface BookingRequest {
  counterparty: string;
  amount: string;
  description: string;
}

class ContractService {
  private publicClient: PublicClient;
  private walletClient: WalletClient | null = null;

  // CoPass smart contract addresses (deploy these contracts first)
  private readonly COPASS_CONTRACT_ADDRESSES: Record<number, string> = {
    [mainnet.id]: "0x...", // Deploy on mainnet
    [polygon.id]: "0x...", // Deploy on Polygon
    [arbitrum.id]: "0x...", // Deploy on Arbitrum
  };

  constructor() {
    this.publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });
  }

  setWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  updateChain(chainId: number) {
    const chain =
      [mainnet, polygon, arbitrum].find((c) => c.id === chainId) || mainnet;
    this.publicClient = createPublicClient({
      chain,
      transport: http(),
    });
  }

  async createSharedBooking(
    counterparty: string,
    amount: string,
    description: string
  ): Promise<number> {
    try {
      if (!this.walletClient) {
        throw new Error("No wallet connected");
      }

      const contractAddress = this.getContractAddress();

      // In a real implementation, you'd use the wallet client to write to contract
      console.log(
        `Creating shared booking: ${counterparty}, ${amount}, ${description}`
      );

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return Date.now(); // For demo purposes
    } catch (error) {
      console.error("Create shared booking error:", error);
      throw new Error("Failed to create shared booking");
    }
  }

  async acceptBooking(bookingId: number): Promise<void> {
    try {
      if (!this.walletClient) {
        throw new Error("No wallet connected");
      }

      const contractAddress = this.getContractAddress();

      // In a real implementation, you'd use the wallet client to write to contract
      console.log(`Accepting booking: ${bookingId}`);

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Accept booking error:", error);
      throw new Error("Failed to accept booking");
    }
  }

  async cancelBooking(bookingId: number): Promise<void> {
    try {
      if (!this.walletClient) {
        throw new Error("No wallet connected");
      }

      const contractAddress = this.getContractAddress();

      // In a real implementation, you'd use the wallet client to write to contract
      console.log(`Cancelling booking: ${bookingId}`);

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Cancel booking error:", error);
      throw new Error("Failed to cancel booking");
    }
  }

  async getBooking(bookingId: number): Promise<SharedBooking | null> {
    try {
      const contractAddress = this.getContractAddress();

      // In a real implementation, you'd read from the contract
      // For now, we'll return mock data
      return {
        id: bookingId,
        creator: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        counterparty: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        amount: "0.1",
        description: "Hotel booking for Token2049",
        status: "pending",
        createdAt: Date.now(),
      };
    } catch (error) {
      console.error("Get booking error:", error);
      throw new Error("Failed to get booking");
    }
  }

  async getUserBookings(userAddress: string): Promise<SharedBooking[]> {
    try {
      const contractAddress = this.getContractAddress();

      // In a real implementation, you'd read from the contract
      // For now, we'll return mock data
      return [
        {
          id: 1,
          creator: userAddress,
          counterparty: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
          amount: "0.1",
          description: "Hotel booking for Token2049",
          status: "pending",
          createdAt: Date.now(),
        },
        {
          id: 2,
          creator: userAddress,
          counterparty: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
          amount: "0.05",
          description: "Airport transfer",
          status: "completed",
          createdAt: Date.now() - 86400000, // 1 day ago
        },
      ];
    } catch (error) {
      console.error("Get user bookings error:", error);
      throw new Error("Failed to get user bookings");
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.publicClient.getBalance({
        address: address as Address,
      });

      return formatEther(balance);
    } catch (error) {
      console.error("Get balance error:", error);
      throw new Error("Failed to get balance");
    }
  }

  private getContractAddress(): string {
    // For now, return a placeholder
    // In a real implementation, you'd get this based on the current chain
    return "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
  }

  // Get supported chains
  getSupportedChains() {
    return [mainnet, polygon, arbitrum];
  }
}

export const contractService = new ContractService();
