import type { MenuItems } from "../../interface/menuItems";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";

export function AthleteHome({ menuItems }: { menuItems: MenuItems[] }) {

    return (
        <SlideBarContextProvider>
            <main>
                <NavBar menuItems={menuItems}/>
                <h1>Home</h1>
            </main>
        </SlideBarContextProvider>
    )
}