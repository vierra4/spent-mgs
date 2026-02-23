import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Wallet, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import LoginButton  from "@/components/auth/LoginButton"; 
import SignupButton  from "@/components/auth/SignupButton";
import LogoutButton  from "@/components/auth/LogoutButton.tsx";
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import Footer  from "@/components/home/Footer";
import Testimonials from "@/components/home/Testimonial";
import Features from "@/components/home/EndCall";
import Hero from "@/components/home/Header";
import Integration from "@/components/home/StartCall";

export default function HomePage() {

  return (
    <div >
      <Hero/>
      <Integration/>
     <Features/>
      <Testimonials />
      <Footer/>
    </div>
  );
}

