import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBerita } from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

// Import local image assets (Vite will bundle them)
import logoIkm from '../assets/logo-ikm.png'
import songketMotif from '../assets/songket-motif.png'
import fotoAdat from '../assets/foto-adat.png'
import fotoBaju from '../assets/foto-baju.png'
import fotoPelantikan from '../assets/foto-pelantikan.png'
import fotoTari from '../assets/foto-tari.png'
import fotoBaralek from '../assets/foto-baralek.png'
import fotoTumpeng from '../assets/foto-tumpeng.png'

import { dummyBerita } from '../data/dummyBerita'
import NewsCard from '../components/NewsCard'

// High-quality stock Unsplash fallbacks for preview until user uploads their assets
const fallbackPhotos = [
  'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=600&q=80', // Baju (shirt back)
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80', // Pelantikan group
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80', // Tari traditional dance
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80', // Baralek Gadang
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80', // Potong tumpeng
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80'  // Adat Suntiang
]

// Songket motif pattern fallback
const fallbackSongket = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'

export default function Home() {
  const [newsList, setNewsList] = useState([])

  useEffect(() => {
    fetchBerita()
      .then((data) => {
        if (data && data.length > 0) {
          setNewsList(data.slice(0, 4))
        } else {
          setNewsList(dummyBerita.slice(0, 4))
        }
      })
      .catch(() => {
        setNewsList(dummyBerita.slice(0, 4))
      })
  }, [])

  // Check if asset is dummy transparent pixel or missing, and apply fallback
  const getImg = (file, fallback) => {
    if (!file || file.startsWith('data:image')) {
      return fallback
    }
    return file
  }

  const activeSongket = getImg(songketMotif, fallbackSongket)
  const imgBaju = getImg(fotoBaju, fallbackPhotos[0])
  const imgPelantikan = getImg(fotoPelantikan, fallbackPhotos[1])
  const imgTari = getImg(fotoTari, fallbackPhotos[2])
  const imgBaralek = getImg(fotoBaralek, fallbackPhotos[3])
  const imgTumpeng = getImg(fotoTumpeng, fallbackPhotos[4])
  const imgAdat = getImg(fotoAdat, fallbackPhotos[5])

  return (
    <div className="w-full bg-[#fff8f5] text-[#1f1414] overflow-x-hidden font-['Poppins']">
      {/* 
        Container wrapping the design mockup structure.
        Uses flex-flow and centered max-width grids to ensure layout alignment is perfect on all screen widths.
      */}
      <div className="relative w-full max-w-[1440px] mx-auto min-h-screen bg-[#fff8f5] flex flex-col">
        
        {/* ========================================================================= */}
        {/* HERO SECTION                                                              */}
        {/* ========================================================================= */}
        <div className="relative w-full h-[600px] sm:h-[700px] lg:h-[900px] bg-gradient-to-b from-[#D22B2B]/90 to-[#FF0000]/90 flex items-center justify-center overflow-hidden">
          
          {/* Decorative repeating Songket Pattern background overlay */}
          <div 
            className="absolute inset-0 opacity-[0.35] mix-blend-screen pointer-events-none select-none"
            style={{
              backgroundImage: `url(${activeSongket})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />

          {/* Hero Headlines */}
          <div className="relative z-20 text-center px-4 max-w-4xl space-y-6">
            <h1 className="text-white text-5xl sm:text-7xl lg:text-[120px] font-extrabold tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none">
              IKM - ITERA
            </h1>
            <p className="text-white/95 text-[24px] font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Mangumpuan nan taserak: menyatukan mahasiswa Minang ITERA demi melestarikan warisan adat budaya
            </p>
          </div>

          {/* 
            Desktop Hero Floating Photos (lg viewports only)
            Flat images (no rounded corners, borders, shadow cards, or hover animations).
            Sizes and center-offsets scale responsively between lg (1024px-1440px) and a custom 1440px breakpoint
            to prevent images from overlapping or overflowing off-screen on standard laptop viewports.
          */}
          <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none">
            {/* Foto 1 (Pelantikan Group - top middle-left) */}
            <div className="absolute left-[calc(50%-260px)] [@media(min-width:1440px)]:left-[calc(50%-330px)] top-[125px] pointer-events-auto z-10">
              <img
                className="w-60 h-44 [@media(min-width:1440px)]:w-72 [@media(min-width:1440px)]:h-52 object-cover origin-top-left rotate-[5deg]"
                src={imgPelantikan}
                alt="Pelantikan Pengurus"
              />
            </div>
            {/* Foto 2 (Traditional Attire - top left) */}
            <div className="absolute left-[calc(50%-540px)] [@media(min-width:1440px)]:left-[calc(50%-670px)] top-[183px] pointer-events-auto z-20">
              <img
                className="w-60 h-44 [@media(min-width:1440px)]:w-72 [@media(min-width:1440px)]:h-52 object-cover origin-top-left rotate-[-5deg]"
                src={imgAdat}
                alt="Busana Adat Minangkabau"
              />
            </div>
            {/* Foto 3 (Baralek Gadang - top right) */}
            <div className="absolute left-[calc(50%+300px)] [@media(min-width:1440px)]:left-[calc(50%+382px)] top-[184px] pointer-events-auto z-20">
              <img
                className="w-60 h-44 [@media(min-width:1440px)]:w-72 [@media(min-width:1440px)]:h-52 object-cover origin-top-left rotate-[5deg]"
                src={imgBaralek}
                alt="Baralek Gadang"
              />
            </div>
            {/* Foto 4 (Baju/Uniform - top middle-right) */}
            <div className="absolute left-[calc(50%+20px)] [@media(min-width:1440px)]:left-[calc(50%+97px)] top-[142px] pointer-events-auto z-10">
              <img
                className="w-60 h-44 [@media(min-width:1440px)]:w-72 [@media(min-width:1440px)]:h-52 object-cover origin-top-left rotate-[-5deg]"
                src={imgBaju}
                alt="IKM ITERA Uniform"
              />
            </div>
            {/* Foto 5 (Traditional Dance - bottom left) */}
            <div className="absolute left-[calc(50%-540px)] [@media(min-width:1440px)]:left-[calc(50%-670px)] top-[624px] pointer-events-auto z-10">
              <img
                className="w-60 h-44 [@media(min-width:1440px)]:w-72 [@media(min-width:1440px)]:h-52 object-cover origin-top-left rotate-[5deg]"
                src={imgTari}
                alt="Tari Tradisional"
              />
            </div>
            {/* Foto 6 (Potong Tumpeng - bottom right) */}
            <div className="absolute left-[calc(50%+300px)] [@media(min-width:1440px)]:left-[calc(50%+382px)] top-[645px] pointer-events-auto z-10">
              <img
                className="w-60 h-44 [@media(min-width:1440px)]:w-72 [@media(min-width:1440px)]:h-52 object-cover origin-top-left rotate-[-5deg]"
                src={imgTumpeng}
                alt="Potong Tumpeng Adat"
              />
            </div>
          </div>
        </div>

        {/* 
          Mobile Hero Gallery (under 1024px)
          Provides a responsive layout flow so images are nicely displayed on phones/tablets
        */}
        <div className="lg:hidden bg-gradient-to-b from-[#800c0c] to-[#fff8f5] px-6 py-12">
          <h3 className="text-white text-center text-sm font-bold tracking-[0.25em] uppercase mb-8 opacity-90">Galeri Kegiatan IKM ITERA</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[imgBaju, imgPelantikan, imgTari, imgBaralek, imgTumpeng, imgAdat].map((imgSrc, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl border-2 border-white shadow-md">
                <img
                  className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                  src={imgSrc}
                  alt={`Galeri ${idx + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TICKER TAPE SECTION                                                       */}
        {/* ========================================================================= */}
        <div className="relative w-full h-20 bg-stone-950 flex items-center shadow-lg border-y border-white/5 overflow-hidden">
          <div className="w-full max-w-[1280px] mx-auto px-6">
            <div className="relative overflow-hidden w-full flex items-center">
              <div className="ticker-wrap w-full">
                <div className="ticker-content flex gap-12 whitespace-nowrap text-white text-[18px] font-medium uppercase tracking-[0.1em] py-1">
                  <span>DIMANA BUMI DIPIJAK, DI SITU LANGIT DIJUNJUNG — MERAWAT IDENTITAS MINANGKABAU DI KAMPUS ITERA. IKUTI PERKEMBANGAN TERKINI,</span>
                  <span>DIMANA BUMI DIPIJAK, DI SITU LANGIT DIJUNJUNG — MERAWAT IDENTITAS MINANGKABAU DI KAMPUS ITERA. IKUTI PERKEMBANGAN TERKINI,</span>
                  <span>DIMANA BUMI DIPIJAK, DI SITU LANGIT DIJUNJUNG — MERAWAT IDENTITAS MINANGKABAU DI KAMPUS ITERA. IKUTI PERKEMBANGAN TERKINI,</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ABOUT SECTION                                                             */}
        {/* ========================================================================= */}
        <div className="w-full max-w-[1154px] mx-auto px-6 lg:px-0 py-16 lg:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            
            {/* Left Column Text & Action */}
            <div className="flex-1 space-y-6">
              <h2 className="text-black text-[28px] font-extrabold leading-tight tracking-wide">
                Tentang IKM ITERA
              </h2>
              <p className="text-black/80 text-[18px] leading-relaxed font-normal font-['Poppins']">
                Diresmikan langsung oleh Rektor Ofyar Z. Tamin pada tahun 2015, IKM ITERA menjadi episentrum berkumpulnya mahasiswa perantau. Sebuah ruang untuk merajut kekeluargaan berlandaskan keluhuran budaya Minangkabau.
              </p>
              <div>
                <Link
                  to="/tentang/latar-belakang"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#e2be3c] hover:bg-[#d0ab2b] text-black text-[18px] font-semibold rounded-xl border border-black/15 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Kenali Lebih Dekat
                  <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                </Link>
              </div>
            </div>

            {/* Right Column Portrait Frame - Flat Emblem Logo (No rounded/shadow/borders/animations) */}
            <div className="shrink-0">
              <img
                className="w-64 h-64 object-contain"
                src={logoIkm}
                alt="IKM ITERA Emblem"
              />
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* ARTICLES/NEWS GRID SECTION                                                */}
        {/* ========================================================================= */}
        <div className="w-full max-w-[1170px] mx-auto px-6 lg:px-0 pb-24 lg:pb-32">
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
            {newsList.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>

          {/* Centered News Action Button */}
          <div className="mt-12 text-center w-full">
            <Link
              to="/informasi/berita"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#e2be3c] hover:bg-[#d0ab2b] text-black text-[18px] font-normal font-['Poppins'] rounded-xl border border-black/15 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Berita Lainnya
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}
