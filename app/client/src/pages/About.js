import React from 'react'

import '../assets/stylesheets/about.css'
import AboutContent from '../components/AboutAccordion'
import data from '../components/AboutData'

function About() {
  console.log(data)
  const aboutData = data.map((item) => (
    <AboutContent
      key={item.id}
      title={item.title}
      content={item.content}
      className={item.className}
    />
  ))

  return (
    <div>
      <div className="container-fluid">
        <div className="about">
          <div className="row gx-5">
            <div className=" col-lg-4 ">
              <p>OUR MISSION</p>
              <h2 className="content">
                To bring more exposure to local Bay area artists and build a community of art lovers
                who want to appreciate and encourage local art.
              </h2>
            </div>
            <div className="col-lg-8  about-accordion">{aboutData}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
