"use client";
import dynamic from "next/dynamic";

export const OnboardingModal = dynamic(() => import("@/components/OnboardingModal"), { ssr: false });
export const PersonalizedBanner = dynamic(() => import("@/components/PersonalizedBanner"), { ssr: false });
export const PersonalizedSection = dynamic(() => import("@/components/PersonalizedSection"), { ssr: false });
export const HeroRightColumn = dynamic(() => import("@/components/HeroRightColumn"), { ssr: false });
