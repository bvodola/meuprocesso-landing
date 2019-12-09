import React from "react"
import "./Nav.sass"

export default ({ logo, logoHref, phone, whatsapp, ...props }) => (
  <nav>
    <div className="brand">
      <img className="logo" src={logo} alt="Logo" />
    </div>
    <div className="contact">
      {phone && <span className="phone">{phone}</span>}

      {phone && whatsapp && <span className="divider">&bull;</span>}

      {whatsapp && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`http://api.whatsapp.com/send?phone=55${whatsapp}`}
        >
          <img className="whatsapp" src="/img/whatsapp.png" alt="" />
        </a>
      )}
    </div>
  </nav>
)
