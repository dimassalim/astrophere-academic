"use client";

import classnames from "classnames";

import { usePathname } from "next/navigation";

import { useLayoutEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import Container from "@/components/Container";
import Link from "@/components/ViewTransitionLink";

import { LINKS, SITE } from "@/lib/config";
import getTheme from "@/lib/getTheme";

import styles from "@/styles/header.module.css";

export interface HeaderProps {
  open?: boolean;
  onToggleDrawer?: () => void;
}

export default function Header({ open, onToggleDrawer: handleToggleDrawer }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const headerRef = useRef<HTMLElement>(null);

  const subpath = pathname.match(/[^/]+/g);

  const handleClickChangeTheme = () => {
    const theme = getTheme() === "dark" ? "light" : "dark";

    const css = document.createElement("style");
    css.appendChild(
      document.createTextNode(
        `* {
             -webkit-transition: none !important;
             -moz-transition: none !important;
             -o-transition: none !important;
             -ms-transition: none !important;
             transition: none !important;
          }`
      )
    );

    document.head.appendChild(css);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.head.removeChild(css);

    localStorage.theme = theme;
  };

  const isMatched = (href: string) => pathname === href || "/" + subpath?.[0] === href;

  useLayoutEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      headerRef.current?.classList.toggle("scrolled", scrolled);
      setScrolled(scrolled);
    };

    document.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [headerRef]);

  return (
    <header
      ref={headerRef}
      id="header"
      className={classnames(styles.header, "fixed top-0 w-full h-16 z-50", {
        [styles["not-scrolled"]]: !scrolled,
        [styles["scrolled"]]: scrolled,
      })}
    >
      <Container size="md">
        <div className="relative h-full w-full">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex gap-1 font-semibold">
            <Link
              href="/"
              className="flex gap-1 text-current hover:text-black dark:hover:text-white transition-colors duration-300 ease-in-out"
            >
              <svg className="size-6 fill-current">
                <use href="/brand.svg#brand"></use>
              </svg>
              <div>{SITE.TITLE}</div>
            </Link>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <nav className="hidden md:flex items-center justify-center text-sm gap-1">
              {LINKS.map((LINK, i) => (
                <Link
                  key={`link-${i}`}
                  href={LINK.HREF}
                  className={twMerge(
                    classnames(
                      "h-8 rounded-full px-3 text-current",
                      "flex items-center justify-center",
                      "transition-colors duration-300 ease-in-out",
                      {
                        "bg-black dark:bg-white text-white dark:text-black": isMatched(LINK.HREF),
                        "hover:bg-black/5 dark:hover:bg-white/20 hover:text-black dark:hover:text-white":
                          !isMatched(LINK.HREF),
                      }
                    )
                  )}
                >
                  {LINK.TEXT}
                </Link>
              ))}
            </nav>
          </div>

          <div className="buttons absolute right-0 top-1/2 -translate-y-1/2 flex gap-1">
            <Link
              href="/search"
              aria-label={`Search blog posts and projects on ${SITE.TITLE}`}
              className={twMerge(
                classnames(
                  "hidden md:flex",
                  "size-9 rounded-full p-2 items-center justify-center",
                  "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                  "stroke-current hover:stroke-black hover:dark:stroke-white",
                  "border border-black/10 dark:border-white/25",
                  "transition-colors duration-300 ease-in-out",
                  pathname === "/search" || "/" + subpath?.[0] === "/search"
                    ? "pointer-events-none bg-black dark:bg-white text-white dark:text-black"
                    : ""
                )
              )}
            >
              <svg className="size-full">
                <use href="/ui.svg#search"></use>
              </svg>
            </Link>

            <Link
              href="/rss.xml"
              target="_blank"
              aria-label={`Rss feed for ${SITE.TITLE}`}
              className={twMerge(
                classnames(
                  "hidden md:flex",
                  "size-9 rounded-full p-2 items-center justify-center",
                  "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                  "stroke-current hover:stroke-black hover:dark:stroke-white",
                  "border border-black/10 dark:border-white/25",
                  "transition-colors duration-300 ease-in-out"
                )
              )}
            >
              <svg className="size-full">
                <use href="/ui.svg#rss"></use>
              </svg>
            </Link>

            <button
              id="header-theme-button"
              aria-label="Toggle light and dark theme"
              className={twMerge(
                classnames(
                  "hidden md:flex",
                  "size-9 rounded-full p-2 items-center justify-center",
                  "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                  "stroke-current hover:stroke-black hover:dark:stroke-white",
                  "border border-black/10 dark:border-white/25",
                  "transition-colors duration-300 ease-in-out"
                )
              )}
              onClick={handleClickChangeTheme}
            >
              <svg className="size-full block dark:hidden">
                <use href="/ui.svg#sun"></use>
              </svg>
              <svg className="size-full hidden dark:block">
                <use href="/ui.svg#moon"></use>
              </svg>
            </button>

            <button
              aria-label="Toggle drawer open and closed"
              className={twMerge(
                classnames(
                  "flex md:hidden",
                  "size-9 rounded-full p-2 items-center justify-center",
                  "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                  "stroke-current hover:stroke-black hover:dark:stroke-white",
                  "border border-black/10 dark:border-white/25",
                  "transition-colors duration-300 ease-in-out"
                )
              )}
              onClick={() => handleToggleDrawer?.()}
            >
              <svg
                id="drawer-open"
                className={classnames("size-full", {
                  block: !open,
                  hidden: open,
                })}
              >
                <use href="/ui.svg#menu"></use>
              </svg>
              <svg
                id="drawer-close"
                className={classnames("size-full", {
                  block: open,
                  hidden: !open,
                })}
              >
                <use href="/ui.svg#x"></use>
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
