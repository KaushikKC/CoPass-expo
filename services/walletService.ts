import AsyncStorage from "@react-native-async-storage/async-storage";

export interface WalletConnection {
  address: string;
  chainId: number;
  provider: string;
  walletType: "metamask" | "walletconnect" | "coinbase" | "other";
}

export interface SharedBooking {
  id: number;
  creator: string;
  counterparty: string;
  amount: string;
  description: string;
  status: "pending" | "accepted" | "cancelled" | "completed";
  createdAt: number;
}

class WalletService {
  private currentConnection: WalletConnection | null = null;

  async connectWallet(
    walletType: "metamask" | "walletconnect" | "coinbase"
  ): Promise<WalletConnection> {
    try {
      // For React Native, we'll use deep linking to open wallet apps
      // This is a simplified approach that works with React Native

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, generate a mock address
      const address = "0x" + Math.random().toString(16).substr(2, 40);
      const chainId = 1; // Ethereum mainnet

      const connection: WalletConnection = {
        address,
        chainId,
        provider:
          walletType === "metamask"
            ? "MetaMask"
            : walletType === "coinbase"
            ? "Coinbase Wallet"
            : "WalletConnect",
        walletType,
      };

      // Save to storage
      await this.saveWalletConnection(connection);
      this.currentConnection = connection;

      return connection;
    } catch (error) {
      console.error("Wallet connection error:", error);
      throw new Error("Failed to connect wallet");
    }
  }

  async disconnectWallet(): Promise<void> {
    try {
      await this.clearWalletConnection();
      this.currentConnection = null;
    } catch (error) {
      console.error("Wallet disconnection error:", error);
      throw new Error("Failed to disconnect wallet");
    }
  }

  async getConnectedWallet(): Promise<WalletConnection | null> {
    try {
      if (this.currentConnection) {
        return this.currentConnection;
      }

      const connectionData = await AsyncStorage.getItem("walletConnection");
      if (!connectionData) return null;

      const connection = JSON.parse(connectionData);
      this.currentConnection = connection;
      return connection;
    } catch (error) {
      console.error("Get connected wallet error:", error);
      return null;
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      if (!this.currentConnection) {
        throw new Error("No wallet connected");
      }

      // In a real implementation, you'd use the wallet's sign method
      // For now, we'll simulate it
      const signature = "0x" + Math.random().toString(16).substr(2, 64);
      return signature;
    } catch (error) {
      console.error("Sign message error:", error);
      throw new Error("Failed to sign message");
    }
  }

  async getBalance(address?: string): Promise<string> {
    try {
      if (!this.currentConnection) {
        throw new Error("No wallet connected");
      }

      // In a real implementation, you'd fetch from an RPC endpoint
      // For now, we'll return a mock balance
      return "0.1234";
    } catch (error) {
      console.error("Get balance error:", error);
      throw new Error("Failed to get balance");
    }
  }

  async sendTransaction(to: string, amount: string): Promise<string> {
    try {
      if (!this.currentConnection) {
        throw new Error("No wallet connected");
      }

      // In a real implementation, you'd use the wallet's send method
      // For now, we'll simulate it
      const txHash = "0x" + Math.random().toString(16).substr(2, 64);
      return txHash;
    } catch (error) {
      console.error("Send transaction error:", error);
      throw new Error("Failed to send transaction");
    }
  }

  // Smart Contract Methods for CoPass

  async createSharedBooking(
    counterparty: string,
    amount: string,
    description: string
  ): Promise<number> {
    try {
      if (!this.currentConnection) {
        throw new Error("No wallet connected");
      }

      // In a real implementation, you'd use the wallet's contract interaction
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
      if (!this.currentConnection) {
        throw new Error("No wallet connected");
      }

      // In a real implementation, you'd use the wallet's contract interaction
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
      if (!this.currentConnection) {
        throw new Error("No wallet connected");
      }

      // In a real implementation, you'd use the wallet's contract interaction
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
      if (!this.currentConnection) {
        throw new Error("No wallet connected");
      }

      // In a real implementation, you'd read from the contract
      // For now, we'll return mock data
      return {
        id: bookingId,
        creator: this.currentConnection.address,
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

  async getUserBookings(userAddress?: string): Promise<SharedBooking[]> {
    try {
      if (!this.currentConnection) {
        throw new Error("No wallet connected");
      }

      const address = userAddress || this.currentConnection.address;

      // This would require additional contract methods to get user's bookings
      // For now, we'll return mock data
      return [
        {
          id: 1,
          creator: address,
          counterparty: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
          amount: "0.1",
          description: "Hotel booking for Token2049",
          status: "pending",
          createdAt: Date.now(),
        },
      ];
    } catch (error) {
      console.error("Get user bookings error:", error);
      throw new Error("Failed to get user bookings");
    }
  }

  private async saveWalletConnection(
    connection: WalletConnection
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "walletConnection",
        JSON.stringify(connection)
      );
    } catch (error) {
      console.error("Save wallet connection error:", error);
    }
  }

  private async clearWalletConnection(): Promise<void> {
    try {
      await AsyncStorage.removeItem("walletConnection");
    } catch (error) {
      console.error("Clear wallet connection error:", error);
    }
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return this.currentConnection !== null;
  }

  // Get current connection
  getCurrentConnection(): WalletConnection | null {
    return this.currentConnection;
  }

  // Get supported chains
  getSupportedChains() {
    return [
      { id: 1, name: "Ethereum Mainnet" },
      { id: 137, name: "Polygon" },
      { id: 42161, name: "Arbitrum" },
    ];
  }
}

export const walletService = new WalletService();
