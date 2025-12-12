import { TargetAndTransition } from "motion/react";

/**
 * Type for indexed variant functions (e.g., bells, rays, bubbles)
 */
export type IndexedVariant = (index: number) => TargetAndTransition;

/**
 * Helper function to get a variant value from a record of variants
 */
export const getVariantValue = <T extends Record<string, TargetAndTransition>>(
  variants: T,
  variant: string
): TargetAndTransition | undefined => {
  return variant in variants ? variants[variant as keyof T] : undefined;
};

/**
 * Helper function to get an indexed variant value from a record of indexed variants
 */
export const getIndexedVariantValue = <
  T extends Record<string, IndexedVariant>
>(
  variants: T,
  variant: string
): IndexedVariant | undefined => {
  return variant in variants ? variants[variant as keyof T] : undefined;
};
