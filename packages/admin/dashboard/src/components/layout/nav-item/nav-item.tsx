import { Kbd, Text, clx } from "@medusajs/ui"
import { Collapsible as RadixCollapsible } from "radix-ui"
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { NavLink, useLocation } from "react-router-dom"
import { useGlobalShortcuts } from "../../../providers/keybind-provider/hooks"
import { ConditionalTooltip } from "../../common/conditional-tooltip"

type ItemType = "core" | "extension" | "setting"

type NestedItemProps = {
  label: string
  to: string
}

export type INavItem = {
  icon?: ReactNode
  label: string
  to: string
  items?: NestedItemProps[]
  type?: ItemType
  from?: string
  nested?: string
}

const BASE_NAV_LINK_CLASSES =
  "text-white transition-all duration-200 hover:bg-[#172b4f] flex items-center gap-x-2  py-2 pl-3 pr-2 outline-none [&>svg]:text-white focus-visible:shadow-borders-focus"
const ACTIVE_NAV_LINK_CLASSES =
  "bg-[#172b4f] text-white hover:bg-[#172b4f]"
const NESTED_NAV_LINK_CLASSES = "pl-10 pr-2 py-0 w-full text-white h-[50px]"
const SETTING_NAV_LINK_CLASSES = "pl-3 py-2"

const getIsOpen = (
  to: string,
  items: NestedItemProps[] | undefined,
  pathname: string
) => {
  return [to, ...(items?.map((i) => i.to) ?? [])].some((p) =>
    pathname.startsWith(p)
  )
}

const NavItemTooltip = ({
  to,
  children,
}: PropsWithChildren<{ to: string }>) => {
  const { t } = useTranslation()
  const globalShortcuts = useGlobalShortcuts()
  const shortcut = globalShortcuts.find((s) => s.to === to)

  return (
    <ConditionalTooltip
      showTooltip={!!shortcut}
      maxWidth={9999} // Don't limit the width of the tooltip
      content={
        <div className="txt-compact-xsmall flex h-5 items-center justify-between gap-x-2 whitespace-nowrap">
          <span>{shortcut?.label}</span>
          <div className="flex items-center gap-x-1">
            {shortcut?.keys.Mac?.map((key, index) => (
              <div className="flex items-center gap-x-1" key={index}>
                <Kbd key={key}>{key}</Kbd>
                {index < (shortcut.keys.Mac?.length || 0) - 1 && (
                  <span className="text-ui-fg-muted txt-compact-xsmall">
                    {t("app.keyboardShortcuts.then")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      }
      side="right"
      delayDuration={1500}
    >
      <div className="w-full">{children}</div>
    </ConditionalTooltip>
  )
}

export const NavItem = ({
  icon,
  label,
  to,
  items,
  type = "core",
  from,
}: INavItem) => {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(getIsOpen(to, items, pathname))
  const [hoverOpen, setHoverOpen] = useState(false)

  useEffect(() => {
    setOpen(getIsOpen(to, items, pathname))
  }, [pathname, to, items])

  const navLinkClassNames = useCallback(
    ({
      to,
      isActive,
      isNested = false,
      isSetting = false,
    }: {
      to: string
      isActive: boolean
      isNested?: boolean
      isSetting?: boolean
    }) => {
      if (["core", "setting"].includes(type)) {
        isActive = pathname.startsWith(to)
      }

      return clx(BASE_NAV_LINK_CLASSES, {
        [NESTED_NAV_LINK_CLASSES]: isNested,
        [ACTIVE_NAV_LINK_CLASSES]: isActive,
        [SETTING_NAV_LINK_CLASSES]: isSetting,
        "h-[50px] py-0": type === "core" && !isNested,
      })
    },
    [type, pathname]
  )

  const isSetting = type === "setting"

  return (
    <div
      className="pl-3 pr-0 relative group"
      onMouseEnter={() => setHoverOpen(true)}
      onMouseLeave={() => setHoverOpen(false)}
    >
      <NavItemTooltip to={to}>
        <NavLink
          to={to}
          end={items?.some((i) => i.to === pathname)}
          state={
            from
              ? {
                from,
              }
              : undefined
          }
          className={({ isActive }) => {
            return clx(navLinkClassNames({ isActive, isSetting, to }), {
              " max-lg:hidden": !!items?.length,
            })
          }}
        >
          {type !== "setting" && (
            <div className="flex w-6 h-6 items-center justify-center [&>svg]:w-6 [&>svg]:h-6">
              <Icon icon={icon} type={type} />
            </div>
          )}
          <Text size="small" weight="plus" leading="compact" className="text-white text-[14px]">
            {label}
          </Text>
        </NavLink>
      </NavItemTooltip>

      {/* Desktop Fly-out Menu */}
      {items && items.length > 0 && (
        <div className="hidden lg:block">
          {hoverOpen && (
            <div className="absolute left-full top-0 bg-[#283046] w-56 shadow-lg z-50 border-l border-[#36415C]">
              <div className="flex flex-col py-2">
                <NavItemTooltip to={to}>
                  <NavLink
                    to={to}
                    end
                    className={({ isActive }) => {
                      return clx(
                        navLinkClassNames({
                          to,
                          isActive,
                          isSetting,
                          isNested: true,
                        })
                      )
                    }}
                  >
                    <Text size="small" weight="plus" leading="compact" className="text-white text-[14px]">
                      {label}
                    </Text>
                  </NavLink>
                </NavItemTooltip>
                {items.map((item) => {
                  return (
                    <NavItemTooltip key={item.to} to={item.to}>
                      <NavLink
                        to={item.to}
                        end
                        className={({ isActive }) => {
                          return clx(
                            navLinkClassNames({
                              to: item.to,
                              isActive,
                              isSetting,
                              isNested: true,
                            })
                          )
                        }}
                      >
                        <Text size="small" weight="plus" leading="compact" className="text-white text-[14px]">
                          {item.label}
                        </Text>
                      </NavLink>
                    </NavItemTooltip>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Collapsible */}
      {items && items.length > 0 && (
        <RadixCollapsible.Root open={open} onOpenChange={setOpen}>
          <RadixCollapsible.Trigger
            className={clx(
              "text-white hover:text-white transition-all duration-200 hover:bg-[#172b4f] flex w-full items-center gap-x-2 rounded-md py-2 pl-3 pr-2 outline-none lg:hidden h-[50px]",
              { "pl-3": isSetting }
            )}
          >
            <div className="flex w-6 h-6 items-center justify-center [&>svg]:w-6 [&>svg]:h-6">
              <Icon icon={icon} type={type} />
            </div>
            <Text size="small" weight="plus" leading="compact" className="text-white text-[14px]">
              {label}
            </Text>
          </RadixCollapsible.Trigger>
          <RadixCollapsible.Content>
            <div className="flex flex-col gap-y-0.5 pb-2 pt-0.5">
              <ul className="flex flex-col gap-y-0.5">
                <li className="flex w-full items-center gap-x-1 lg:hidden">
                  <NavItemTooltip to={to}>
                    <NavLink
                      to={to}
                      end
                      className={({ isActive }) => {
                        return clx(
                          navLinkClassNames({
                            to,
                            isActive,
                            isSetting,
                            isNested: true,
                          })
                        )
                      }}
                    >
                      <Text size="small" weight="plus" leading="compact" className="text-white text-[14px]">
                        {label}
                      </Text>
                    </NavLink>
                  </NavItemTooltip>
                </li>
                {items.map((item) => {
                  return (
                    <li key={item.to} className="flex h-[50px] items-center">
                      <NavItemTooltip to={item.to}>
                        <NavLink
                          to={item.to}
                          end
                          className={({ isActive }) => {
                            return clx(
                              navLinkClassNames({
                                to: item.to,
                                isActive,
                                isSetting,
                                isNested: true,
                              })
                            )
                          }}
                        >
                          <Text size="small" weight="plus" leading="compact" className="text-white text-[14px]">
                            {item.label}
                          </Text>
                        </NavLink>
                      </NavItemTooltip>
                    </li>
                  )
                })}
              </ul>
            </div>
          </RadixCollapsible.Content>
        </RadixCollapsible.Root>
      )}
    </div>
  )
}

const Icon = ({ icon, type }: { icon?: ReactNode; type: ItemType }) => {
  if (!icon) {
    return null
  }

  return type === "extension" ? (
    <div className="shadow-borders-base bg-ui-bg-base flex h-6 w-6 items-center justify-center rounded-[4px]">
      <div className="h-[24px] w-[24px] overflow-hidden rounded-sm">{icon}</div>
    </div>
  ) : (
    icon
  )
}
