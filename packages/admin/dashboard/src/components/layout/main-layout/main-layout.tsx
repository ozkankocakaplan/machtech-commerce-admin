import {
  Buildings,
  ChevronDownMini,
  CogSixTooth,
  CurrencyDollar,
  MinusMini,
  ReceiptPercent,
  ShoppingCart,
  SquaresPlus,
  Tag,
  Users,
} from "@medusajs/icons"
import { Avatar, Text } from "@medusajs/ui"
import { Collapsible as RadixCollapsible } from "radix-ui"
import { useTranslation } from "react-i18next"

import { useStore } from "../../../hooks/api/store"
import { Skeleton } from "../../common/skeleton"
import { INavItem, NavItem } from "../../layout/nav-item"
import { Shell } from "../../layout/shell"

import { useLocation } from "react-router-dom"
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
      <div className="flex flex-1 flex-col">
        <div className="sticky top-0">
          <Header />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-1 flex-col">
            <CoreRouteSection />
            <ExtensionRouteSection />
          </div>
          <UtilitySection />
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
      <div className="grid w-full grid-cols-[24px_1fr] items-center gap-x-3 py-4 px-3 h-full">
        {fallback ? (
          <Avatar variant="squared" size="xsmall" fallback={fallback} />
        ) : (
          <Skeleton className="h-6 w-6 rounded-md" />
        )}
        <div className="block overflow-hidden text-start">
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
      icon: <ShoppingCart />,
      label: t("orders.domain"),
      to: "/orders",
      items: [
        // TODO: Enable when domin is introduced
        // {
        //   label: t("draftOrders.domain"),
        //   to: "/draft-orders",
        // },
      ],
    },
    {
      icon: <Tag />,
      label: t("products.domain"),
      to: "/products",
      items: [
        {
          label: t("collections.domain"),
          to: "/collections",
        },
        {
          label: t("categories.domain"),
          to: "/categories",
        },
        // TODO: Enable when domin is introduced
        // {
        //   label: t("giftCards.domain"),
        //   to: "/gift-cards",
        // },
      ],
    },
    {
      icon: <Buildings />,
      label: t("inventory.domain"),
      to: "/inventory",
      items: [
        {
          label: t("reservations.domain"),
          to: "/reservations",
        },
      ],
    },
    {
      icon: <Users />,
      label: t("customers.domain"),
      to: "/customers",
      items: [
        {
          label: t("customerGroups.domain"),
          to: "/customer-groups",
        },
      ],
    },
    {
      icon: <ReceiptPercent />,
      label: t("promotions.domain"),
      to: "/promotions",
      items: [
        {
          label: t("campaigns.domain"),
          to: "/campaigns",
        },
      ],
    },
    {
      icon: <CurrencyDollar />,
      label: t("priceLists.domain"),
      to: "/price-lists",
    },
  ]
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
        return <NavItem key={route.to} {...route} />
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

const UtilitySection = () => {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-y-0.5 py-3">
      <NavItem
        label={t("app.nav.settings.header")}
        to="/settings"
        from={location.pathname}
        icon={<CogSixTooth />}
      />
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
