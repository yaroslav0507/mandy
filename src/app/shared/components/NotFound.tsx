import SearchIcon    from '@material-ui/icons/Search';
import React, { FC } from 'react';
import styled        from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  align: center;
  justify-content: center;
  text-align: center;
`;

const ErrorCode = styled.div`
  font-size: 48px;
`;

const Description = styled.div`
  font-size: 16px;
`;

const SearchIconStyled = styled(SearchIcon)`
  color: #eee;
`;

export const NotFound: FC = () => {
  return (
    <PageWrapper>
      <ErrorCode>404 - Not Found!</ErrorCode>
      <SearchIconStyled/>
      <Description>
        The page you are looking for was not found.
      </Description>
    </PageWrapper>
  );
};

