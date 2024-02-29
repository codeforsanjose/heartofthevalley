import React, { useState } from 'react'
import { FaArrowDown, FaArrowRight } from 'react-icons/fa'
import PropTypes from 'prop-types'

import '../assets/stylesheets/about.css'

function AboutContent({ title, content }) {
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
        <div // eslint-disable-line jsx-a11y/no-static-element-interactions
          className="accordion-heading"
          onClick={() => setShow(!show)}
          onKeyDown={() => setShow(!show)}
        >

          <button type="button">{show ? <FaArrowRight className="icon" /> : <FaArrowDown />}</button>
          <h3 className="accordion-title" style={colorStyle}>
            {title}
          </h3>

        </div>

        <p style={paraStyles} className="accordion-para">
          {content}
        </p>

      </div>
    </div>
  )
}

AboutContent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
}

export default AboutContent
