import styled from 'styled-components';
import ReactPaginate from 'react-paginate';

export const Map = styled.section`
  display: flex;
  padding: 45px 0 60px;
  height: 100vh;

  @media (max-width: 980px) {
    flex-direction: column;
  }
`;

export const ListContainer = styled.article`
  width: 40%;
  height: 100%;

  @media (max-width: 980px) {
    width: 100%;
    height: 100%;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* gap: 20px; */
  padding: 20px;
`;

export const Pagination = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 35px;
`;

export const PaginationNumber = styled.li`
  border-radius: 5px;
  padding: 5px 8px;
  cursor: pointer;
`;

export const PaginationStyled = styled(ReactPaginate)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 35px;

  ul {
    display: flex;
    list-style: none;
    padding: 0;
  }

  li {
    margin: 0 5px;
    cursor: pointer;
    border-radius: 5px;
    padding: 5px 8px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export default {
  Map,
  ListContainer,
  SearchContainer,
  Pagination,
  PaginationNumber,
  PaginationStyled,
};
