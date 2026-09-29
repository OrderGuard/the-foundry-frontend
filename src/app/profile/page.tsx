"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import './page.css';

import Profile from './Profile';


export default function ProfilePage() {

  return (
    <section id="page" className="profile-page d-flex align-items-center">
      <div className="container align-items-center mx-auto space-y-6">
          <Profile />
      </div>
    </section>
  );
}

