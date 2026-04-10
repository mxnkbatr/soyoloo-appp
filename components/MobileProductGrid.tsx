"use client";

import { type Product } from "@/models/Product";
import UniversalProductCard from "./UniversalProductCard";
import { motion } from "framer-motion";

interface MobileProductGridProps {
  products: Product[];
  statusBadgeMode?: "default" | "ready" | "preorder" | "new" | "sale";
}

export default function MobileProductGrid({
  products,
  statusBadgeMode = "default",
}: MobileProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 px-3 pb-32">
      {products.map((product, index) => (
        <UniversalProductCard
          key={`prod-${product.id || 'empty'}-${index}`}
          product={product}
          index={index}
          statusBadgeMode={statusBadgeMode}
        />
      ))}
    </div>
  );
}
