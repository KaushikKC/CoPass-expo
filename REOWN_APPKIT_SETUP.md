# Reown AppKit React Native Setup Guide

This guide explains how to set up and use Reown AppKit for real-time wallet connections in the CoPass React Native app.

## What's Been Implemented

### 1. Dependencies Installed
- `@reown/appkit-wagmi-react-native` - React Native AppKit with Wagmi
- `wagmi` - React hooks for Ethereum
- `viem` - TypeScript interface for Ethereum
- `@tanstack/react-query` - Data fetching and caching
- `@walletconnect/react-native-compat` - WalletConnect React Native compatibility
- `@react-native-async-storage/async-storage` - Async storage for React Native
- `react-native-get-random-values` - Random values polyfill
- `react-native-svg` - SVG support
- `react-native-modal` - Modal component
- `@react-native-community/netinfo` - Network information
- `expo-application` - Expo application utilities
- `@react-navigation/native` - React Navigation
- `react-native-reanimated` - Reanimated library

### 2. Configuration Files Created

#### `babel.config.js`
- Added `unstable_transformImportMeta: true` for valtio support
- Required for Expo SDK 53+ compatibility

#### `app/_layout.tsx`
- Direct AppKit configuration following the official React Native example
- AppKit initialization at module level
- WagmiProvider and QueryClientProvider setup
- AppKit component integration

#### `app.json`
- Added wallet detection schemes for iOS
- Supports MetaMask, Trust, Safe, Rainbow, Uniswap, Coinbase, WalletConnect

#### `hooks/useColorScheme.ts`
- Color scheme hook for theme support

### 3. Components Created

#### `components/WalletConnectButton.tsx`
- React Native component that uses AppKit
- Shows wallet status (connected/disconnected)
- Displays wallet address and balance
- Uses AppKitButton for connection
- Handles disconnect functionality

### 4. Updated Files

#### `app/onboarding.tsx`
- Added wallet connection section to profile setup
- Uses WalletConnectButton component

#### `app/(tabs)/profile.tsx`
- Replaced old wallet connection with AppKit
- Uses WalletConnectButton component

## Environment Setup

Create a `.env` file in your project root with:

```env
EXPO_PUBLIC_PROJECT_ID=eb447922bf799117d4a4fcb3c11efb9b
```

## How It Works

### 1. AppKit Initialization
- AppKit is initialized directly in `app/_layout.tsx` at module level
- Creates Wagmi configuration with supported chains
- Sets up metadata and project configuration
- Uses the official React Native example structure

### 2. Wallet Connection Flow
1. User clicks the AppKit button
2. AppKit modal opens with wallet options
3. User selects and connects their wallet
4. AppKit handles the connection via WalletConnect
5. Component updates to show connected state

### 3. Supported Wallets
- MetaMask
- WalletConnect
- Coinbase Wallet
- Trust Wallet
- Safe Wallet
- Rainbow
- Uniswap Wallet
- And 430+ more wallets

### 4. Supported Networks
- Ethereum Mainnet
- Polygon
- Arbitrum

## Usage in Components

### Basic Usage
```tsx
import WalletConnectButton from "@/components/WalletConnectButton";

function MyComponent() {
  return (
    <WalletConnectButton 
      onConnect={() => console.log("Connected!")}
      onDisconnect={() => console.log("Disconnected!")}
    />
  );
}
```

### Using Wagmi Hooks Directly
```tsx
import { useAccount, useBalance, useDisconnect } from 'wagmi';

function MyComponent() {
  const { address, isConnected, chainId } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  
  if (isConnected) {
    return <Text>Connected: {address}</Text>;
  }
  
  return <Text>Not connected</Text>;
}
```

### Using AppKit Button Directly
```tsx
import { AppKitButton } from '@reown/appkit-wagmi-react-native';

function MyComponent() {
  return <AppKitButton />;
}
```

## Smart Contract Integration

You can use Wagmi hooks for smart contract interactions:

```tsx
import { useReadContract, useWriteContract } from 'wagmi';

function MyComponent() {
  const { data, isLoading } = useReadContract({
    address: '0x...',
    abi: [...],
    functionName: 'totalSupply',
  });

  const { writeContract } = useWriteContract();

  const handleTransaction = () => {
    writeContract({
      address: '0x...',
      abi: [...],
      functionName: 'transfer',
      args: ['0x...', 1000],
    });
  };
}
```

## Wallet Detection

The app is configured to detect installed wallets on iOS devices. This provides:
- Green checkmarks next to installed wallets
- Prioritized wallet list with installed wallets at the top
- Better user experience

## Implementation Details

### Layout Structure
The `app/_layout.tsx` follows the exact structure from the official React Native example:
- AppKit imports and configuration at module level
- QueryClient setup
- Wagmi configuration with chains and metadata
- AppKit initialization with `createAppKit`
- ThemeProvider, WagmiProvider, and QueryClientProvider wrapping
- AppKit component included in the render tree

### Key Features
- ✅ **Real wallet connections** via WalletConnect protocol
- ✅ **AppKit modal** with beautiful wallet selection interface
- ✅ **Wagmi integration** for wallet state management
- ✅ **Multiple network support** (Ethereum, Polygon, Arbitrum)
- ✅ **Wallet detection** for iOS devices
- ✅ **React Native optimized** configuration
- ✅ **Official example structure** for maximum compatibility

## Next Steps

1. **Test the integration** by running your app and trying to connect a wallet
2. **Deploy smart contracts** and update contract addresses
3. **Add error handling** for failed connections
4. **Add loading states** during wallet operations
5. **Test on real devices** to verify wallet detection works

## Troubleshooting

### Common Issues

1. **AppKit button not showing**: Make sure AppKit is initialized before rendering components
2. **Connection fails**: Check that your project ID is correct
3. **Babel errors**: Ensure `babel.config.js` has `unstable_transformImportMeta: true`
4. **Wallet detection not working**: Verify wallet schemes are added to `app.json`
5. **Dependency conflicts**: Use `--legacy-peer-deps` for installation

### Debug Mode
Enable debug logging by adding to your environment:
```env
EXPO_PUBLIC_DEBUG=true
```

## Resources

- [Reown AppKit Documentation](https://docs.reown.com)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [WalletConnect Documentation](https://docs.walletconnect.com)
- [React Native AppKit Guide](https://docs.reown.com/appkit/react-native) 