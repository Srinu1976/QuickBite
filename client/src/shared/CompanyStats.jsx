import React from "react";
import "./company-stats.css";

import icon1 from "../assets/images/icon1.png";
import icon2 from "../assets/images/icon2.png";
import icon3 from "../assets/images/icon3.png";
import icon4 from "../assets/images/icon4.png";

const CompanyStats = () => {
  return (
    <div className="company-stats container pt-5 pt-md-0 mt-0 ">
      <div className="row d-flex justify-content-around text-center g-4">
        {/* <div className='icon-box col-lg-3 col-sm-6 col-12'>
            <img src={icon1} alt="icon1"/>
            <p className='mt-1 mb-2'>Professional Cheifs</p>
            <h5>270</h5>
          </div> */}

        {/* <div className='icon-box col-lg-3 col-sm-6 col-12'>
            <img src={icon2} alt="icon1"/>
            <p className='mt-1 mb-2'>Items Of Food</p>
            <h5>270</h5>
          </div> */}

        <div className="icon-box col-lg-3 col-sm-6 col-12">
          <img src={icon3} alt="icon1" />
          <p className="mt-1 mb-2">Years Of Experience</p>
          <h5>15+</h5>
        </div>

        {/* <div className='icon-box col-lg-3 col-sm-6 col-12'>
            <img src={icon4} alt="icon1"/>
            <p className='mt-1 mb-2'>Categories</p>
            <h5>20</h5>
          </div> */}
      </div>
    </div>
  );
};

export default CompanyStats;
