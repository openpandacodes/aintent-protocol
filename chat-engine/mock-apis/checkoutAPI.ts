// checkoutAPI.ts

export async function checkout() {
    return {
      summary: { item: 'MacBook', discount: 'SAVE10' },
      proof: 'proof-checkout-0xaaa'
    };
  }
  