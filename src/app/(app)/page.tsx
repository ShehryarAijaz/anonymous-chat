"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import messages from "@/messages.json";
import { Separator } from "@/components/ui/separator";
import Autoplay from "embla-carousel-autoplay"
import { Mail } from "lucide-react";

const Home = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center  bg-gray-800">
      <section className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white">
          Dive into the world of Anonymous Chat
        </h1>
        <p className="mt-2 text-md text-white">
          Your identity remains <u>anonymous</u>. Forever. No trace. No records.
        </p>
        <Carousel
          className="w-full max-w-lg mt-4"
          plugins={[
            Autoplay({
              delay: 2500,
            }),
          ]}
          >
          <CarouselContent>
              {messages && messages.length > 0 && (
               messages.map((message, index) => (
                <CarouselItem key={index}>
                <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-black text-xl">{message.title}</CardTitle>
                  <Separator />
                  <div>
                    <div className="flex items-start gap-2 mt-2">
                  <Mail className="w-5 h-5 text-gray-500 mt-1" />
                    <p className="text-md text-black">{message.content}</p>
                    </div>
                    <span className="text-sm text-gray-500 ml-7">{message.received}</span>
                  </div>
                </CardHeader>
              </Card>
              </CarouselItem>
               )) 
              )
              }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </main>
  );
};

export default Home;
