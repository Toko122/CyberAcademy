'use client'

import React from 'react'
import styled from 'styled-components'

interface Mentor {
  name: string
  role: string
  description?: string
  image: string
}

interface CardProps {
  mentor: Mentor
}

const Card: React.FC<CardProps> = ({ mentor }) => {
  return (
    <StyledWrapper>
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <img src={mentor.image} alt={mentor.name} />
            <button className="view-btn">ნახვა</button>
          </div>

          <div className="flip-card-back">
            <h3>{mentor.name}</h3>
            <span>{mentor.role}</span>
            {mentor.description && <p>{mentor.description}</p>}
          </div>
        </div>
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .flip-card {
    width: 250px;
    height: 350px;
    perspective: 1000px;
    font-family: sans-serif;
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    border-radius: 1rem;
  }

  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }

  .flip-card-front,
  .flip-card-back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    backface-visibility: hidden;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  .flip-card-front {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flip-card-front img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1rem;
    transition: transform 0.3s ease;
  }

  .flip-card-front:hover img {
    transform: scale(1.05);
  }

  .view-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0.5rem 1rem;
    background-color: rgba(34, 211, 238, 0.6);
    color: #fff;
    font-weight: 700;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    z-index: 2;
    transition: background 0.3s ease, transform 0.2s ease;
  }

  .view-btn:hover {
    background-color: rgba(34, 211, 238, 0.9);
    transform: scale(1.05);
  }

  .flip-card-back {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    text-align: center;
    transform: rotateY(180deg);
    border-radius: 1rem;
  }

  .flip-card-back h3 {
    margin: 0 0 0.5rem;
    font-size: 1.4rem;
    font-weight: 700;
    text-shadow: 0 1px 3px rgba(0,0,0,0.6);
  }

  .flip-card-back span {
    font-size: 1rem;
    color: #22d3ee;
    margin-bottom: 0.5rem;
  }

  .flip-card-back p {
    font-size: 0.9rem;
    color: #cbd5e1;
  }
`

export default Card