import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    position: relative;
    width: 33px;
    height: 33px;
    perspective: 67px;
  }

  .loader div {
    width: 100%;
    height: 100%;
    background: #2f3545;
    position: absolute;
    left: 50%;
    transform-origin: left;
    animation: loader 2s infinite;
  }

  .loader div:nth-child(1) {
    animation-delay: 0.15s;
  }

  .loader div:nth-child(2) {
    animation-delay: 0.3s;
  }

  .loader div:nth-child(3) {
    animation-delay: 0.45s;
  }

  .loader div:nth-child(4) {
    animation-delay: 0.6s;
  }

  .loader div:nth-child(5) {
    animation-delay: 0.75s;
  }

  @keyframes loader {
    0% {
      transform: rotateY(0deg);
    }

    50%, 80% {
      transform: rotateY(-180deg);
    }

    90%, 100% {
      opacity: 0;
      transform: rotateY(-180deg);
    }
  }`;

export default Loader;
