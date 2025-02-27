import FooterOne from "../../../layouts/footers/FooterOne";
import HeaderOne from "../../../layouts/headers/HeaderOne";
import FancyBanner from "../../common/FancyBanner";
import BreadcrumbThree from "../../common/breadcrumb/BreadcrumbThree";
import BlogOneArea from "./BlogOneArea"

const BlogOne = () => {
   return (
      <>
         <HeaderOne />
         <BreadcrumbThree title="Blog Grid" link="#" link_title="Pages" sub_title="Blog" style={false} />
         <BlogOneArea />
         <FancyBanner />
         <FooterOne />
      </>
   )
}

export default BlogOne;
