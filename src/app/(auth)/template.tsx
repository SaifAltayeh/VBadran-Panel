"use client";

import { motion, useReducedMotion } from "framer-motion";

import { ease } from "@/lib/utils";

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  const reduce = Boolean(useReducedMotion());
  return (
    <motion.div
      className="h-full"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      {children}
    </motion.div>
  );
}
