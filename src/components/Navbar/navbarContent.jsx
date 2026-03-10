"use client";
import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import PropTypes from "prop-types";

/*[--- COMPONENT IMPORT ---]*/
import SideBarMenu from "@/components/Navbar/SideBarMenu/page.jsx";
import NotificationMenu from "@/components/Navbar/NotificationMenu/page.jsx";
import ProfileMenu from "@/components/Navbar/ProfileMenu/page.jsx";

/*[--- CONSTANTS IMPORT ---]*/
import { navbarOptions } from "@/lib/constants/navbarOptions";

/*[--- ASSETS IMPORT ---]*/
import iconMenuClose from "@@/icons/icon-menuclose.svg";
import logoHome from "@@/icons/logoHome.svg";
import logoSearch from "@@/logo/logoSearch/nav-search.svg";
import iconChartRed from "@@/icons/icon-chart-red.svg";
import iconChartYellow from "@@/icons/icon-chart-yellow.svg";

/*[--- CONTEXT IMPORT ---]*/
import { useAuth } from "../Context/AuthContext";
import {
  useGetPopularSearchesQuery,
  useGetSearchHistoryByUserQuery,
  useGetSearchSuggestionsQuery,
} from "@/hooks/api/searchAPI";
import { Icon } from "@iconify/react";
import { useDebounce } from "use-debounce";
import { useGetMeQuery } from "@/hooks/api/userSliceAPI";
import ShowCoin from "../Coin/ShowCoin";

/* ─────────────────────────────────────────────────────────────────
   INLINE STYLES — keyframe animations injected once
───────────────────────────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @keyframes cmdFadeIn {
    from { opacity: 0; transform: translateY(-6px) scale(0.985); }
    to   { opacity: 1; transform: translateY(0)    scale(1);     }
  }
  @keyframes cmdFadeOut {
    from { opacity: 1; }
    to   { opacity: 0; transform: translateY(-4px); }
  }
  @keyframes suggSlide {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  .cmd-enter { animation: cmdFadeIn 0.18s cubic-bezier(0.16,1,0.3,1) forwards; }
  .sugg-enter { animation: suggSlide 0.14s ease forwards; }
  .nav-link-underline::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 50%; right: 50%;
    height: 2px;
    background: linear-gradient(90deg, #0395BC, #38bdf8);
    border-radius: 2px;
    transition: left 0.25s cubic-bezier(0.16,1,0.3,1), right 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  .nav-link-underline.active::after,
  .nav-link-underline:hover::after { left: 12px; right: 12px; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(3,149,188,0.25); border-radius: 4px; }
`;

export default function NavbarContent({ openCreateContentModal, openRedeemVoucherModal }) {
  const EMOJI_REGEX = /[\p{Extended_Pictographic}\uFE0F]/gu;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const inputRef = useRef(null);
  const cmdRef   = useRef(null);

  const [role, setRole]       = useState(user?.role || "Users");
  const [imageUrl, setImageUrl] = useState(
    user?.isCreator ? user?.image_creators : user?.image_users
  );
  const [isMenuBarsOpen]            = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const [searchValidationError, setSearchValidationError] = useState("");
  const [cmdOpen, setCmdOpen]               = useState(false);   // command palette
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [isScrolled, setIsScrolled]         = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const { data: userData }      = useGetMeQuery(undefined, { skip: !user?.token });
  const { data: historyData }   = useGetSearchHistoryByUserQuery(undefined, { skip: !user?.token });
  const { data: trendingData }  = useGetPopularSearchesQuery(undefined, { skip: !user?.token });
  const [debouncedQ]            = useDebounce(searchQuery, 350);
  const { data: suggestionData, isFetching: isSuggFetching } =
    useGetSearchSuggestionsQuery(debouncedQ, {
      skip: !(cmdOpen || mobileSearchOpen) || !debouncedQ?.trim(),
    });

  const isAuthenticated = !!user?.token;

  const suggSource = suggestionData?.suggestions || suggestionData?.searchSuggestions || suggestionData?.data || [];
  const suggItems  = Array.isArray(suggSource)
    ? suggSource.map(i => (typeof i === "string" ? i : i?.searchQuery || i?.query || i?.title || i?.name || "")).filter(Boolean)
    : [];

  /* ── scroll elevation ── */
  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── open cmd palette ── */
  const openCmd = useCallback(() => {
    setCmdOpen(true);
    setIsSuggestionOpen(false);
    setTimeout(() => inputRef.current?.focus(), 40);
  }, []);

  const closeCmd = useCallback(() => {
    setCmdOpen(false);
    setIsSuggestionOpen(false);
    setSearchValidationError("");
    setActiveCategory(null);
  }, []);

  /* ── close on outside click ── */
  useEffect(() => {
    if (!cmdOpen) return;
    const h = (e) => { if (cmdRef.current && !cmdRef.current.contains(e.target)) closeCmd(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [cmdOpen, closeCmd]);

  /* ── Escape key ── */
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") { closeCmd(); setMobileSearchOpen(false); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [closeCmd]);

  const normalizeInput = (v = "") => v.replace(EMOJI_REGEX, "").replace(/\s+/g, " ").slice(0, 100);

  const handleChange = (e) => {
    const raw = e.target.value;
    const norm = normalizeInput(raw);
    setSearchQuery(norm);
    setIsSuggestionOpen(!!norm.trim());
    setActiveCategory(null);
    setSearchValidationError(raw !== norm ? "Emoji tidak diperbolehkan." : "");
  };

  const handleSubmit = (q = searchQuery) => {
    const v = normalizeInput(q).trim();
    if (!v) return;
    router.push(`/search?search=${encodeURIComponent(v)}`);
    setSearchQuery(v);
    closeCmd();
    setMobileSearchOpen(false);
  };

  const handleSelect = (value) => {
    const v = normalizeInput(value).trim();
    if (!v) return;
    setSearchQuery(v);
    router.push(`/search?search=${encodeURIComponent(v)}`);
    closeCmd();
    setMobileSearchOpen(false);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.url === activeCategory ? null : cat.url);
    setSearchQuery("");
    setIsSuggestionOpen(false);
  };

  useEffect(() => {
    const h = (e) => { if (e.key === "role") setRole(e.newValue); };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);

  useEffect(() => {
    setRole(user?.role || "Users");
    setImageUrl(user?.isCreator ? user?.image_creators : user?.image_users);
  }, [user]);

  useEffect(() => { closeCmd(); setMobileSearchOpen(false); }, [pathname, searchParams]);

  /* ────────────────────────────────────────────────────────────
     COMMAND PALETTE BODY
  ──────────────────────────────────────────────────────────── */
  const CommandPalette = () => (
    <div
      ref={cmdRef}
      className="cmd-enter fixed z-50 left-1/2 -translate-x-1/2 top-[72px] w-[92vw] max-w-[600px]
                 rounded-2xl overflow-hidden
                 border border-white/[0.1]
                 shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(3,149,188,0.08),inset_0_1px_0_rgba(255,255,255,0.06)]"
      style={{ background: "linear-gradient(145deg, #020f1a 0%, #011624 60%, #012030 100%)" }}
      onClick={e => e.stopPropagation()}
    >
      {/* ── INPUT ROW ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07]">
        <Icon
          icon={isSuggFetching ? "svg-spinners:pulse-rings-2" : "solar:magnifer-bold"}
          className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${isSuggFetching ? "text-[#0395BC]" : "text-[#0395BC]/60"}`}
        />
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent text-[15px] font-medium text-white placeholder:text-white/25 focus:outline-none caret-[#38bdf8] tracking-wide"
          placeholder="Cari konten, kreator, topik..."
          maxLength={100}
          value={searchQuery}
          onChange={handleChange}
          onFocus={() => setIsSuggestionOpen(!!searchQuery.trim())}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          autoFocus
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setIsSuggestionOpen(false); inputRef.current?.focus(); }}
              className="text-white/20 hover:text-white/50 transition-colors"
            >
              <Icon icon="solar:close-circle-bold" className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 rounded-md border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/25 font-mono">
            ESC
          </kbd>
        </div>
      </div>

      {/* ── CATEGORY CHIPS (always visible above results) ── */}
      {!isSuggestionOpen && (
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.05] overflow-x-auto scrollbar-none">
          {navbarOptions.map((opt) => {
            const isAct = activeCategory === opt.url;
            return (
              <button
                key={opt.id}
                onClick={() => handleCategoryClick(opt)}
                className={`
                  sugg-enter flex items-center gap-2 flex-shrink-0
                  rounded-full px-3 py-1.5 text-[11.5px] font-semibold tracking-wide
                  border transition-all duration-200 active:scale-95
                  ${isAct
                    ? "bg-[#0395BC]/20 border-[#0395BC]/50 text-[#38bdf8] shadow-[0_0_12px_rgba(3,149,188,0.2)]"
                    : "bg-white/[0.03] border-white/[0.07] text-white/45 hover:text-white/75 hover:bg-white/[0.06] hover:border-white/[0.14]"
                  }
                `}
              >
                <Image alt={opt.tittle} src={opt.icon} width={14} height={14} className={`transition-opacity ${isAct ? "opacity-100" : "opacity-50"}`} />
                {opt.tittle}
              </button>
            );
          })}
        </div>
      )}

      {/* ── IF CATEGORY SELECTED: browse it ── */}
      {activeCategory && !isSuggestionOpen && (
        <div className="px-4 py-4">
          <Link
            href={activeCategory}
            onClick={closeCmd}
            className="group flex items-center justify-between rounded-xl px-4 py-3
                       bg-gradient-to-r from-[#0395BC]/10 to-transparent
                       border border-[#0395BC]/20 hover:border-[#0395BC]/40
                       transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#0395BC]/15 flex items-center justify-center border border-[#0395BC]/20">
                <Image
                  alt=""
                  src={navbarOptions.find(o => o.url === activeCategory)?.icon}
                  width={18} height={18} className="opacity-90"
                />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-white/85 group-hover:text-white transition-colors">
                  Jelajahi {navbarOptions.find(o => o.url === activeCategory)?.tittle}
                </p>
                <p className="text-[11px] text-white/35">Lihat semua konten</p>
              </div>
            </div>
            <Icon icon="solar:arrow-right-linear" className="h-4 w-4 text-white/30 group-hover:text-[#0395BC]/80 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      )}

      {/* ── SUGGESTIONS ── */}
      {isSuggestionOpen && searchQuery.trim() && (
        <div className="py-2">
          {searchValidationError && (
            <div className="mx-4 mb-2 flex items-center gap-2 rounded-xl bg-red-500/8 border border-red-500/15 px-3 py-2">
              <Icon icon="solar:danger-triangle-bold" className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
              <p className="text-[11px] text-red-300">{searchValidationError}</p>
            </div>
          )}

          <div className="px-4 pb-1">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#0395BC]/45 mb-2">Saran</p>
          </div>

          {isSuggFetching ? (
            <div className="flex items-center gap-3 px-5 py-3 text-[12.5px] text-white/30">
              <Icon icon="svg-spinners:3-dots-fade" className="h-4 w-4 text-[#0395BC]/60" />
              Memuat...
            </div>
          ) : suggItems.length > 0 ? (
            <ul className="max-h-52 overflow-y-auto">
              {suggItems.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handleSelect(s)}
                    className="sugg-enter group flex w-full items-center gap-3.5 px-5 py-2.5
                               text-[13px] text-white/52 hover:text-white hover:bg-white/[0.04]
                               transition-all duration-100"
                  >
                    <Icon icon="solar:magnifer-linear" className="h-3.5 w-3.5 text-white/18 group-hover:text-[#0395BC]/70 flex-shrink-0 transition-colors" />
                    <span className="flex-1 text-left truncate">{s}</span>
                    <Icon icon="solar:arrow-right-up-linear" className="h-3 w-3 text-transparent group-hover:text-white/25 transition-colors flex-shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-3 text-[12.5px] text-white/25">Tidak ada saran.</p>
          )}

          {/* Quick submit */}
          {searchQuery.trim() && (
            <div className="px-4 pt-2 pb-3 border-t border-white/[0.05] mt-1">
              <button
                onClick={() => handleSubmit()}
                className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5
                           bg-gradient-to-r from-[#0395BC]/8 to-transparent
                           border border-[#0395BC]/15 hover:border-[#0395BC]/35
                           text-[12.5px] text-white/45 hover:text-white/85
                           transition-all duration-200"
              >
                <Icon icon="solar:magnifer-bold" className="h-4 w-4 text-[#0395BC]/40 group-hover:text-[#0395BC]/80 transition-colors" />
                <span>Cari <span className="text-[#38bdf8]/70 font-semibold">"{searchQuery}"</span></span>
                <Icon icon="solar:keyboard-bold" className="ml-auto h-3.5 w-3.5 text-white/15" />
                <kbd className="text-[10px] text-white/20 font-mono">↵</kbd>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── DEFAULT: TRENDING + HISTORY ── */}
      {!isSuggestionOpen && !activeCategory && (
        <div className="grid grid-cols-2 divide-x divide-white/[0.05]">
          <div className="px-4 py-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Image alt="" src={iconChartRed} width={11} height={11} />
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#0395BC]/45">Trending</p>
            </div>
            <ul className="space-y-0.5">
              {trendingData?.popularSearches?.map((item, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.searchQuery)}
                    className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-2
                               text-[12px] text-white/42 hover:text-white/80
                               hover:bg-white/[0.03] transition-all duration-100"
                  >
                    <Image alt="" src={iconChartYellow} width={10} height={10} className="flex-shrink-0 opacity-45 group-hover:opacity-80 transition-opacity" />
                    <span className="truncate flex-1 text-left">{item.searchQuery}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 py-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Icon icon="solar:history-linear" className="h-3 w-3 text-white/30" />
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#0395BC]/45">Riwayat</p>
            </div>
            <ul className="space-y-0.5">
              {historyData?.searchHistories?.map((item, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.searchQuery)}
                    className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-2
                               text-[12px] text-white/38 hover:text-white/75
                               hover:bg-white/[0.03] transition-all duration-100"
                  >
                    <Icon icon="solar:clock-circle-linear" className="h-3 w-3 text-white/15 group-hover:text-[#0395BC]/45 flex-shrink-0 transition-colors" />
                    <span className="truncate flex-1 text-left">{item.searchQuery}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/[0.05]"
           style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="flex items-center gap-3 text-[10px] text-white/20">
          <span className="flex items-center gap-1">
            <kbd className="font-mono border border-white/[0.1] rounded px-1 py-0.5 bg-white/[0.03]">↑↓</kbd>
            navigasi
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono border border-white/[0.1] rounded px-1 py-0.5 bg-white/[0.03]">↵</kbd>
            pilih
          </span>
        </div>
        <span className="text-[10px] text-white/15 font-medium">gate+</span>
      </div>
    </div>
  );

  /* ────────────────────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────────────────────── */
  return (
    <Fragment>
      <style>{GLOBAL_STYLES}</style>

      {/* ═══════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════ */}
      <nav
        className={`
          fixed z-30 w-full
          transition-all duration-500 ease-out md:py-2 
          ${isMenuBarsOpen ? "rounded-b-2xl" : ""}
          ${isScrolled
            ? "shadow-[0_1px_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.45)]"
            : ""
          }
        `}
        style={{
          background: isScrolled
            ? "rgba(1, 13, 24, 0.94)"
            : "linear-gradient(180deg, rgba(1,13,24,0.85) 0%, rgba(1,13,24,0.3) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* ── DESKTOP ROW ─────────────────────────────── */}
        <section className={`
          ${mobileSearchOpen ? "hidden md:flex" : "flex"}
          items-center h-[60px] 2xl:h-[68px]
          px-5 lg:px-10 2xl:px-16
          gap-6
        `}>

          {/* LOGO */}
          <Link href="/" className="flex-shrink-0 group mr-2">
            <Image
              className="w-[68px] md:w-auto md:h-auto opacity-85 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(3,149,188,0.4)]"
              src={logoHome} alt="logo-gate+" priority
            />
          </Link>

          {/* ── NAV LINKS — underline style ────────────── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navbarOptions.map((option) => {
              const isActive = option.url === pathname;
              return (
                <Link key={option.id} href={option.url}>
                  <div className={`
                    nav-link-underline relative
                    flex items-center gap-1
                    px-3 py-2 rounded-lg text-md font-normal tracking-wide
                    transition-all duration-200 cursor-pointer select-none
                    ${isActive ? "active text-white" : "text-white/45 hover:text-white/80"}
                  `}>
                    <Image alt={option.tittle} src={option.icon} width={24} height={24}
                      className={`transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-40"}`} />
                    {option.tittle}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── SPACER ── */}
          <div className="flex-1" />

          {/* ── SEARCH COMMAND BUTTON ──────────────────── */}
          <button
            onClick={cmdOpen ? closeCmd : openCmd}
            aria-label="Buka pencarian"
            aria-expanded={cmdOpen}
            className={`
              hidden md:flex items-center gap-3
              rounded-full border px-4 py-2
              text-[13px] font-medium
              transition-all duration-200 active:scale-[0.97]
              ${cmdOpen
                ? "bg-[#0395BC]/12 border-[#0395BC]/40 text-white/80 shadow-[0_0_0_3px_rgba(3,149,188,0.1),inset_0_1px_0_rgba(3,149,188,0.15)]"
                : "bg-white/[0.04] border-white/[0.09] text-white/40 hover:text-white/70 hover:bg-white/[0.07] hover:border-white/[0.15]"
              }
            `}
          >
            <Icon
              icon="solar:magnifer-linear"
              className={`h-4 w-4 transition-colors duration-200 ${cmdOpen ? "text-[#0395BC]" : "text-white/35"}`}
            />
            <span className="hidden lg:inline min-w-[120px]">
              {searchQuery && !cmdOpen
                ? (searchQuery.length > 14 ? `${searchQuery.slice(0, 14)}…` : searchQuery)
                : <span className="text-white/28 text-start">Cari apa saja...</span>}
            </span>
          </button>

          {/* ── MOBILE SEARCH BUTTON ───────────────────── */}
          <button
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-200 border border-white/[0.06]"
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Cari"
          >
            <Icon icon="solar:magnifer-linear" className="h-4.5 w-4.5" />
          </button>

          {/* ── RIGHT: COINS + NOTIF + PROFILE / AUTH ── */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {userData?.Session?.UserWallet?.balance !== undefined &&
                  userData?.Session?.UserWallet?.balance !== null && (
                    <ShowCoin balance={userData?.Session?.UserWallet?.balance ?? 0} />
                  )}
                <NotificationMenu key={role} />
                <ProfileMenu
                  userBalance={userData?.Session?.UserWallet?.balance ?? 0}
                  creatorId={user.creators_id}
                  userId={user.users_id}
                  isCreator={user.isCreator}
                  imageUrl={imageUrl}
                  role={role}
                  openCreateContentModal={openCreateContentModal}
                  openRedeemVoucherModal={openRedeemVoucherModal}
                />
              </>
            ) : (
              <>
                <Link href="/login">
                  <span className="
                    hidden sm:inline-flex items-center
                    rounded-xl border border-white/[0.12] hover:border-white/[0.25]
                    px-4 py-2
                    text-[13px] font-semibold text-white/50 hover:text-white
                    hover:bg-white/[0.05]
                    transition-all duration-200 active:scale-[0.97]
                  ">
                    Log In
                  </span>
                </Link>
                <Link href="/register">
                  <span className="
                    inline-flex items-center
                    rounded-xl
                    px-4 py-2
                    text-[13px] font-semibold text-white
                    transition-all duration-200 active:scale-[0.97]
                    relative overflow-hidden
                  "
                  style={{
                    background: "linear-gradient(135deg, #1569c7 0%, #0881AB 50%, #0395BC 100%)",
                    boxShadow: "0 2px 16px rgba(3,149,188,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 24px rgba(3,149,188,0.55), inset 0 1px 0 rgba(255,255,255,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 16px rgba(3,149,188,0.35), inset 0 1px 0 rgba(255,255,255,0.15)"}
                  >
                    Sign Up
                  </span>
                </Link>
              </>
            )}
          </div>
        </section>

        {/* ── MOBILE SEARCH BAR ───────────────────────── */}
        {mobileSearchOpen && (
          <section className="flex items-center gap-2 px-4 py-3 md:hidden"
                   style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="
              flex items-center gap-2.5 flex-1
              rounded-2xl px-4 py-2.5
              border border-white/[0.1]
              focus-within:border-[#0395BC]/45
              focus-within:shadow-[0_0_0_3px_rgba(3,149,188,0.08)]
              transition-all duration-200
            " style={{ background: "rgba(255,255,255,0.04)" }}>
              <Icon icon="solar:magnifer-linear" className="h-4 w-4 text-white/30 flex-shrink-0" />
              <input
                type="text"
                className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/25 focus:outline-none caret-[#38bdf8]"
                placeholder="Cari konten, kreator..."
                maxLength={100}
                value={searchQuery}
                onChange={handleChange}
                onFocus={() => setIsSuggestionOpen(!!searchQuery.trim())}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setIsSuggestionOpen(false); }} className="text-white/20 hover:text-white/50 transition-colors">
                  <Icon icon="solar:close-circle-bold" className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-xl text-white/35 hover:text-white/70 hover:bg-white/[0.06] transition-all border border-white/[0.07]"
              onClick={() => { setMobileSearchOpen(false); setIsSuggestionOpen(false); }}
            >
              <Image className="h-[13px] w-[13px] opacity-50" src={iconMenuClose} alt="close" priority />
            </button>
          </section>
        )}

        {/* Mobile inline suggestions */}
        {mobileSearchOpen && isSuggestionOpen && searchQuery.trim() && (
          <div className="md:hidden px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(1,13,24,0.97)" }}>
            {isSuggFetching ? (
              <div className="flex items-center gap-2 text-[12px] text-white/30 py-1">
                <Icon icon="svg-spinners:3-dots-fade" className="h-3.5 w-3.5 text-[#0395BC]/60" />
                <span>Memuat...</span>
              </div>
            ) : suggItems.length > 0 ? (
              <ul className="space-y-0.5">
                {suggItems.slice(0, 6).map((s, i) => (
                  <li key={i}>
                    <button type="button" onClick={() => handleSelect(s)}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] text-white/48 hover:text-white hover:bg-white/[0.04] transition-all">
                      <Icon icon="solar:magnifer-linear" className="h-3.5 w-3.5 text-white/18 group-hover:text-[#0395BC]/65 flex-shrink-0 transition-colors" />
                      <span className="truncate">{s}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] text-white/25 px-1 py-1">Tidak ada saran.</p>
            )}
          </div>
        )}

        {isMenuBarsOpen && (
          <SideBarMenu
            searchQuery={searchQuery}
            pathname={pathname}
            handleSearchChange={handleChange}
            handleBlur={handleSubmit}
            logoSearch={logoSearch}
            isAuthenticated={isAuthenticated}
          />
        )}

        {/* ── THIN ACCENT LINE at bottom ─────────────── */}
        <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${isScrolled ? "opacity-100" : "opacity-0"}`}
             style={{ background: "linear-gradient(90deg, transparent 0%, rgba(3,149,188,0.25) 30%, rgba(56,189,248,0.4) 50%, rgba(3,149,188,0.25) 70%, transparent 100%)" }} />
      </nav>

      {/* ═══════════════════════════════════════════════
          COMMAND PALETTE (desktop)
      ═══════════════════════════════════════════════ */}
      {cmdOpen && <CommandPalette />}

      {/* BACKDROP */}
      {cmdOpen && (
        <div
          className="fixed inset-0 z-[49] hidden md:block"
          style={{ background: "rgba(0,8,16,0.6)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
          onClick={closeCmd}
        />
      )}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[29] md:hidden bg-black/40" onClick={() => { setMobileSearchOpen(false); setIsSuggestionOpen(false); }} />
      )}
    </Fragment>
  );
}

NavbarContent.propTypes = {
  openCreateContentModal: PropTypes.func.isRequired,
  openRedeemVoucherModal: PropTypes.func.isRequired,
};