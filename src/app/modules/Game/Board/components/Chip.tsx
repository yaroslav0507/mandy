import styled from 'styled-components';

export const Chip = styled.div<{ color: string }>`
  width: 70%;
  height: 70%;
  border-radius: 100%;
  background-color: ${ ({ color }) => color };
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 3px solid #00000030;
  transition: ease .3s width;
`;
