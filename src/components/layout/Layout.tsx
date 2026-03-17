import { type Component, type JSX } from "solid-js";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Toaster } from "../ui/Toast";

interface LayoutProps {
  title: string;
  subtitle?: string;
  children: JSX.Element;
}

export const Layout: Component<LayoutProps> = (props) => {
  return (
    <div class="flex min-h-screen bg-background">
      <Sidebar />
      <div class="flex flex-col flex-1 min-w-0">
        <Header title={props.title} subtitle={props.subtitle} />
        <main class="flex-1 p-6 overflow-auto">
          {props.children}
        </main>
      </div>
      <Toaster />
    </div>
  );
};
