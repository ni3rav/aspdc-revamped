"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export function Dcardcode({author, title, description, imgUrl, liveUrl, github_url}: {author?: string, title?: string, description?: string, imgUrl?: string, liveUrl?: string, github_url?: string}) {
    return (
        <CardContainer className="inter-var w-full">
            <CardBody className="relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black border-white/[0.2] w-full min-h-[26rem] rounded-xl p-4 sm:p-6 border">
                <CardItem
                    translateZ="30"
                    className="text-lg sm:text-xl font-bold text-white"
                >
                    <div className="flex flex-col sm:flex-row sm:items-end  gap-1 sm:gap-2">
                        <span className="truncate">{title}</span>
                        <span className="text-sm text-gray-400">by {author}</span>
                    </div>
                </CardItem>
                <CardItem
                    as="p"
                    translateZ="40"
                    className="text-sm mt-2 text-neutral-200 line-clamp-3"
                >
                    {description}
                </CardItem>
                <CardItem translateZ="50" className="w-full mt-4">
                    <img
                        src={imgUrl}
                        height="500"
                        width="500"
                        className="h-40 sm:h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                        alt="thumbnail"
                    />
                </CardItem>
                <div className="flex justify-between items-center mt-4 sm:mt-8">
                    <CardItem
                        translateZ={15}
                        as="a"
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 sm:px-4 rounded-xl text-xs font-normal text-white hover:underline"
                    >
                        Live Url →
                    </CardItem>
                    <CardItem
                        translateZ={15}
                        as="a"
                        href={github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 sm:px-4 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-100"
                    >
                        Github
                    </CardItem>
                </div>
            </CardBody>
        </CardContainer>
    );
}
