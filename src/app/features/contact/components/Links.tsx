'use client'

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { BsTiktok } from 'react-icons/bs';

const Card: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="card_container">
        <ul className="social_list">

          <li className="iso-pro">
            <span /><span /><span />
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social_link">
              <FaFacebookF />
            </Link>
            <div className="tooltip">Facebook</div>
          </li>

          <li className="iso-pro">
            <span /><span /><span />
            <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social_link">
              <BsTiktok />
            </Link>
            <div className="tooltip">Twitter</div>
          </li>

          <li className="iso-pro">
            <span /><span /><span />
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social_link">
              <FaInstagram />
            </Link>
            <div className="tooltip">Instagram</div>
          </li>
          
        </ul>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card_container {
    padding: 10px 0;
  }

  .social_list {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    align-items: center;
  }

  .iso-pro {
    position: relative;
    list-style: none;
    transition: 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .social_link {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px;
    border-radius: 12px;
    color: #22d3ee;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(34, 211, 238, 0.2);
    backdrop-filter: blur(5px);
    transition: all 0.4s ease;
    z-index: 10;
    font-size: 20px;
    text-decoration: none;
  }

  .tooltip {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 5px 10px;
    border-radius: 5px;
    opacity: 0;
    pointer-events: none;
    transition: all 0.4s ease;
    color: #22d3ee;
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid rgba(34, 211, 238, 0.3);
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
    z-index: 100;
  }

  .iso-pro:hover .tooltip {
    opacity: 1;
    top: -45px;
  }

  .iso-pro span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: #0ea5e9;
    transition: 0.5s;
    opacity: 0;
  }

  .iso-pro:hover span {
    opacity: 0.2;
  }

  .iso-pro:hover span:nth-child(1) { transform: translate(5px, -5px); opacity: 0.1; }
  .iso-pro:hover span:nth-child(2) { transform: translate(10px, -10px); opacity: 0.2; }
  .iso-pro:hover span:nth-child(3) { transform: translate(15px, -15px); opacity: 0.3; }

  .iso-pro:hover .social_link {
    transform: translate(15px, -15px);
    color: #fff;
    background: #0ea5e9;
    border-color: #0ea5e9;
    box-shadow: -5px 5px 20px rgba(14, 165, 233, 0.4);
  }
`;

export default Card;
