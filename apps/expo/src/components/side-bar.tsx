"use dom";

import DOMProvider from "@/components/dom-provider";
import { AppSidebar } from "@/components/navigation/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@hamilton/ui/components/ui/breadcrumb";
import { Separator } from "@hamilton/ui/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@hamilton/ui/components/ui/sidebar";

export default function SideBar({
  isSidebarOpen,
  onOpenChange,
}: {
  isSidebarOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    // <div className="fixed left-0 top-0 h-screen w-screen overflow-hidden">
    <DOMProvider>
      <SidebarProvider
        open={isSidebarOpen}
        onOpenChange={(open) => {
          console.log("Sidebar open state changed:", open);
          onOpenChange(open);
        }}
      >
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
        </SidebarInset>
      </SidebarProvider>
    </DOMProvider>
    // </div>
  );
}
