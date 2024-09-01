import React, { useEffect } from 'react'
import Aboutus from '../assets/images/aboutus.png'
import Aboutimg from '../assets/images/aboutimg.png'
import '../styles/about.css'

const About = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);
  
  return (
    <section>
      <div className='container mb-5'>
        <div className='row  '>
          <div className='col-lg-5 col-12 aboutus-text'>
            <h1>About Us</h1>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.</p>
            <button className='read-more-btn rounded-5 btn btn-light mb-3'>Read More</button>
          </div>
          <div className='col-lg-7 col-12 aboutus-img mt-4'>
            <img className='restaurent-img img-fluid rounded-2 ' src={Aboutus} alt="AboutUs"/>
            <img className='burger-img img-fluid ms-auto d-flex' src={Aboutimg}/>
          </div>
        </div>  
      </div>
    </section>
  )
}

export default About