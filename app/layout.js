import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "The  Mission Trader",
  description: "Mission Trader",
  generator: "The red Mission",
  icons: {
    icons: {
    icon: "/bit2.jpeg",
    apple: "/bit2.jpeg",
  },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="secondary">
      <body className={`font-sans antialiased`}>
        <>
        <Navbar/>
         {children}
        </>
       
      </body>
    </html>
  )
}
