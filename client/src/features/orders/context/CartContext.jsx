import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => {
    try {
      const savedCart = localStorage.getItem("kurogi-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [open, setOpen] = useState(false);

  // Keep cart after refresh
  useEffect(() => {
    localStorage.setItem("kurogi-cart", JSON.stringify(lines));
  }, [lines]);

  const addItem = (item) => {
    setLines((current) => {
      const existing = current.find(
        (line) => line.item.id === item.id
      );

      if (existing) {
        return current.map((line) =>
          line.item.id === item.id
            ? { ...line, qty: line.qty + 1 }
            : line
        );
      }

      return [...current, { item, qty: 1 }];
    });

    setOpen(true);
  };

  const removeItem = (itemId) => {
    setLines((current) =>
      current.filter((line) => line.item.id !== itemId)
    );
  };

  const setQty = (itemId, qty) => {
    if (qty <= 0) {
      removeItem(itemId);
      return;
    }

    setLines((current) =>
      current.map((line) =>
        line.item.id === itemId
          ? { ...line, qty }
          : line
      )
    );
  };

  // Called after successful checkout
  const clearCart = () => {
    setLines([]);
    localStorage.removeItem("kurogi-cart");
  };

  const count = useMemo(
    () =>
      lines.reduce(
        (total, line) => total + line.qty,
        0
      ),
    [lines]
  );

  const total = useMemo(
    () =>
      lines.reduce(
        (total, line) =>
          total + line.item.price * line.qty,
        0
      ),
    [lines]
  );

  const value = {
    lines,
    count,
    total,
    open,
    setOpen,
    addItem,
    removeItem,
    setQty,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}