import React from 'react'
import '../styles/faq.css'
import faq from '../assets/images/faq.png'

const Faq = () => {
  return (
    <div className='container'>
    <div className='row d-flex align-items-center'>
    <div className='col-12'>
      <h1 className='text-center '>FAQs</h1>
      <div className='heading-line mb-5'></div>
    </div>
        <div className='faq-text col-md-6 col-12'>
              <div className="accordion shadow" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    What is your most popular menu item?
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                    Our most popular menu item is the Signature Deluxe Burger, known for its unique blend of flavors and high-quality ingredients
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Do you offer vegetarian or vegan options?
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                    Yes, we offer a variety of vegetarian and vegan options, including the Veggie Supreme Wrap. Check our menu for more details.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    What are your operating hours?
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                    Our operating hours vary by location, but generally, we are open seven days a week from 15:45 to 01:00. You can find the specific hours for your nearest location on our website.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                    What safety measures are in place for food preparation and handling?
                    </button>
                  </h2>
                  <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                    We prioritize the safety and well-being of our customers. Our staff follows strict hygiene and food safety protocols, and we have implemented additional measures to ensure a clean and safe dining experience.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                    Do you offer delivery services?
                    </button>
                  </h2>
                  <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                    Yes, we partner with various delivery services to bring our delicious food straight to your doorstep. Check our website or app for the list of available delivery options in your area.
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div className='faq-img col-md-6 col-12 '>
            <img className='img-fluid rounded-5' src={faq} alt="faqImg"/>
          </div>
        </div>
      </div>
  )
}

export default Faq
