import { FaArrowDown } from 'react-icons/fa'
import { FaArrowRight } from 'react-icons/fa'
import { useState } from 'react'
import '../assets/stylesheets/about.css'

function AboutContent(props) {
  const [show, setShow] = useState(false)
  
  const paraStyles = {
    display: show ? 'block' : 'none',
  }
  const colorStyle = {
    color: show ? '#D44100' : '#000',
  }
  return (
    <div>
      <div className="accordion">
        <div className="accordion-heading" onClick={() => setShow(!show)}>
          <button>{show ? <FaArrowRight className="icon" /> : <FaArrowDown />}</button>
          <h3 className="accordion-title" style={colorStyle}>
            {props.title}
          </h3>
        </div>

        <p style={paraStyles} className="accordion-para">
          {props.content}
        </p>
      </div>
    </div>
  )
}

export default AboutContent
