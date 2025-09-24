import styled from "styled-components";

export const MainWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(180deg, #89f7fe, #66a6ff);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #fff;

  .container {
    width: 350px;
    padding: 2rem;
    border-radius: 1.25rem;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(12px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }

  /* Search bar */
  .searchArea {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50px;

    input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 1rem;
      color: #fff;

      ::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    .searchCirle {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        transform: scale(1.1);
        background: #f5f5f5;
      }

      .searchIcon {
        font-size: 1.3rem;
        color: #333;
      }
    }
  }

  /* Weather info */
  .weatherInfo {
    text-align: center;
    margin-bottom: 2rem;

    h1 {
      font-size: 2.2rem;
      margin: 0.5rem 0;
    }

    h2 {
      font-size: 1.2rem;
      font-weight: 400;
      margin: 0.25rem 0;
      opacity: 0.9;
    }

    span {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .icon {
      font-size: 4rem;
      margin: 1rem 0;
    }
  }

  /* Bottom section (humidity + wind) */
  .bottomInfoArea {
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;

    .humidityLevel,
    .wind {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .windIcon {
      font-size: 2rem;
      margin-bottom: 0.25rem;
    }

.humidInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.25rem;

  h1 {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  p {
    font-size: 0.85rem;
    margin: 0.25rem 0 0 0;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.5px;
  }
}

    }
  }
`;
