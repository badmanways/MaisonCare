import React from "react";
import { notFound } from "next/navigation";
import DedicatedServiceView from "@/components/sections/DedicatedServiceView";
import { ServiceCategorySlug } from "@/components/forms/ServiceRequestForm";

export function generateStaticParams() {
  return [
    { slug: "nanny" },
    { slug: "cleaning" },
    { slug: "concierge" },
    { slug: "senior" },
    { slug: "pet" },
  ];
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function DedicatedServicePage({ params }: PageProps) {
  const { slug } = params;
  const validSlugs: ServiceCategorySlug[] = [
    "nanny",
    "cleaning",
    "concierge",
    "senior",
    "pet",
  ];

  if (!validSlugs.includes(slug as ServiceCategorySlug)) {
    notFound();
  }

  return <DedicatedServiceView slug={slug as ServiceCategorySlug} />;
}

