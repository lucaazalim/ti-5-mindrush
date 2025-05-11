import Image from "next/image";
import ProfileDropdownMenu from "./ProfileDropdownMenu";
import ThemeSwitcherButton from "./ThemeSwitchButton";

export default async function Header() {
  return (
    <div className="bg-primary dark:bg-background">
      <div className="mx-auto flex max-w-5xl flex-row justify-between p-5">
        <div className="my-auto flex items-center">
          <Image src="/logo.png" alt="Logo do MindRush" width={100} height={0} />
        </div>
        <div className="flex flex-row items-center gap-5">
          <ThemeSwitcherButton />
          <ProfileDropdownMenu />
        </div>
      </div>
    </div>
  );
}
