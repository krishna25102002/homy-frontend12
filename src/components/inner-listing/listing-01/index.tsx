import FooterOne from "../../../layouts/footers/FooterOne";
import HeaderOne from "../../../layouts/headers/HeaderOne";
import FancyBanner from "../../common/FancyBanner";
import ListingOneArea from "./ListingOneArea"

const ListingOne = () => {
   return (
      <>
         <HeaderOne style={true} />
         <ListingOneArea />
         <FancyBanner />
         <FooterOne />
      </>
   )
}

export default ListingOne;
