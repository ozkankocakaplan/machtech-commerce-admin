import {
  ChevronDownMini,
  CogSixTooth,
  MinusMini,
  ShoppingCart,
  SquaresPlus,
  Tag,
  Users,
  Sparkles,
} from "@medusajs/icons"
import { Avatar, Text, clx } from "@medusajs/ui"
import { Collapsible as RadixCollapsible } from "radix-ui"
import { useTranslation } from "react-i18next"
import React, { useState, useRef, useEffect } from "react"

import { useStore } from "../../../hooks/api/store"
import { Skeleton } from "../../common/skeleton"
import { INavItem, NavItem } from "../../layout/nav-item"
import { Shell } from "../../layout/shell"

import { useLocation, NavLink, useNavigate } from "react-router-dom"
import { createPortal } from "react-dom"
import { useExtension } from "../../../providers/extension-provider"
import { UserMenu } from "../user-menu"

export const MainLayout = () => {
  return (
    <Shell>
      <MainSidebar />
    </Shell>
  )
}

const MainSidebar = () => {
  return (
    <aside className="flex flex-1 flex-col justify-between overflow-y-auto">
      <div className="flex flex-1 flex-col relative">
        <div className="sticky top-0">
          <Header />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-1 flex-col">
            <CoreRouteSection />
            <ExtensionRouteSection />
          </div>
        </div>
        <div className="sticky bottom-0">
          <UserSection />
        </div>
      </div>
    </aside>
  )
}

const Header = () => {
  const { store, isError, error } = useStore()
  const name = store?.name
  const fallback = store?.name?.slice(0, 1).toUpperCase()

  if (isError) {
    throw error
  }

  return (
    <div className="h-[90px] flex items-center justify-center">
      <div className="flex w-full items-center gap-3 py-4 px-4 h-full">
        <div className="flex size-8 items-center justify-center shrink-0">
          {fallback ? (
            <Avatar variant="squared" size="xsmall" fallback={fallback} />
          ) : (
            <Skeleton className="h-6 w-6 rounded-md" />
          )}
        </div>
        <div className="block overflow-hidden text-start flex-1 min-w-0">
          {name ? (
            <Text
              size="small"
              weight="plus"
              leading="compact"
              className="truncate text-white"
            >
              {store.name}
            </Text>
          ) : (
            <Skeleton className="h-[9px] w-[120px]" />
          )}
        </div>
      </div>
    </div>
  )
}

const useCoreRoutes = (): Omit<INavItem, "pathname">[] => {
  const { t } = useTranslation()

  return [
    {
      icon: <SquaresPlus color="rgb(106, 214, 240)" />,
      label: t("app.nav.dashboard", "Dashboard"),
      to: "/dashboard",
    },
    {
      icon: <Tag color="rgb(87, 217, 163)" />,
      label: t("app.nav.catalogues", "Catalogues"),
      to: "/catalogues",
      items: [
        {
          label: t("products.domain"),
          to: "/products",
        },
        {
          label: t("app.nav.reviews", "Reviews"),
          to: "/reviews",
        },
        {
          label: t("categories.domain"),
          to: "/categories",
        },
        {
          label: t("collections.domain"),
          to: "/collections",
        },
        {
          label: t("inventory.domain"),
          to: "/inventory",
        },
      ],
    },
    {
      icon: <ShoppingCart color="rgb(160, 146, 240)" />,
      label: t("orders.domain"),
      to: "/orders",
    },
    {
      icon: <Users color="rgb(248, 137, 98)" />,
      label: t("customers.domain"),
      to: "/customers",
    },
    {
      icon: <Sparkles color="rgb(255, 215, 0)" />,
      label: t("app.nav.marketing", "Marketing"),
      to: "/marketing",
      items: [
        {
          label: t("promotions.domain"),
          to: "/promotions",
        },
        {
          label: t("priceLists.domain"),
          to: "/price-lists",
        },
      ],
    },
    {
      icon: <CogSixTooth color="rgb(154, 168, 181)" />,
      label: t("app.nav.settings.header", "Settings"),
      to: "/settings",
    },
  ]
}

type CoreRouteItemProps = {
  icon?: React.ReactNode
  label: string
  to: string
  items?: Array<{ label: string; to: string }>
}

const CoreRouteItem = ({ icon, label, to, items }: CoreRouteItemProps) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [isClickedOpen, setIsClickedOpen] = useState(false)
  const [allowHover, setAllowHover] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, itemHeight: 50 })

  const isActive = pathname.startsWith(to)
  const isExactActive = pathname === to
  const hasItems = items && items.length > 0
  const isFlyoutOpen = isHovered
  const isDropdownOpen = isClickedOpen
  const hasActiveNestedItem = items?.some(item => pathname === item.to)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isFlyoutOpen && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.top,
        left: rect.right,
        itemHeight: rect.height,
      })
    }
  }, [isFlyoutOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isClickedOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        itemRef.current &&
        !itemRef.current.contains(event.target as Node)
      ) {
        setIsClickedOpen(false)
        setAllowHover(true)
      }
    }

    if (isClickedOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isClickedOpen])

  const handleMouseEnter = () => {
    if (allowHover && !isClickedOpen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isClickedOpen) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(false)
      }, 150)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (hasItems) {
      e.preventDefault()
      const willBeOpen = !isClickedOpen
      setIsClickedOpen(willBeOpen)
      setIsHovered(false)

      if (!willBeOpen) {
        setAllowHover(true)
      }
    } else {
      navigate(to)
    }
  }

  return (
    <>
      <div
        ref={itemRef}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hasItems ? (
          <button
            onClick={handleClick}
            className={clx(
              "w-full text-white transition-all duration-200 flex items-center gap-x-2 h-[50px] py-0 pl-5 pr-2 outline-none focus-visible:shadow-borders-focus",
              {
                "bg-[#0d2145]": isExactActive,
                "bg-[#172b4f]": (isActive || isDropdownOpen || hasActiveNestedItem) && !isExactActive,
                "hover:bg-[#172b4f]": !isExactActive,
              }
            )}
          >
            <div className="flex w-6 h-6 items-center justify-center ">{icon}</div>
            <Text size="small" weight="plus" leading="compact" className="text-white text-[14px]">
              {label}
            </Text>
          </button>
        ) : (
          <NavLink
            to={to}
            className={({ isActive: navIsActive }) => {
              return clx(
                "text-white transition-all duration-200 hover:bg-[#172b4f] flex items-center gap-x-2 h-[50px] py-0 pl-5 pr-2 outline-none focus-visible:shadow-borders-focus ",
                {
                  "bg-[#172b4f]": isActive || navIsActive,
                }
              )
            }}
          >
            <div className="flex w-6 h-6 items-center justify-center ">{icon}</div>
            <Text size="small" weight="plus" leading="compact" className="text-white text-[14px]">
              {label}
            </Text>
          </NavLink>
        )}

        {hasItems && (
          <RadixCollapsible.Root
            open={isDropdownOpen}
            onOpenChange={setIsClickedOpen}
          >
            <RadixCollapsible.Content className="hidden lg:block">
              <div className="flex flex-col  pb-2  ">
                {items?.map((item) => {
                  const itemIsActive = pathname === item.to
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end
                      className={({ isActive: navIsActive }) => {
                        const isSelected = itemIsActive || navIsActive
                        return clx(
                          "text-white transition-colors duration-150 flex items-center pl-[55px] pr-2 py-2 outline-none h-[50px]",
                          {
                            "bg-[#0d2145]": isSelected,
                            "bg-[#172b4f]": isDropdownOpen && !isSelected,
                            "hover:bg-[#172b4f]": !isSelected,
                          }
                        )
                      }}
                    >
                      <Text size="small" weight="plus" leading="compact" className="text-white text-[14px]">
                        {item.label}
                      </Text>
                    </NavLink>
                  )
                })}
              </div>
            </RadixCollapsible.Content>
          </RadixCollapsible.Root>
        )}

        {hasItems && (
          <RadixCollapsible.Root
            defaultOpen={[to, ...(items?.map((i) => i.to) ?? [])].some((p) =>
              pathname.startsWith(p)
            )}
          >
            <RadixCollapsible.Trigger className="text-white hover:text-white transition-all duration-200 hover:bg-[#172b4f] flex w-full items-center gap-x-2 rounded-md py-2 pl-3 pr-2 outline-none lg:hidden">
              <div className="flex w-6 h-6 items-center justify-center [&>svg]:w-6 [&>svg]:h-6">{icon}</div>
              <Text size="small" weight="plus" leading="compact" className="text-white text-[14px]">
                {label}
              </Text>
            </RadixCollapsible.Trigger>
            <RadixCollapsible.Content>
              <div className="flex flex-col gap-y-0.5 pb-2 pt-0.5 lg:hidden">
                <NavLink
                  to={to}
                  end
                  className={({ isActive: navIsActive }) => {
                    return clx(
                      "text-white transition-colors duration-150 hover:bg-[#172b4f] flex items-center pl-10 pr-2 py-2 outline-none",
                      {
                        "bg-[#172b4f]": isActive || navIsActive,
                      }
                    )
                  }}
                >
                  <Text size="small" weight="plus" leading="compact" className="text-white text-[14px]">
                    {label}
                  </Text>
                </NavLink>
                {items?.map((item) => {
                  const itemIsActive = pathname === item.to
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end
                      className={({ isActive: navIsActive }) => {
                        return clx(
                          "text-white transition-colors duration-150 hover:bg-[#172b4f] flex items-center pl-10 pr-2 py-2 outline-none",
                          {
                            "bg-[#172b4f]": itemIsActive || navIsActive,
                          }
                        )
                      }}
                    >
                      <Text size="small" weight="plus" leading="compact" className="text-white text-[14px]">
                        {item.label}
                      </Text>
                    </NavLink>
                  )
                })}
              </div>
            </RadixCollapsible.Content>
          </RadixCollapsible.Root>
        )}
      </div>

      {hasItems &&
        isFlyoutOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            className="hidden lg:flex fixed z-[9999] overflow-hidden flex-col"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="absolute -left-[2px] top-0 w-[2px] bg-[#283046]"
              style={{
                height: `${menuPosition.itemHeight}px`,
              }}
            />

            <div className="bg-[#243758] w-64 flex flex-col relative">
              <div className="flex flex-col">
                <div className="flex flex-col">
                  {items?.map((item, index) => {
                    const itemIsActive = pathname === item.to
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        onClick={() => {
                          setIsClickedOpen(false)
                          setAllowHover(true)
                        }}
                        className={({ isActive: navIsActive }) => {
                          const isSelected = itemIsActive || navIsActive
                          return clx(
                            "text-white transition-colors duration-150 flex items-center px-4 outline-none h-[50px]",
                            {
                              "bg-[#0d2145]": isSelected,
                              "bg-[#293f65]": isFlyoutOpen && !isSelected,
                              "hover:bg-[#293f65]": !isSelected,
                              "pt-0": index === 0,
                            }
                          )
                        }}
                      >
                        <Text
                          size="small"
                          weight="plus"
                          leading="compact"
                          className="text-white text-[14px]"
                        >
                          {item.label}
                        </Text>
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

const CoreRouteSection = () => {
  const coreRoutes = useCoreRoutes()

  const { getMenu } = useExtension()

  const menuItems = getMenu("coreExtensions")

  menuItems.forEach((item) => {
    if (item.nested) {
      const route = coreRoutes.find((route) => route.to === item.nested)
      if (route) {
        route.items?.push(item)
      }
    }
  })

  return (
    <nav className="flex flex-col gap-y-1 py-3">
      {coreRoutes.map((route) => {
        return (
          <CoreRouteItem
            key={route.to}
            icon={route.icon}
            label={route.label}
            to={route.to}
            items={route.items}
          />
        )
      })}
    </nav>
  )
}

const ExtensionRouteSection = () => {
  const { t } = useTranslation()
  const { getMenu } = useExtension()

  const menuItems = getMenu("coreExtensions").filter((item) => !item.nested)

  if (!menuItems.length) {
    return null
  }

  return (
    <div>
      <div className="flex flex-col gap-y-1 py-3">
        <RadixCollapsible.Root defaultOpen>
          <div className="px-4">
            <RadixCollapsible.Trigger asChild className="group/trigger">
              <button className="text-white flex w-full items-center justify-between px-2">
                <Text size="xsmall" weight="plus" leading="compact" className="text-white">
                  {t("app.nav.common.extensions")}
                </Text>
                <div className="text-gray-400">
                  <ChevronDownMini className="group-data-[state=open]/trigger:hidden" />
                  <MinusMini className="group-data-[state=closed]/trigger:hidden" />
                </div>
              </button>
            </RadixCollapsible.Trigger>
          </div>
          <RadixCollapsible.Content>
            <nav className="flex flex-col gap-y-0.5 py-1 pb-4">
              {menuItems.map((item, i) => {
                return (
                  <NavItem
                    key={i}
                    to={item.to}
                    label={item.label}
                    icon={item.icon ? item.icon : <SquaresPlus />}
                    items={item.items}
                    type="extension"
                  />
                )
              })}
            </nav>
          </RadixCollapsible.Content>
        </RadixCollapsible.Root>
      </div>
    </div>
  )
}

const UserSection = () => {
  return (
    <div>
      <UserMenu />
    </div>
  )
}
