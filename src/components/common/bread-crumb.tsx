import { SlashIcon } from "@radix-ui/react-icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
export default function BreadCrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="font-medium  text-[10px] sm:text-sm">
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-black transition-colors duration-300 ease-out hover:text-blue"
            href="/"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-black transition-colors duration-300 ease-out hover:text-blue"
            href="/iphone"
          >
            iPhone
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
