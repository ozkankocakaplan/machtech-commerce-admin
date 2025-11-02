import {
  BookOpen,
  CircleHalfSolid,
  ChevronUpMini,
  Keyboard,
  OpenRectArrowOut,
  TimelineVertical,
  User as UserIcon,
  XMark,
} from "@medusajs/icons"
import {
  Avatar,
  DropdownMenu,
  Heading,
  IconButton,
  Input,
  Kbd,
  Text,
  clx,
} from "@medusajs/ui"
import { Dialog as RadixDialog } from "radix-ui"
import { useTranslation } from "react-i18next"

import { Skeleton } from "../../common/skeleton"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useLogout, useMe } from "../../../hooks/api"
import { queryClient } from "../../../lib/query-client"
import { useGlobalShortcuts } from "../../../providers/keybind-provider/hooks"
import { useTheme } from "../../../providers/theme-provider"
import { useDocumentDirection } from "../../../hooks/use-document-direction"

export const UserMenu = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const direction = useDocumentDirection()

  const [openMenu, setOpenMenu] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const toggleModal = () => {
    setOpenMenu(false)
    setOpenModal(!openModal)
  }

  return (
    <div>
      <DropdownMenu dir={direction} open={openMenu} onOpenChange={setOpenMenu}>
        <UserBadge />
        <DropdownMenu.Content className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-w-[var(--radix-dropdown-menu-trigger-width)]">
          <UserItem />
          <DropdownMenu.Separator />
          <DropdownMenu.Item asChild>
            <Link to="/settings/profile" state={{ from: location.pathname }}>
              <UserIcon className="text-ui-fg-subtle me-2" />
              {t("app.menus.user.profileSettings")}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item asChild>
            <Link to="https://docs.medusajs.com" target="_blank">
              <BookOpen className="text-ui-fg-subtle me-2" />
              {t("app.menus.user.documentation")}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link to="https://medusajs.com/changelog/" target="_blank">
              <TimelineVertical className="text-ui-fg-subtle me-2" />
              {t("app.menus.user.changelog")}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={toggleModal}>
            <Keyboard className="text-ui-fg-subtle me-2" />
            {t("app.menus.user.shortcuts")}
          </DropdownMenu.Item>
          <ThemeToggle />
          <DropdownMenu.Separator />
          <Logout />
        </DropdownMenu.Content>
      </DropdownMenu>
      <GlobalKeybindsModal open={openModal} onOpenChange={setOpenModal} />
    </div>
  )
}

const UserBadge = () => {
  const { user, isPending, isError, error } = useMe()

  // Get user name and display name
  const name = user ? [user.first_name, user.last_name].filter(Boolean).join(" ") : ""
  const displayName = name || user?.email || ""

  // Get initials for avatar from first_name and last_name, or from email
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    if (user?.first_name) {
      return user.first_name.substring(0, 2).toUpperCase()
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return "AA"
  }

  const initials = user ? getInitials() : "AA"
  const role = "Administrator" // Role text

  if (isPending) {
    return (
      <div className="h-[90px] bg-[#172b4f] flex items-center justify-center hover:bg-[#1a315b] rounded-b-lg">
        <div className="flex w-full items-center gap-3 py-4 px-3 h-full">
          {/* Avatar skeleton with orange background */}
          <div className="flex size-8 items-center justify-center shrink-0">
            <div
              className="h-8 w-8 rounded-full animate-pulse opacity-60"
              style={{ backgroundColor: '#F57C00' }}
            />
          </div>

          {/* Display name and role skeleton */}
          <div className="flex flex-col items-start overflow-hidden flex-1 min-w-0 gap-1">
            <Skeleton className="h-4 w-[140px] rounded" />
            <div
              className="h-3.5 w-[100px] rounded animate-pulse opacity-60"
              style={{ backgroundColor: '#FFB300' }}
            />
          </div>

          {/* Icon skeleton */}
          <div
            className="h-4 w-4 rounded shrink-0 animate-pulse opacity-60"
            style={{ backgroundColor: '#CFD8DC' }}
          />
        </div>
      </div>
    )
  }

  if (isError) {
    throw error
  }

  return (
    <div className="h-[90px] bg-[#172b4f] flex items-center justify-center hover:bg-[#1a315b] rounded-b-lg">
      <DropdownMenu.Trigger
        disabled={!user}
        className={clx(
          "flex w-full cursor-pointer items-center gap-3 py-4 px-3 outline-none h-full",
          "data-[state=open]:bg-[#172b4f]",
          "focus-visible:shadow-borders-focus"
        )}
      >
        {/* Avatar with orange background */}
        <div className="flex size-8 items-center justify-center shrink-0">
          <div
            className="flex size-8 items-center justify-center rounded-full text-white font-bold text-sm"
            style={{ backgroundColor: '#F57C00' }}
          >
            {initials}
          </div>
        </div>

        {/* Display name and role */}
        <div className="flex flex-col items-start overflow-hidden flex-1 min-w-0">
          <Text
            size="small"
            weight="plus"
            leading="compact"
            className="truncate text-white"
          >
            {displayName}
          </Text>
          <Text
            size="small"
            leading="compact"
            className="truncate"
            style={{ color: '#FFB300' }}
          >
            {role}
          </Text>
        </div>

        {/* Upward caret icon */}
        <ChevronUpMini className="text-[#CFD8DC] shrink-0" />
      </DropdownMenu.Trigger>
    </div>
  )
}

const ThemeToggle = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu.SubMenu>
      <DropdownMenu.SubMenuTrigger dir="ltr" className="rounded-md rtl:rotate-180">
        <CircleHalfSolid className="text-ui-fg-subtle me-2" />
        <span className="rtl:rotate-180">{t("app.menus.user.theme.label")}</span>
      </DropdownMenu.SubMenuTrigger>
      <DropdownMenu.SubMenuContent>
        <DropdownMenu.RadioGroup value={theme}>
          <DropdownMenu.RadioItem
            value="system"
            onClick={(e) => {
              e.preventDefault()
              setTheme("system")
            }}
          >
            {t("app.menus.user.theme.system")}
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem
            value="light"
            onClick={(e) => {
              e.preventDefault()
              setTheme("light")
            }}
          >
            {t("app.menus.user.theme.light")}
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem
            value="dark"
            onClick={(e) => {
              e.preventDefault()
              setTheme("dark")
            }}
          >
            {t("app.menus.user.theme.dark")}
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.SubMenuContent>
    </DropdownMenu.SubMenu>
  )
}

const Logout = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { mutateAsync: logoutMutation } = useLogout()

  const handleLogout = async () => {
    await logoutMutation(undefined, {
      onSuccess: () => {
        /**
         * When the user logs out, we want to clear the query cache
         */
        queryClient.clear()
        navigate("/login")
      },
    })
  }

  return (
    <DropdownMenu.Item onClick={handleLogout}>
      <div className="flex items-center gap-x-2">
        <OpenRectArrowOut className="text-ui-fg-subtle" />
        <span>{t("app.menus.actions.logout")}</span>
      </div>
    </DropdownMenu.Item>
  )
}

const GlobalKeybindsModal = (props: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const { t } = useTranslation()
  const globalShortcuts = useGlobalShortcuts()

  const [searchValue, onSearchValueChange] = useState("")

  const searchResults = searchValue
    ? globalShortcuts.filter((shortcut) => {
      return shortcut.label.toLowerCase().includes(searchValue?.toLowerCase())
    })
    : globalShortcuts

  return (
    <RadixDialog.Root {...props}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="bg-ui-bg-overlay fixed inset-0" />
        <RadixDialog.Content className="bg-ui-bg-subtle shadow-elevation-modal fixed left-[50%] top-[50%] flex h-full max-h-[612px] w-full max-w-[560px] translate-x-[-50%] translate-y-[-50%] flex-col divide-y overflow-hidden rounded-lg">
          <div className="flex flex-col gap-y-3 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <RadixDialog.Title asChild>
                  <Heading>{t("app.menus.user.shortcuts")}</Heading>
                </RadixDialog.Title>
                <RadixDialog.Description className="sr-only"></RadixDialog.Description>
              </div>
              <div className="flex items-center gap-x-2">
                <Kbd>esc</Kbd>
                <RadixDialog.Close asChild>
                  <IconButton variant="transparent" size="small">
                    <XMark />
                  </IconButton>
                </RadixDialog.Close>
              </div>
            </div>
            <div>
              <Input
                type="search"
                value={searchValue}
                onChange={(e) => onSearchValueChange(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col divide-y overflow-y-auto">
            {searchResults.map((shortcut, index) => {
              return (
                <div
                  key={index}
                  className="text-ui-fg-subtle flex items-center justify-between px-6 py-3"
                >
                  <Text size="small">{shortcut.label}</Text>
                  <div className="flex items-center gap-x-1">
                    {shortcut.keys.Mac?.map((key, index) => {
                      return (
                        <div className="flex items-center gap-x-1" key={index}>
                          <Kbd>{key}</Kbd>
                          {index < (shortcut.keys.Mac?.length || 0) - 1 && (
                            <span className="txt-compact-xsmall text-ui-fg-subtle">
                              {t("app.keyboardShortcuts.then")}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

const UserItem = () => {
  const { user, isPending, isError, error } = useMe()

  const loaded = !isPending && !!user

  if (!loaded) {
    return <div></div>
  }

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ")
  const email = user.email
  const fallback = name ? name[0].toUpperCase() : email[0].toUpperCase()
  const avatar = user.avatar_url

  if (isError) {
    throw error
  }

  return (
    <div className="flex items-center gap-x-3 overflow-hidden px-2 py-1">
      <Avatar
        size="small"
        variant="rounded"
        src={avatar || undefined}
        fallback={fallback}
      />
      <div className="block w-full min-w-0 max-w-[187px] overflow-hidden whitespace-nowrap">
        <Text
          size="small"
          weight="plus"
          leading="compact"
          className="overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {name || email}
        </Text>
        {!!name && (
          <Text
            size="xsmall"
            leading="compact"
            className="text-ui-fg-subtle overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {email}
          </Text>
        )}
      </div>
    </div>
  )
}
