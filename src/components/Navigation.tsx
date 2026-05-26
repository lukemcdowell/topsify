import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { CircleUserRound, Disc3, ChartBar } from "lucide-react";
import Link from "next/link";

interface NavigationProps {
  selected: "tracks" | "artists" | "genres";
}

function Navigation({ selected }: NavigationProps) {
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                selected === "tracks" && "border border-primary",
              )}
            >
              <Link href="/tracks">
                <Disc3 className="pr-1" />
                Tracks
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                selected === "artists" && "border border-primary",
              )}
            >
              <Link href="/artists">
                <CircleUserRound className="pr-1" />
                Artists
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                selected === "genres" && "border border-primary",
              )}
            >
              <Link href="/genres">
                <ChartBar className="pr-1" />
                Genres
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default Navigation;
