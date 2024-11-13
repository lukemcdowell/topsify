import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { CircleUserRound, Disc3 } from 'lucide-react';
import Link from 'next/link';

function Navigation() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-5 pt-5">
      <Link href="/">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl">
          Tops<span className="text-primary">ify</span>
        </h1>
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/tracks" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Disc3 className="pr-1" />
                Tracks
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/artists" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <CircleUserRound className="pr-1" />
                Artists
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default Navigation;
