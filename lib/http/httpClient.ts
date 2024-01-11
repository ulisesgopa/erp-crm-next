"use client";

import axios from 'axios';

export const httpClient = axios.create({
  baseURL: process.env.VITE_SERVER_URL,
});
