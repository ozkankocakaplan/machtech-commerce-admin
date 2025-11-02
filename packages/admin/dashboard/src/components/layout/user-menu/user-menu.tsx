import {
  ChevronDownMini,
  OpenRectArrowOut,
  User as UserIcon,
} from "@medusajs/icons"
import {
  Text,
  clx,
} from "@medusajs/ui"
import { Collapsible as RadixCollapsible } from "radix-ui"
import { useTranslation } from "react-i18next"

import { Skeleton } from "../../common/skeleton"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useLogout, useMe } from "../../../hooks/api"
import { queryClient } from "../../../lib/query-client"

export const UserMenu = () => {
  const location = useLocation()

  const [open, setOpen] = useState(false)

  return (
    <RadixCollapsible.Root open={open} onOpenChange={setOpen}>
      <UserBadge />
      <RadixCollapsible.Content>
        <div className="bg-[#172b4f] flex flex-col">
          <ProfileLink location={location} />
          <Logout />
        </div>
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
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
    <div className="bg-[#172b4f] rounded-b-lg">
      <RadixCollapsible.Trigger
        disabled={!user}
        className={clx(
          "group flex w-full cursor-pointer items-center gap-3 py-4 px-3 outline-none h-[90px] hover:bg-[#1a315b] transition-all",
          "data-[state=open]:bg-[#1a315b]",
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

        {/* Downward caret icon */}
        <ChevronDownMini
          className={clx(
            "text-[#CFD8DC] shrink-0 transition-transform",
            "group-data-[state=open]:rotate-180"
          )}
        />
      </RadixCollapsible.Trigger>
    </div>
  )
}

const ProfileLink = ({ location }: { location: ReturnType<typeof useLocation> }) => {
  const { t } = useTranslation()

  return (
    <Link
      to="/settings/profile"
      state={{ from: location.pathname }}
      className={clx(
        "text-white transition-all duration-200 hover:bg-[#1a315b] flex items-center gap-x-2 py-3 pl-3 pr-3 outline-none h-[50px]",
        "focus-visible:shadow-borders-focus"
      )}
    >
      <div className="flex size-8 items-center justify-center shrink-0">
        <UserIcon className="text-[#CFD8DC]" />
      </div>
      <Text size="small" weight="plus" leading="compact" className="text-white">
        {t("app.menus.user.profileSettings")}
      </Text>
    </Link>
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
    <button
      onClick={handleLogout}
      className={clx(
        "text-white transition-all duration-200 hover:bg-[#1a315b] flex items-center gap-x-2 py-3 pl-3 pr-3 outline-none h-[50px] w-full text-left",
        "focus-visible:shadow-borders-focus"
      )}
    >
      <div className="flex size-8 items-center justify-center shrink-0">
        <OpenRectArrowOut className="text-[#CFD8DC]" />
      </div>
      <Text size="small" weight="plus" leading="compact" className="text-white">
        {t("app.menus.actions.logout")}
      </Text>
    </button>
  )
}

