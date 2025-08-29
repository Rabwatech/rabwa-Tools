"use client";
import { useMotionValue } from "motion/react";
import React, { useState, useEffect } from "react";
import { useMotionTemplate, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Button } from "./button";

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: any;
  };
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  onClick: (toolId: string) => void;
  className?: string;
}

export const ToolCard = ({
  tool,
  isFavorite,
  onToggleFavorite,
  onClick,
  className,
}: ToolCardProps) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    let str = generateRandomString(1500);
    setRandomString(str);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(1500);
    setRandomString(str);
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(tool.id);
  };

  const handleCardClick = () => {
    onClick(tool.id);
  };

  return (
    <div
      className={cn(
        "p-0.5 bg-transparent aspect-square flex items-center justify-center w-full h-full relative cursor-pointer border-2 border-border/60 hover:border-primary/80 transition-colors duration-300 rounded-3xl",
        className
      )}
      onClick={handleCardClick}
    >
      <div
        onMouseMove={onMouseMove}
        className="group/card rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full transition-colors duration-300"
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
          randomString={randomString}
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-colors ${
            isFavorite
              ? 'text-yellow-500 hover:text-yellow-600'
              : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Tool Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center h-full w-full rounded-2xl m-2">
          {/* Tool Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <tool.icon className="w-8 h-8 text-primary" />
          </div>

          {/* Tool Name */}
          <h3 className="font-bold text-lg mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {tool.name}
          </h3>

          {/* Tool Description */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
            {tool.description}
          </p>

          {/* Category Badge */}
          <div className="mt-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {tool.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, randomString }: any) {
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50"></div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover/card:opacity-100 backdrop-blur-xl transition duration-500"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay group-hover/card:opacity-100"
        style={style}
      >
        <p className="absolute inset-x-0 text-xs h-full break-words whitespace-pre-wrap text-primary/30 font-mono font-bold transition duration-500">
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
