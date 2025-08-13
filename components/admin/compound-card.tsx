"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompoundCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string | null;
  imageUrls?: string[];
  showImages?: boolean;
  badges?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  }[];
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}

export function CompoundCard({
  title,
  subtitle,
  description,
  imageUrl,
  imageUrls = [],
  showImages = true,
  badges = [],
  actions,
  footer,
  className,
  imageClassName,
  contentClassName,
  children,
}: CompoundCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesVisible, setImagesVisible] = useState(showImages);

  // Combine single image and multiple images into one array
  const allImages = [
    ...(imageUrl ? [imageUrl] : []),
    ...imageUrls.filter(Boolean),
  ];

  const hasImages = allImages.length > 0;
  const hasMultipleImages = allImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Image Section */}
      {hasImages && imagesVisible && (
        <div className="relative">
          <div
            className={cn(
              "aspect-video bg-muted overflow-hidden",
              imageClassName
            )}
          >
            {/* eslint-disable @next/next/no-img-element  */}
            <img
              src={
                allImages[currentImageIndex] ||
                "/placeholder.svg?height=200&width=400"
              }
              alt={`${title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Image Controls */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
              onClick={() => setImagesVisible(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation for multiple images */}
          {hasMultipleImages && (
            <>
              <Button
                size="sm"
                variant="secondary"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Image indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    )}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Show Images Button (when hidden) */}
      {hasImages && !imagesVisible && (
        <div className="p-4 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImagesVisible(true)}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            Show Images ({allImages.length})
          </Button>
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold leading-tight truncate">{title}</h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex gap-2 flex-shrink-0">{actions}</div>}
        </CardTitle>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant || "secondary"}>
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className={cn("pt-0", contentClassName)}>
        {description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {description}
          </p>
        )}

        {children}

        {footer && <div className="mt-4 pt-4 border-t">{footer}</div>}
      </CardContent>
    </Card>
  );
}
